import HeroSection from "@/app/en/components/sections/hero-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find the best prices in Croatia",
  description:
    "App for shoppers in Croatia to compare store prices, create smart shopping lists, track loyalty cards, and get deal alerts with barcode scanning & AI suggestions.",
};

export default function Home() {
  return (
    <>
      <div className="space-y-48">
        <HeroSection />
      </div>
    </>
  );
}
