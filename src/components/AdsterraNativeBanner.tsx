import React from 'react';

interface AdsterraNativeBannerProps {
  className?: string;
}

/**
 * Adsterra Native Banner Ad Unit
 * Disabled during Google AdSense review period to comply with clean UX guidelines.
 */
export default function AdsterraNativeBanner({ className = '' }: AdsterraNativeBannerProps) {
  // Return null to prevent third-party ad scripts from executing during AdSense review
  return null;
}

