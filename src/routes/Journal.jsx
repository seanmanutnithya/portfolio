import { Link, useLoaderData } from "react-router-dom";

import Media from "@/components/Media";
import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";
import { journalQuery } from "@/lib/content";
import { longDate } from "@/lib/format";

import styles from "./Journal.module.css";

export async function loader() {
  return journalQuery();
}

/** /journal — the index. Drafts are filtered out in production. */
export function Component() {
  const { posts } = useLoaderData();

  return (
    <div className="u-wrap">
      <Seo title="Journal" description="Notes on making TikToks, working with brands and the numbers behind both." />

      <header className={styles.head}>
        <h1 className="u-display">Journal</h1>
        <p className={`${styles.count} u-meta`}>
          {posts.length} {posts.length === 1 ? "entry" : "entries"}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className={styles.empty}>Nothing published yet.</p>
      ) : (
        <Reveal as="ul" className={styles.list} selector="li" stagger={0.06}>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/journal/${post.slug}`} className={styles.card}>
                {post.cover ? <Media media={post.cover} /> : null}
                <span className="u-meta">
                  {longDate(post.date)} · {post.category}
                </span>
                <h2 className={styles.title}>{post.title}</h2>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <span className="u-meta">
                  {post.readingMinutes} min read <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      )}
    </div>
  );
}

export default Component;
