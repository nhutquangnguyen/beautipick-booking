import { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface SectionProps {
  children: ReactNode;
  className?: string;
}
