# API Reference

Base URL: `/api`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile`
- `PUT /auth/profile`

## Catalog

- `GET /categories`
- `GET /categories/:slug`
- `GET /categories/admin`
  - Admin only
- `POST /categories`
  - Admin only
- `PUT /categories/:id`
  - Admin only
- `DELETE /categories/:id`
  - Admin only
- `GET /products`
  - Query: `keyword`, `category`, `sort`
- `GET /products/meta`
- `GET /products/featured`
- `GET /products/:id`
- `POST /products`
  - Admin only
- `PUT /products/:id`
  - Admin only
- `DELETE /products/:id`
  - Admin only

## Cart

- `GET /cart`
- `POST /cart`
- `PUT /cart/:productId`
- `DELETE /cart/:productId`

## Orders

- `POST /orders/preview`
- `POST /orders/cod`
- `POST /orders/razorpay/create`
- `POST /orders/razorpay/verify`
- `GET /orders/my-orders`
- `GET /orders`
  - Admin only
- `GET /orders/:id`
- `PUT /orders/:id`
  - Admin only

## Admin

- `GET /admin/summary`

## Notes

- Protected routes require `Authorization: Bearer <token>`.
- Validation is enforced with Zod at the route layer.
- Rate limiting and security headers are enabled globally.
- Razorpay verification uses HMAC signature validation on the server.
- Product and category images can be stored either as normal URLs or uploaded image data URLs.
