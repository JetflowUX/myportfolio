import { ImageResponse } from "next/og";

/* The card a shared link shows on LinkedIn, Slack, WhatsApp and X (2026-11-03): the site's grey
   paper, its name, the three-word line, and the aqua accent block. */
export const runtime = "edge";
export const alt = "Jethro Adebisi: product designer, motion designer and front-end engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F4F4F3", padding: 64, color: "#111111" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>
          <span>JETHRO ADEBISI</span>
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
