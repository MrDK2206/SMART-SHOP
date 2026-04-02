# Cartify MERN Store

Full MERN ecommerce application with a React + Tailwind frontend and an Express + MongoDB backend.

## Features

- JWT authentication and protected admin APIs
- Product catalog with search, category filters, and sorting
- Admin-managed categories with reusable category landing pages
- Stock-aware cart and order flows
- Coupon support and shipping-rule calculation
- Cash on Delivery and Razorpay payment flow
- Razorpay payment signature verification on the server
- Order history and status tracking
- Profile and saved shipping-address management
- Admin dashboard, inventory management, and order management
- Product and category images via direct URL or manual upload
- Device-preference dark mode for storefront and admin
- Custom password reveal controls and case-sensitive captcha on auth forms
- Responsive React UI with SEO-friendly metadata and sitemap/robots files
- Request validation, rate limiting, and security headers

## Architecture

- `src/`: React client, route-based pages, shared contexts, SEO helpers
- `server/controllers`: HTTP orchestration only
- `server/services`: pricing and payment business logic
- `server/models`: MongoDB domain models
- `server/validators`: request validation schemas
- `server/routes`: transport layer with auth and validation middleware

## Environment

Copy `.env.example` to `.env` and set the values.

Required keys:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Default seeded accounts after running `npm run seed`:

- Admin: `admin@cartify.com` / `Admin123!`
- Customer: `shopper@cartify.com` / `Shop123!`

Seeded coupons:

- `WELCOME10`
- `SHIPFREE`

## Run

```bash
npm install
npm run seed
npm run dev
```

Client: `http://localhost:5173`

Server: `http://localhost:5000`

## Deployment

1. Provision MongoDB Atlas or another managed MongoDB instance.
2. Create a Razorpay account and set live API keys in production env vars.
3. Build the frontend with `npm run build`.
4. Deploy the Express app with the same env vars used locally.
5. Serve the Vite build output from a CDN, static host, or behind the Node app.
6. Update `CLIENT_URL`, `public/robots.txt`, and `public/sitemap.xml` with the real domain.
7. Put the app behind HTTPS before enabling live Razorpay payments.

### One-Service Deploy (Recommended)

This repo can run as a single Node service where Express serves both API and frontend build.

#### 1) Push to GitHub

```bash
git init
git add .
git commit -m "Initial SmartShop deployment setup"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

#### 2) Deploy on Render

- Create a new **Web Service** from your GitHub repo.
- Runtime: **Node**
- Build command: `npm install && npm run build`
- Start command: `npm start`

Set these environment variables in Render:

- `NODE_ENV=production`
- `PORT=10000`
- `MONGO_URI=<your atlas uri>`
- `JWT_SECRET=<strong secret>`
- `CLIENT_URL=https://<your-render-domain>.onrender.com`
- `RAZORPAY_KEY_ID=<live or test key id>`
- `RAZORPAY_KEY_SECRET=<live or test key secret>`
- `RAZORPAY_CURRENCY=INR`

After first deploy succeeds, open:

- `https://<your-render-domain>.onrender.com`
- `https://<your-render-domain>.onrender.com/api/health`

#### 3) Keep client and API on same domain

The frontend uses relative API path by default (`/api`) and production server now serves `dist/` directly, so no extra frontend host is required.

#### 4) Update SEO files

Replace localhost URLs in `public/sitemap.xml` and references in `public/robots.txt` with your live domain, then redeploy.

## API Docs

API endpoints are documented in [docs/API.md](C:/Users/Dhruvil/OneDrive/Documents/Playground/docs/API.md).
