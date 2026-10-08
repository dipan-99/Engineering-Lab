# Lab 05 — Shopping Cart Architecture

## Architecture

```text
React
 ├── CartContext
 ├── Cart.jsx
 └── ProductCard
          ↓
        Axios
          ↓
      /cart routes
          ↓
   Cart Controller
          ↓
Customer.cart
          ↓
       Product
          ↓
       MongoDB
```

The cart is stored **inside the Customer document**. Each cart item contains a product reference and quantity.

```js
cart: [
    {
        product: ObjectId,
        quantity: Number
    }
]
```

## Main APIs

```text
POST   /cart/:productId
GET    /cart
PATCH  /cart/:productId
DELETE /cart/:productId
```

All cart APIs are protected.

## Flow

### Add to cart

```text
ProductCard
   ↓
POST /cart/:productId
   ↓
Authenticate user
   ↓
Find product
   ↓
Check stock
   ↓
Add/increase quantity
   ↓
Save Customer
```

### Read cart

```text
CartContext
   ↓
GET /cart
   ↓
Customer.cart
   ↓
Populate Product
   ↓
CartContext stores cartItems
   ↓
Cart.jsx renders items
```

### Update/remove

```text
Cart.jsx
   ↓
PATCH /cart/:productId
        OR
DELETE /cart/:productId
   ↓
Update Customer.cart
   ↓
Refresh cart
```

The cart becomes the input for the checkout process in Lab 06.
