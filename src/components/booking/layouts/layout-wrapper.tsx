"use client";

import { ReactNode } from "react";
import { LayoutTemplate } from "@/types/database";
import { LuxuryLayout } from "./luxury-layout";
import { ModernLayout } from "./modern-layout";
import { MinimalLayout } from "./minimal-layout";
import { ClassicLayout } from "./classic-layout";
import { PortfolioLayout } from "./portfolio-layout";

interface LayoutWrapperProps {
  layoutTemplate: LayoutTemplate;
  children: ReactNode;
}

export function LayoutWrapper({ layoutTemplate, children }: LayoutWrapperProps) {
  switch (layoutTemplate) {
    case "luxury":
      return <LuxuryLayout>{children}</LuxuryLayout>;
    case "modern":
      return <ModernLayout>{children}</ModernLayout>;
    case "minimal":
      return <MinimalLayout>{children}</MinimalLayout>;
    case "classic":
      return <ClassicLayout>{children}</ClassicLayout>;
    case "portfolio":
      return <PortfolioLayout>{children}</PortfolioLayout>;
    default:
      // Fallback to modern layout
      return <ModernLayout>{children}</ModernLayout>;
  }
}
