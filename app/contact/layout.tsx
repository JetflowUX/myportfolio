import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Jethro Adebisi",
  description:
    "Product designer, motion designer and front-end engineer. Open to new roles and opportunities. Write about a product, a build, a launch film or a role; I reply within a day.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
