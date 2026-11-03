import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Shelf | Jethro Adebisi",
  description: "Everything designed, built and filmed: product design case studies, front-end builds, and launch films and explainers.",
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
