'use client';

import { useEffect, useRef, useState } from 'react';

type PosterGeneratorProps = {
  businessName: string;
  offer: string;
  location: string;
};

export default function PosterGenerator({ businessName, offer, location }: PosterGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [posterUrl, setPosterUrl] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0070f3');
    gradient.addColorStop(1, '#00b894');

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#ffffff';
    context.font = 'bold 72px sans-serif';
    context.fillText('LocalBoost AI', 80, 140);

    context.font = 'bold 86px sans-serif';
    wrapText(context, businessName || 'Your Business Name', 80, 300, 900, 95);

    context.font = '56px sans-serif';
    wrapText(context, offer || 'Special Offer Available', 80, 610, 900, 70);

    context.font = '46px sans-serif';
    context.fillText(`📍 ${location || 'Your City'}`, 80, 900);

    context.fillStyle = 'rgba(255,255,255,0.92)';
    context.fillRect(0, 960, width, 120);
    context.fillStyle = '#003366';
    context.font = 'bold 42px sans-serif';
    context.fillText('Call / Message us today!', 80, 1038);

    setPosterUrl(canvas.toDataURL('image/png'));
  }, [businessName, location, offer]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Promotional Poster</h3>
      <p className="mb-3 mt-1 text-sm text-slate-600">Auto-generated template poster for quick social sharing.</p>
      <canvas className="w-full rounded-xl border border-slate-200" ref={canvasRef} />
      {posterUrl && (
        <a
          className="mt-3 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          download="localboost-poster.png"
          href={posterUrl}
        >
          Download Poster
        </a>
      )}
    </section>
  );
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';

  words.forEach((word) => {
    const testLine = `${line}${word} `;
    const width = context.measureText(testLine).width;

    if (width > maxWidth && line) {
      context.fillText(line, x, y);
      line = `${word} `;
      y += lineHeight;
    } else {
      line = testLine;
    }
  });

  context.fillText(line, x, y);
}
