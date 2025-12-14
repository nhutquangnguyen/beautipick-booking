import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              BeautiPick
            </h3>
            <p className="text-sm text-gray-600">
              Nền tảng đặt lịch làm đẹp hàng đầu Việt Nam
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Khách hàng</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/search">Tìm salon</Link></li>
              <li><Link href="/customer">Lịch đặt của tôi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Merchant</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/business">Giới thiệu</Link></li>
              <li><Link href="/signup">Đăng ký</Link></li>
              <li><Link href="/business/dashboard">Đăng nhập</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/terms">Điều khoản</Link></li>
              <li><Link href="/privacy">Bảo mật</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} BeautiPick. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
