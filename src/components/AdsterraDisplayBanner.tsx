import React from 'react';

interface AdsterraDisplayBannerProps {
  className?: string;
}

/**
 * Adsterra 300x250 Display Banner Ad Unit
 * Key: dedbfd293485a9542378c6b5433fe1e8
 * Placed after introduction, before main content sections.
 */
export default function AdsterraDisplayBanner({ className = '' }: AdsterraDisplayBannerProps) {
  const iframeHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <base target="_blank" />
    <style>
      body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : 'dedbfd293485a9542378c6b5433fe1e8',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highrevenueformat.com/dedbfd293485a9542378c6b5433fe1e8/invoke.js"></script>
  </body>
</html>`;

  return (
    <div className={`w-full my-6 flex flex-col items-center justify-center overflow-hidden ${className}`}>
      <iframe
        title="Advertisement"
        width={300}
        height={250}
        srcDoc={iframeHtml}
        style={{ width: '300px', height: '250px', border: 'none', overflow: 'hidden' }}
        className="w-[300px] h-[250px] border-0 overflow-hidden mx-auto"
      />
    </div>
  );
}
