"use client";

import { useState, ReactNode } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { MerchantProfileClient } from "./MerchantProfileClient";

interface MerchantPageWrapperProps {
  merchant: any;
  services: any[];
  products: any[];
  staff: any[];
  availability: any[];
  galleryWithFullUrls: any[];
  socialLinks: any[];
  merchantIsOpen: boolean;
  heroSection: ReactNode;
}

export function MerchantPageWrapper(props: MerchantPageWrapperProps) {
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <PublicHeader
        key="header"
        merchantId={props.merchant.id}
        cartCount={cartCount}
        onCartClick={() => setShowCart(true)}
      />
      <div key="hero">{props.heroSection}</div>
      <MerchantProfileClient
        key="profile"
        {...props}
        externalShowCart={showCart}
        onShowCartChange={setShowCart}
        onCartCountChange={setCartCount}
      />
    </>
  );
}
