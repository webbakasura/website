import type { Metadata } from "next";
import AccountPage from "@/components/AccountPage";

export const metadata: Metadata = {
  title: "My Account — Bakasura Biryani",
  robots: { index: false, follow: false },
};

export default function Account() {
  return <AccountPage />;
}
