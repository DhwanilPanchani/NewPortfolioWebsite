# Dhwanil Panchani - Portfolio Website

A modern, high-performance portfolio website built with Next.js 15, React Three Fiber, GSAP, and Tailwind CSS. The site features smooth scrolling, aesthetic animations, magnetic interactions, and a rich user experience tailored for performance.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** GSAP, Framer Motion
- **3D Graphics:** Three.js, React Three Fiber, `@react-three/drei`
- **Smooth Scrolling:** Lenis
- **Forms/Email:** Nodemailer
- **Testing:** Jest, React Testing Library
- **Deployment:** Vercel

## ✨ Key Features

- ⚡ **Next.js 15 App Router** for lightning-fast loading and server-side rendering
- 🎨 **Modern UI** built with Tailwind CSS, utilizing glassmorphism and modern layouts
- 🎭 **Advanced Animations** executed via GSAP and Framer Motion (`TextReveal`, `MagneticCursor`, `TiltCard`)
- 🌀 **Smooth Scrolling** powered by Lenis (`SmoothScroll` component)
- 🌓 **Dark Mode** integrated styling
- 📱 Fully responsive (mobile-first design)
- 📧 **Integrated Contact API** powered by Nodemailer

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/DhwanilPanchani/NewPortfolioWebsite.git
cd NewPortfolioWebsite

# Install dependencies (use legacy-peer-deps to avoid React 19 warnings with Drei)
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests in watch mode
npm run test:ci      # Run tests once (CI mode)
```

## 🏗️ Project Structure

```
├── app/
│   ├── (pages)/           # Route pages (about, contact, education, etc.)
│   ├── api/               # API routes (contact form, health checks)
│   ├── components/        # React components
│   │   ├── core/          # Core components (NavBar, Footer)
│   │   ├── home/          # Home page sections (Hero, FeaturedProjects, Skills, etc.)
│   │   └── ui/            # Reusable UI interactions (MagneticCursor, SmoothScroll, TiltCard)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── data/                  # Static data for content
├── lib/                   # Utility functions
├── public/                # Static assets
└── tests/                 # Test files
```

## 🚀 Deployment

This application is configured for seamless deployment on **Vercel**. 

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Target dependencies conflict gracefully via Vercel settings if needed (though the committed `.npmrc` handles this automatically!)
4. Add any environment variables (`EMAIL_USER`, `EMAIL_PASS`, etc.)
5. Deploy!

## 🔐 Environment Variables

Ensure your `.env.local` or environment secrets are set up correctly:
```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Email Configuration (for Nodemailer)
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_app_password
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

**Dhwanil Panchani** - [dhwanilpanchani@gmail.com](mailto:dhwanilpanchani@gmail.com)

Project Link: [https://github.com/DhwanilPanchani/NewPortfolioWebsite](https://github.com/DhwanilPanchani/NewPortfolioWebsite)
