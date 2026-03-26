'use client';

import { useEffect, useState } from 'react';

const IntroOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="intro-overlay" aria-hidden="true">
      <p className="intro-overlay-message break-keep">
        혼자와도 함께하는, 밤이 깊어질수록 더 좋아지는 공간. 혼술바 딥딥
      </p>
    </div>
  );
};

export default IntroOverlay;
