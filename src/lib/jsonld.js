import { site } from "@/content/site";

/** JSON-LD Organization, used on the home route. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.defaultSeo.description,
    foundingDate: String(site.founded),
    email: site.emails[0]?.address,
    sameAs: site.socials.map((social) => social.url),
    address: site.offices.map((office) => ({
      "@type": "PostalAddress",
      addressLocality: office.city,
    })),
  };
}

/** JSON-LD Article, used on a journal post. */
export function articleJsonLd(post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: site.name },
  };
}
