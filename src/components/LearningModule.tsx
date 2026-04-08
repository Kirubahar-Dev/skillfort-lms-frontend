import type { TechTrack } from "../data/questionBank";

type LearningModuleProps = {
  track: TechTrack;
};

export function LearningModule({ track }: LearningModuleProps) {
  return (
    <section className="learning-module" aria-live="polite">
      <header className="module-header">
        <p className="module-kicker">{track.category}</p>
        <h2>{track.title} Question Bank</h2>
        <p>{track.description}</p>
        <div className="concept-pill">{track.conceptNote}</div>
      </header>

      <div className="module-columns">
        <article className="theory-column">
          <h3>Theory Track</h3>
          {track.theory.map((section, index) => (
            <details key={section.title} open={index === 0} className="theory-block">
              <summary>{section.title}</summary>
              <ol>
                {section.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
            </details>
          ))}
        </article>

        <article className="coding-column">
          <h3>Coding Track</h3>
          <ol className="coding-list">
            {track.coding.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}
