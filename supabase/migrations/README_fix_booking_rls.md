# Fix RLS for Customer Creation from Bookings

## Vấn đề
Khi tạo booking mới, trigger `auto_create_customer_from_booking` cố gắng tự động tạo customer record, nhưng bị chặn bởi RLS policy vì trigger không có `auth.uid()`.

Lỗi: `new row violates row-level security policy for table "customers"`

## Giải pháp
Migration `20251206_fix_customers_rls_for_bookings.sql` sửa RLS policies để cho phép:
1. Triggers (auth.uid() IS NULL) có thể INSERT và UPDATE customers
2. Merchants vẫn có thể tự INSERT và UPDATE customers của mình

## Cách chạy Migration

### Cách 1: Qua Supabase Dashboard (Khuyến nghị)

1. Mở Supabase Dashboard: https://hopyfszhtdqtkhzaxrem.supabase.co
2. Vào **SQL Editor** (icon database bên trái)
3. Click **New Query**
4. Copy toàn bộ nội dung từ `20251206_fix_customers_rls_for_bookings.sql`
5. Paste vào SQL Editor
6. Click **Run** (hoặc Cmd/Ctrl + Enter)
7. Kiểm tra kết quả - phải thấy "Success. No rows returned"

### Cách 2: Qua psql (Nếu có Database URL)

```bash
# Lấy Direct Connection String từ Supabase Dashboard:
# Settings > Database > Connection String > Direct Connection

# Chạy migration
psql "postgresql://postgres:[YOUR-PASSWORD]@db.hopyfszhtdqtkhzaxrem.supabase.co:5432/postgres" \
  -f supabase/migrations/20251206_fix_customers_rls_for_bookings.sql
```

## Kiểm tra Migration đã hoạt động

Sau khi chạy migration, thử tạo booking mới qua UI. Nếu thành công và không còn lỗi RLS, migration đã hoạt động!

## Rollback (Nếu cần)

Nếu cần quay lại policy cũ:

```sql
-- Restore old restrictive policies
DROP POLICY IF EXISTS "Allow customer creation from bookings or by merchants" ON public.customers;
DROP POLICY IF EXISTS "Allow customer updates from bookings or by merchants" ON public.customers;

CREATE POLICY "Merchants can insert own customers"
    ON public.customers
    FOR INSERT
    WITH CHECK (merchant_id = auth.uid());

CREATE POLICY "Merchants can update own customers"
    ON public.customers
    FOR UPDATE
    USING (merchant_id = auth.uid())
    WITH CHECK (merchant_id = auth.uid());
```
