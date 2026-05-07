import { useEffect } from 'react';

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
  useEffect(() => {
    if (document.querySelector(`script[src="${SPLINE_SCRIPT_SRC}"]`)) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = SPLINE_SCRIPT_SRC;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] overflow-hidden rounded-2xl translate-x-8 md:translate-x-16">
      <spline-viewer
        url="https://prod.spline.design/yVgYuDzwhW1S10jx/scene.splinecode"
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          display: 'block',
        }}
      />
      {/* Cover Spline watermark */}
      <div className="absolute bottom-0 right-0 w-44 h-14 bg-background pointer-events-none" />
    </div>
  );
};

export default SplineScene;
