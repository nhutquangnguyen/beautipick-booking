"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut, ChevronDown, LayoutDashboard, UserCircle, Calendar, Settings, Search, ShoppingBag, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicHeaderProps {
  showSearch?: boolean;
  merchantId?: string;
  cartCount?: number;
  onCartClick?: () => void;
}

export function PublicHeader({ showSearch = false, merchantId, cartCount = 0, onCartClick }: PublicHeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [hasMerchantAccount, setHasMerchantAccount] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [showHeaderSearch, setShowHeaderSearch] = useState(showSearch);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkUserType = async (userId: string) => {
      // Try to get cached data first
      const cachedUserType = localStorage.getItem(`user_type_${userId}`);
      const cachedHasMerchant = localStorage.getItem(`has_merchant_${userId}`);

      console.log('[PublicHeader] Cached data:', { userId, cachedUserType, cachedHasMerchant });

      // Only use cache if user is marked as customer or merchant
      // If cache says "not a customer" (empty string), we should re-check in case account was created
      const hasCachedCustomer = cachedUserType === "customer";
      const hasCachedMerchant = cachedHasMerchant === "true";

      if ((hasCachedCustomer || hasCachedMerchant) && cachedUserType !== null && cachedHasMerchant !== null) {
        // Use cached data immediately ONLY if positive (user has an account)
        console.log('[PublicHeader] Using cached data - userType:', cachedUserType, 'hasMerchant:', cachedHasMerchant);
        setUserType(hasCachedCustomer ? "customer" : null);
        setHasMerchantAccount(hasCachedMerchant);
        setIsLoadingAuth(false);
        return;
      }

      // If cache says "no account", re-check database in case account was recently created
      if (cachedUserType === "" && cachedHasMerchant === "false") {
        console.log('[PublicHeader] Cache says no account, but re-checking database...');
      }

      console.log('[PublicHeader] No cache found, fetching from database...');

      // If no cache, fetch from database
      const { data: customerAccount, error: customerError } = await supabase
        .from("customer_accounts")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (customerError) {
        console.error('[PublicHeader] Error querying customer account:', customerError);
      }

      const { data: merchantAccount, error: merchantError } = await supabase
        .from("merchants")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (merchantError) {
        console.error('[PublicHeader] Error querying merchant account:', merchantError);
      }

      const isCustomer = !!customerAccount;
      const isMerchant = !!merchantAccount;

      console.log('[PublicHeader] User type check:', { userId, isCustomer, isMerchant, customerAccount, merchantAccount });

      // Cache the results
      localStorage.setItem(`user_type_${userId}`, isCustomer ? "customer" : "");
      localStorage.setItem(`has_merchant_${userId}`, isMerchant ? "true" : "false");

      setUserType(isCustomer ? "customer" : null);
      setHasMerchantAccount(isMerchant);
      setIsLoadingAuth(false);
    };

    const initAuth = async () => {
      setIsLoadingAuth(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('[PublicHeader] Init auth:', { user: user?.id, email: user?.email, error });
      setUser(user);

      if (user) {
        await checkUserType(user.id);
      } else {
        setIsLoadingAuth(false);
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user || null;
      setUser(newUser);

      if (!newUser) {
        setUserType(null);
        setHasMerchantAccount(false);
        setIsLoadingAuth(false);
      } else {
        // Only check user type if it changed
        await checkUserType(newUser.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    if (isAccountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountMenuOpen]);

  // Scroll detection for showing search on homepage
  useEffect(() => {
    // If showSearch is explicitly true (like on /account pages), always show
    if (showSearch) {
      setShowHeaderSearch(true);
      return;
    }

    // Only apply scroll detection on homepage
    if (pathname === "/") {
      const handleScroll = () => {
        // Show search bar when scrolled past 300px (approximately past hero search)
        setShowHeaderSearch(window.scrollY > 300);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setShowHeaderSearch(false);
    }
  }, [pathname, showSearch]);

  const handleSignOut = async () => {
    // Clear cached user data
    if (user?.id) {
      localStorage.removeItem(`user_type_${user.id}`);
      localStorage.removeItem(`has_merchant_${user.id}`);
    }
    await supabase.auth.signOut();
    setIsAccountMenuOpen(false);
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              BeautiPick
            </Link>
          </div>

          {/* Search Bar - Centered, shows conditionally */}
          {showHeaderSearch && (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-xl mx-4"
            >
              <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm salon, dịch vụ..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    type="submit"
                    className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                  >
                    Tìm
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Mobile Search Button */}
          {showHeaderSearch && (
            <Link
              href="/search"
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </Link>
          )}

          {/* Right Side: Cart & Auth */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Cart Button - Show when merchantId is provided and cart has items */}
            {merchantId && cartCount > 0 && onCartClick && (
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Giỏ hàng"
              >
                <ShoppingBag className="h-6 w-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            )}

            {/* Auth Links or Account Menu - Only show for customers */}
            {isLoadingAuth ? (
              /* Loading skeleton */
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="hidden sm:block h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : user && userType === "customer" ? (
              <div ref={accountMenuRef} className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 hidden sm:block max-w-[120px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-600 transition-transform hidden sm:block",
                    isAccountMenuOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown Menu */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Profile */}
                    <Link
                      href="/account/profile"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UserCircle className="h-5 w-5" />
                      <span>Hồ sơ</span>
                    </Link>

                    {/* Appointments */}
                    <Link
                      href="/account/appointments"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Các cuộc hẹn</span>
                    </Link>

                    {/* Favorites */}
                    <Link
                      href="/account/favorites"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Mục yêu thích</span>
                    </Link>

                    {/* Settings */}
                    <Link
                      href="/account/settings"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Cài đặt</span>
                    </Link>

                    {/* Merchant Dashboard Link (if user also has merchant account) */}
                    {hasMerchantAccount && (
                      <>
                        <div className="border-t border-gray-200 my-1"></div>
                        <Link
                          href="/business/dashboard"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Quản lý Salon</span>
                        </Link>
                      </>
                    )}

                    {/* Sign Out */}
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Đăng nhập
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
