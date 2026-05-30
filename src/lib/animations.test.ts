import { describe, it, expect } from 'vitest';
import type { Variants } from 'framer-motion';
import {
  fogReveal,
  fogRevealFast,
  unfurlReveal,
  growIn,
  growInStagger,
  fogTransition,
  fogFastTransition,
} from './animations';

const EASE_OUT_STRONG: [number, number, number, number] = [0.23, 1, 0.32, 1];

describe('animations.ts', () => {
  describe('fogReveal', () => {
    it('hidden: opacity 0, blur 8px, scale 0.98', () => {
      const h = fogReveal.hidden as Record<string, unknown>;
      expect(h.opacity).toBe(0);
      expect(h.filter).toBe('blur(8px)');
      expect(h.scale).toBe(0.98);
    });
    it('visible: opacity 1, blur 0px, scale 1, duration 1.4s', () => {
      const v = fogReveal.visible as Record<string, unknown>;
      expect(v.opacity).toBe(1);
      expect(v.filter).toBe('blur(0px)');
      expect(v.scale).toBe(1);
      const t = v.transition as Record<string, unknown>;
      expect(t.duration).toBe(1.4);
      expect(t.ease).toEqual(EASE_OUT_STRONG);
    });
  });

  describe('fogRevealFast', () => {
    it('hidden: opacity 0, blur 5px, scale 0.98', () => {
      const h = fogRevealFast.hidden as Record<string, unknown>;
      expect(h.opacity).toBe(0);
      expect(h.filter).toBe('blur(5px)');
      expect(h.scale).toBe(0.98);
    });
    it('visible: duration 0.9s with EASE_OUT_STRONG', () => {
      const v = fogRevealFast.visible as Record<string, unknown>;
      const t = v.transition as Record<string, unknown>;
      expect(t.duration).toBe(0.9);
      expect(t.ease).toEqual(EASE_OUT_STRONG);
    });
  });

  describe('unfurlReveal', () => {
    it('hidden: clipPath inset bottom 100%, opacity 0', () => {
      const h = unfurlReveal.hidden as Record<string, unknown>;
      expect(h.clipPath).toBe('inset(0 0 100% 0)');
      expect(h.opacity).toBe(0);
    });
    it('visible: clipPath 0%, opacity 1, duration 1.0s', () => {
      const v = unfurlReveal.visible as Record<string, unknown>;
      expect(v.clipPath).toBe('inset(0 0 0% 0)');
      expect(v.opacity).toBe(1);
      const t = v.transition as Record<string, unknown>;
      expect(t.duration).toBe(1.0);
      expect(t.ease).toEqual(EASE_OUT_STRONG);
    });
  });

  describe('growIn', () => {
    it('hidden: scale 0.94, opacity 0, blur 4px', () => {
      const h = growIn.hidden as Record<string, unknown>;
      expect(h.scale).toBe(0.94);
      expect(h.opacity).toBe(0);
      expect(h.filter).toBe('blur(4px)');
    });
    it('visible: scale 1, opacity 1, blur 0, duration 0.85s', () => {
      const v = growIn.visible as Record<string, unknown>;
      expect(v.scale).toBe(1);
      expect(v.opacity).toBe(1);
      expect(v.filter).toBe('blur(0px)');
      const t = v.transition as Record<string, unknown>;
      expect(t.duration).toBe(0.85);
    });
  });

  describe('growInStagger', () => {
    it('hidden is empty object', () => {
      expect(Object.keys(growInStagger.hidden as object)).toHaveLength(0);
    });
    it('visible: staggerChildren 0.07, delayChildren 0.05', () => {
      const v = growInStagger.visible as Record<string, unknown>;
      const t = v.transition as Record<string, unknown>;
      expect(t.staggerChildren).toBe(0.07);
      expect(t.delayChildren).toBe(0.05);
    });
  });

  describe('fogTransition(delay)', () => {
    it('returns correct delay, duration 1.4s, EASE_OUT_STRONG', () => {
      const t = fogTransition(0.4);
      expect(t.delay).toBe(0.4);
      expect(t.duration).toBe(1.4);
      expect(t.ease).toEqual(EASE_OUT_STRONG);
    });
    it('preserves any delay: 0, 0.2, 2.5', () => {
      expect(fogTransition(0).delay).toBe(0);
      expect(fogTransition(0.2).delay).toBe(0.2);
      expect(fogTransition(2.5).delay).toBe(2.5);
    });
    it('duration is always 1.4 regardless of delay', () => {
      expect(fogTransition(0).duration).toBe(1.4);
      expect(fogTransition(99).duration).toBe(1.4);
    });
  });

  describe('fogFastTransition(delay)', () => {
    it('returns correct delay, duration 0.9s, EASE_OUT_STRONG', () => {
      const t = fogFastTransition(1.6);
      expect(t.delay).toBe(1.6);
      expect(t.duration).toBe(0.9);
      expect(t.ease).toEqual(EASE_OUT_STRONG);
    });
    it('duration is always 0.9 regardless of delay', () => {
      expect(fogFastTransition(0).duration).toBe(0.9);
      expect(fogFastTransition(3.5).duration).toBe(0.9);
    });
  });

  describe('Type correctness', () => {
    it('all exports are valid Variants objects with hidden and visible keys', () => {
      const variants: Variants[] = [fogReveal, fogRevealFast, unfurlReveal, growIn, growInStagger];
      for (const v of variants) {
        expect(v).toBeDefined();
        expect('hidden' in v).toBe(true);
        expect('visible' in v).toBe(true);
      }
    });
    it('transition helpers return objects with delay, duration, ease', () => {
      for (const fn of [fogTransition, fogFastTransition]) {
        const t = fn(0.5);
        expect(typeof t.delay).toBe('number');
        expect(typeof t.duration).toBe('number');
        expect(Array.isArray(t.ease)).toBe(true);
      }
    });
  });
});
