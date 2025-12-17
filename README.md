<div align="center">

# 🛍️ OmniFlow

**Omni-Conversational Sales Orchestrator | Complete Solution**

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2F19-61DAFB.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)

A comprehensive omnichannel shopping platform that seamlessly integrates mobile web app, in-store kiosk, and WhatsApp commerce for Aditya Birla Fashion & Retail Limited.

[🌐 Live Demo - Mobile App](https://omniflow-mobile.netlify.app/) • [🖥️ Live Demo - Kiosk App](https://omniflow-kiosk.vercel.app/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Components](#-components)
- [Getting Started](#-getting-started)
- [Technology Stack](#-technology-stack)
- [Deployment](#-deployment)
- [Use Cases](#-use-cases)
- [Contributing](#-contributing)

---

## 🎯 Overview

OmniFlow is a complete omnichannel shopping solution consisting of three integrated applications:

1. **[Mobile App](https://github.com/denispaul2406/omniflow-mobile)** - React-based progressive web application for conversational shopping
2. **[Kiosk App](https://github.com/denispaul2406/omniflow-kiosk)** - Next.js-based in-store kiosk interface for seamless in-store experience
3. **WhatsApp Integration** - Post-purchase engagement and cross-brand recommendations

### ✨ Key Features

- 🔄 **Multi-Channel Integration**: Seamless shopping across web, mobile, WhatsApp, and physical stores
- 🤖 **AI-Powered Personalization**: Intelligent product recommendations with cross-brand collaboration
- 🔗 **Session Continuity**: Visible session IDs ensure seamless multi-device shopping
- 💬 **Conversational Commerce**: Natural language interface for intuitive product discovery
- 🎁 **Loyalty Integration**: Real-time points tracking and automatic tier-based discount application
- 📱 **QR Code Sync**: Instant cart synchronization between mobile and kiosk

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              [Mobile App](https://omniflow-mobile.netlify.app/)              │
│         React • Conversational Shopping Interface           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Supabase Database
                       │ (Shared Session & Cart)
                       │
┌──────────────────────┴──────────────────────────────────────┐
│          [Kiosk App](https://omniflow-kiosk.vercel.app/)          │
│      Next.js • In-Store Touchscreen Interface               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Order Confirmation
                       │
┌──────────────────────┴──────────────────────────────────────┐
│              WhatsApp Integration                           │
│    Post-Purchase Engagement & Recommendations              │
└─────────────────────────────────────────────────────────────┘
```

### 🗄️ Database

All applications share a single **Supabase PostgreSQL** database with the following tables:
- `users` - Customer profiles and loyalty information
- `products` - Product catalog with extended metadata
- `cart` - Shopping cart items (linked by `session_id`)
- `orders` - Order records
- `order_items` - Order line items

---

## 📁 Project Structure

```
omniflow-abfrl/
├── mobile-app/          # React/Vite mobile web application
│   ├── src/             # Source code
│   ├── public/          # Static assets
│   ├── supabase/        # Database migrations
│   └── README.md        # [Mobile app documentation](./mobile-app/README.md)
│
├── kiosk-app/           # Next.js kiosk application
│   ├── app/             # Next.js app router
│   ├── components/      # React components
│   ├── lib/             # Utilities and contexts
│   ├── public/          # Static assets
│   └── README.md        # [Kiosk app documentation](./kiosk-app/README.md)
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

## 🧩 Components

### 📱 [Mobile App](https://github.com/denispaul2406/omniflow-mobile)

**Live Demo:** [omniflow-mobile.netlify.app](https://omniflow-mobile.netlify.app/)

A React-based progressive web application featuring:
- 💬 Conversational AI shopping interface
- 📷 QR code scanner for kiosk integration
- 🔄 Real-time cart synchronization
- 📲 WhatsApp integration for post-purchase engagement
- 🎁 Loyalty program integration

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Supabase

📖 **[View Mobile App Documentation →](./mobile-app/README.md)**

### 🖥️ [Kiosk App](https://github.com/denispaul2406/omniflow-kiosk)

**Live Demo:** [omniflow-kiosk.vercel.app](https://omniflow-kiosk.vercel.app/)

A Next.js-based kiosk interface for in-store experiences:
- 👆 Touchscreen-optimized UI
- 📱 QR code generation for session sync
- 🗺️ Product location finder with store map
- 📦 Out-of-stock handling with alternatives
- 💳 In-store checkout with payment options

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase

📖 **[View Kiosk App Documentation →](./kiosk-app/README.md)**

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
   git clone https://github.com/denispaul2406/omniflow-abfrl.git
   cd omniflow-abfrl
   ```

2. **Set up Supabase Database**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the migration files from `mobile-app/supabase/migrations/` in order
   - Note your project URL and anon key

3. **Set up Mobile App**
   ```bash
   cd mobile-app
   npm install
   # Create .env file with Supabase credentials
   # VITE_SUPABASE_URL=your_supabase_url
   # VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   npm run dev
   ```
   Visit [http://localhost:8080](http://localhost:8080)

4. **Set up Kiosk App**
   ```bash
   cd kiosk-app
   npm install
   # Create .env.local file with Supabase credentials
   # NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

📖 For detailed setup instructions, see the individual README files:
- [Mobile App Setup](./mobile-app/README.md#-getting-started)
- [Kiosk App Setup](./kiosk-app/README.md#-getting-started)

---

## 💻 Technology Stack

### Frontend
- **React 18/19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Framer Motion** - Smooth animations

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Row Level Security (RLS)** - Secure data access policies

### Build Tools
- **Vite** - Lightning-fast build tool for mobile app
- **Next.js** - Full-stack framework for kiosk app
- **Turbopack** - Fast bundler

---

## 🚀 Deployment

### 🌐 Live Applications

- **Mobile App**: [omniflow-mobile.netlify.app](https://omniflow-mobile.netlify.app/) (Hosted on Netlify)
- **Kiosk App**: [omniflow-kiosk.vercel.app](https://omniflow-kiosk.vercel.app/) (Hosted on Vercel)

### 📦 Individual Repositories

Each application can be deployed independently from its own repository:

- **Mobile App Repository**: [github.com/denispaul2406/omniflow-mobile](https://github.com/denispaul2406/omniflow-mobile)
- **Kiosk App Repository**: [github.com/denispaul2406/omniflow-kiosk](https://github.com/denispaul2406/omniflow-kiosk)

### 🔧 Deployment Configuration

**Mobile App (Netlify)**
- Build command: `npm run build`
- Output directory: `dist/`
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

**Kiosk App (Vercel)**
- Build command: `npm run build`
- Output directory: `.next/`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📊 Use Cases

The application supports three primary use cases:

1. **👤 Aarav** - Casual outfit shopping (Bewakoof products)
2. **👔 Rohan** - Formal wear shopping (Allen Solly products)
3. **👗 Priya** - Traditional/Ethnic wear shopping (W products with out-of-stock handling)

📖 See individual app READMEs for detailed user flow documentation:
- [Mobile App User Flows](./mobile-app/README.md#-user-flows)
- [Kiosk App User Flows](./kiosk-app/README.md#-user-flows)

---

## 🔒 Security

- 🔐 Environment variables for sensitive data
- 🛡️ Row Level Security (RLS) on database
- 🔒 HTTPS in production
- ✅ Input validation and sanitization
- 🔑 Session-based authentication

---

## 📈 Performance

- ⚡ Code splitting and lazy loading
- 🖼️ Optimized images and assets
- 🎯 Efficient state management
- ✨ Smooth 60fps animations
- 🔄 Real-time synchronization

---

## 🤝 Contributing

This is a hackathon project for **Aditya Birla Fashion & Retail Limited**. For contributions or questions, please contact the development team.

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

## 🔗 Quick Links

- 📱 [Mobile App Live Demo](https://omniflow-mobile.netlify.app/)
- 🖥️ [Kiosk App Live Demo](https://omniflow-kiosk.vercel.app/)
- 📦 [Mobile App Repository](https://github.com/denispaul2406/omniflow-mobile)
- 📦 [Kiosk App Repository](https://github.com/denispaul2406/omniflow-kiosk)
- 📖 [Mobile App Documentation](./mobile-app/README.md)
- 📖 [Kiosk App Documentation](./kiosk-app/README.md)

---

<div align="center">

**Built with ❤️ for ABFRL**

[⬆ Back to Top](#-omniflow)

</div>
