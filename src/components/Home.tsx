"use client";

import AnimatedBackground from "./AnimatedBackground";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Categories from "./Categories";
import Story from "./Story";
import Menu from "./Menu";
import Offers from "./Offers";
import WhyUs from "./WhyUs";
import HoursBanner from "./HoursBanner";
import Reviews from "./Reviews";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <AnimatedBackground />
      <Hero />
      <Categories />
      <Story />
      <Menu />
      <Offers />
      <WhyUs />
      <HoursBanner />
      <Reviews />
      <Footer />
    </div>
  );
}
