import { useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";

import Seo from "@/components/Seo";
import { getSiteSettings } from "@/lib/content";

import styles from "./Contact.module.css";

/** Phase 2, off by default — the site ships mailto-first. */
const FORM_ENABLED = import.meta.env.VITE_ENABLE_FORM === "true";
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? "";
const RATE_LIMIT_MS = 30_000;

export async function loader() {
  return getSiteSettings();
}

/** /contact */
export function Component() {
  const site = useLoaderData();

  return (
    <div className="u-wrap">
      <Seo title="Contact" description="New business, press and careers enquiries." />
      <header className={styles.head}>
        <h1 className="u-display">
          Contact
          <br />
          {site.name}
        </h1>
      </header>

      <div className={styles.layout}>
        <div className={styles.col}>
          <p className="u-prose">{site.contactIntro}</p>

          <ul className={styles.emails}>
            {site.emails.map((email) => (
              <li key={email.address}>
                <span className="u-meta">{email.label}</span>
                <a href={`mailto:${email.address}`} className={styles.email}>
                  {email.address}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <div className={styles.meta}>
            <div>
              <span className="u-meta">Offices</span>
              <ul className={styles.offices}>
                {site.offices.map((office) => (
                  <li key={office.city}>
                    <strong>{office.city}</strong>
                    <span className={styles.address}>{office.address}</span>
                    <span className="u-meta">{office.tz}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="u-meta">Follow</span>
              <div className={styles.socials}>
                {site.socials.map((social) => (
                  <a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-tag"
                  >
                    {social.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>

          {FORM_ENABLED ? <InquiryForm fallbackAddress={site.emails[0].address} /> : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Phase-2 inquiry form.
 *
 * States: idle → submitting → success | error, announced via aria-live.
 * Protected by a honeypot field and a 30s client-side rate limit. No captcha,
 * deliberately.
 *
 * With no VITE_FORM_ENDPOINT configured it composes a mailto instead of
 * pretending to send — the message still reaches the creator.
 */
function InquiryForm({ fallbackAddress }) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const lastSubmit = useRef(0);

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot — real people never fill this in.
    if (data.get("company")) {
      setState("success");
      setMessage("Thanks — we'll be in touch.");
      return;
    }

    const now = Date.now();
    if (now - lastSubmit.current < RATE_LIMIT_MS) {
      setState("error");
      setMessage("Just a moment — try again in half a minute.");
      return;
    }

    setState("submitting");

    if (!FORM_ENDPOINT) {
      // No endpoint wired up: hand off to the mail client rather than
      // silently dropping the message.
      const subject = encodeURIComponent(`Enquiry from ${data.get("name")}`);
      const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("email")}`);
      window.location.href = `mailto:${fallbackAddress}?subject=${subject}&body=${body}`;
      setState("success");
      setMessage("Opening your mail client…");
      return;
    }

    try {
      const response = await fetch(FORM_ENDPOINT, { method: "POST", body: data });
      if (!response.ok) throw new Error(String(response.status));
      lastSubmit.current = now;
      form.reset();
      setState("success");
      setMessage("Thanks — we'll be in touch.");
    } catch {
      setState("error");
      setMessage(`Something went wrong. Email us directly at ${fallbackAddress}.`);
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
      <span className="u-meta">Or send a note</span>

      <label className={styles.field}>
        <span className="u-sr">Your name</span>
        <input name="name" type="text" placeholder="Name" required autoComplete="name" />
      </label>

      <label className={styles.field}>
        <span className="u-sr">Your email</span>
        <input name="email" type="email" placeholder="Email" required autoComplete="email" />
      </label>

      <label className={styles.field}>
        <span className="u-sr">Your message</span>
        <textarea name="message" rows={4} placeholder="What are you making?" required />
      </label>

      {/* Honeypot. Hidden from sight and from assistive tech. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.formFoot}>
        <button type="submit" className="u-tag" disabled={state === "submitting"}>
          {state === "submitting" ? "Sending…" : "Send"}
        </button>
        <p className="u-meta" role="status" aria-live="polite">
          {message}
        </p>
      </div>
    </form>
  );
}

export default Component;
