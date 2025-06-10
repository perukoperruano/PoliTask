
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-1 text-sm text-muted-foreground flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.icon && React.createElement(item.icon, { className: "h-4 w-4 mr-1.5 flex-shrink-0" })}
            {index < items.length - 1 && item.href ? (
              <Link to={item.href} className="hover:text-primary hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-1.5 text-muted-foreground flex-shrink-0" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
