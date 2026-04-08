import type { PlaygroundLanguage } from "../data/questionBank";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export type PlaygroundRunRequest = {
  language: Exclude<PlaygroundLanguage, "html">;
  code: string;
  stdin?: string;
};

export type PlaygroundRunResponse = {
  stdout: string;
  stderr: string;
  compile_output: string;
  exit_code: number;
  runtime: string;
  elapsed_ms: number;
};

export async function runPlaygroundCode(payload: PlaygroundRunRequest): Promise<PlaygroundRunResponse> {
  const response = await fetch(`${API_BASE_URL}/learning/playground/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to run code");
  }

  return (await response.json()) as PlaygroundRunResponse;
}
