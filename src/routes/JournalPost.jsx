import { Link, useLoaderData } from "react-router-dom";

import Blocks from "@/components/Blocks";
import Media from "@/components/Media";
import Seo from "@/components/Seo";
import { journalPostBySlug } from "@/lib/content";
import { longDate } from "@/lib/format";
import { articleJsonLd } from "@/lib/jsonld";

import styles from "./JournalPost.module.css";

export async function loader({ params }) {
  const post = await journalPostBySlug(params.slug);
  if (!post) {
    throw new Response("Post not found", { status: 404, statusText: "Not Found" });
  }
  return post;
}

/** /journal/:slug — the article. Measure is held at 62–68ch. */
export function Component() {
  const post = useLoaderData();

  return (
    <article className="u-wrap">
      <Seo title={post.title} description={post.excerpt} jsonLd={articleJsonLd(post)} />

      <header className={styles.head}>
        <Link to="/journal" className="u-meta">
          ← Journal
        </Link>
        <h1 className={styles.title}>{post.title}</h1>
        <p className="u-meta">
          {longDate(post.date)} · {post.readingMinutes} min · by {post.author}
        </p>
      </header>

      {post.cover ? (
        <div className={styles.cover}>
          <Media media={post.cover} priority />
        </div>
      ) : null}

      <div className={styles.body}>
        <Blocks blocks={post.blocks} />
      </div>

      <footer className={styles.foot}>
        {post.next ? (
          <Link to={`/journal/${post.next.slug}`} className={styles.next}>
            <span className="u-meta">Next entry</span>
            <span className={styles.nextTitle}>
              {post.next.title} <span aria-hidden="true">→</span>
            </span>
          </Link>
        ) : (
          <span className="u-meta">That is the last entry.</span>
        )}
      </footer>
    </article>
  );
}

export default Component;
