'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const next = locale === 'en' ? 'es' : 'en';

  const toggle = () => {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: isPending ? 'var(--color-accent-dim)' : 'var(--color-accent)',
        background: 'transparent',
        border: '1px solid',
        borderColor: isPending ? 'var(--color-accent-dim)' : 'rgba(255,140,66,0.3)',
        borderRadius: '100px',
        padding: '4px 12px',
        cursor: isPending ? 'wait' : 'pointer',
        transition: 'border-color 200ms ease, color 200ms ease',
      }}
      onMouseEnter={e => {
        if (!isPending) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)';
      }}
      onMouseLeave={e => {
        if (!isPending) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,140,66,0.3)';
      }}
    >
      {locale.toUpperCase()} → {next.toUpperCase()}
    </button>
  );
}
