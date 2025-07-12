"use client";
import React from 'react';
import PortalLayout from './PortalLayout';

interface PortalLayoutProps {
  children: React.ReactNode;
}

// Sử dụng React.FC với kiểu PortalLayoutProps
const PortalRootLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  return <PortalLayout>{children}</PortalLayout>;
};

export default PortalRootLayout;