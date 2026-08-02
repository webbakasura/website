import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us | Bakasura Biryani",
  description: "Reach Bakasura Biryani — address, phone, WhatsApp, and hours.",
};

export default function Contact() {
  return <ContactPage />;
}
