"use client";

import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div
      className="h-[15rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>
  );
}

const testimonials = [
    {
      quote: "Finally, a platform that makes regulatory queries transparent and efficient. No more endless email chains!",
      name: "Priya Sharma",
      title: "Compliance Director, TechCorp India",
    },
    {
      quote: "The country-specific quote system is brilliant. I know exactly what I'm paying for before approving any work.",
      name: "Michael Chen",
      title: "Legal Counsel, Global Pharma",
    },
    {
      quote: "As a regulatory consultant, this platform streamlined my entire workflow. Quote to delivery has never been smoother.",
      name: "Dr. Sarah Williams",
      title: "Senior Regulatory Advisor",
    },
    {
      quote: "The real-time status tracking gives me peace of mind. I always know where my regulatory projects stand.",
      name: "Rajesh Gupta",
      title: "VP Operations, MedDevice Solutions",
    },
    {
      quote: "Connecting with qualified regulatory experts across multiple jurisdictions was never this easy.",
      name: "Elena Rodriguez",
      title: "International Business Manager",
    },
    {
      quote: "The quote approval system is fantastic. Professional pricing with complete transparency for complex regulatory work.",
      name: "James Thompson",
      title: "Chief Regulatory Officer",
    },
    {
      quote: "I've increased my consulting efficiency by 40% since joining this platform. The workflow is intuitive and professional.",
      name: "Dr. Anita Desai",
      title: "Regulatory Consultant & Expert",
    },
    {
      quote: "File sharing and deliverable management feels secure and organized. Perfect for sensitive regulatory documents.",
      name: "Mark Johnson",
      title: "Regulatory Affairs Manager",
    },
    {
      quote: "From query submission to final report, everything is tracked beautifully. Best regulatory platform I've used.",
      name: "Kavya Nair",
      title: "Compliance Lead, BioTech Startup",
    },
    {
      quote: "The analytics dashboard helps me understand my consulting performance and optimize my quotes accordingly.",
      name: "Robert Kumar",
      title: "Independent Regulatory Specialist",
    }
  ];
  