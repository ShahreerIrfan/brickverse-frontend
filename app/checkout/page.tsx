import { Metadata } from "next";
import CheckoutPage from "@/components/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout | Kawaii Subete",
  description: "Complete your Kawaii Subete order with Cash on Delivery nationwide.",
};

export default function Checkout() {
  return <CheckoutPage />;
}
