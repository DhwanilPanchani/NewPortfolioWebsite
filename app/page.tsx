import OS from './os/OS';
import { profile, featured, secondary, archive, experience, education } from '@/data/portfolio';

export default function Home() {
  return (
    <>
      <OS />
      {/* Plain-text edition of the whole site for crawlers and screen readers. */}
      <main className="sr-only">
        <h1>
          {profile.name} — {profile.role}
        </h1>
        <p>{profile.headline}</p>
        <p>{profile.summary}</p>
        <h2>Flagship projects</h2>
        {featured.map((p) => (
          <article key={p.id}>
            <h3>
              {p.name}: {p.kicker}
            </h3>
            <p>{p.tagline}</p>
            <p>{p.build}</p>
            <ul>
              {p.metrics.map((m) => (
                <li key={m.label}>
                  {m.value} {m.label}
                </li>
              ))}
            </ul>
            {p.github && <a href={p.github}>Source code for {p.name}</a>}
          </article>
        ))}
        <h2>More projects</h2>
        <ul>
          {[...secondary, ...archive].map((p) => (
            <li key={p.id}>
              {p.github ? <a href={p.github}>{p.name}</a> : p.name}: {p.blurb} ({p.metric})
            </li>
          ))}
        </ul>
        <h2>Experience</h2>
        {experience.map((r) => (
          <article key={r.id}>
            <h3>
              {r.title}, {r.company} ({r.start} – {r.end})
            </h3>
            <ul>
              {r.bullets.map((b) => (
                <li key={b.text}>
                  {b.label ? `${b.label}: ` : ''}
                  {b.text}
                </li>
              ))}
            </ul>
          </article>
        ))}
        <h2>Education</h2>
        <ul>
          {education.map((e) => (
            <li key={e.id}>
              {e.degree}, {e.school} ({e.start} – {e.end})
            </li>
          ))}
        </ul>
        <p>
          Contact: <a href={`mailto:${profile.email}`}>{profile.email}</a> · <a href={profile.links.github}>GitHub</a> ·{' '}
          <a href={profile.links.linkedin}>LinkedIn</a>
        </p>
      </main>
    </>
  );
}
