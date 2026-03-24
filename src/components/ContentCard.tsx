'use client';

import { useMemo, useState } from 'react';

type ContentCardProps = {
  title: string;
  value: string;
  onChange: (value: string) => void;
  enableWhatsAppShare?: boolean;
};

export default function ContentCard({ title, value, onChange, enableWhatsAppShare = false }: ContentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle');

  const whatsappUrl = useMemo(() => {
    if (!enableWhatsAppShare || !value.trim()) {
      return '';
    }

    return `https://wa.me/?text=${encodeURIComponent(value)}`;
  }, [enableWhatsAppShare, value]);

  const handleCopy = async () => {
    if (!value.trim()) {
      setCopyState('error');
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }

    setTimeout(() => setCopyState('idle'), 1800);
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <button
          className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700"
          onClick={() => setIsEditing((prev) => !prev)}
          type="button"
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <textarea
          className="min-h-32 w-full rounded-xl border border-slate-300 p-3 text-sm"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{value || 'Generated text appears here.'}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          disabled={!value.trim()}
          onClick={handleCopy}
          type="button"
        >
          {copyState === 'success' ? 'Copied!' : 'Copy'}
        </button>
        {enableWhatsAppShare && whatsappUrl && (
          <a
            className="rounded-xl border border-green-600 px-4 py-2 text-sm font-semibold text-green-700"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            Share on WhatsApp
          </a>
        )}
      </div>
      {copyState === 'error' && <p className="mt-2 text-xs text-red-600">Could not copy. Please try again.</p>}
    </article>
  );
}
