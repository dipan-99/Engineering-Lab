# Lab 06 — Checkout & Orders Architecture

## Architecture

```text
Cart
 ↓
Checkout.jsx
 ↓
POST /orders/create-payment-order
 ↓
Order Controller
 ├── Customer.cart
 ├── Product
 └── Order
 ↓
Razorpay Order
 ↓
Razorpay Checkout
 ↓
POST /orders/verify-payment
 ↓
HMAC Signature Verification
 ↓
Payment = PAID
Order = PLACED
 ↓
Clear Customer.cart
 ↓
Order Success
```

## Order Model

An order stores:

- User
- Product snapshots
- Quantity
- Price at purchase time
- Product image/name
- Shipping address
- Server-calculated total
- Payment status
- Order status
- Razorpay order/payment IDs

## Create Payment Flow

```text
Checkout
   ↓
Send shipping address
   ↓
Backend reads current cart
   ↓
Load latest products
   ↓
Check stock
   ↓
Snapshot name/price/image
   ↓
Calculate total on server
   ↓
Create ShopKart Order
   ↓
Create Razorpay Order
   ↓
Return Razorpay details
```

The frontend does **not** control the final price.

## Payment Verification

```text
Razorpay
   ↓
Payment response
   ↓
Frontend sends payment details
   ↓
Backend generates HMAC SHA256
   ↓
Compare signatures
   ↓
Valid?
 ┌───────┴───────┐
Yes              No
 ↓                ↓
PAID              400
PLACED            Cart stays
 ↓
Clear cart
 ↓
Order Success
```

## Orders Flow

```text
GET /orders
     ↓
Authenticated user
     ↓
Newest orders first
     ↓
My Orders page
```

```text
GET /orders/:id
     ↓
Authenticated user
     ↓
Find order belonging to user
     ↓
Order Details page
```

## Complete ShopKart Flow

```text
Register/Login
      ↓
Browse Products
      ↓
Wishlist / Cart
      ↓
Checkout
      ↓
Shipping Details
      ↓
Razorpay Payment
      ↓
Payment Verification
      ↓
Cart Cleared
      ↓
Order Success
      ↓
My Orders
      ↓
Order Details
```

The six labs together form the complete ShopKart MERN application: authentication, catalog, wishlist, cart, checkout, payments and order history.
