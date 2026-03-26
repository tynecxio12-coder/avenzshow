Use this full README code:

````md
# 🛍️ AvenzShoe — Premium Shoe E-commerce Platform

A modern full-stack e-commerce web application for selling premium footwear, built with **React + TypeScript + Supabase**.

This platform includes everything needed for a real business, including product browsing, cart and wishlist, order management, admin dashboard, and real-time order tracking.

---

## 🚀 Features

### 👤 User Features
- 🔐 Authentication (Sign up / Login)
- 🛒 Add to cart and checkout
- ❤️ Wishlist system
- 📦 Order history (My Orders)
- 📍 Real-time order tracking
- 🧾 Order details view

### 📦 Order Tracking System
Each order has its own tracking flow.

**Users can:**
- Click any order to track it
- View status timeline from **Pending → Delivered**

**Admins can:**
- Update tracking status
- Add notes, courier, and delivery information

### 👨‍💼 Admin Features
- 🔑 Admin login protection
- 📊 Admin dashboard
- 📦 Manage orders
- 🔄 Update order status
- 🚚 Add tracking updates
- 👥 Role-based system (**Admin / Customer**)

### 🎨 UI/UX Features
- Fully responsive design
- 📱 Modern animations with Framer Motion
- Clean product cards
- Smooth hover effects
- Fast performance

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router

### Backend
- Supabase Authentication
- PostgreSQL Database
- Realtime updates

---

## 📂 Project Structure

```bash
src/
├── components/
├── layout/
├── product/
├── pages/
│   ├── LoginPage.tsx
│   ├── MyOrdersPage.tsx
│   └── TrackOrderPage.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── StoreContext.tsx
├── lib/
│   ├── supabase.ts
│   ├── currency.ts
│   └── orderStatus.ts
├── types/
│   └── order.ts
└── routes/
    └── AdminRoute.tsx
````

---

## 🔐 Authentication Flow

* Users login using **Supabase Auth**
* Role is stored in the **profiles** table

### Redirect logic

* **Admin users** → redirected to `/admin`
* **Customer users** → redirected to `/account`

---

## 📦 Order Flow

1. User places an order
2. Order is saved in the **orders** table
3. Admin updates status
4. Tracking entries are saved in the **tracking** table
5. User sees real-time updates

---

## 📊 Database Tables

### `orders`

* `id`
* `user_id`
* `status`
* `payment_status`
* `tracking_number`
* `courier_name`
* `total_amount`

### `tracking`

* `id`
* `order_id`
* `status`
* `title`
* `description`
* `created_at`

### `profiles`

* `id`
* `role` (`admin` / `customer`)

---

## ⚙️ Installation

```bash
git clone https://github.com/tynecxio12-coder/avenz-step-up-elevate.git
cd avenz-step-up-elevate
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

## 🌍 Routes

| Route          | Description     |
| -------------- | --------------- |
| `/shop`        | Product listing |
| `/product/:id` | Product details |
| `/account`     | User account    |
| `/my-orders`   | User orders     |
| `/track-order` | Order tracking  |
| `/admin`       | Admin dashboard |

---

## 🧠 Key Logic Highlights

### Order Tracking

Each order is tracked using:

```bash
/track-order?orderId=ORDER_ID
```

So every order has:

* Unique tracking
* Clear order-specific updates
* No confusion between multiple orders

### Admin Redirect After Login

* **Admin** → `/admin`
* **User** → `/account`

### Clickable Orders

* Clicking an order card opens tracking
* Buttons still work separately where needed

---

## 🏆 Future Improvements

* Email notifications
* Payment gateway integration (Stripe / SSLCommerz)
* Multi-language support
* Product review system
* Analytics dashboard

---

## 🤝 Contributing

Pull requests are welcome.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Nifad Hasan**
CEO of **TynecXio**

```

Your current problem was mainly that everything was written in one long messy paragraph. This version is clean, professional, and GitHub README friendly.

I can also make it even more premium with badges, demo link, screenshot section, and live preview button.
```
