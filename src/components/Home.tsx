"use client";

import AnimatedBackground from "./AnimatedBackground";
import Navbar from "./Navbar";
import PromoModal from "./PromoModal";
import Hero from "./Hero";
import Categories from "./Categories";
import Story from "./Story";
import Team from "./Team";
import Menu from "./Menu";
import Offers from "./Offers";
import BulkOrders from "./BulkOrders";
import WhyUs from "./WhyUs";
import HoursBanner from "./HoursBanner";
import Reviews from "./Reviews";
import Newsletter from "./Newsletter";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <PromoModal />
      <Navbar />
      <AnimatedBackground />
      <Hero />
      <Categories />
      <Story />
      <Team />
      <Menu />
      <Offers />
      <BulkOrders />
      <WhyUs />
      <HoursBanner />
      <Reviews />
      <Newsletter />
      <Footer />
    </div>
  );
}
