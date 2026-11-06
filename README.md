# PS Elite Homestay Tirupati — Official Web Application & Management Console

Official full-stack web application, booking engine, and property management portal for **PS Elite Homestay  Tirupati** (`https://pselitehomestays.com`).

Repository: [Revanth-1258/pselitehomestay-website](https://github.com/Revanth-1258/pselitehomestay-website)  
Production Domain: **https://pselitehomestays.com**

---

## 🌟 Key Application Features

1. **Stunning Luxury Pilgrim UI/UX**:
   - Built with Next.js App Router, Tailwind CSS, and Framer Motion micro-interactions.
   - Dedicated suite showcase: AC & Non-AC Rooms, Terrace AC 1BHK Apartment (`₹2,800/night`), and Expansive Family AC 2BHK Suite (`₹3,500/night`).
2. **Interactive Direct Booking Engine (`BookingModal`)**:
   - Zero commission, direct-to-owner WhatsApp reservation workflow.
   - Real-time date-specific rate calculations and instant confirmation modal.
   - Automated email dispatch to `pselitehomestays@gmail.com` alerting the front desk on every new reservation.
3. **Receptionist & Admin Management Portal (`/admin`)**:
   - Secure PIN/password protected gateway.
   - **Unified Date-Specific Inventory & Dynamic Pricing Center**: Single-day price/unit editor + **Bulk Date Range Updater** for seasonal pricing blocks.
   - Live custom stay voucher generation & direct WhatsApp sharing.
4. **Owner Financial Intelligence Portal (`/owner-analytics`)**:
   - Secure PIN/password protected analytics dashboard.
   - Real-time revenue insights, occupancy tracking, and suite performance metrics.

---

## 🛠️ Tech Stack & Prerequisites

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons + Framer Motion
- **Package Manager**: `npm` (Node.js 18+ required)

---

## 🚀 Local Development & Build Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Revanth-1258/pselitehomestay-website.git
cd pselitehomestay-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Setup
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
*(Review `.env.example` for detailed documentation on variables)*

### 4. Run the Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the customer application.

### 5. Production Build Verification
To compile and test the production bundle locally:
```bash
npm run build
npm run start
```

---

## 🌐 Production Deployment Guide (Vercel)

This application is optimized for deployment on your personal **Vercel** account connected to `https://pselitehomestays.com`.

### Deployment Steps:
1. Push your code changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Deploy production release"
   git push origin main
   ```
2. Log into your **Vercel Account** and import the repository `Revanth-1258/pselitehomestay-website`.
3. Set the Framework Preset to **Next.js**.
4. Add the Environment Variables documented in `.env.example`.
5. Under **Settings -> Domains**, add your custom domain:
   - **`pselitehomestays.com`**
   - **`www.pselitehomestays.com`**
6. Click **Deploy**. Vercel will automatically provision SSL certificates and serve static/serverless routes.

---

## 🔌 Third-Party Integrations Documentation

| Service / Integration | Purpose | Configuration & Notes |
| :--- | :--- | :--- |
| **FormSubmit Email API** | Automated instant email alerts to front desk (`pselitehomestays@gmail.com`) upon guest reservation submission. | Uses HTTPS POST to `https://formsubmit.co/ajax/pselitehomestays@gmail.com`. **First-time setup**: Click "Activate Form" in the confirmation email sent to `pselitehomestays@gmail.com` on first live submission. |
| **WhatsApp Direct Booking** | Instant guest reservation sharing and direct receptionist call/chat links (`+91 93927 39715`). | Uses standard `https://wa.me/919392739715` links with URL-encoded booking summaries. |
| **Google Maps Embeds** | Interactive property location, distance calculations to Tirupati Railway Station, Bus Stand, Padmavathi Temple, & Alipiri. | Direct iframe embeds & Google Maps place URLs. |
| **Supabase Storage CDN** | High-speed global image delivery for suite galleries and hero photography. | Hosted under Supabase object storage bucket `websites-data`. |

---

## 🔒 SEO & Search Engine Indexing

- **Canonical URL**: `https://pselitehomestays.com`
- **Robots Policy (`src/app/robots.ts`)**: Public pages (`/`) are fully indexed. Sensitive management routes (`/admin/`, `/owner-analytics/`) are explicitly disallowed (`Disallow`).
- **Rich Structured Data (`JSON-LD`)**: Embedded Hotel & FAQ Schema.org structured data in `src/app/layout.tsx` for optimal Google Search rich snippets.

---

## 📄 License & Ownership
Copyright © 2026 **PS Elite Homestay Tirupati** (`Revanth-1258`). All rights reserved.
