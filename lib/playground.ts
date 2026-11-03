/* Shared by the Playground's tools (2026-11-03): a seeded random number generator, so the same
   seed always draws the same picture, and the downloads (SVG, PNG drawn from the SVG, JSON). */

/** mulberry32: a small, fast seeded generator returning numbers in [0, 1). */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const newSeed = () => Math.floor(Math.random() * 1_000_000);

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function svgText(svg: SVGSVGElement) {
  const copy = svg.cloneNode(true) as SVGSVGElement;
  copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return new XMLSerializer().serializeToString(copy);
}

export function downloadSvg(svg: SVGSVGElement, name: string) {
  save(new Blob([svgText(svg)], { type: 'image/svg+xml' }), name);
}

/** Draws the SVG onto a canvas at full size and saves it as a PNG. */
export function downloadPng(svg: SVGSVGElement, width: number, height: number, name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([svgText(svg)], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas is not available'));
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Could not make the PNG'));
        save(blob, name);
        resolve();
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not draw the image'));
    };
    img.src = url;
  });
}

export function downloadJson(data: unknown, name: string) {
  save(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), name);
}
