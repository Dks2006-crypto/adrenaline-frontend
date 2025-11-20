"use client";

import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";
import Trainers from "@/components/home/Trainers";

export default function HomePage() {

  return (
    <div className="bg-linear-to-br from-indigo-50 to-blue-100 py-24 min-h-screen">
      
      <Hero />
      <Features />
      <Trainers />
      <Pricing />

    </div>
  );
}