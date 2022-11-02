import { useEffect, useRef } from 'react';

type Props = {
  html: string;
  onLoad(): void;
};

export default function PreloadImages({ html, onLoad }: Props) {
  const htmlRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const targetEl = htmlRef.current;
    if (!targetEl) return;

    const imageNodes = Array.from(
      targetEl.querySelectorAll<HTMLImageElement>('img')
    );

    if (!imageNodes.length) onLoad();
    else {
      Promise.all(
        imageNodes.map(
          (image) =>
            new Promise((resolve, reject) => {
              image.onload = resolve;
              image.onerror = reject;
            })
        )
      ).then(onLoad, onLoad);
    }
  });
  return (
    <>
      Loading...
      <span
        ref={htmlRef}
        style={{ display: 'none' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
