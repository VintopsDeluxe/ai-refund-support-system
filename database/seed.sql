-- WORKNOON AI Refund Support System
-- Synthetic seed data
-- 15 customers with multiple refund-policy scenarios

-- ============================================
-- CUSTOMERS
-- ============================================

INSERT INTO customers (name, email, phone)
VALUES
  ('John Carter', 'john.carter@example.com', '+15550000001'),
  ('Sarah Williams', 'sarah.williams@example.com', '+15550000002'),
  ('Michael Brown', 'michael.brown@example.com', '+15550000003'),
  ('Emily Davis', 'emily.davis@example.com', '+15550000004'),
  ('Daniel Wilson', 'daniel.wilson@example.com', '+15550000005'),
  ('Olivia Martinez', 'olivia.martinez@example.com', '+15550000006'),
  ('James Anderson', 'james.anderson@example.com', '+15550000007'),
  ('Sophia Taylor', 'sophia.taylor@example.com', '+15550000008'),
  ('William Thomas', 'william.thomas@example.com', '+15550000009'),
  ('Ava Moore', 'ava.moore@example.com', '+15550000010'),
  ('Benjamin Jackson', 'benjamin.jackson@example.com', '+15550000011'),
  ('Mia White', 'mia.white@example.com', '+15550000012'),
  ('Lucas Harris', 'lucas.harris@example.com', '+15550000013'),
  ('Charlotte Martin', 'charlotte.martin@example.com', '+15550000014'),
  ('Henry Thompson', 'henry.thompson@example.com', '+15550000015')
ON CONFLICT (email) DO NOTHING;


-- ============================================
-- ORDERS
-- ============================================

-- 1. Normal delivered order
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Wireless Headphones',
  129.99,
  'delivered',
  CURRENT_DATE - INTERVAL '10 days',
  CURRENT_DATE - INTERVAL '6 days',
  false
FROM customers
WHERE email = 'john.carter@example.com';


-- 2. Damaged item
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Smart Monitor',
  349.99,
  'delivered',
  CURRENT_DATE - INTERVAL '8 days',
  CURRENT_DATE - INTERVAL '4 days',
  false
FROM customers
WHERE email = 'sarah.williams@example.com';


-- 3. Final sale
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Clearance Laptop Stand',
  79.99,
  'delivered',
  CURRENT_DATE - INTERVAL '12 days',
  CURRENT_DATE - INTERVAL '8 days',
  true
FROM customers
WHERE email = 'michael.brown@example.com';


-- 4. Old order
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Mechanical Keyboard',
  159.99,
  'delivered',
  CURRENT_DATE - INTERVAL '120 days',
  CURRENT_DATE - INTERVAL '115 days',
  false
FROM customers
WHERE email = 'emily.davis@example.com';


-- 5. High-value order (> $500)
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Professional Camera',
  1299.99,
  'delivered',
  CURRENT_DATE - INTERVAL '7 days',
  CURRENT_DATE - INTERVAL '3 days',
  false
FROM customers
WHERE email = 'daniel.wilson@example.com';


-- 6. Incorrect item
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Running Shoes',
  119.99,
  'delivered',
  CURRENT_DATE - INTERVAL '9 days',
  CURRENT_DATE - INTERVAL '5 days',
  false
FROM customers
WHERE email = 'olivia.martinez@example.com';


-- 7. Normal eligible order
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Bluetooth Speaker',
  89.99,
  'delivered',
  CURRENT_DATE - INTERVAL '6 days',
  CURRENT_DATE - INTERVAL '3 days',
  false
FROM customers
WHERE email = 'james.anderson@example.com';


-- 8. High-value order (> $500)
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Gaming Laptop',
  1899.00,
  'delivered',
  CURRENT_DATE - INTERVAL '5 days',
  CURRENT_DATE - INTERVAL '2 days',
  false
FROM customers
WHERE email = 'sophia.taylor@example.com';


-- 9. Final sale
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Refurbished Tablet',
  199.99,
  'delivered',
  CURRENT_DATE - INTERVAL '15 days',
  CURRENT_DATE - INTERVAL '10 days',
  true
FROM customers
WHERE email = 'william.thomas@example.com';


-- 10. Recent normal order
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'USB-C Docking Station',
  149.99,
  'delivered',
  CURRENT_DATE - INTERVAL '4 days',
  CURRENT_DATE - INTERVAL '2 days',
  false
FROM customers
WHERE email = 'ava.moore@example.com';


-- 11. Damaged item
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Office Chair',
  429.99,
  'delivered',
  CURRENT_DATE - INTERVAL '11 days',
  CURRENT_DATE - INTERVAL '7 days',
  false
FROM customers
WHERE email = 'benjamin.jackson@example.com';


-- 12. Old order
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Smartwatch',
  249.99,
  'delivered',
  CURRENT_DATE - INTERVAL '150 days',
  CURRENT_DATE - INTERVAL '145 days',
  false
FROM customers
WHERE email = 'mia.white@example.com';


-- 13. Incorrect item
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'External SSD',
  179.99,
  'delivered',
  CURRENT_DATE - INTERVAL '7 days',
  CURRENT_DATE - INTERVAL '4 days',
  false
FROM customers
WHERE email = 'lucas.harris@example.com';


-- 14. High-value order
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  '4K Professional Camera Lens',
  899.99,
  'delivered',
  CURRENT_DATE - INTERVAL '6 days',
  CURRENT_DATE - INTERVAL '3 days',
  false
FROM customers
WHERE email = 'charlotte.martin@example.com';


-- 15. Normal eligible order
INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Noise Cancelling Earbuds',
  99.99,
  'delivered',
  CURRENT_DATE - INTERVAL '3 days',
  CURRENT_DATE - INTERVAL '1 day',
  false
FROM customers
WHERE email = 'henry.thompson@example.com';


-- ============================================
-- ADDITIONAL ORDERS
-- Multiple orders for selected customers
-- ============================================

INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Laptop Backpack',
  69.99,
  'delivered',
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE - INTERVAL '26 days',
  false
FROM customers
WHERE email = 'john.carter@example.com';


INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  'Wireless Mouse',
  39.99,
  'delivered',
  CURRENT_DATE - INTERVAL '20 days',
  CURRENT_DATE - INTERVAL '17 days',
  false
FROM customers
WHERE email = 'sarah.williams@example.com';


INSERT INTO orders
  (customer_id, product_name, amount, status, order_date, delivery_date, is_final_sale)
SELECT
  id,
  '4K Monitor',
  599.99,
  'delivered',
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE - INTERVAL '10 days',
  false
FROM customers
WHERE email = 'daniel.wilson@example.com';


-- ============================================
-- VERIFICATION
-- ============================================

SELECT
  COUNT(*) AS total_customers
FROM customers;


SELECT
  COUNT(*) AS total_orders
FROM orders;


SELECT
  c.name AS customer,
  c.email,
  o.product_name,
  o.amount,
  o.order_date,
  o.is_final_sale
FROM customers c
JOIN orders o ON o.customer_id = c.id
ORDER BY c.name, o.order_date DESC;