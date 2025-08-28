import React, { useEffect, useState } from 'react';

export default function Typewriter({ text, className }: { text: string, className?: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(t => t + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [text]);
  return <span className={className}>{displayed}</span>;
}
