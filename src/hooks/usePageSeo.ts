import { useEffect } from 'react';
import type { PageSeoMetadata } from '../seo/metadata';

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function usePageSeo(metadata: PageSeoMetadata, jsonLdObjects: object[] = []): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const origin = window.location.origin;
    const canonicalUrl = `${origin}${metadata.canonicalPath}`;

    document.title = metadata.title;
    upsertCanonical(canonicalUrl);
    upsertMeta('name', 'description', metadata.description);
    upsertMeta('name', 'robots', metadata.robots);

    upsertMeta('property', 'og:title', metadata.title);
    upsertMeta('property', 'og:description', metadata.description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:type', metadata.ogType);
    upsertMeta('property', 'og:site_name', 'LABVERSE');

    if (metadata.ogImage) {
      upsertMeta('property', 'og:image', `${origin}${metadata.ogImage}`);
    }

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', metadata.title);
    upsertMeta('name', 'twitter:description', metadata.description);

    // Replace active JSON-LD script tags cleanly
    const existingScripts = document.head.querySelectorAll('script[data-labverse-jsonld="true"]');
    existingScripts.forEach((node) => node.remove());

    jsonLdObjects.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-labverse-jsonld', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [metadata, jsonLdObjects]);
}
