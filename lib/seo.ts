import { Metadata } from 'next';

const siteConfig = {
  name: 'Dhwanil Panchani',
  title: 'Dhwanil Panchani — Software Engineer · Software should show its work',
  description:
    'Software engineer building payment risk engines, AI agent security, and LLM pipelines that have to prove their work. Explore the portfolio as a spatial operating system.',
  url: 'https://dhwanilpanchani.com',
  ogImage: 'https://dhwanilpanchani.com/og-image.jpg',
  links: {
    github: 'https://github.com/DhwanilPanchani',
    linkedin: 'https://linkedin.com/in/dhwanilpanchani',
  },
};

export function generateSiteMetadata(): Metadata {
  return {
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      'Software Engineer',
      'Full-Stack Engineer',
      'AI Agents',
      'Agent Security',
      'MCP',
      'Payments',
      'Java',
      'Python',
      'TypeScript',
      'Boston',
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: siteConfig.title,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
  };
}
