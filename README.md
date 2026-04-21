# Dhwanil Panchani - Portfolio Website

A modern, high-performance portfolio website built with Next.js 15, React Three Fiber, and Framer Motion. Features 3D animations, dark mode, and a futuristic glassmorphism design.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion, React Three Fiber
- **3D Graphics:** Three.js, @react-three/drei
- **Testing:** Jest, React Testing Library
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel

## ✨ Features

- ⚡ Lightning-fast performance with Next.js 15
- 🎨 Modern glassmorphism UI with smooth animations
- 🌓 Dark/Light mode with system preference detection
- 🎭 Interactive 3D particle background
- 📱 Fully responsive (mobile-first design)
- ♿ WCAG AA accessible
- 🔍 SEO optimized with metadata and sitemap
- 🧪 Comprehensive test coverage
- 🚀 Optimized for Core Web Vitals

## 📦 Installation
```bash
# Clone the repository
git clone https://github.com/DhwanilPanchani/portfolio.git
cd portfolio

# Install dependencies
npm install

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
npm run dev          # Start dev server with Turbopack
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
│   ├── (pages)/           # Route pages
│   │   ├── about/
│   │   ├── contact/
│   │   ├── education/
│   │   ├── experience/
│   │   └── projects/
│   ├── api/               # API routes
│   ├── components/        # React components
│   │   ├── core/          # Core components (NavBar, Footer, etc.)
│   │   ├── home/          # Home page components
│   │   ├── projects/      # Project components
│   │   └── shared/        # Shared components
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── data/                  # JSON data files
├── lib/                   # Utility functions
├── public/                # Static assets
├── tests/                 # Test files
└── ...config files
```

## 🎨 Design System

### Color Palette
```typescript
Primary:    #6366F1 (Indigo)
Secondary:  #EC4899 (Pink)
Accent:     #14B8A6 (Teal)
Background: #FAFAFA (Light) / #0A0A0F (Dark)
Surface:    #FFFFFF (Light) / #1A1A24 (Dark)
```

### Typography

- **Sans:** Inter Variable, system-ui
- **Mono:** Fira Code Variable, Consolas
- **Display:** Cal Sans, Inter Variable

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The site can be deployed to any platform supporting Next.js:

- **Netlify:** Use `next export` or Netlify adapter
- **AWS Amplify:** Connect GitHub repository
- **Docker:** Build container with `docker build`

## 🔐 Environment Variables

Create a `.env.local` file:
```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Contact Form (Optional)
SENDGRID_API_KEY=your_sendgrid_api_key
CONTACT_EMAIL=your@email.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 📊 Performance Optimization

### Lighthouse Targets

- **Performance:** ≥ 90
- **Accessibility:** ≥ 90
- **Best Practices:** ≥ 90
- **SEO:** 100

### Optimization Strategies

1. **Images:** Next/Image with AVIF/WebP formats
2. **Fonts:** Variable fonts with font-display: swap
3. **3D Scenes:** Lazy loaded with performance detection
4. **Code Splitting:** Dynamic imports for heavy components
5. **Caching:** Aggressive caching with ISR
6. **Bundle Size:** Tree shaking and code optimization

### Running Lighthouse
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
npm run build
npm start
lighthouse http://localhost:3000 --view
```

## 🧪 Testing
```bash
# Run all tests
npm test

# Run specific test file
npm test NavBar.test.tsx

# Generate coverage report
npm test -- --coverage

# Update snapshots
npm test -- -u
```

## 📝 Content Management

### Adding Projects

Edit `data/projects.json`:
```json
{
  "id": "unique-id",
  "title": "Project Title",
  "description": "Short description",
  "image": "/images/projects/project.jpg",
  "technologies": ["React", "TypeScript"],
  "githubUrl": "https://github.com/...",
  "featured": true,
  "category": "AI/ML"
}
```

### Resume Parsing

Place resume files in `data/resumes/` and run the parser:
```bash
node scripts/parse-resumes.js
```

Supported formats: PDF, DOCX, JSON

## 🎯 Roadmap

### Alpha (MVP) ✅
- Core pages and navigation
- Project showcase
- Contact form
- Dark mode
- Basic animations

### Beta (Performance Tuning)
- [ ] Lighthouse optimizations
- [ ] Advanced 3D scenes
- [ ] Blog functionality
- [ ] Analytics integration
- [ ] Comprehensive test coverage

### Production (Scale)
- [ ] CDN integration
- [ ] A/B testing
- [ ] Advanced SEO
- [ ] Performance monitoring
- [ ] User analytics

## 🐛 Known Issues & Trade-offs

1. **3D Performance:** Heavy 3D scenes may impact Lighthouse scores. Mitigated with:
   - Hardware detection
   - Reduced motion support
   - Lazy loading
   - Static fallbacks

2. **Bundle Size:** Three.js adds ~150KB. Mitigated with:
   - Dynamic imports
   - Tree shaking
   - Code splitting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

Dhwanil Panchani - [dhwanilpanchani@gmail.com](mailto:dhwanilpanchani@gmail.com)

Project Link: [https://github.com/DhwanilPanchani/portfolio](https://github.com/DhwanilPanchani/portfolio)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Vercel](https://vercel.com/)