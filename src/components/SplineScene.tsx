import { useEffect, useRef } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { url?: string; 'loading-anim-type'?: string },
        HTMLElement
      >;
    }
  }
}

const SPLINE_SCRIPT_SRC =
  'https://unpkg.com/@splinetool/viewer@1.12.92/build/spline-viewer.js';

const SplineScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.querySelector(`script[src="${SPLINE_SCRIPT_SRC}"]`)) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = SPLINE_SCRIPT_SRC;
      document.head.appendChild(script);
    }

    // Inject global CSS to hide the Spline logo via ::part selector
    const styleId = 'spline-hide-logo-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        spline-viewer::part(logo) { display: none !important; }
        spline-viewer #logo, spline-viewer a[href*="spline.design"] { display: none !important; }
      `;
      document.head.appendChild(style);
    }

    // JS fallback: remove the badge from shadow DOM once it loads
    const removeBadge = () => {
      const viewer = containerRef.current?.querySelector('spline-viewer') as HTMLElement | null;
      if (!viewer) return;
      const root = (viewer as any).shadowRoot as ShadowRoot | null;
      if (root) {
        const logo = root.querySelector('#logo') || root.querySelector('a[href*="spline.design"]');
        if (logo) (logo as HTMLElement).style.display = 'none';
      }
    };

    const interval = window.setInterval(removeBadge, 300);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 8000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] md:min-h-[500px] overflow-hidden rounded-2xl translate-x-8 md:translate-x-16"
    >
      <spline-viewer
        url="https://prod.spline.design/yVgYuDzwhW1S10jx/scene.splinecode"
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          display: 'block',
        }}
      />
    </div>
  );
};

export default SplineScene;
