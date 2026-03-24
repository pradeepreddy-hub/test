'use client';

import { FormEvent, useMemo, useState } from 'react';
import ContentCard from './ContentCard';
import PosterGenerator from './PosterGenerator';
import { FormDataShape, GeneratedContent } from './types';

const initialForm: FormDataShape = {
  businessType: 'Hotel',
  businessName: '',
  location: '',
  description: '',
  offer: '',
  targetAudience: '',
  language: 'English'
};

const initialContent: GeneratedContent = {
  whatsapp: '',
  instagram: '',
  linkedin: ''
};

const sampleUseCases: FormDataShape[] = [
  {
    businessType: 'Hotel',
    businessName: 'GreenNest Homestay',
    location: 'Coorg',
    description: 'Cozy nature-view rooms with homemade breakfast and campfire evenings.',
    offer: 'Weekend package ₹2999 per night',
    targetAudience: 'tourists, families',
    language: 'English'
  },
  {
    businessType: 'Agriculture',
    businessName: 'Namma Organic Farms',
    location: 'Bangalore',
    description: 'Fresh pesticide-free vegetables delivered directly from farm to home.',
    offer: 'Starter basket ₹399',
    targetAudience: 'local buyers, health-conscious families',
    language: 'English'
  },
  {
    businessType: 'Shop',
    businessName: 'Sweet Crust Bakery',
    location: 'Mysuru',
    description: 'Freshly baked breads, pastries, and customized celebration cakes.',
    offer: 'Buy 2 pastries, get 1 free',
    targetAudience: 'local buyers, students',
    language: 'English'
  },
  {
    businessType: 'Service',
    businessName: 'BrightPath Tuition Center',
    location: 'Hubballi',
    description: 'After-school coaching for classes 6 to 10 with small batches.',
    offer: 'Free demo class this week',
    targetAudience: 'families, students',
    language: 'English'
  },
  {
    businessType: 'Service',
    businessName: 'GlowCraft Salon',
    location: 'Mangalore',
    description: 'Unisex salon with hair spa, bridal makeup, and skin care packages.',
    offer: '20% off on weekday appointments',
    targetAudience: 'local buyers, professionals',
    language: 'English'
  }
];

export default function LocalBoostApp() {
  const [form, setForm] = useState<FormDataShape>(initialForm);
  const [content, setContent] = useState<GeneratedContent>(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canGenerate = useMemo(
    () => [form.businessName, form.location, form.description].every((value) => value.trim().length > 0),
    [form.businessName, form.description, form.location]
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canGenerate) {
      setError('Please fill business name, location, and product/service description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Could not generate content. Please try again.');
      }

      const data = (await response.json()) as GeneratedContent;
      setContent(data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setContent(initialContent);
    setError('');
    setLoading(false);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6">
      <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">LocalBoost AI</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Create ready-to-share marketing content in minutes</h1>
        <p className="mt-2 text-sm text-slate-600">Designed for local businesses. Just 3 steps: enter details, generate, and share.</p>
      </section>

      <form className="space-y-4 rounded-2xl bg-white p-5 shadow-sm" noValidate onSubmit={onSubmit}>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Step 1 of 3</p>
        <h2 className="text-lg font-semibold">Business Details</h2>

        <Field htmlFor="businessType" label="Business Type">
          <select
            className="w-full rounded-xl border border-slate-300 p-3 text-base"
            id="businessType"
            value={form.businessType}
            onChange={(event) => setForm((prev) => ({ ...prev, businessType: event.target.value as FormDataShape['businessType'] }))}
          >
            <option>Hotel</option>
            <option>Agriculture</option>
            <option>Shop</option>
            <option>Service</option>
          </select>
        </Field>

        <Field htmlFor="businessName" label="Business Name*">
          <input
            required
            className="w-full rounded-xl border border-slate-300 p-3 text-base"
            id="businessName"
            value={form.businessName}
            onChange={(event) => setForm((prev) => ({ ...prev, businessName: event.target.value }))}
          />
        </Field>

        <Field htmlFor="location" label="Location (City)*">
          <input
            required
            className="w-full rounded-xl border border-slate-300 p-3 text-base"
            id="location"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
          />
        </Field>

        <Field htmlFor="description" label="Product/Service Description*">
          <textarea
            required
            className="min-h-24 w-full rounded-xl border border-slate-300 p-3 text-base"
            id="description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
        </Field>

        <Field htmlFor="offer" label="Offer/Price (optional)">
          <input
            className="w-full rounded-xl border border-slate-300 p-3 text-base"
            id="offer"
            value={form.offer}
            onChange={(event) => setForm((prev) => ({ ...prev, offer: event.target.value }))}
          />
        </Field>

        <Field htmlFor="targetAudience" label="Target Audience (optional)">
          <input
            className="w-full rounded-xl border border-slate-300 p-3 text-base"
            id="targetAudience"
            placeholder="tourists, local buyers, families"
            value={form.targetAudience}
            onChange={(event) => setForm((prev) => ({ ...prev, targetAudience: event.target.value }))}
          />
        </Field>

        <Field htmlFor="language" label="Language">
          <select
            className="w-full rounded-xl border border-slate-300 p-3 text-base"
            id="language"
            value={form.language}
            onChange={(event) => setForm((prev) => ({ ...prev, language: event.target.value as FormDataShape['language'] }))}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Kannada</option>
          </select>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canGenerate || loading}
            type="submit"
          >
            {loading ? 'Generating...' : 'Step 2: Generate Content'}
          </button>
          <button
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base font-semibold text-slate-700"
            onClick={handleReset}
            type="button"
          >
            Reset
          </button>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      </form>

      <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Step 0 (Optional)</p>
        <h2 className="text-lg font-semibold">Quick Sample Use Cases</h2>
        <div className="mt-3 grid gap-2">
          {sampleUseCases.map((example) => (
            <button
              key={example.businessName}
              className="rounded-xl border border-slate-200 p-3 text-left text-sm"
              onClick={() => {
                setForm(example);
                setError('');
              }}
              type="button"
            >
              <p className="font-semibold">{example.businessName}</p>
              <p className="text-slate-600">
                {example.businessType} · {example.location}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Step 3 of 3</p>
        <ContentCard
          enableWhatsAppShare
          title="WhatsApp Message"
          value={content.whatsapp}
          onChange={(value) => setContent((prev) => ({ ...prev, whatsapp: value }))}
        />
        <ContentCard
          title="Instagram Caption"
          value={content.instagram}
          onChange={(value) => setContent((prev) => ({ ...prev, instagram: value }))}
        />
        <ContentCard
          title="LinkedIn Post"
          value={content.linkedin}
          onChange={(value) => setContent((prev) => ({ ...prev, linkedin: value }))}
        />
      </section>

      <section className="mt-4">
        <PosterGenerator businessName={form.businessName} location={form.location} offer={form.offer} />
      </section>
    </main>
  );
}

function Field({ children, htmlFor, label }: { children: React.ReactNode; htmlFor: string; label: string }) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
