import React from 'react';

interface AdsterraDisplayBannerProps {
  className?: string;
}

/**
 * Adsterra 300x250 Display Banner Ad Unit
 * Disabled during Google AdSense review period to comply with clean UX guidelines.
 */
export default function AdsterraDisplayBanner({ className = '' }: AdsterraDisplayBannerProps) {
  // Return null to prevent third-party ad scripts from executing during AdSense review
  return null;
}

