import { render, screen } from '@testing-library/react';
import ProjectCard from '@/app/components/projects/ProjectCard';

const mockProject = {
  id: 'test-project',
  title: 'Test Project',
  description: 'A test project description',
  image: '/images/test.jpg',
  technologies: ['React', 'TypeScript', 'Node.js'],
  githubUrl: 'https://github.com/test/project',
  liveUrl: 'https://test.com',
  featured: true,
};

describe('ProjectCard', () => {
  it('renders project title and description', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  it('renders technology tags', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('renders GitHub link when provided', () => {
    render(<ProjectCard project={mockProject} />);
    const githubLink = screen.getByLabelText('View GitHub repository');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/project');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('renders live demo link when provided', () => {
    render(<ProjectCard project={mockProject} />);
    const liveLink = screen.getByLabelText('View live project');
    expect(liveLink).toHaveAttribute('href', 'https://test.com');
    expect(liveLink).toHaveAttribute('target', '_blank');
  });

  it('does not render links when not provided', () => {
    const projectWithoutLinks = { ...mockProject, githubUrl: undefined, liveUrl: undefined };
    render(<ProjectCard project={projectWithoutLinks} />);
    expect(screen.queryByLabelText('View GitHub repository')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('View live project')).not.toBeInTheDocument();
  });
});