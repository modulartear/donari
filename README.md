# DON ARII - Gamer Store

A modern e-commerce platform for gaming hardware and peripherals built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Backend Services**:
  - Firebase (Authentication, Database)
  - Mercado Pago (Payment Processing)
  - Builder.io (CMS)
- **Hosting**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd donari
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_ADMIN_EMAILS=admin@example.com
MP_ACCESS_TOKEN=your_mercado_pago_access_token
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Deployment to Vercel

This project is configured for deployment on Vercel. The `vercel.json` file contains the build configuration.

### Steps to Deploy

1. **Push your code to GitHub** (or your preferred Git provider)

2. **Import project on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your repository
   - Vercel will auto-detect Vite configuration

3. **Set Environment Variables**:
   - In Vercel Project Settings → Environment Variables
   - Add all variables from `.env.example`:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_ADMIN_EMAILS`
     - `MP_ACCESS_TOKEN`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

### Environment Variables Notes

- Variables prefixed with `VITE_` are exposed to the client-side code
- `MP_ACCESS_TOKEN` is server-side only (API routes)
- Never commit `.env.local` or `.env` files to version control
- Use Vercel's environment variable management for production secrets

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable React components
├── context/         # React Context (Auth, Cart)
├── hooks/           # Custom React hooks
├── layouts/         # Page layouts
├── pages/           # Page components
├── services/        # API and service functions
├── styles/          # Global styles
└── main.tsx         # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- Product catalog with categories
- Shopping cart management
- User authentication
- Order checkout with Mercado Pago
- Admin dashboard for product management
- Responsive design for all devices

## License

Proprietary - All rights reserved
