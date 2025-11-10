export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
  category?: string;
  details?: {
    challenge?: string;
    solution?: string;
    keyFeatures?: string[];
    impact?: string;
  };
}
