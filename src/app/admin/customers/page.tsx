import type { Metadata } from "next";
import AdminCustomers from "@/components/AdminCustomers";

export const metadata: Metadata = {
  title: "Customer Wishes — Bakasura Admin",
  robots: { index: false, follow: false },
};

export default function AdminCustomersPage() {
  return <AdminCustomers />;
}
