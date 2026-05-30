'use client';

import { useEffect, useState } from 'react';
import { formatCountdown, getDropTargetDate } from '../lib/loyalty';

export default function DropCountdown({ labelPrefix = 'MỞ BÁN SS.24 SAU' }: { labelPrefix?: string }) {
  const [text, setText] = useState('—:—:—');
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(true);
    const target = getDropTargetDate();

    const tick = () => {
      setText(formatCountdown(target.getTime() - Date.now()));
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!live) {
    return (
      <h3 className="font-tech text-lg font-bold mb-6 tracking-tight text-on-surface">
        {labelPrefix} —:—:—
      </h3>
    );
  }

  return (
    <h3 className="font-tech text-lg font-bold mb-6 tracking-tight text-on-surface">
      {labelPrefix} {text}
    </h3>
  );
}
