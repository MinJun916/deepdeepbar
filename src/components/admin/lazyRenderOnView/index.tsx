'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

type LazyRenderOnViewProps = {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
};

const LazyRenderOnView = ({
  children,
  minHeight = 280,
  rootMargin = '220px 0px',
}: LazyRenderOnViewProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight }}>
      {isVisible ? children : null}
    </div>
  );
};

export default LazyRenderOnView;
