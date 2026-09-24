import { useState } from "react";
import { useLoaderData } from "react-router-dom";

import MediaScroller from "@/components/MediaScroller";
import RosterList, { MediaSlot } from "@/components/RosterList";
import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";
import { aboutQuery } from "@/lib/content";

import styles from "./About.module.css";

export async function loader() {
  return aboutQuery();
}

/** /about — bio, headline numbers, behind the scenes, offering, brands. */
export function Component() {
  const data = useLoaderData();
  const [activeSkill, setActiveSkill] = useState(null);

  return (
    <div className="u-wrap">
      <Seo title="Info" description={data.body[0]} />

      <header className={styles.head}>
        <h1 className="u-display">{data.headline}</h1>
      </header>

      <section className={styles.manifesto}>
        <div className="u-prose">
          {data.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
        <dl className={styles.facts}>
          {data.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="u-meta">{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="studio">
        <div className="u-band">
          <h2 id="studio" className="u-meta">
            Behind the scenes
          </h2>
          <span className="u-meta">Drag →</span>
        </div>
        <div className={styles.scroller}>
          <MediaScroller items={data.studioImages} label="Behind the scenes" />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="people">
        <div className="u-band">
          <h2 id="people" className="u-meta">
            What I offer
          </h2>
          <span className="u-meta">{data.skills.length} formats</span>
        </div>

        <div className={styles.peopleLayout}>
          <RosterList
            items={data.skills}
            activeId={activeSkill?._id}
            onActive={setActiveSkill}
          />
          {/* Fixed slot, bottom right. Never reflows the list. */}
          <div className={styles.slotWrap}>
            <MediaSlot item={activeSkill} idleLabel="Hover a format" />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="clients">
        <div className="u-band">
          <h2 id="clients" className="u-meta">
            Brands I have worked with
          </h2>
        </div>
        {/* Open decision in the wireframe: logo wall vs. set list. Shipping
            the set list — it needs no asset pipeline and no logo permissions. */}
        <Reveal as="ul" className={styles.clients} selector="li" stagger={0.02}>
          {data.clients.map((client) => (
            <li key={client} className={styles.client}>
              {client}
            </li>
          ))}
        </Reveal>
      </section>
    </div>
  );
}

export default Component;
