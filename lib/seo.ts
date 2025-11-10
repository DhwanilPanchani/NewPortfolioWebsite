import { Metadata } from 'next';

const siteConfig = {
  name: 'Dhwanil Panchani',
  title: 'Dhwanil Panchani | AI Engineer & Full-Stack Developer',
  description:
    'AI Engineer and Full-Stack Developer specializing in React, Next.js, TensorFlow, and cloud-native architecture. Building intelligent systems that deliver real business value.',
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
      'AI Engineer',
      'Full-Stack Developer',
      'React',
      'Next.js',
      'TensorFlow',
      'Machine Learning',
      'Node.js',
      'TypeScript',
      'Cloud Architecture',
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