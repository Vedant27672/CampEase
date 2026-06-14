<div align="center">
<img src="https://capsule-render.vercel.app/api?type=venom&color=gradient&customColorList=6,11,20&height=180&section=header&text=%E2%9B%BA%20CampEase&fontSize=55&fontColor=fff&animation=fadeIn&desc=Discover%2C%20book%2C%20and%20review%20amazing%20campgrounds&descAlignY=65&descSize=18"/>
</div>

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=black)](http://www.passportjs.org)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Vedant27672/CampEase?style=for-the-badge&color=gold)](https://github.com/Vedant27672/CampEase/stargazers)

</div>

---

## 🏕️ About

**CampEase** is a full-stack web application for discovering, creating, and reviewing campgrounds. Users can register, add their own campgrounds with photo uploads, leave reviews with star ratings, and interact with an interactive map showing all locations. Built on the MVC pattern with full CRUD operations, authentication, and authorization.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | Secure registration & login via Passport.js (bcrypt hashing) |
| 🗺️ **Map** | Interactive Mapbox cluster map showing all campgrounds |
| 📍 **Geocoding** | Automatic location resolution via Mapbox Geocoding API |
| 🖼️ **Image Upload** | Multi-image upload with Cloudinary CDN storage |
| ⭐ **Reviews** | Star-rated reviews with author-only delete permission |
| 🛡️ **Authorization** | Route-level protection — only owners can edit/delete |
| ✅ **Validation** | Server-side (Joi) + client-side form validation |
| 💾 **Sessions** | Persistent sessions via connect-mongo |
| 🚨 **Flash Messages** | Success/error alerts throughout the app |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | Passport.js (Local Strategy) |
| **Templating** | EJS + EJS-Mate |
| **Styling** | Bootstrap 5 |
| **Maps** | Mapbox GL JS + Mapbox Geocoding |
| **Images** | Cloudinary + Multer |
| **Validation** | Joi |
| **Sessions** | express-session + connect-mongo |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Mapbox token

### Installation

```bash
# Clone the repo
git clone https://github.com/Vedant27672/CampEase.git
cd CampEase

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in: CLOUDINARY_CLOUD_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET,
#          MAPBOX_TOKEN, DB_URL, SECRET
```

### Run

```bash
node app.js
# Visit http://localhost:3000
```

---

## 📁 Project Structure

```
CampEase/
├── models/          # Mongoose schemas (User, Campground, Review)
├── routes/          # Express routers
├── views/           # EJS templates
├── public/          # Static assets (CSS, JS)
├── controllers/     # Route logic
├── middleware.js    # Auth & validation middleware
└── app.js           # Entry point
```

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer"/>
</div>