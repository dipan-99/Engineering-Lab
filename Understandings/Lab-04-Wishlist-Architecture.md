# Lab 04 — Wishlist Architecture

## Architecture

```text
ProductCard / Wishlist Page
            ↓
          Axios
            ↓
     Wishlist Routes
            ↓
   Wishlist Controller
            ↓
      Customer Model
            ↓
        MongoDB
```

The wishlist is associated with the authenticated customer.

### Main APIs

```text
POST   /wishlist/:productId
GET    /wishlist
DELETE /wishlist/:productId
```

All wishlist operations are protected by authentication.

## Flow

### Add

```text
ProductCard
   ↓
POST /wishlist/:productId
   ↓
Authentication
   ↓
Check product/user
   ↓
Save product reference
```

### View

```text
Wishlist Page
   ↓
GET /wishlist
   ↓
Authenticated customer
   ↓
Populate saved products
   ↓
Render wishlist
```

### Remove

```text
Remove button
   ↓
DELETE /wishlist/:productId
   ↓
Remove reference
   ↓
Updated wishlist
```

The frontend handles loading, success, empty and error states.
