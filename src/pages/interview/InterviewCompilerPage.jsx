import { useState } from "react";
import Editor from "@monaco-editor/react";
import { runCode } from "../../services/interviewService";

const templates = {
  python: "print('Hello Skillfort')",
  javascript: "console.log('Hello Skillfort');",
  java: "public class Main { public static void main(String[] args){ System.out.println(\"Hello Skillfort\"); } }",
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ cout<<\"Hello Skillfort\"; }",
};

export default function InterviewCompilerPage() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(templates.python);
  const [output, setOutput] = useState("Run your code to see output");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const onRun = async () => {
    setLoading(true);
    try {
      const data = await runCode({ language, code, stdin: input });
      setOutput(`${data.status}:\n${data.stdout || data.stderr || "No output"}`);
    } catch {
      setOutput("Execution failed. Configure Judge0 keys in .env.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0F0F1A] text-white">
      <div className="container-wide py-8">
        <h1 className="font-heading text-4xl font-bold">Live Compiler</h1>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-white/10 bg-[#12122A] p-4">
            <div className="mb-3 flex gap-2">
              <select className="rounded-lg border border-white/20 bg-transparent px-3 py-2" value={language} onChange={(e) => { setLanguage(e.target.value); setCode(templates[e.target.value]); }}>
                {Object.keys(templates).map((k) => <option key={k} value={k} className="text-black">{k}</option>)}
              </select>
              <button className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold" onClick={onRun} disabled={loading}>{loading ? "Running your code..." : "Run Code"}</button>
            </div>
            <Editor
              height="480px"
              defaultLanguage="python"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              theme="vs-dark"
              onChange={(v) => setCode(v || "")}
              options={{ fontSize: 14, minimap: { enabled: false } }}
            />
          </section>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#12122A] p-4">
              <h2 className="font-semibold">Custom Input</h2>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} className="mt-3 h-28 w-full rounded-lg border border-white/20 bg-transparent p-2 font-code" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-black p-4 font-code text-emerald-300">
              <h2 className="mb-2 font-body font-semibold text-white">Output</h2>
              <pre className="whitespace-pre-wrap text-sm">{output}</pre>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
