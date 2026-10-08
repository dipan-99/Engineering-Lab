# Lab 03 — Product Catalog Architecture

## Architecture

```text
React
 ├── Products.jsx
 ├── ProductCard.jsx
 └── ProductDetails.jsx
          ↓
       Axios
          ↓
   Express Product Routes
          ↓
   Product Controller
          ↓
    Product Model
          ↓
      MongoDB
```

This lab adds the product catalog to ShopKart.

### Main features

- Fetch products.
- Search products.
- Filter/category handling.
- Display products using `ProductCard`.
- Open a product's detail page.
- Fetch an individual product using its ID.

## Flow

### Product list

```text
/products
   ↓
GET /products
   ↓
Product Controller
   ↓
MongoDB
   ↓
Products.jsx
   ↓
ProductCard components
```

### Product details

```text
Click Product
     ↓
/products/:id
     ↓
GET /products/:id
     ↓
Backend finds product
     ↓
ProductDetails.jsx
```

React Router handles navigation while Axios communicates with the Express API.
