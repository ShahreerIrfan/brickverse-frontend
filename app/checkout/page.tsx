import { Metadata } from "next";
import CheckoutPage from "@/components/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout | Brickverse",
  description: "Complete your Brickverse order with Cash on Delivery nationwide.",
};

export default function Checkout() {
  return <CheckoutPage />;
}
