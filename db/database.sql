DROP TRIGGER IF EXISTS trigger_check_price ON "Product";
DROP TRIGGER IF EXISTS trigger_order_status_change ON "Order";
DROP FUNCTION IF EXISTS prevent_negative_price;
DROP FUNCTION IF EXISTS log_order_status_change;
DROP PROCEDURE IF EXISTS archive_old_cancelled_orders;
DROP PROCEDURE IF EXISTS update_category_prices;
DROP FUNCTION IF EXISTS get_user_total_spent;
DROP FUNCTION IF EXISTS is_product_active;

DROP TABLE IF EXISTS "AuditLog" CASCADE;
DROP TABLE IF EXISTS "Shipment" CASCADE;
DROP TABLE IF EXISTS "Payment" CASCADE;
DROP TABLE IF EXISTS "Address" CASCADE;
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "CartItem" CASCADE;
DROP TABLE IF EXISTS "Favorite" CASCADE;
DROP TABLE IF EXISTS "ProductImage" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

DROP TYPE IF EXISTS "ShipmentStatus";
DROP TYPE IF EXISTS "PaymentStatus";
DROP TYPE IF EXISTS "PaymentMethod";
DROP TYPE IF EXISTS "OrderStatus";
DROP TYPE IF EXISTS "Role";

CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'BLIK', 'TRANSFER');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');
CREATE TYPE "ShipmentStatus" AS ENUM ('PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Category" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL
);

CREATE TABLE "Product" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sellerId" TEXT NOT NULL,
    "categoryId" TEXT,
    CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL
);

CREATE TABLE "ProductImage" (
    "id" TEXT PRIMARY KEY,
    "url" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

CREATE TABLE "Favorite" (
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("userId", "productId"),
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Favorite_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

CREATE TABLE "CartItem" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CartItem_user_product_unique" UNIQUE ("userId", "productId"),
    CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

CREATE TABLE "Order" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OrderStatus" NOT NULL DEFAULT 'PAID',
    "totalPrice" DECIMAL(10,2) NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT
);

CREATE TABLE "OrderItem" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT
);

CREATE TABLE "Address" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT,
    "line1" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE TABLE "Payment" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT UNIQUE,
    "amount" DECIMAL(10,2),
    "method" "PaymentMethod" NOT NULL DEFAULT 'CARD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL
);

CREATE TABLE "Shipment" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT UNIQUE,
    "carrier" TEXT,
    "trackingNumber" TEXT,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PREPARING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL
);

CREATE TABLE "AuditLog" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION get_user_total_spent(user_uuid TEXT)
RETURNS DECIMAL AS $$
DECLARE
    total_spent DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM("totalPrice"), 0)
    INTO total_spent
    FROM "Order"
    WHERE "userId" = user_uuid AND status = 'PAID';
    RETURN total_spent;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_product_active(prod_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    active_status BOOLEAN;
BEGIN
    SELECT "isActive" INTO active_status FROM "Product" WHERE id = prod_id;
    RETURN COALESCE(active_status, false);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE archive_old_cancelled_orders()
LANGUAGE plpgsql
AS $$
DECLARE
    order_cursor CURSOR FOR
        SELECT id, "userId" FROM "Order"
        WHERE status = 'CANCELLED' AND "createdAt" < NOW() - INTERVAL '30 days';
    order_record RECORD;
BEGIN
    OPEN order_cursor;
    LOOP
        FETCH order_cursor INTO order_record;
        EXIT WHEN NOT FOUND;

        -- Dodaj wpis do logów (symulacja archiwizacji)
        INSERT INTO "AuditLog" (id, "userId", action, "createdAt")
        VALUES (
            gen_random_uuid()::text,
            order_record."userId",
            'Archived Cancelled Order (Cursor): ' || order_record.id,
            NOW()
        );
    END LOOP;
    CLOSE order_cursor;
END;
$$;

CREATE OR REPLACE PROCEDURE update_category_prices(cat_id TEXT, percentage DECIMAL)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "Product"
    SET price = price * (1 + (percentage / 100))
    WHERE "categoryId" = cat_id;

    INSERT INTO "AuditLog" (id, "userId", action)
    VALUES (gen_random_uuid()::text, NULL, 'Updated prices for category ' || cat_id || ' by ' || percentage || '%');
END;
$$;

CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO "AuditLog" (id, "userId", action)
        VALUES (
            gen_random_uuid()::text,
            NEW."userId",
            'TRIGGER: Order ' || NEW.id || ' status changed from ' || OLD.status || ' to ' || NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_order_status_change
AFTER UPDATE ON "Order"
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();

CREATE OR REPLACE FUNCTION prevent_negative_price()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.price < 0 THEN
        RAISE EXCEPTION 'BLAD: Cena produktu nie może być ujemna!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_price
BEFORE INSERT OR UPDATE ON "Product"
FOR EACH ROW
EXECUTE FUNCTION prevent_negative_price();


INSERT INTO "User" (id, email, "passwordHash", name, role) VALUES
('u1', 'admin@sklep.pl', 'hash123', 'Admin Adam', 'ADMIN'),
('u2', 'klient@gmail.com', 'hash456', 'Jan Kowalski', 'USER'),
('u3', 'anna@wp.pl', 'hash789', 'Anna Nowak', 'USER');

INSERT INTO "Category" (id, name, "parentId") VALUES
('c1', 'Elektronika', NULL),
('c2', 'Ubrania', NULL),
('c3', 'Laptopy', 'c1'),
('c4', 'Smartfony', 'c1');

INSERT INTO "Product" (id, title, description, price, "sellerId", "categoryId") VALUES
('p1', 'MacBook Pro', 'Super szybki laptop', 10000.00, 'u1', 'c3'),
('p2', 'iPhone 15', 'Najnowszy model', 5000.00, 'u1', 'c4'),
('p3', 'T-shirt Biały', 'Bawełna 100%', 50.00, 'u1', 'c2');

INSERT INTO "Order" (id, "userId", status, "totalPrice", "createdAt") VALUES
('o1', 'u2', 'PAID', 10050.00, NOW() - INTERVAL '2 days');

INSERT INTO "Order" (id, "userId", status, "totalPrice", "createdAt") VALUES
('o2', 'u3', 'PENDING', 5000.00, NOW());

INSERT INTO "Order" (id, "userId", status, "totalPrice", "createdAt") VALUES
('o3', 'u2', 'CANCELLED', 100.00, NOW() - INTERVAL '40 days');

INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, "unitPrice") VALUES
('oi1', 'o1', 'p1', 1, 10000.00),
('oi2', 'o1', 'p3', 1, 50.00),
('oi3', 'o2', 'p2', 1, 5000.00);

INSERT INTO "Payment" (id, "orderId", amount, method, status) VALUES
('pay1', 'o1', 10050.00, 'BLIK', 'PAID');

INSERT INTO "Shipment" (id, "orderId", carrier, "trackingNumber", status) VALUES
('sh1', 'o1', 'DHL', 'DHL123456PL', 'SHIPPED');

INSERT INTO "Address" (id, "userId", line1, city, zip, country) VALUES
('a1', 'u2', 'Ul. Długa 1', 'Warszawa', '00-001', 'Polska');


-- SELECT u.name, o.id as order_id, p.title, oi.quantity, oi."unitPrice"
-- FROM "User" u
-- JOIN "Order" o ON u.id = o."userId"
-- JOIN "OrderItem" oi ON o.id = oi."orderId"
-- JOIN "Product" p ON oi."productId" = p.id
-- WHERE u.email = 'klient@gmail.com';

-- SELECT 'Suma wydatków u2' as opis, get_user_total_spent('u2') as wynik;

-- UPDATE "Order" SET status = 'PAID' WHERE id = 'o2';
-- SELECT * FROM "AuditLog" WHERE action LIKE 'TRIGGER%';

-- CALL archive_old_cancelled_orders();
-- SELECT * FROM "AuditLog" WHERE action LIKE 'Archived Cancelled Order%';


-- CALL update_category_prices('c2', 10.0);
-- SELECT id, title, price FROM "Product" WHERE "categoryId" = 'c2';

-- 5.6 TEST: Trigger walidacji ceny (Próba dodania produktu z ceną -100)
-- To zapytanie POWINNO wyrzucić błąd w konsoli "Cena produktu nie może być ujemna!"
-- INSERT INTO "Product" (id, title, description, price, "sellerId", "categoryId")
-- VALUES ('p_fail', 'Bad Product', 'Desc', -100.00, 'u1', 'c1');
