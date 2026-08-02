import type { Metadata } from "next";
import FeedbackPage from "@/components/FeedbackPage";

export const metadata: Metadata = {
  title: "Feedback | Bakasura Biryani",
  description: "Tell us how your Bakasura Biryani experience was — quality, taste, service, and more.",
};

export default function Feedback() {
  return <FeedbackPage />;
}
