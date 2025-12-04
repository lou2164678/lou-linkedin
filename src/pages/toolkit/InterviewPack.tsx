import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";

import ApiKeyBar from "../../components/toolkit/ApiKeyBar";
import CopyButton from "../../components/toolkit/CopyButton";
import DemoVideo from "../../components/toolkit/DemoVideo";
import { openRouterInterviewPackService, type InterviewPack } from "../../services/openrouterInterviewPack";

type Tab = "report" | "json";

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-semibold">
      {title}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const KVList = ({ items }: { items: string[] }) => {
  const parsed = items.map((line) => {
    const m = line.match(/^\*\*(.+?)\*\*\s*[:\-–]\s*(.*)$/);
    return m ? { label: m[1], value: m[2] } : { label: "", value: line };
  });
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {parsed.map((it, i) => (
        <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
          {it.label ? (
            <>
              <div className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold mb-1">{it.label}</div>
              <div className="text-sm text-gray-700 dark:text-gray-200">{it.value || "—"}</div>
            </>
          ) : (
            <div className="text-sm text-gray-700 dark:text-gray-200">{it.value}</div>
          )}
        </div>
      ))}
    </div>
  );
};

const SmartList = ({ list }: { list: unknown[] }) => (
  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
    {list.map((v, i) => (
      <li key={i}>{typeof v === "string" ? v : JSON.stringify(v)}</li>
    ))}
  </ul>
);

const SmartTable = ({ rows }: { rows: Record<string, unknown>[] }) => {
  const headers = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => Object.keys(r).forEach((k) => set.add(k)));
    return Array.from(set);
  }, [rows]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wide">
                {h.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              {headers.map((h) => (
                <td key={h} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {formatCell(r[h])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function formatCell(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.join("; ");
  return JSON.stringify(v);
}

const InterviewPackPage = () => {
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InterviewPack | null>(null);
  const [tab, setTab] = useState<Tab>("report");

  useEffect(() => {
    if (apiKey) openRouterInterviewPackService.initialize(apiKey);
  }, [apiKey]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const pack = await openRouterInterviewPackService.generateInterviewPack(query);
      setResult(pack);
      setTab("report");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate interview pack.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link to="/projects" className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            <FaArrowLeft className="mr-2" /> Back to Projects
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">AI Interview Pack Generator</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Generate a structured interview preparation pack as strict JSON with a clean visual report. Powered by Gemini via OpenRouter.
            </p>
          </div>

          <ApiKeyBar storageKey="openrouter_api_key" onChange={setApiKey} />

          <DemoVideo
            videoSrc="/videos/Interview.mp4"
            title="See It In Action"
            description="Watch how to generate an interview preparation pack"
          />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role / Context
                </label>
                <textarea
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='e.g., "Senior Product Manager at Stripe for their Connect product"'
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </button>
                {result && <CopyButton text={JSON.stringify(result, null, 2)} label="Copy JSON" />}
              </div>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
              <strong className="font-semibold">Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${tab === "report" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  onClick={() => setTab("report")}
                >
                  Visual Report
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${tab === "json" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  onClick={() => setTab("json")}
                >
                  Raw JSON
                </button>
              </div>

              {tab === "json" && (
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}

              {tab === "report" && (
                <div className="space-y-6">
                  {result.executive_summary && (
                    <SectionCard title="Executive Summary">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.executive_summary as string}</p>
                    </SectionCard>
                  )}

                  {Array.isArray(result.quick_facts) && result.quick_facts.length > 0 && (
                    <SectionCard title="Quick Facts">
                      <KVList items={result.quick_facts as string[]} />
                    </SectionCard>
                  )}

                  {result.company_summary && (
                    <SectionCard title="Company Summary">
                      <SmartObject value={result.company_summary as Record<string, unknown>} />
                    </SectionCard>
                  )}

                  {result.product_area && (
                    <SectionCard title="Product Area">
                      <SmartObject value={result.product_area as Record<string, unknown>} />
                    </SectionCard>
                  )}

                  {result.interview_plan && (
                    <SectionCard title="Interview Plan">
                      <SmartObject value={result.interview_plan as Record<string, unknown>} />
                    </SectionCard>
                  )}

                  {result.pre_work && (
                    <SectionCard title="Pre-work">
                      <SmartObject value={result.pre_work as Record<string, unknown>} />
                    </SectionCard>
                  )}

                  {Array.isArray(result.sources) && result.sources.length > 0 && (
                    <SectionCard title="Sources">
                      <SmartTable rows={result.sources as Record<string, unknown>[]} />
                    </SectionCard>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const SmartObject = ({ value }: { value: Record<string, unknown> }) => {
  const entries = Object.entries(value);
  return (
    <div className="space-y-4">
      {entries.map(([key, val]) => (
        <div key={key}>
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">{key.replace(/_/g, " ")}</div>
          {renderValue(val)}
        </div>
      ))}
    </div>
  );
};

function renderValue(val: unknown): JSX.Element {
  if (val == null) return <span className="text-gray-500">—</span>;
  if (typeof val === "string") return <p className="text-gray-700 dark:text-gray-300">{val}</p>;
  if (Array.isArray(val)) {
    if (val.length && typeof val[0] === "object" && !Array.isArray(val[0])) {
      return <SmartTable rows={val as Record<string, unknown>[]} />;
    }
    return <SmartList list={val} />;
  }
  if (typeof val === "object") return <SmartObject value={val as Record<string, unknown>} />;
  return <span className="text-gray-700 dark:text-gray-300">{String(val)}</span>;
}

export default InterviewPackPage;

