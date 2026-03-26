🛍️ AvenzShoe — Premium Shoe E-commerce Platform

A modern full-stack e-commerce web application for selling premium footwear, built with React + TypeScript + Supabase.

This platform includes everything needed for a real business:

Product browsing
Cart & wishlist
Order system
Admin dashboard
Order tracking system 🚀
🚀 Features
👤 User Features
🔐 Authentication (Sign up / Login)
🛒 Add to cart & checkout
❤️ Wishlist system
📦 Order history (My Orders)
📍 Real-time order tracking
🧾 Order details view
📦 Order Tracking System
Each order has its own tracking
Users can:
Click any order → track it
See status timeline (Pending → Delivered)
Admin can:
Update tracking status
Add notes, courier, delivery info
👨‍💼 Admin Features
🔑 Admin login protection
📊 Admin dashboard
📦 Manage orders
🔄 Update order status
🚚 Add tracking updates
👥 Role-based system (Admin / Customer)
🎨 UI/UX Features
Fully responsive design 📱
Modern animations (Framer Motion)
Clean product cards
Smooth hover effects
Fast performance
🛠️ Tech Stack
Frontend
React (Vite)
TypeScript
Tailwind CSS
Framer Motion
React Router
Backend
Supabase
Authentication
PostgreSQL Database
Realtime updates
📂 Project Structure
src/
│
├── components/
│   ├── layout/
│   ├── product/
│
├── pages/
│   ├── LoginPage.tsx
│   ├── MyOrdersPage.tsx
│   ├── TrackOrderPage.tsx
│
├── contexts/
│   ├── AuthContext.tsx
│   ├── StoreContext.tsx
│
├── lib/
│   ├── supabase.ts
│   ├── currency.ts
│   ├── orderStatus.ts
│
├── types/
│   ├── order.ts
│
└── routes/
    ├── AdminRoute.tsx
🔐 Authentication Flow
Users login using Supabase auth
Role stored in profiles table
Admin users:
Automatically redirected to /admin
Customers:
Redirected to /account
📦 Order Flow
User places order
Order saved in orders table
Admin updates status
Tracking entries saved in tracking table
User sees real-time updates
📊 Database Tables
orders
id
user_id
status
payment_status
tracking_number
courier_name
total_amount
tracking
id
order_id
status
title
description
created_at
profiles
id
role (admin / customer)
⚙️ Installation
git clone https://github.com/tynecxio12-coder/avenz-step-up-elevate.git

cd avenz-step-up-elevate

npm install

npm run dev
🔑 Environment Variables

Create .env file:

VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
🌍 Routes
Route	Description
/shop	Product listing
/product/:id	Product details
/account	User account
/my-orders	User orders
/track-order	Order tracking
/admin	Admin dashboard
🧠 Key Logic Highlights
Order Tracking

Each order is tracked using:

/track-order?orderId=ORDER_ID

So:

Every order → unique tracking
No confusion between orders
Admin Redirect
After login:
Admin → /admin
User → /account
Clickable Orders
Clicking order card → opens tracking
Buttons still work separately
🏆 Future Improvements
Email notifications
Payment gateway integration (Stripe / SSLCommerz)
Multi-language support
Product reviews system
Analytics dashboard
🤝 Contributing

Pull requests are welcome.

📄 License

MIT License

👨‍💻 Author

Nifad Hasan
CEO of TynecXio
