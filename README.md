# NOVA-Store E-Commerce Platform

A comprehensive e-commerce web application developed using Next.js 15, TypeScript, and Tailwind CSS. This project implements a fully functional online store with internationalization support, state management, and a responsive user interface.

## Project Overview

This application serves as a modern e-commerce solution featuring product browsing, cart management, user authentication, and checkout processes. It utilizes Server Side Rendering (SSR) and Client Side Rendering (CSR) where appropriate to optimize performance and SEO.

## Key Features

* **Internationalization (i18n):** Full support for English and Arabic languages, including bidirectional layout adjustments (LTR/RTL) using next-intl.
* **Authentication System:** User registration, login, password recovery, and protected routes using JWT and Context API.
* **Product Management:** Detailed product listings, category filtering, brand filtering, and product search capabilities.
* **Shopping Cart:** Dynamic cart management allowing users to add, remove, and update item quantities via a side drawer.
* **Wishlist & Comparison:** Functionality to save items for later and compare product specifications side-by-side.
* **Checkout Process:** Integrated checkout flow for order placement.
* **User Dashboard:** Specialized area for users to manage profiles and view order history.
* **Theme Support:** System-wide dark and light mode toggle using next-themes.
* **Responsive Design:** Optimized layout for mobile, tablet, and desktop viewports.
* **Toast Notifications:** System status updates and alerts using sonner.

## Technology Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI Components:** Shadcn UI
* **Icons:** Lucide React
* **State Management:** React Context API
* **Localization:** next-intl
* **Form Handling:** React Hook Form & Zod
* **HTTP Client:** Fetch API (Custom wrapper)

## Prerequisites

Before running the project, ensure the following are installed:
* Node.js (v18.17 or later)
* npm, yarn, or pnpm package manager

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/repo-name.git
    cd repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` file in the root directory and configure the API endpoint:
    ```env
    NEXT_PUBLIC_API_URL=https://route-ecommerce.onrender.com/api/v1
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be accessible at `http://localhost:3000`.

## Scripts

* `npm run dev`: Starts the development server.
* `npm run build`: Builds the application for production.
* `npm run start`: Runs the built application in production mode.
* `npm run lint`: Runs ESLint to check for code quality issues.

## Project Structure

The project follows the standard Next.js App Router structure:

```text
src/
├── app/                 # App Router pages and layouts
│   ├── [locale]/        # Dynamic locale routes
│   │   ├── (auth)/      # Authentication routes
│   │   ├── (shop)/      # Shop and product routes
│   │   └── layout.tsx   # Main application layout
├── components/          # UI Components
│   ├── ui/              # Shadcn UI components
│   ├── home/            # Homepage components
│   ├── products/        # Product-related components
│   └── shared/          # Shared components (Header, Footer)
├── context/             # Global state management (Context API)
├── lib/                 # Utility functions and API configuration
├── messages/            # Localization files (JSON)
└── types/               # TypeScript type definitions
License

This project is distributed under the MIT License.