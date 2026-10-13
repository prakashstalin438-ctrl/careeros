import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'ai' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  style,
  icon,
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} style={style}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </span>
  );
};
