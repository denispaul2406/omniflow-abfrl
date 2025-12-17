# OmniFlow - Kiosk App

**Next.js-based Kiosk Interface for Seamless In-Store Shopping Experience**

A modern, touchscreen-optimized kiosk application that integrates with the mobile app to provide a unified omnichannel shopping experience across all ABFRL retail touchpoints.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Integration with Mobile App](#-integration-with-mobile-app)
- [Core Features](#-core-features)
- [Database Integration](#-database-integration)
- [User Flows](#-user-flows)
- [Development](#-development)
- [Deployment](#-deployment)

---

## 🎯 Overview

OmniFlow Kiosk App is a Next.js-based application designed for large touchscreen displays in physical retail stores. It enables customers to seamlessly continue their shopping journey from mobile to in-store, find products, handle out-of-stock scenarios, and complete purchases with integrated payment processing.

### Business Value

- **Seamless Channel Transition**: Customers can start shopping on mobile and continue in-store without friction
- **Product Discovery**: Interactive store map helps customers locate products quickly
- **Inventory Management**: Real-time stock checking and alternative suggestions
- **Unified Experience**: Same cart, same session, same preferences across channels
- **Increased Conversion**: Reduces cart abandonment by enabling in-store completion

---

## ✨ Key Features

### 📱 QR Code Integration
- **Unique Session Generation**: Each kiosk generates a unique session ID displayed as QR code
- **Mobile App Scanning**: Customers scan QR code with mobile app to sync cart
- **Manual Entry**: Alternative session ID entry for accessibility
- **Visual Feedback**: Clear instructions and session ID display

### 🔄 Session Management
- **Supabase Integration**: Fetches user data and cart items from shared database
- **Real-time Sync**: Cart updates reflect immediately across channels
- **User Profile Display**: Shows customer name, loyalty tier, and avatar
- **Session Persistence**: Maintains session state throughout shopping journey

### 🗺️ Product Location Finder
- **Interactive Store Map**: Visual representation of store layout
- **Aisle Navigation**: Shows exact aisle and position for each product
- **Multiple Size Options**: Displays alternative sizes and their locations
- **Navigation Assistance**: Walking distance and directions

### 📦 Out-of-Stock Handling
- **Smart Alternatives**: Suggests alternative sizes, nearby stores, or home delivery
- **Gold Member Priority**: Premium customers get VIP treatment and recommendations
- **Real-time Inventory**: Checks stock availability across stores
- **Seamless Options**: All alternatives sync with mobile cart

### 🛒 Browse Store
- **Brand-Wise Organization**: Products grouped by brand for easy browsing
- **Gender Filtering**: Automatically filters products based on user profile
- **Product Grid**: Visual product cards with images, prices, and discounts
- **Quick Selection**: Tap any product to find its location in-store

### 💳 Checkout & Orders
- **Payment Methods**: Card, UPI, Cash, and Wallet options
- **Loyalty Integration**: Automatic tier-based discount calculation
  - Gold: 30% discount
  - Silver: 20% discount
  - Bronze: 10% discount
- **Order Creation**: Creates orders in Supabase with full details
- **Cart Clearing**: Automatically clears cart after successful order
- **WhatsApp Integration**: Opens WhatsApp mock for post-purchase engagement

### ⏱️ Idle Timeout
- **Auto-Return**: Returns to home screen after 5 minutes of inactivity
- **Activity Detection**: Monitors clicks, touches, and keyboard input
- **Session Reset**: Clears session data on timeout
- **User-Friendly**: Prevents unauthorized access and maintains privacy

---

## 🏗️ Architecture

### Technology Stack

**Frontend Framework:**
- **Next.js 16** - React framework with App Router and Server Components
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development with full type coverage
- **Turbopack** - Fast bundler for development

**Styling & UI:**
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components
- **Lucide React** - Modern icon library

**Backend & Database:**
- **Supabase** - PostgreSQL database (shared with mobile app)
- **Row Level Security (RLS)** - Secure data access policies
- **RESTful API** - Standardized data operations

**State Management:**
- **React Context API** - Global kiosk state management
- **React Hooks** - Local component state

**Additional Libraries:**
- **react-qr-code** - QR code generation for session display
- **next/image** - Optimized image loading

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Kiosk App (Next.js 16)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Home Screen │  │ Welcome Back │  │ Browse Store │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│  ┌──────┴──────────────────┴──────────────────┴──────┐     │
│  │         KioskContext (Global State)                │     │
│  └──────────────────────┬────────────────────────────┘     │
│                         │                                    │
│  ┌──────────────────────┴────────────────────────────┐       │
│  │         Supabase Client (REST API)                │       │
│  └──────────────────────┬────────────────────────────┘       │
└─────────────────────────┼────────────────────────────────────┘
                          │
┌─────────────────────────┴────────────────────────────────────┐
│              Supabase Backend (Shared)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ products │  │   cart   │  │  orders  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────┴────────────────────────────────────┐
│              Mobile App (React)                             │
│         Scans QR Code → Syncs Session                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or **pnpm** / **yarn**)
- **Supabase Account** (shared with mobile app)
- **Git** (for cloning the repository)

### Installation

1. **Navigate to kiosk app directory**
   ```bash
   cd kiosk-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the `kiosk-app` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   > **Note**: Use the same Supabase credentials as the mobile app for shared database access.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   
   The kiosk will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
kiosk-app/
├── app/
│   ├── page.tsx              # Main kiosk page with state management
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles and ABFRL theme
├── components/
│   ├── kiosk/
│   │   ├── abfrl-logo.tsx           # ABFRL logo component
│   │   ├── browse-store.tsx         # Browse products by brand
│   │   ├── checkout-summary.tsx     # Checkout screen
│   │   ├── kiosk-header.tsx         # Header with user info
│   │   ├── kiosk-home.tsx           # Home screen with QR code
│   │   ├── order-confirmation.tsx   # Order confirmation
│   │   ├── out-of-stock.tsx         # Out-of-stock alternatives
│   │   ├── product-location.tsx     # Product finder with map
│   │   ├── session-loading.tsx      # Loading screen
│   │   └── welcome-back.tsx         # Welcome screen with cart
│   ├── theme-provider.tsx    # Theme context provider
│   └── ui/                   # shadcn/ui components
│       ├── button.tsx        # Button component
│       ├── card.tsx           # Card component
│       └── input.tsx          # Input component
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Supabase client configuration
│   │   └── types.ts          # TypeScript database types
│   ├── kiosk-context.tsx     # Kiosk state management context
│   └── utils.ts              # Utility functions (cn helper)
├── public/
│   ├── data/                 # Product images (men/women)
│   └── placeholder.*         # Placeholder images
├── .env.local                # Environment variables (create this)
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

---

## 🔄 Integration with Mobile App

### Session Flow

1. **Kiosk Home Screen**
   - Generates unique kiosk session ID (format: `KIOSK-{timestamp}-{random}`)
   - Displays QR code with session ID
   - Shows session ID for manual entry
   - Waits for mobile app scan or manual entry

2. **Mobile App Scan**
   - User opens mobile app → "Try Before You Buy" screen
   - Scans kiosk QR code
   - Mobile app session ID is passed to kiosk
   - Cart syncs automatically via Supabase

3. **Kiosk Session Loading**
   - Receives session ID (from mobile scan or manual entry)
   - Fetches user data and cart items from Supabase:
     ```typescript
     supabase
       .from("cart")
       .select(`
         *,
         product:products(*),
         user:users(*)
       `)
       .eq("session_id", sessionId)
     ```
   - Maps database schema to kiosk interface
   - Displays welcome screen with synced cart

4. **In-Store Experience**
   - Browse products by brand
   - Find product locations on store map
   - Handle out-of-stock items with alternatives
   - Complete checkout with payment selection
   - Order confirmation with WhatsApp integration

### Data Synchronization

```
Mobile App Session (SES-ABC123)
    ↓
Cart items stored in Supabase
    ↓
Kiosk receives session ID
    ↓
Kiosk fetches from Supabase:
  - User profile (name, loyalty tier, avatar)
  - Cart items (products, quantities, prices)
  - Product details (images, descriptions, stock)
    ↓
Kiosk displays synced data
    ↓
Customer completes purchase
    ↓
Order created in Supabase
Cart cleared automatically
Mobile app cart updates in real-time
```

### Session ID Formats

- **Mobile App**: `SES-{timestamp}-{random}` (e.g., `SES-MJ6YNS13-Q17R`)
- **Kiosk**: `KIOSK-{timestamp}-{random}` (e.g., `KIOSK-MJ6YK01S-4QRJ`)

---

## 🌟 Core Features in Detail

### 1. QR Code Display

**Features:**
- Unique session ID generation on client-side (prevents hydration issues)
- QR code displayed using `react-qr-code` library
- Session ID shown for manual entry
- Clear instructions for mobile app scanning
- Responsive design for large touchscreens

**Technical Details:**
- Uses `useState` and `useEffect` for client-side generation
- Dynamic import with SSR disabled for QR code component
- Suppresses hydration warnings for dynamic content

### 2. Session Management

**Data Fetching:**
- Fetches cart items with product and user details
- Maps Supabase schema to kiosk interface
- Handles empty cart scenarios gracefully
- Fallback to guest user if no data found

**State Management:**
- React Context API for global state
- Session ID, user session, cart items, selected product
- Screen navigation state
- Order ID and idle timer

### 3. Product Location Finder

**Features:**
- Interactive store map with 6 aisles
- Visual representation of product locations
- User position indicator
- Walking distance calculation
- Alternative sizes display
- Navigation assistance

**Map Layout:**
- Grid-based layout (2 rows × 3 columns)
- Highlighted product aisle
- User position marker
- Checkout location indicator

### 4. Out-of-Stock Handling

**Options Provided:**
1. **Try Alternative Size** - Available in-store
2. **Visit Nearby Store** - Reserve for 2 hours
3. **Home Delivery** - Free for Gold members

**Gold Member Benefits:**
- VIP messaging and styling
- Recommended option highlighted
- Premium treatment throughout

### 5. Browse Store

**Features:**
- Fetches all products from Supabase
- Groups products by brand
- Gender filtering based on user profile
- Product grid with images, names, prices
- Click to find product location

**Gender Filtering:**
- Automatically detects user gender from name
- Filters products by image URL path (`/men/` vs `/women/`)
- Ensures relevant product display

### 6. Checkout & Orders

**Payment Methods:**
- Card (Credit/Debit)
- UPI
- Cash
- Wallet

**Order Processing:**
- Creates order in `orders` table
- Creates order items in `order_items` table
- Calculates tier-based discounts
- Clears cart after successful order
- Opens WhatsApp mock for post-purchase engagement

**Discount Calculation:**
```typescript
// Tier-based discount multipliers
Gold: 30% (0.30)
Silver: 20% (0.20)
Bronze: 10% (0.10)

// Applied discount
loyaltyDiscount = min(userLoyaltyPoints, subtotal * tierMultiplier)
```

---

## 🔌 Database Integration

### Tables Used

**users**
- Customer profiles and loyalty information
- Used for: User display, loyalty tier, discount calculation

**cart**
- Shopping cart items linked by session_id
- Used for: Loading cart items, syncing with mobile app

**products**
- Product catalog with extended fields
- Used for: Product display, inventory checking, recommendations

**orders**
- Order records
- Used for: Creating orders, order confirmation

**order_items**
- Order line items
- Used for: Storing order details

### Key Queries

**Load Session:**
```typescript
const { data } = await supabase
  .from("cart")
  .select(`
    *,
    product:products(*),
    user:users(*)
  `)
  .eq("session_id", sessionId)
```

**Create Order:**
```typescript
const { data: order } = await supabase
  .from("orders")
  .insert({
    user_id: userSession.id,
    session_id: sessionId,
    total_amount: total,
    discount_applied: loyaltyDiscount,
    order_status: "confirmed"
  })
  .select()
  .single()
```

**Clear Cart:**
```typescript
await supabase
  .from("cart")
  .delete()
  .eq("session_id", sessionId)
  .eq("user_id", userSession.id)
```

---

## 🎬 User Flows

### Complete Kiosk Journey

1. **Home Screen**
   - QR code displayed
   - Session ID shown
   - Wait for scan or manual entry

2. **Session Loading**
   - Fetching data from Supabase
   - Progress indicator
   - Session ID displayed

3. **Welcome Back**
   - User profile displayed
   - Cart items shown
   - Action cards:
     - Find Products
     - Check Out
     - Browse More
     - Ask Agent

4. **Find Product** (if in stock)
   - Product details
   - Store map with location
   - Alternative sizes
   - Navigation assistance

5. **Out of Stock** (if not available)
   - Alternative options
   - Size suggestions
   - Nearby stores
   - Home delivery

6. **Browse Store**
   - Products grouped by brand
   - Gender-filtered display
   - Product grid
   - Click to find location

7. **Checkout**
   - Order summary
   - Loyalty discount applied
   - Payment method selection
   - Complete purchase

8. **Order Confirmation**
   - Success animation
   - Order details
   - WhatsApp integration
   - Auto-return after 30s

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

### Code Style

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** (recommended) for formatting

### Best Practices

- Server Components where possible
- Client Components only when needed
- Proper hydration handling
- Error boundaries
- Loading states
- Responsive design for touchscreens

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The production build will be in the `.next/` directory.

### Environment Variables

Ensure these are set in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Hosting Options

- **Vercel** - Recommended for Next.js apps
- **Netlify** - Easy deployment with CI/CD
- **AWS Amplify** - Enterprise hosting
- **Self-hosted** - Docker containerization

### Kiosk Hardware Requirements

- **Display**: Large touchscreen (minimum 1920×1080)
- **Browser**: Chrome/Edge (latest version)
- **Network**: Stable internet connection
- **Performance**: Minimum 4GB RAM, modern CPU

---

## 📱 Browser Support

- **Chrome** (latest) - Full support, recommended
- **Firefox** (latest) - Full support
- **Safari** (latest) - Full support
- **Edge** (latest) - Full support

**Note**: Designed for large touchscreen displays (kiosk hardware). Optimized for touch interactions.

---

## 🔒 Security

- Environment variables for sensitive data
- Row Level Security (RLS) on database
- HTTPS in production
- Input validation
- Session timeout for security
- No sensitive data in client-side code

---

## 📈 Performance

- Server-side rendering where possible
- Optimized images with Next.js Image component
- Code splitting with Next.js
- Efficient state management
- Lazy loading for components
- Smooth animations

---

## 🎨 Design System

### ABFRL Brand Guidelines

**Colors:**
- **Primary**: Persian Red (#CF2E2E)
- **Accent**: Princeton Orange (#F68529)
- **Loyalty Gold**: Nugget Gold (#C58A24)
- **Success**: Green (#22C55E)

**Typography:**
- **Headings**: Montserrat (Bold)
- **Body**: Inter (Regular)
- **Monospace**: Geist Mono (for IDs)

**UI Patterns:**
- Large touch targets (minimum 44×44px)
- High contrast for readability
- Clear visual hierarchy
- Consistent spacing and padding

---

## 🤝 Integration Notes

### Session Synchronization

- Both apps share the same Supabase database
- Cart items are linked by `session_id`
- User data is fetched from `users` table
- Orders are created in `orders` and `order_items` tables
- Real-time updates via Supabase subscriptions (optional)

### WhatsApp Integration

- Opens WhatsApp mock interface after order confirmation
- Passes order data via URL parameters
- Enables post-purchase engagement
- Cross-brand recommendations
- Time-limited offers

---

## 📄 License

© 2024 Aditya Birla Fashion & Retail Limited. All rights reserved.

This project is proprietary and confidential. Unauthorized copying, modification, or distribution is strictly prohibited.

---

## 👥 Credits

**Developed for:** Aditya Birla Fashion & Retail Limited  
**Project Type:** Hackathon Demo - Omni-Conversational Sales Orchestrator  
**Technology Stack:** Next.js 16, React 19, TypeScript, Supabase, Tailwind CSS

---

## 📞 Support

For technical support or questions about this project, please reach out to the development team.

---

**Built with ❤️ for ABFRL**
