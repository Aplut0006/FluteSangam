import React, { useEffect, useRef } from 'react';

interface AdsterraNativeBannerProps {
  className?: string;
}

/**
 * Adsterra Native Banner Ad Unit
 * Container ID: container-527848d6d2d22dfef32fd0ad56503ca1
 * Placed before FAQ sections across pages.
 */
export default function AdsterraNativeBanner({ className = '' }: AdsterraNativeBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bannerWrapper = bannerRef.current;
    if (!bannerWrapper) return;

    // Clear and create fresh container and script
    bannerWrapper.innerHTML = '';

    const adContainer = document.createElement('div');
    adContainer.id = 'container-527848d6d2d22dfef32fd0ad56503ca1';
    adContainer.className = 'w-full min-h-[50px]';
    bannerWrapper.appendChild(adContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl31210238.profitableratecpmnetwork.com/527848d6d2d22dfef32fd0ad56503ca1/invoke.js';
    bannerWrapper.appendChild(script);

    return () => {
      bannerWrapper.innerHTML = '';
    };
  }, []);

  return (
    <div className={`w-full my-6 sm:my-8 flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {/* Container where the ad unit and script are injected */}
      <div ref={bannerRef} className="w-full flex flex-col items-center justify-center">
        <div id="container-527848d6d2d22dfef32fd0ad56503ca1" className="w-full min-h-[50px]"></div>
      </div>
    </div>
  );
}
