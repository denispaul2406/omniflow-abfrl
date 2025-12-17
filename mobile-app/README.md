# ABFRL Fashion Chat Suite - Mobile App

**Omni-Conversational Sales Orchestrator | Mobile Application**

A next-generation AI-powered shopping experience that seamlessly integrates multi-channel commerce, personalized recommendations, and conversational commerce for Aditya Birla Fashion & Retail Limited.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Design System](#-design-system)
- [Core Features](#-core-features)
- [Database Schema](#-database-schema)
- [User Flows](#-user-flows)
- [Development](#-development)
- [Deployment](#-deployment)

---

## 🎯 Overview

The ABFRL Fashion Chat Suite Mobile App is a React-based progressive web application that delivers a unified, AI-driven shopping experience across multiple channels. It enables customers to browse products, receive personalized recommendations, manage their cart, and seamlessly transition between mobile, web, WhatsApp, and in-store kiosk experiences.

### Business Value

- **Multi-Channel Integration**: Seamless shopping across web, mobile, WhatsApp, and physical stores
- **AI-Powered Personalization**: Intelligent product recommendations with cross-brand collaboration
- **Session Continuity**: Visible session IDs ensure seamless multi-device shopping
- **Conversational Commerce**: Natural language interface for intuitive product discovery
- **Loyalty Integration**: Real-time points tracking and automatic discount application

---

## ✨ Key Features

### 🤖 AI-Powered Personalization
- **Intelligent Recommendations**: Product suggestions based on user preferences, style, purchase history, and loyalty tier
- **Recommendation Reasoning**: Visual badges showing why products are recommended:
  - "💼 Matches your [Brand] favorites"
  - "👔 Perfect for [Style Preference]"
  - "🔥 Only X left!" (low stock alerts)
  - "⭐ Trending in your size"
- **Cross-Brand Collaboration**: Smart brand grouping (e.g., Bewakoof → The Souled Store, Louis Philippe → Van Heusen)
- **Gender-Aware Filtering**: Automatic product filtering based on user profile (male/female)

### 💬 Conversational Commerce
- **Personalized Agent**: Conversational AI with personality, using user's name and preferences
- **Natural Language Processing**: Understands requests like "show me formal wear" or "casual outfits"
- **Context-Aware Responses**: Adapts recommendations based on conversation history
- **Quick Actions**: One-tap buttons for common requests
- **Typing Indicators**: Visual feedback when agent is processing

### 🔄 Multi-Channel Integration
- **QR Code Scanner**: Scan kiosk QR codes to sync cart and preferences instantly
- **Session Continuity**: Visible session IDs across all pages for seamless multi-device experience
- **Unified Cart**: Real-time synchronization across web, mobile, WhatsApp, and in-store
- **WhatsApp Integration**: Order confirmation and cross-brand recommendations via WhatsApp mock interface

### 🎁 Loyalty Program
- **Real-time Points Tracking**: Visible loyalty points with tier badges (Gold, Silver, Bronze)
- **Tier-Based Discounts**: 
  - Gold: 30% discount
  - Silver: 20% discount
  - Bronze: 10% discount
- **Automatic Discount Calculation**: Applied at checkout automatically
- **VIP Messaging**: Premium customer treatment with personalized greetings

### 🛒 Smart Cart Management
- **Session-Based Persistence**: Cart items linked to session ID
- **Real-time Updates**: Automatic cart synchronization across devices
- **Quantity Management**: Easy add/remove/update cart items
- **Loyalty Integration**: Discounts applied automatically

### ✨ Enhanced UX
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Confetti Animation**: Brand-colored celebration on order confirmation
- **Order Tracking**: Visual timeline showing order status
- **Responsive Design**: Optimized for mobile and desktop
- **ABFRL Branding**: Complete visual identity alignment

---

## 🏗️ Architecture

### Technology Stack

**Frontend Framework:**
- **React 18** - Modern UI framework with hooks and context API
- **TypeScript** - Type-safe development with full type coverage
- **Vite** - Lightning-fast build tool and dev server with HMR
- **React Router v6** - Client-side routing with future flags

**Styling & UI:**
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React component library
- **Framer Motion** - Smooth animations and micro-interactions
- **Lucide React** - Modern icon library

**Backend & Database:**
- **Supabase** - PostgreSQL database with real-time capabilities
- **Row Level Security (RLS)** - Secure data access policies
- **RESTful API** - Standardized data operations

**State Management:**
- **React Context API** - Global state management (user, cart, messages)
- **TanStack Query** - Server state management, caching, and synchronization

**Additional Libraries:**
- **html5-qrcode** - QR code scanning for kiosk integration
- **react-confetti** - Celebration animation on order confirmation
- **sonner** - Toast notifications

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (React)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Chat UI    │  │  Product UI  │  │   Cart UI    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│  ┌──────┴──────────────────┴──────────────────┴──────┐     │
│  │         AppContext (Global State)                  │     │
│  └──────────────────────┬────────────────────────────┘     │
│                         │                                    │
│  ┌──────────────────────┴────────────────────────────┐       │
│  │         Supabase Client (REST API)                │       │
│  └──────────────────────┬────────────────────────────┘       │
└─────────────────────────┼────────────────────────────────────┘
                          │
┌─────────────────────────┴────────────────────────────────────┐
│                    Supabase Backend                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  users   │  │ products │  │   cart   │  │  orders  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or **yarn** / **pnpm**)
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))
- **Git** (for cloning the repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `mobile-app` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
   
   > **Note**: Get your Supabase credentials from **Project Settings → API** in your Supabase dashboard.

4. **Set up the database**
   
   - Open your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Run the migration SQL files in order:
     1. `supabase/migrations/20251214233912_e0e9e4e3-cd85-4864-bbdf-84f3f4f22ed9.sql`
     2. `supabase/migrations/20250115000000_extend_products_schema.sql`
     3. `supabase/migrations/20250115000001_fix_products_rls.sql`
   - This will create all necessary tables, policies, and seed data

5. **Import product data (optional)**
   
   ```bash
   npm run import-products
   ```
   
   This will import products from the `data/` folder into your Supabase database.

6. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:8080`

---

## 📁 Project Structure

```
mobile-app/
├── public/
│   ├── ABFRL-Logo.png          # ABFRL brand logo
│   ├── data/                    # Product images (men/women)
│   └── favicon.ico              # Application favicon
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn-ui components (button, card, etc.)
│   │   ├── CartItem.tsx         # Shopping cart item component
│   │   ├── ChatBubble.tsx       # Chat message bubble with animations
│   │   ├── ChatInput.tsx        # Chat input field
│   │   ├── Header.tsx           # Application header with session ID
│   │   ├── ProductCard.tsx      # Product display with recommendation badges
│   │   ├── QRScanner.tsx        # QR code scanner for kiosk integration
│   │   ├── QuickActions.tsx     # Quick action buttons
│   │   ├── TimeLimitedOffer.tsx # Time-limited offer component
│   │   └── UserCard.tsx          # User profile card
│   ├── contexts/
│   │   └── AppContext.tsx        # Global application state management
│   ├── hooks/
│   │   ├── use-mobile.tsx       # Mobile detection hook
│   │   └── use-toast.ts         # Toast notification hook
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts        # Supabase client configuration
│   │       └── types.ts          # TypeScript database types
│   ├── lib/
│   │   ├── recommendationEngine.ts  # Cross-brand recommendation logic
│   │   └── storeInventory.ts         # Store inventory management
│   ├── pages/
│   │   ├── Index.tsx            # User selection landing page
│   │   ├── Chat.tsx              # Main chat interface
│   │   ├── Cart.tsx             # Shopping cart page
│   │   ├── TryBeforeBuy.tsx     # QR scanner integration
│   │   ├── Checkout.tsx         # Checkout process
│   │   ├── Confirmation.tsx     # Order confirmation
│   │   ├── WhatsApp.tsx         # WhatsApp mock interface
│   │   └── NotFound.tsx          # 404 error page
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles and ABFRL theme
├── supabase/
│   ├── migrations/               # Database migration files
│   └── config.toml                # Supabase configuration
├── .env                           # Environment variables (create this)
├── package.json                   # Project dependencies
├── tailwind.config.ts             # Tailwind CSS configuration
├── vite.config.ts                 # Vite build configuration
└── README.md                      # This file
```

---

## 🎨 Design System

### Brand Identity

This application follows the **Aditya Birla Fashion & Retail** brand guidelines:

**Colors:**
- **Primary**: Persian Red (#CF2E2E) - CTAs and primary actions
- **Accent**: Princeton Orange (#F68529) - Highlights and active states
- **Loyalty Gold**: Nugget Gold (#C58A24) - Premium features
- **Success**: Green (#22C55E) - Success states
- **Background**: Clean White (#FFFFFF) with Soft Grey (#F5F5F5)

**Typography:**
- **Headings**: Montserrat (Bold, 600-700 weight)
- **Body**: Inter / Roboto (Regular, 400 weight)
- **Monospace**: Geist Mono (for session IDs and codes)

**UI Patterns:**
- **Cards**: Clean white backgrounds with soft shadows (0 2px 8px rgba(0,0,0,0.08))
- **Buttons**: Rounded corners (8-12px), bold CTA colors, hover effects
- **Spacing**: Generous padding (16-24px), clean whitespace
- **Animations**: Subtle fade-in (0.6s), smooth transitions (200-300ms)
- **Layout**: Grid-based, responsive design

---

## 🌟 Core Features in Detail

### 1. Multi-Channel Shopping Flow

**User Journey:**
1. **Landing Page** → Select user profile
2. **Chat Interface** → Browse and add products
3. **Shopping Cart** → Review items and apply discounts
4. **Try Before You Buy** → Scan QR code or continue online
5. **Checkout** → Complete purchase
6. **Order Confirmation** → Track order and continue shopping

**Session Continuity:**
- Visible session IDs across all pages
- Session-based cart persistence
- Seamless multi-device experience
- QR code sync with kiosk

### 2. AI-Powered Recommendations

**Recommendation Engine:**
- **Cross-Brand Collaboration**: Groups brands that work well together
  - Bewakoof + The Souled Store + Flying Machine (youth/casual)
  - Louis Philippe + Van Heusen + Allen Solly (professional/formal)
  - Pantaloons + Forever 21 + Allen Solly (premium)
- **Gender Filtering**: Automatic product filtering based on user profile
- **Personalization**: Based on style preferences, favorite brands, and loyalty tier
- **Context-Aware**: Adapts recommendations based on conversation history

**Recommendation Badges:**
- "💼 Matches your [Brand] favorites"
- "👔 Perfect for [Style Preference]"
- "🔥 Only X left!" (low stock alerts)
- "⭐ Trending in your size"

### 3. Conversational Interface

**Features:**
- Personalized agent greetings with emojis
- Natural language understanding
- Context-aware responses
- Quick action buttons
- Typing indicators
- Smooth message animations

**Supported Queries:**
- "Show me formal wear"
- "Casual outfits"
- "Ethnic wear"
- "View cart"
- "More options"

### 4. QR Code Scanner

**Features:**
- Camera-based QR scanning (mobile)
- Webcam support (desktop)
- Bypass mode for testing
- Success feedback modal
- Auto-close after sync
- Session ID display

**Integration:**
- Scans kiosk QR codes
- Syncs cart and preferences
- Visual confirmation
- Seamless transition to kiosk

### 5. WhatsApp Integration

**Features:**
- WhatsApp mock interface
- Order confirmation messages
- Cross-brand recommendations
- Time-limited offers
- In-chat checkout
- Order tracking

**Flow:**
- Order confirmation → Track order → Recommendations → Checkout

---

## 📊 Database Schema

### Tables

**users**
- Customer profiles with preferences and loyalty information
- Fields: `id`, `name`, `age`, `style_preference`, `favorite_brands`, `size`, `loyalty_points`, `loyalty_tier`, `avatar_url`

**products**
- Product catalog with brand, pricing, and inventory
- Extended fields: `product_code`, `discount_price`, `discount_percent`, `description`, `material`, `fit`, `color`, `occasion`, `pattern`, `collection`, `product_type`, `subbrand`, `style_code`, `rating`, `reviews`, `aisle`, `stock_store`, `sizes_data`, `coupons_data`, `image_source`

**cart**
- Shopping cart items linked to users and sessions
- Fields: `id`, `user_id`, `product_id`, `quantity`, `session_id`

**orders**
- Order records with totals and status
- Fields: `id`, `user_id`, `total_amount`, `discount_applied`, `order_status`, `session_id`, `created_at`

**order_items**
- Individual line items for each order
- Fields: `id`, `order_id`, `product_id`, `quantity`, `price`

### Row Level Security

All tables have RLS enabled with public read access for demo purposes. In production, implement proper authentication and authorization policies.

---

## 🎬 User Flows

### Complete Shopping Journey

1. **Landing Page** (`/`)
   - Select user profile (Aarav, Rohan, or Priya)
   - View value propositions
   - See loyalty tier badges

2. **Chat Interface** (`/chat`)
   - Personalized AI agent greeting
   - Natural language product queries
   - Product recommendations with reasoning badges
   - Add items to cart directly
   - Quick action buttons

3. **Shopping Cart** (`/cart`)
   - View all cart items with quantities and prices
   - Apply loyalty points discount
   - Proceed to "Try Before You Buy"

4. **Try Before You Buy** (`/try-before-buy`)
   - Display session ID
   - Scan kiosk QR code or continue online
   - Success confirmation modal

5. **Checkout** (`/checkout`)
   - Enter delivery details
   - Review order summary with discounts
   - Complete purchase

6. **Order Confirmation** (`/confirmation`)
   - Confetti animation
   - Order details and tracking
   - Continue on WhatsApp option
   - Back to home

### WhatsApp Flow

1. **Order Confirmation** → Navigate to WhatsApp
2. **Order Message** → Track order option
3. **Order Status** → Display order timeline
4. **Cross-Brand Recommendations** → Show collaborative brands
5. **Time-Limited Offers** → Display countdown
6. **In-Chat Checkout** → Complete purchase

---

## 🔧 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Import products from data folder
npm run import-products
```

### Code Style

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** (recommended) for code formatting

### Best Practices

- Component-based architecture
- Reusable UI components
- Context API for global state
- Type-safe database queries
- Responsive design (mobile-first)
- Error handling and loading states

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Environment Variables

Ensure these are set in your production environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Hosting Options

- **Vercel** - Recommended for React apps
- **Netlify** - Easy deployment with CI/CD
- **AWS Amplify** - Enterprise hosting
- **GitHub Pages** - Static hosting

---

## 📱 Browser Support

- **Chrome** (latest) - Full support including camera API
- **Firefox** (latest) - Full support including camera API
- **Safari** (latest) - Full support (iOS 11+)
- **Edge** (latest) - Full support including camera API

**Note**: QR Scanner requires camera permissions and HTTPS (or localhost) for webcam access.

---

## 🔒 Security

- Environment variables for sensitive data
- Row Level Security (RLS) on database
- HTTPS in production
- Input validation and sanitization
- XSS protection
- CSRF protection

---

## 📈 Performance

- Code splitting with React Router
- Optimized images and assets
- Lazy loading for components
- Efficient state management
- Smooth 60fps animations
- Optimized QR scanner with configurable FPS

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
**Technology Stack:** React 18, TypeScript, Vite, Supabase, Tailwind CSS

---

## 📞 Support

For technical support or questions about this project, please reach out to the development team.

---

**Built with ❤️ for ABFRL**
