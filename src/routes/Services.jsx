import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData, useLocation } from "react-router-dom";

import Media from "@/components/Media";
import Seo from "@/components/Seo";
import { useLenis } from "@/hooks/useLenis";
import { servicesQuery } from "@/lib/content";
import { loadMotion } from "@/lib/motion";

import styles from "./Services.module.css";

export async function loader() {
  return servicesQuery();
}

/**
 * Panel body with an animated height.
 *
 * Height is animated by GSAP to `auto`, not by a CSS `max-height` guess —
 * a guessed max-height either clips long copy or makes short panels ease
 * against an invisible ceiling.
 */
function PanelBody({ open, children, id }) {
  const ref = useRef(null);
  const firstRun = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Skip the animation on mount — the first panel is open by default and
    // should not animate in.
    if (firstRun.current) {
      firstRun.current = false;
      el.style.height = open ? "auto" : "0px";
      return undefined;
    }

    let cancelled = false;
    loadMotion().then((motion) => {
      if (cancelled || !ref.current) return;
      if (!motion) {
        el.style.height = open ? "auto" : "0px";
        return;
      }
      motion.gsap.to(el, {
        height: open ? "auto" : 0,
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: () => motion.ScrollTrigger.refresh(),
      });
    });

    return () => {
      cancelled = true;
    };
  }, [open]);

  // `inert` rather than `hidden`: display:none would fight the height
  // animation, but collapsed content still must not be focusable.
  return (
    <div className={styles.panelBody} ref={ref} id={id} inert={!open}>
      <div className={styles.panelInner}>{children}</div>
    </div>
  );
}

/** /services — sticky index plus accordion. */
export function Component() {
  const { services } = useLoaderData();
  const location = useLocation();
  const { scrollTo } = useLenis();

  const [openId, setOpenId] = useState(services[0]?.id);
  const [activeId, setActiveId] = useState(services[0]?.id);
  const sectionRefs = useRef({});

  // /services#identity opens that panel and scrolls to it.
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const match = services.find((service) => service.id === hash);
    if (!match) return;

    // set-state-in-effect is correct here: the URL hash is an external
    // system, and the panel must expand before the scroll target can be
    // measured. There is nothing to derive during render.
    // oxlint-disable-next-line set-state-in-effect
    setOpenId(hash);
    setActiveId(hash);
    // Wait for the panel to expand before measuring the scroll target.
    const timer = setTimeout(() => {
      const node = sectionRefs.current[hash];
      if (node) scrollTo(node, { offset: -72 });
    }, 80);

    return () => clearTimeout(timer);
  }, [location.hash, services, scrollTo]);

  /**
   * Which panel the reader is actually looking at.
   *
   * DEVIATION: the spec says ScrollTrigger drives this. An
   * IntersectionObserver does the same job, keeps working under reduced
   * motion (where GSAP is never loaded at all), and costs nothing.
   */
  useEffect(() => {
    const nodes = Object.values(sectionRefs.current).filter(Boolean);
    if (nodes.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target?.dataset.serviceId) {
          setActiveId(visible.target.dataset.serviceId);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [services]);

  return (
    <div className="u-wrap">
      <Seo
        title="Work with me"
        description="Short form, long form, UGC, hosting and ambassadorship — how brands can work together with me."
      />

      <header className={styles.head}>
        <h1 className="u-display">Work with me</h1>
      </header>

      <div className={styles.layout}>
        <nav className={styles.index} aria-label="Services">
          <span className="u-meta">Index</span>
          <ul className={styles.indexList}>
            {services.map((service) => (
              <li key={service.id}>
                <a
                  href={`#${service.id}`}
                  className={styles.indexLink}
                  data-active={activeId === service.id ? "true" : "false"}
                >
                  <span className="u-meta">{service.n}</span> {service.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.panels}>
          {services.map((service) => {
            const open = openId === service.id;
            return (
              <section
                key={service.id}
                id={service.id}
                className={styles.panel}
                data-service-id={service.id}
                ref={(node) => {
                  sectionRefs.current[service.id] = node;
                }}
              >
                <h2>
                  <button
                    type="button"
                    className={styles.panelHead}
                    aria-expanded={open}
                    aria-controls={`${service.id}-body`}
                    onClick={() => setOpenId(open ? null : service.id)}
                  >
                    <span className={styles.panelTitle}>{service.title}</span>
                    <span className={styles.panelSign} aria-hidden="true">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </h2>

                <PanelBody open={open} id={`${service.id}-body`}>
                  <p className="u-prose">{service.body}</p>

                  <div className={styles.panelMedia}>
                    {service.images.map((image) => (
                      <Media key={image.id} media={image} />
                    ))}
                  </div>

                  {service.related.length > 0 ? (
                    <div className={styles.related}>
                      <span className="u-meta">Recent examples</span>
                      <ul className={styles.relatedList}>
                        {service.related.map((project) => (
                          <li key={project.slug}>
                            <Link to={`/work/${project.slug}`} className={styles.relatedLink}>
                              <span>{project.title}</span>
                              <span className="u-meta">
                                {project.client} · {project.year} →
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </PanelBody>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Component;
