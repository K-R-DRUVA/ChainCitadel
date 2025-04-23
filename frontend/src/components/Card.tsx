import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  title,
  subtitle,
  footer
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 ${className}`}>
      {(title || subtitle) && (
        <div className="p-4 sm:p-6 border-b border-gray-100">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
      {footer && (
        <div className="px-4 py-3 sm:px-6 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;