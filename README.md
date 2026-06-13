# SEP490 Frontend

Frontend web application for **BShowSell** — an e-commerce and social media management platform. Built with React 19 and TypeScript using Vite, supporting brand management, product sales, marketing campaigns, content publishing, and analytics for Admin, Brand, Marketing, Content, and Sales roles.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build tool**: Vite 7
- **Routing**: React Router v7
- **State management**: Redux Toolkit
- **Styling**: Tailwind CSS v4, shadcn/ui, Radix UI
- **Forms**: React Hook Form + Yup
- **Rich text editor**: Tiptap
- **Maps**: Goong Maps
- **Media**: Plyr, HLS.js, FFmpeg.wasm
- **Charts**: Recharts
- **PDF generation**: @react-pdf/renderer
- **PWA**: vite-plugin-pwa
- **HTTP client**: Axios
- **Animations**: Framer Motion
- **Tooling**: ESLint, Prettier, Husky, lint-staged, Commitlint

## Project Structure

```
src/
  pages/
    landing/            Public site (homepage, about, blog, order tracking, policies)
    authentication/     Login, register, forgot/reset password
    manager/
      admin/            Users, channels, attributes, product options, system configs
      brand/            Brand-side campaign, contract, product & content approvals
      marketing/        Brand/campaign/contract management, violations
      content/          Content creation, scheduling, tasks, tags
      sale/             Categories, orders, pre-orders, products, reviews, transactions
      shared/           Dashboard, account, notifications
    pwa/                Sales Staff PWA pages
  components/           UI building blocks (per domain + shared `ui/`)
  layouts/              App layouts (Manage, Authentication, Customer, etc.)
  routes/               Route definitions (public, private, sales PWA)
  libs/
    stores/             Redux slices & thunks (one folder per domain)
    services/           API service definitions per domain
    hooks/              Custom hooks (useAuth, useProduct, useContent, ...)
    types/              Shared TypeScript types
    validation/         Yup validation schemas
    helper/ & utils/    Helper functions & utilities
    contexts/           React contexts
  enums/                Shared enums
  styles/               Global styles
```

## Features

| Module             | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| **Landing**        | Homepage, about us/app, blog, order tracking, terms & privacy policy      |
| **Auth**           | Login, register, forgot/reset password                                   |
| **Dashboard**      | Role-based dashboards for Admin, Brand, Marketing, Content, Sales         |
| **Brand**          | Brand profiles, analytics, approvals                                      |
| **Campaigns**      | Create, edit, and track marketing campaigns                              |
| **Contracts**      | Advertising, affiliate, brand ambassador, co-producing; financial & legal terms, payments, transactions |
| **Products**       | Standard, limited, and pre-order products; categories, variants/attributes, concepts |
| **Orders**         | Orders, pre-orders, reviews, GHN shipping integration                    |
| **Maps**           | Goong Maps integration for location-based features                       |
| **Content**        | Tiptap rich-text editor, scheduling, posting, approval workflow, tagging  |
| **Analytics**      | Dashboards for admin, brand, sales, content, and marketing performance    |
| **Notifications**  | Real-time notification center                                            |
| **Payments**       | Payment, transaction history, success/cancel result pages                |
| **Sales PWA**       | Installable Progressive Web App for Sales Staff                          |

## Prerequisites

- **Node.js** 18 or later
- **npm**

## Configuration

Create a `.env` file in the project root:

```env
VITE_API_URL=
VITE_APP_BASE_URL=
VITE_GOONG_API_KEY=
VITE_GOONG_MAPTILES_KEY=
VITE_GOONG_URL=
```

## Installation & Running

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

The app starts on `http://localhost:5173` by default.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Scripts

| Command                | Action                                  |
| ----------------------- | --------------------------------------- |
| `npm run dev`           | Start the Vite dev server                |
| `npm run build`         | Type-check and build for production      |
| `npm run preview`       | Preview the production build locally     |
| `npm run lint`          | Run ESLint with auto-fix                 |
| `npm run format`        | Format the codebase with Prettier        |
| `npm run format:check`  | Check formatting without writing changes |
