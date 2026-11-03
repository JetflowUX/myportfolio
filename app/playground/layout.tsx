import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground | Jethro Adebisi",
  description: "Small tools to make something and keep it: a shape study driven by one formula, and a token maker with Cardano-ready metadata.",
};

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
