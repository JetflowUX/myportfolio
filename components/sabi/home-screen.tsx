import type { CSSProperties, ReactNode } from "react";
import { ArrowUp, Bell, Coins, Disc3, House, Landmark, MessagesSquare, MoreHorizontal, Plus, ReceiptText, Send, User, Wallet, ScrollText, Loader } from "lucide-react";

/* ---------------------------------------------------------------------------
   SABIBANK HOME (2026-11-02)

   The "Homepage/Landing Screen" frame (36:3499) of Jethro's SABI APP Figma file,
   rebuilt in code at its native 412 x 892 px so it stays sharp at any scale and
   every part can move. Positions and sizes are the Figma frame's own (layer
   names in the comments); colours were sampled from the Figma export:
   balance #219653, blue #4285F4, panel #E3ECFB, badge #B3261E, ink #333333.
   Type: Poppins for the greeting and balance, Roboto for the lists, as in the
   file. The avatar is the memoji from the design.

   `part(i)` styles each of the ten parts, in build order, so the same screen
   can be revealed by CSS transitions on the web or frame by frame in a film.
   --------------------------------------------------------------------------- */

export const HOME_PARTS = [
  "Status bar",
  "Frame 7 · greeting",
  "Balance",
  "Top bar · buttons",
  "Panel",
  "Frame 8 · categories",
  "Notifications header",
  "Messages",
  "Navigation bar",
  "Home indicator",
] as const;

export const SABI = {
  blue: "#4285F4",
  green: "#219653",
  panel: "#E3ECFB",
  ink: "#333333",
  badge: "#B3261E",
  pill: "#E8DEF8",
};

const POPPINS = "'Poppins', 'Inter', sans-serif";
const ROBOTO = "'Roboto', 'Inter', sans-serif";

type Props = {
  /** style for part i (0..9, the order of HOME_PARTS); default: shown */
  part?: (i: number) => CSSProperties;
  /** the balance to show, so a film can count it up */
  balance?: number;
  avatar?: string;
};

const Abs = ({ x, y, w, h, style, children }: { x: number; y: number; w?: number; h?: number; style?: CSSProperties; children?: ReactNode }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>
);

const MESSAGES = [
  { icon: Landmark, title: "Central Bank of Nigeria", sub: "Central Bank of Nigeria : Your accou...", date: "Today" },
  { icon: User, title: "Account", sub: "Your account is limited. Please foll...", date: "11 Apr" },
  { icon: MessagesSquare, title: "Alert", sub: "Your statement is ready for you to...", date: "08 Apr" },
  { icon: Wallet, title: "Paypal", sub: "Your account has been linked. Ple...", date: "08 Apr" },
];

const CATEGORIES = [
  { icon: ReceiptText, label: ["Expense", "Tracking"] },
  { icon: Disc3, label: ["Daily", "Insights"] },
  { icon: Wallet, label: ["Budgets"] },
  { icon: Coins, label: ["Save", "online"] },
];

export function money(n: number) {
  const [w, c] = n.toFixed(2).split(".");
  return { whole: Number(w).toLocaleString("en-US"), cents: c };
}

export function SabiHome({ part = () => ({}), balance = 23970.98, avatar = "/sabi/avatar-memoji.png" }: Props) {
  const m = money(balance);
  return (
    <div style={{ position: "relative", width: 412, height: 892, overflow: "hidden", background: "#fff", color: SABI.ink, fontFamily: ROBOTO }}>
      {/* Device/status bar */}
      <div style={part(0)}>
        <Abs x={24} y={20} style={{ fontSize: 14, fontWeight: 500, letterSpacing: 0.1 }}>9:30</Abs>
        <Abs x={194} y={18} w={24} h={24} style={{ borderRadius: 24, background: "#1d1b20" }} />
        <Abs x={342} y={25} w={46} h={17} style={{ display: "flex", gap: 4, alignItems: "flex-end", justifyContent: "flex-end" }}>
          <span style={{ width: 14, height: 11, background: "#dcdcdc", clipPath: "polygon(50% 100%, 0 25%, 100% 25%)" }} />
          <span style={{ width: 12, height: 12, background: "#1d1b20", clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />
          <span style={{ width: 7, height: 13, background: "#1d1b20", borderRadius: 1 }} />
        </Abs>
      </div>

      {/* Frame 7: avatar, greeting, the bell */}
      <div style={part(1)}>
        <Abs x={15} y={49} w={50} h={50} style={{ borderRadius: 50, overflow: "hidden", border: "1px solid #cfd2d6" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatar} alt="" width={50} height={50} style={{ display: "block", width: 50, height: 50 }} />
        </Abs>
        <Abs x={92} y={62} style={{ fontFamily: POPPINS, fontSize: 16, fontWeight: 500 }}>Welcome Jethro!</Abs>
        <Abs x={350} y={62}>
          <Bell size={22} strokeWidth={1.8} />
          <span style={{ position: "absolute", left: 11, top: -7, minWidth: 16, height: 16, borderRadius: 16, background: SABI.badge, color: "#fff", fontSize: 10, fontWeight: 600, display: "grid", placeItems: "center" }}>3</span>
        </Abs>
      </div>

      {/* Balance */}
      <div style={part(2)}>
        <Abs x={44} y={124} style={{ fontFamily: POPPINS, fontSize: 16, color: "#6f6f6f" }}>Total balance</Abs>
        <Abs x={44} y={141} style={{ fontFamily: POPPINS, fontSize: 24, fontWeight: 700, color: SABI.green, letterSpacing: -0.2, whiteSpace: "nowrap" }}>
          $ {m.whole}
          <span style={{ fontWeight: 400 }}>.{m.cents}</span>
        </Abs>
      </div>

      {/* top bar: Transfer, Add Money */}
      <div style={part(3)}>
        {[
          { x: 16, icon: ArrowUp, label: "Transfer" },
          { x: 216, icon: Plus, label: "Add Money" },
        ].map((b) => (
          <Abs
            key={b.label}
            x={b.x}
            y={215}
            w={180}
            h={40}
            style={{
              borderRadius: 7,
              background: `linear-gradient(90deg, #3a78e6 0 9%, ${SABI.blue} 9% 91%, #3a78e6 91%)`,
              boxShadow: "0 2px 3px rgba(0,0,0,0.25)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <b.icon size={16} strokeWidth={2} />
            {b.label}
          </Abs>
        ))}
      </div>

      {/* the light panel */}
      <div style={part(4)}>
        <Abs x={16} y={291} w={380} h={640} style={{ borderRadius: 40, background: SABI.panel }} />
      </div>

      {/* Frame 8: four categories */}
      <div style={part(5)}>
        {CATEGORIES.map((c, k) => (
          <Abs
            key={c.label.join(" ")}
            x={28 + k * 92}
            y={327}
            w={80}
            h={80}
            style={{ borderRadius: 12, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "#6b6b6b", fontSize: 12, lineHeight: "16px", textAlign: "center" }}
          >
            <c.icon size={20} color="#1d1b20" strokeWidth={2} />
            <span>
              {c.label.map((l) => (
                <span key={l} style={{ display: "block" }}>
                  {l}
                </span>
              ))}
            </span>
          </Abs>
        ))}
      </div>

      {/* notifications header */}
      <div style={part(6)}>
        <Abs x={43} y={436} style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.3 }}>NOTIFICATIONS</Abs>
        <Abs x={327} y={436} style={{ fontSize: 12, fontWeight: 600, color: SABI.blue }}>View all</Abs>
      </div>

      {/* Messages */}
      <div style={part(7)}>
        {MESSAGES.map((msg, k) => (
          <Abs key={msg.title} x={43} y={468 + k * 84} w={327} h={64} style={{ borderRadius: 10, background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <Abs x={12} y={12} w={40} h={40} style={{ borderRadius: 8, background: SABI.blue, color: "#fff", display: "grid", placeItems: "center" }}>
              <msg.icon size={20} strokeWidth={2} fill="currentColor" />
            </Abs>
            <Abs x={64} y={11} style={{ fontSize: 16, fontWeight: 500, whiteSpace: "nowrap" }}>{msg.title}</Abs>
            <Abs x={64} y={36} style={{ fontSize: 12, color: "#6f6f6f", whiteSpace: "nowrap" }}>{msg.sub}</Abs>
            <Abs x={270} y={12} w={45} style={{ fontSize: 12, color: "#7a7a7a", textAlign: "right" }}>{msg.date}</Abs>
          </Abs>
        ))}
      </div>

      {/* Navigation bar */}
      <div style={part(8)}>
        <Abs x={0} y={812} w={412} h={80} style={{ background: SABI.panel }} />
        {[
          { icon: House, label: "Home" },
          { icon: Send, label: "Send" },
          { icon: ScrollText, label: "Pay" },
          { icon: Loader, label: "Insight" },
          { icon: MoreHorizontal, label: "More" },
        ].map((t, k) => (
          <Abs key={t.label} x={8 + k * 80.8} y={824} w={72.8} h={56} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontSize: 12, fontWeight: k === 0 ? 600 : 500 }}>
            <span style={{ width: 64, height: 32, borderRadius: 16, display: "grid", placeItems: "center", background: k === 0 ? SABI.pill : "transparent" }}>
              <t.icon size={20} strokeWidth={k === 0 ? 2.4 : 1.8} fill={k === 0 ? "#1d1b20" : "none"} />
            </span>
            {t.label}
          </Abs>
        ))}
      </div>

      {/* Device/navigation: the home indicator */}
      <div style={part(9)}>
        <Abs x={170} y={878} w={72} h={3} style={{ borderRadius: 3, background: "#1d1b20" }} />
      </div>
    </div>
  );
}
