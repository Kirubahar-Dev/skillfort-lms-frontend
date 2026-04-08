import { useEffect, useMemo, useState } from "react";

import type { PlaygroundLanguage, TechTrack } from "../data/questionBank";
import { runPlaygroundCode, type PlaygroundRunResponse } from "../lib/learningApi";

type RunnerLanguage = Exclude<PlaygroundLanguage, "html">;

type PlaygroundPanelProps = {
  track: TechTrack;
};

const defaultHtmlCss = `body {\n  font-family: 'Poppins', sans-serif;\n  margin: 0;\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  background: linear-gradient(135deg, #101828, #1c2436);\n  color: #f8fafc;\n}\n.hero {\n  text-align: center;\n}\nh1 {\n  font-family: 'Montserrat', sans-serif;\n  margin-bottom: 0.25rem;\n}`;

const defaultHtmlJs = `const heading = document.querySelector('h1');\nif (heading) heading.style.letterSpacing = '0.04em';`;

const languageSnippets: Record<RunnerLanguage, string> = {
  python: `print("SkillFort Python Lab")`,
  javascript: `console.log("SkillFort JavaScript Lab");`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("SkillFort Java Lab");\n  }\n}`,
  sql: `SELECT 'SkillFort SQL Lab' AS message;`,
  bash: `echo "SkillFort Bash Lab"`,
};

const initialOutput: PlaygroundRunResponse = {
  stdout: "",
  stderr: "",
  compile_output: "",
  exit_code: 0,
  runtime: "",
  elapsed_ms: 0,
};

function toRunnerLanguage(language: PlaygroundLanguage): RunnerLanguage | null {
  if (language === "html") {
    return null;
  }
  return language;
}

function buildPreviewDocument(html: string, css: string, js: string): string {
  return `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
}

export function PlaygroundPanel({ track }: PlaygroundPanelProps) {
  const [language, setLanguage] = useState<PlaygroundLanguage>(track.playgroundLanguage);
  const [code, setCode] = useState(track.starterCode);
  const [stdin, setStdin] = useState("");
  const [htmlCode, setHtmlCode] = useState(track.playgroundLanguage === "html" ? track.starterCode : "");
  const [cssCode, setCssCode] = useState(defaultHtmlCss);
  const [jsCode, setJsCode] = useState(defaultHtmlJs);
  const [output, setOutput] = useState<PlaygroundRunResponse>(initialOutput);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLanguage(track.playgroundLanguage);
    setCode(track.starterCode);
    setStdin("");
    setError(null);
    setOutput(initialOutput);
    if (track.playgroundLanguage === "html") {
      setHtmlCode(track.starterCode);
      setCssCode(defaultHtmlCss);
      setJsCode(defaultHtmlJs);
    }
  }, [track]);

  useEffect(() => {
    if (language === "html") {
      return;
    }

    const runnerLanguage = toRunnerLanguage(language);
    if (!runnerLanguage) {
      return;
    }

    const nextCode = language === track.playgroundLanguage ? track.starterCode : languageSnippets[runnerLanguage];
    setCode(nextCode);
    setStdin("");
  }, [language, track.playgroundLanguage, track.starterCode]);

  const previewDocument = useMemo(() => buildPreviewDocument(htmlCode, cssCode, jsCode), [htmlCode, cssCode, jsCode]);

  async function runCode() {
    setError(null);

    if (language === "html") {
      setOutput({
        stdout: "Preview rendered in-browser.",
        stderr: "",
        compile_output: "",
        exit_code: 0,
        runtime: "live-preview",
        elapsed_ms: 0,
      });
      return;
    }

    const runnerLanguage = toRunnerLanguage(language);
    if (!runnerLanguage) {
      return;
    }

    setRunning(true);
    try {
      const result = await runPlaygroundCode({ language: runnerLanguage, code, stdin });
      setOutput(result);
    } catch (runError) {
      const message = runError instanceof Error ? runError.message : "Unable to run code.";
      setError(message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <aside className="playground-panel" aria-label="Online compiler">
      <div className="playground-header">
        <h3>Try It Workspace</h3>
        <p>Online compiler built in. Use this panel to test snippets while learning.</p>
      </div>

      <div className="language-strip">
        {["python", "javascript", "java", "sql", "bash", "html"].map((item) => {
          const option = item as PlaygroundLanguage;
          const active = option === language;
          return (
            <button
              key={option}
              type="button"
              className={active ? "lang-btn active" : "lang-btn"}
              onClick={() => setLanguage(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {language === "html" ? (
        <div className="html-lab">
          <label>
            HTML
            <textarea value={htmlCode} onChange={(event) => setHtmlCode(event.target.value)} rows={8} />
          </label>
          <label>
            CSS
            <textarea value={cssCode} onChange={(event) => setCssCode(event.target.value)} rows={7} />
          </label>
          <label>
            JavaScript
            <textarea value={jsCode} onChange={(event) => setJsCode(event.target.value)} rows={6} />
          </label>
          <iframe className="preview-frame" title="HTML preview" srcDoc={previewDocument} sandbox="allow-scripts" />
        </div>
      ) : (
        <div className="runner-lab">
          <label>
            Code editor
            <textarea value={code} onChange={(event) => setCode(event.target.value)} rows={15} />
          </label>
          <label>
            Standard input
            <textarea value={stdin} onChange={(event) => setStdin(event.target.value)} rows={3} />
          </label>
        </div>
      )}

      <div className="run-row">
        <button type="button" className="run-btn" onClick={runCode} disabled={running}>
          {running ? "Running..." : "Run code"}
        </button>
        <span className="runtime-chip">Language: {language}</span>
      </div>

      {error ? <p className="error-line">{error}</p> : null}

      <div className="output-panel">
        <h4>Output</h4>
        {output.runtime ? (
          <p className="output-meta">
            Runtime: {output.runtime} | Exit: {output.exit_code} | Time: {output.elapsed_ms} ms
          </p>
        ) : null}
        {output.stdout ? <pre>{output.stdout}</pre> : null}
        {output.stderr ? <pre className="stderr">{output.stderr}</pre> : null}
        {output.compile_output ? <pre className="stderr">{output.compile_output}</pre> : null}
        {!output.stdout && !output.stderr && !output.compile_output ? (
          <p className="output-empty">Run a snippet to view results here.</p>
        ) : null}
      </div>
    </aside>
  );
}
