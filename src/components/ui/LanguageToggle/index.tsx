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
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-xs)',
        color: 'var(--accent-lichen)',
        background: 'none',
        border: 'none',
        borderBottom: '1px solid rgba(122,173,94,0.4)',
        paddingBottom: '1px',
        cursor: 'pointer',
        transition: 'opacity 200ms ease',
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
