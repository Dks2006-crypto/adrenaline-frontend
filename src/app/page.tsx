"use client";

import Features from "@/widgets/home/Features";
import Hero from "@/widgets/home/Hero";
import Pricing from "@/widgets/home/Pricing";
import GroupClasses from "@/widgets/home/GroupClasses";
import { TrainersWidget } from "@/widgets/trainers";
import GallerySection from "@/widgets/home/GallerySection";

export default function HomePage() {

  return (
    <div className="bg-linear-to-br from-indigo-50 to-blue-100 min-h-screen">
      
      <Hero />
      <Pricing />
      <GroupClasses />
      <TrainersWidget />
      <GallerySection />
      <Features />

    </div>
  );
}