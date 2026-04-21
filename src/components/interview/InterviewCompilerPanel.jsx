import { useState } from "react";
import Editor from "@monaco-editor/react";
import { runCode } from "../../services/interviewService";

export default function InterviewCompilerPanel({ starterCode = "print('solve')", testCases = [] }) {
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState("");

  const onRun = async () => {
    try {
      const data = await runCode({ language: "python", code, stdin: "" });
      setResult(data.stdout || data.stderr || "Done");
    } catch {
      setResult("Compiler unavailable");
    }
  };

  return (
    <aside className="rounded-2xl border p-4 dark:border-white/10">
      <h2 className="font-semibold">Live Compiler</h2>
      <Editor height="300px" defaultLanguage="python" value={code} onChange={(v) => setCode(v || "")} theme="vs-dark" options={{ minimap: { enabled: false } }} />
      <button className="mt-3 rounded-lg bg-brand-primary px-4 py-2 text-slate-900" onClick={onRun}>Run</button>
      <pre className="mt-3 rounded-lg bg-black p-3 font-code text-emerald-300">{result}</pre>
      <div className="mt-3 space-y-1 text-xs">
        {testCases.map((t, i) => <p key={`${t.input}-${i}`}>#{i + 1} in: {t.input} out: {t.expected_output}</p>)}
      </div>
    </aside>
  );
}
