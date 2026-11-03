import { ImageResponse } from "next/og";

/* The card a shared link shows on LinkedIn, Slack, WhatsApp and X (2026-11-03): the site's grey
   paper, its name and J mark, the three-word line, and the aqua accent block. */
export const runtime = "edge";
export const alt = "Jethro Adebisi: product designer, motion designer and front-end engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F4F4F3", padding: 64, color: "#111111" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="30" height="34" viewBox="0 0 441 505">
              <path fill="#111111" d="M 441 0 L 240 1 L 225 44 L 351.5 45 L 261 335 C 249.1 373.1 210.7 411.3 168 407 C 110.2 401.2 68.3 343.8 96.2 288 C 107.4 265.6 121.3 247.8 140 231 C 156.1 216.5 180.6 195.4 202 190 L 227 223 L 256 118 L 144 118 L 173 152 C 120 184.8 66.1 206.4 28.6 260 C -26.2 338.3 2.9 446.2 88 488.8 C 152.8 521.2 232.4 505.6 283 455 C 301.4 436.6 316.5 408.8 324 384 Z" />
            </svg>
            JETHRO ADEBISI
          </span>
          <span style={{ color: "#555555", fontWeight: 600 }}>jethrotheuxpert.vercel.app</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 900, letterSpacing: -5, lineHeight: 0.95 }}>Design it.</div>
          <div style={{ fontSize: 112, fontWeight: 900, letterSpacing: -5, lineHeight: 0.95 }}>Build it.</div>
          <div style={{ fontSize: 112, fontWeight: 900, letterSpacing: -5, lineHeight: 0.95 }}>Film it.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 30, color: "#333333" }}>Product designer, motion designer and front-end engineer</span>
          <span style={{ width: 120, height: 48, background: "#00FFC2" }} />
        </div>
      </div>
    ),
    size,
  );
}
