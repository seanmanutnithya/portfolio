import { site } from "@/content/site";

/**
 * Document metadata.
 *
 * Uses React 19's native hoisting — `<title>`, `<meta>` and `<link>` rendered
 * anywhere in the tree are moved into `<head>`, so no Helmet dependency.
 *
 * @param {object} props
 * @param {string} [props.title] Page title; the site name is appended.
 * @param {string} [props.description]
 * @param {object} [props.jsonLd] Serialised into a JSON-LD script tag.
 */
export function Seo({ title, description, image, jsonLd, noIndex = false }) {
  const fullTitle = title ? `${title} — ${site.name}` : site.defaultSeo.title;
  const desc = description ?? site.defaultSeo.description;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      {image ? <meta property="og:image" content={image} /> : null}
      {noIndex ? <meta name="robots" content="noindex" /> : null}
      {jsonLd ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- JSON.stringify output, no user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
    </>
  );
}

export default Seo;
