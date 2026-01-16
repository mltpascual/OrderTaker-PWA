# OrderTaker PWA

## A High-End Order Management System for Boutique Bakeries

OrderTaker is a Progressive Web Application (PWA) designed to streamline order management for small businesses and boutique bakeries. It focuses on intuitive usability, a mobile-first approach, and a premium aesthetic to provide an efficient and enjoyable experience for managing customer orders, menu items, and sales performance.

---

## ✨ Features

### 🔐 Authentication & User Management
*   **Secure Login**: Supports both Email/Password and Google Sign-In via Firebase Authentication.
*   **Automatic Profile Creation**: New user profiles are automatically created and stored in Firestore upon successful registration or first login.
*   **Protected Routes**: Ensures access to the main dashboard is restricted to authenticated users.

### 📋 Order Management
*   **CRUD Operations**: Easily Create, Read, Update, and Delete customer orders.
*   **Dynamic Order Form**: Populated with items from your custom menu, including an option for "custom" items with manual name and price entry.
*   **Smart Validation**: Strict validation ensures essential fields like Customer Name, Item, Pickup Date, and Pickup Time are completed before an order can be confirmed.
*   **Order Status Toggle**: Mark orders as `pending` or `completed` with dedicated confirmation modals.
*   **Order Duplication**: Quickly duplicate existing orders to save time for recurring customers or similar requests.
*   **Flexible Notes**: Add special instructions or customer preferences with an optional notes field.
*   **Source Tracking**: Categorize orders by their origin (e.g., Instagram, Marketplace, FB Page) for marketing insights.
*   **Local Date Handling**: Ensures pickup dates are handled consistently across timezones.

### 🗓️ Order Queue & Filtering
*   **"Today's Queue" View**: Instantly see all pending orders scheduled for the current local date.
*   **Status Filters**: Filter orders by `pending` or `completed` status.
*   **Order Summary**: A dedicated view showing aggregated quantities of items for production planning on a selected date.
*   **Intelligent Sorting**: Orders are sortable by 'Earliest Pickup' (default) or 'Latest Pickup' to help prioritize workflow.
*   **Customer Grouping**: Visually distinguishes customers with multiple orders using subtle background colors.

### 🍰 Menu Management
*   **Dynamic Menu**: Add, Edit, and Remove cake items with their base prices.
*   **Real-time Updates**: Menu changes are immediately reflected in the order form.
*   **Duplicate Menu Items**: Quickly clone existing menu items for minor variations.

### 📊 Sales Reports
*   **Key Performance Indicators (KPIs)**:
    *   **Total Revenue**: Revenue from all completed orders.
    *   **Pipeline**: Total value of all pending orders.
    *   **Total Orders**: Count of completed orders.
    *   **Average Order Value**: Average value per completed order.
*   **Top Selling Items**: Visual breakdown of your top 5 best-selling items by quantity.
*   **Orders by Source**: Chart illustrating the distribution of orders across different sources.

### 🎨 UI/UX & Design
*   **Mobile-First Responsive Design**: Optimized for seamless use on small screens (e.g., iPhone) with a dedicated bottom navigation bar.
*   **Premium Aesthetic**: Clean, modern interface with a consistent color palette (Indigo, Emerald, Rose, Slate).
*   **Bold Typography**: Utilizes the 'Inter' font with strong emphasis on `font-black` for headings and key information.
*   **Custom Icons**: Inline SVG icons with a 2.5px stroke width for a unique, bold visual style.
*   **Intuitive Modals**: Clear and stylish confirmation modals for critical actions like completing or deleting orders.
*   **Smooth Animations**: Subtle animations for form openings, tab transitions, and error messages enhance user experience.
*   **Accessible Input Modes**: Numeric inputs are configured with `inputMode="decimal"` or `inputMode="numeric"` to activate appropriate mobile keypads.

---

## 🚀 Tech Stack

*   **Frontend**: React 19 (ESM via `esm.sh`)
*   **Styling**: Tailwind CSS
*   **Backend & Authentication**: Firebase (Firestore, Authentication)
*   **Package Manager**: Assumed to be handled by the ESM import map for browser execution.

---

## 🛠️ Installation & Usage (Conceptual)

1.  **Firebase Setup**:
    *   Create a Firebase project.
    *   Enable Email/Password and Google authentication.
    *   Initialize Firestore and set up collection rules (e.g., `users/{uid}/orders`, `users/{uid}/menu`).
    *   Replace `firebaseConfig` in `firebase.ts` with your project's credentials.
2.  **Run Locally**:
    *   Due to the ESM setup, this app is designed to run directly in a modern browser without a traditional build step.
    *   Serve the `index.html` file using a simple local web server (e.g., `npx serve .`).
    *   Navigate to `http://localhost:5000` (or your server's address) in your browser.

---

## 📄 Blueprints

For detailed information on the design system, technical architecture, and project overview, refer to the `blueprints/` directory.

---
