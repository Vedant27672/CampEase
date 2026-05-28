<div align="center">

# ⛺ CampEase

**Discover, book, and review amazing campgrounds — all in one place.**

[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🌐 Live Demo](https://campease.onrender.com) &nbsp;·&nbsp; [🐛 Report Bug](https://github.com/Vedant27672/CampEase/issues) &nbsp;·&nbsp; [✨ Request Feature](https://github.com/Vedant27672/CampEase/issues)

</div>

---

## 📸 Overview

CampEase is a full-stack campground discovery and booking platform. Users can browse handpicked campgrounds, view them on interactive maps, write reviews, book stays with a date picker, manage a cart of multiple bookings, and sign in with Google — all wrapped in a polished responsive UI with dark mode support.

---

## ✨ Features

### 🏕️ Campgrounds
- Browse all campgrounds in a responsive card grid with live client-side search
- Create, edit, and delete campgrounds (authenticated owners only)
- Drag-and-drop multi-photo upload stored on **Cloudinary**
- Auto-geocoding — location text is silently converted to map coordinates on save/edit

### 🗺️ Interactive Maps
- Per-campground location map powered by **MapLibre GL JS** + **MapTiler**
- Fullscreen mode switches to a clustered view of **all** campgrounds on one map
- Live geocode preview while typing a location in the create/edit form

### ⭐ Reviews
- Star ratings (1–5) with smooth CSS animations via the Starability library
- Add and delete reviews per campground
- Only the review author can delete their own review

### 📅 Booking System
- **Flatpickr** date picker — existing confirmed bookings are automatically disabled
- Conflict detection prevents double-booking the same campground
- **Book Now** — instant single booking directly from the campground page
- **Add to Cart** — queue multiple campgrounds with different dates
- Live price preview: nights × nightly price updates as you select dates

### 🛒 Cart
- Session-based cart — no extra database model, naturally expires with the session
- Review all queued reservations before confirming
- Bulk checkout — conflict-checks every item first, then creates all bookings at once
- Cart item count badge in the navbar updates on every request

### 📆 Booking History & Calendar
- Tabbed booking history — **Upcoming** and **Past & Cancelled**
- Cancel any upcoming confirmed booking with one click
- **FullCalendar** view — all confirmed bookings shown as date-range events, click any to open details

### 🔐 Authentication
- Local sign-up / sign-in with Passport.js (username + password)
- **Google OAuth 2.0** — one-click sign-in; automatically links to an existing local account if emails match
- All protected routes save and restore the intended destination after login

### 📖 API Documentation
- Auto-generated **Swagger / OpenAPI** docs served at `/api-docs`
- Powered by `swagger-autogen` (scans route files) + `swagger-ui-express` (interactive UI)
- All routes grouped by feature — Campgrounds, Reviews, Bookings, Cart, Auth
- Regenerate any time with `npm run swagger`; auto-regenerated on every Render deploy

### 🎨 UI / UX
- Full **light / dark mode** — persisted in `localStorage`, respects `prefers-color-scheme` on first visit
- Live stat counters on the home page pulled directly from the database
- Scroll-reveal entrance animations and toast flash notifications
- Fully responsive — mobile hamburger drawer, touch-friendly date pickers
- Password strength indicator on the register page

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 24.x |
| Framework | Express 4.x |
| Database | MongoDB (Mongoose 5.x) via Atlas |
| Auth | Passport.js — Local Strategy + Google OAuth 2.0 |
| Templates | EJS + ejs-mate (layouts) |
| Validation | Joi (server-side) + Bootstrap classes (client-side) |
| Image Hosting | Cloudinary + Multer |
| Maps | MapLibre GL JS v4 + MapTiler (geocoding + tiles) |
| Date Picker | Flatpickr (CDN) |
| Calendar | FullCalendar 6 (CDN) |
| CSS | Bootstrap 5.3 + custom CSS design system (CSS custom properties) |
| API Docs | swagger-autogen + swagger-ui-express |
| Session Store | connect-mongo (MongoDB-backed sessions) |
| Deployment | Render |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster
- A [Cloudinary](https://cloudinary.com) account (free tier)
- A [MapTiler](https://maptiler.com) account (free tier)
- *(Optional)* Google Cloud project with OAuth 2.0 credentials for Google login

### Installation

```bash
git clone https://github.com/Vedant27672/CampEase.git
cd CampEase
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Atlas connection string
atlas_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0

# Session (use a long random string in production)
SESSION_SECRET=your-strong-random-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# MapTiler
MAPTILER_TOKEN=your_maptiler_token

# Google OAuth — optional, app works without it
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> **Google OAuth setup:**
> 1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
> 2. Go to **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
> 3. Add authorized redirect URIs:
>    - `http://localhost:3000/auth/google/callback`
>    - `https://your-app.onrender.com/auth/google/callback`
> 4. Copy the Client ID and Secret into `.env`

### Run Locally

```bash
node app.js
```

Visit [http://localhost:3000](http://localhost:3000)

### Seed Sample Data *(optional)*

```bash
node seeds/index.js
```

---

## 📁 Project Structure

```
CampEase/
├── controllers/
│   ├── campgrounds.js   # CRUD, geocoding, blocked-dates query
│   ├── users.js         # Register, login, logout, Google OAuth callback
│   ├── reviews.js       # Create & delete reviews
│   ├── bookings.js      # Create, list, calendar, detail, cancel
│   └── cart.js          # Add, remove, bulk checkout (session-based)
├── models/
│   ├── campground.js    # Title, images, price, location, GeoJSON geometry
│   ├── user.js          # Email, username, googleId (passport-local-mongoose)
│   ├── review.js        # Body, rating, author
│   └── booking.js       # Campground, user, checkIn/Out, totalPrice, status
├── routes/
│   ├── campgrounds.js
│   ├── users.js         # Local auth + Google OAuth routes
│   ├── reviews.js
│   ├── bookings.js
│   └── cart.js
├── views/
│   ├── layouts/         # boilerplate.ejs
│   ├── partials/        # navbar, footer, flash
│   ├── campgrounds/     # index, show, new, edit
│   ├── users/           # login, register
│   ├── bookings/        # index, calendar, confirmation
│   └── cart/            # index
├── public/
│   ├── stylesheets/     # styles.css (design system), stars.css
│   └── javascripts/     # animations.js, validateForms.js
├── middleware.js         # isLoggedIn, isAuthor, isReviewAuthor, isBookingOwner, validators
├── schemas.js            # Joi validation schemas (campground, review, booking)
├── cloudinary/           # Multer-Cloudinary storage config
└── app.js                # Express setup, Passport strategies, route mounts
```

---

## 🔑 Key Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Home — live stat counters |
| `GET` | `/campgrounds` | All campgrounds with search |
| `POST` | `/campgrounds` | Create campground |
| `GET` | `/campgrounds/:id` | Detail page + booking widget |
| `PUT` | `/campgrounds/:id` | Update campground |
| `DELETE` | `/campgrounds/:id` | Delete campground |
| `POST` | `/campgrounds/:id/reviews` | Add review |
| `POST` | `/campgrounds/:id/bookings` | Book Now (direct) |
| `GET` | `/cart` | View cart |
| `POST` | `/cart/add` | Add to cart |
| `POST` | `/cart/checkout` | Confirm all cart bookings |
| `GET` | `/bookings` | Booking history |
| `GET` | `/bookings/calendar` | FullCalendar view |
| `POST` | `/bookings/:id/cancel` | Cancel booking |
| `GET` | `/register` | Register |
| `GET` | `/login` | Login |
| `GET` | `/auth/google` | Google OAuth sign-in |
| `GET` | `/api-docs` | Interactive Swagger API docs |

---

## 🌐 Deploying to Render

1. Push your code to GitHub
2. Create a **Web Service** on [Render](https://render.com) and connect your repo
3. Set **Build Command:** `npm install && npm run swagger`
4. Set **Start Command:** `node app.js`
5. Add all env vars from `.env` in the Render **Environment** tab
6. **Do not** set `GOOGLE_CALLBACK_URL` — it is derived automatically from the request (the app has `trust proxy` enabled for Render's HTTPS proxy)

---

## 🗺️ Roadmap

- [ ] Razorpay / Stripe payment integration
- [ ] Booking confirmation emails (Nodemailer)
- [ ] Host dashboard — owners see bookings and revenue per campground
- [ ] Wishlist / saved campgrounds
- [ ] Reviews gated by completed booking
- [ ] Dynamic / seasonal pricing

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 👤 Author

**Vedant Singh Chauhan**

[![GitHub](https://img.shields.io/badge/GitHub-Vedant27672-181717?logo=github)](https://github.com/Vedant27672)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-vedant--singh--chauhan-0A66C2?logo=linkedin)](https://www.linkedin.com/in/vedant-singh-chauhan-417a10248)
[![Email](https://img.shields.io/badge/Email-vedant.chauhan213%40gmail.com-D14836?logo=gmail&logoColor=white)](mailto:vedant.chauhan213@gmail.com)

---

<div align="center">
Made with ❤️ by <a href="https://github.com/Vedant27672">Vedant Singh Chauhan</a>
</div>
