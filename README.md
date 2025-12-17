# ABFRL Fashion Chat Suite

**Omni-Conversational Sales Orchestrator | Complete Solution**

A comprehensive omnichannel shopping platform that seamlessly integrates mobile web app, in-store kiosk, and WhatsApp commerce for Aditya Birla Fashion & Retail Limited.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Components](#-components)
- [Technology Stack](#-technology-stack)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

The ABFRL Fashion Chat Suite is a complete omnichannel shopping solution consisting of three integrated applications:

1. **Mobile App** - React-based progressive web application for conversational shopping
2. **Kiosk App** - Next.js-based in-store kiosk interface for seamless in-store experience
3. **WhatsApp Integration** - Post-purchase engagement and cross-brand recommendations

### Key Features

- **Multi-Channel Integration**: Seamless shopping across web, mobile, WhatsApp, and physical stores
- **AI-Powered Personalization**: Intelligent product recommendations with cross-brand collaboration
- **Session Continuity**: Visible session IDs ensure seamless multi-device shopping
- **Conversational Commerce**: Natural language interface for intuitive product discovery
- **Loyalty Integration**: Real-time points tracking and automatic tier-based discount application
- **QR Code Sync**: Instant cart synchronization between mobile and kiosk

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (React)                       │
│              Conversational Shopping Interface              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Supabase Database
                       │ (Shared Session & Cart)
                       │
┌──────────────────────┴──────────────────────────────────────┐
│              Kiosk App (Next.js)                            │
│         In-Store Touchscreen Interface                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Order Confirmation
                       │
┌──────────────────────┴──────────────────────────────────────┐
│              WhatsApp Integration                           │
│      Post-Purchase Engagement & Recommendations            │
└─────────────────────────────────────────────────────────────┘
```

### Database

All applications share a single Supabase PostgreSQL database with the following tables:
- `users` - Customer profiles and loyalty information
- `products` - Product catalog with extended metadata
- `cart` - Shopping cart items (linked by session_id)
- `orders` - Order records
- `order_items` - Order line items

---

## 📁 Project Structure

```
abfrl/
├── mobile-app/          # React/Vite mobile web application
│   ├── src/             # Source code
│   ├── public/          # Static assets
│   ├── supabase/        # Database migrations
│   └── README.md        # Mobile app documentation
│
├── kiosk-app/           # Next.js kiosk application
│   ├── app/             # Next.js app router
│   ├── components/      # React components
│   ├── lib/             # Utilities and contexts
│   ├── public/          # Static assets
│   └── README.md        # Kiosk app documentation
│
├── scripts/             # Utility scripts
│   └── import-products-to-supabase.js
│
├── data/                # Product data and images
│   ├── men/             # Men's products
│   └── women/           # Women's products
│
└── README.md            # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or **yarn** / **pnpm**)
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))
- **Git** (for cloning the repository)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd abfrl
   ```

2. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the migration files from `mobile-app/supabase/migrations/` in order
   - Note your project URL and anon key

3. **Set up Mobile App**
   ```bash
   cd mobile-app
   npm install
   # Create .env file with Supabase credentials
   npm run dev
   ```

4. **Set up Kiosk App**
   ```bash
   cd kiosk-app
   npm install
   # Create .env.local file with Supabase credentials
   npm run dev
   ```

For detailed setup instructions, see the individual README files in each app directory.

---

## 🧩 Components

### Mobile App (`mobile-app/`)

A React-based progressive web application featuring:
- Conversational AI shopping interface
- QR code scanner for kiosk integration
- Real-time cart synchronization
- WhatsApp integration for post-purchase engagement
- Loyalty program integration

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Supabase

**See:** [mobile-app/README.md](./mobile-app/README.md) for detailed documentation

### Kiosk App (`kiosk-app/`)

A Next.js-based kiosk interface for in-store experiences:
- Touchscreen-optimized UI
- QR code generation for session sync
- Product location finder with store map
- Out-of-stock handling with alternatives
- In-store checkout with payment options

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase

**See:** [kiosk-app/README.md](./kiosk-app/README.md) for detailed documentation

---

## 💻 Technology Stack

### Frontend
- **React 18/19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Row Level Security (RLS)** - Data access policies

### Build Tools
- **Vite** - Mobile app build tool
- **Next.js** - Kiosk app framework
- **Turbopack** - Fast bundler

---

## 🚀 Deployment

### Root Repository

This repository can be used as a monorepo for development and submission. For deployment:

### Individual App Deployment

Each app can be deployed independently:

1. **Mobile App** - Deploy to Netlify, Vercel, or any static hosting
   - Build command: `npm run build`
   - Output directory: `dist/`
   - Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

2. **Kiosk App** - Deploy to Vercel, Netlify, or self-hosted
   - Build command: `npm run build`
   - Output directory: `.next/`
   - Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Recommended Hosting

- **Mobile App**: Netlify (recommended for React apps)
- **Kiosk App**: Vercel (recommended for Next.js apps)

Both apps can be deployed from their individual repositories or from this monorepo.

---

## 📊 Use Cases

The application supports three primary use cases:

1. **Aarav** - Casual outfit shopping (Bewakoof products)
2. **Rohan** - Formal wear shopping (Allen Solly products)
3. **Priya** - Traditional/Ethnic wear shopping (W products with out-of-stock handling)

See individual app READMEs for detailed user flow documentation.

---

## 🔒 Security

- Environment variables for sensitive data
- Row Level Security (RLS) on database
- HTTPS in production
- Input validation and sanitization
- Session-based authentication

---

## 📈 Performance

- Code splitting and lazy loading
- Optimized images and assets
- Efficient state management
- Smooth 60fps animations
- Real-time synchronization

---

## 🤝 Contributing

This is a hackathon project for ABFRL. For contributions or questions, please contact the development team.

---

## 📄 License

© 2024 Aditya Birla Fashion & Retail Limited. All rights reserved.

This project is proprietary and confidential. Unauthorized copying, modification, or distribution is strictly prohibited.

---

## 👥 Credits

**Developed for:** Aditya Birla Fashion & Retail Limited  
**Project Type:** Hackathon Demo - Omni-Conversational Sales Orchestrator  
**Technology Stack:** React, Next.js, TypeScript, Supabase, Tailwind CSS

---

## 📞 Support

For technical support or questions about this project, please reach out to the development team.

---

**Built with ❤️ for ABFRL**

