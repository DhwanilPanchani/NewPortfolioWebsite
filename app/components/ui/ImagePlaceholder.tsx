import React from 'react';

interface ImagePlaceholderProps {
  width: number;
  height: number;
  alt: string;
  className?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width,
  height,
  alt,
  className = '',
}) => {
  const aspectRatio = (height / width * 100).toFixed(2);
  
  return (
    <div 
      className={`relative bg-gradient-to-br from-blue-500 to-purple-600 ${className}`}
      style={{
        paddingBottom: `${aspectRatio}%`,
        width: '100%',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
        <div className="text-white font-medium text-lg">
          {alt}
          <div className="text-sm opacity-80 mt-2">
            {width} × {height}px • Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};
