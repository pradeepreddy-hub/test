import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFallbackContent, buildPrompts, normalizeGeneratedResponse, slugTag } from '../src/lib/generateContent.mjs';

const baseInput = {
  businessType: 'Hotel',
  businessName: 'GreenNest Homestay',
  location: 'Coorg',
  description: 'Nature-view stay with breakfast',
  offer: '₹2999',
  targetAudience: 'families',
  language: 'English'
};

test('buildPrompts returns three platform prompts', () => {
  const prompts = buildPrompts(baseInput);
  assert.ok(prompts.whatsapp.includes('WhatsApp'));
  assert.ok(prompts.instagram.includes('Instagram'));
  assert.ok(prompts.linkedin.includes('LinkedIn'));
});

test('normalizeGeneratedResponse trims values', () => {
  const output = normalizeGeneratedResponse({
    whatsapp: ' hello ',
    instagram: ' world ',
    linkedin: ' test '
  });

  assert.deepEqual(output, {
    whatsapp: 'hello',
    instagram: 'world',
    linkedin: 'test'
  });
});

test('normalizeGeneratedResponse throws for invalid shape', () => {
  assert.throws(() => normalizeGeneratedResponse({ whatsapp: 42, instagram: '', linkedin: '' }), /Invalid whatsapp output/);
});

test('fallback content supports Hindi and Kannada', () => {
  const hindi = buildFallbackContent({ ...baseInput, language: 'Hindi' });
  const kannada = buildFallbackContent({ ...baseInput, language: 'Kannada' });

  assert.ok(hindi.whatsapp.includes('में'));
  assert.ok(kannada.whatsapp.includes('ನಲ್ಲಿ'));
});

test('slugTag removes spaces for hashtags', () => {
  assert.equal(slugTag('Bengaluru Rural'), 'BengaluruRural');
});
