"use client";

import { Merchant, Service, Staff, Availability, MerchantTheme, MerchantSettings } from "@/types/database";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

interface BookingPageProps {
  merchant: Merchant;
  services: Service[];
  staff: Array<Staff & { staff_services: { service_id: string }[] }>;
  availability: Availability[];
  gallery: GalleryImage[];
  products: Product[];
  theme: MerchantTheme;
  settings: MerchantSettings;
}

export function BookingPageTest(props: BookingPageProps) {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Test Booking Page</h1>
      <p>Merchant: {props.merchant.business_name}</p>
      <p>Theme: {props.theme.layoutTemplate}</p>
      <p>Services: {props.services.length}</p>
    </div>
  );
}
