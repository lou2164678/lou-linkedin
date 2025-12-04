import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";

import ApiKeyBar from "../../components/toolkit/ApiKeyBar";
import CopyButton from "../../components/toolkit/CopyButton";
import DemoVideo from "../../components/toolkit/DemoVideo";
import { openRouterGeminiService } from "../../services/openrouterGemini";

type RunState = "idle" | "loading" | "streaming" | "completed" | "error";

interface Section {
  title: string;
  body: string;
}

const parseSections = (markdown: string): Section[] => {
  if (!markdown.trim()) {
    return [];
  }

  const lines = markdown.split(/\r?\n/);
  const sections: Section[] = [];
  let current: Section | null = null;

  lines.forEach((line) => {
    const headingMatch = line.match(/^##\s+(.*)$/);
    if (headingMatch) {
      if (current) {
        sections.push(current);
      }
      current = { title: headingMatch[1].trim(), body: "" };
    } else if (current) {
      current.body += `${line}\n`;
    }
  });

  if (current) {
    sections.push(current);
  }

  return sections;
};

const renderSectionBody = (body: string, _sectionTitle: string) => {
  const lines = body.trim().split(/\r?\n/);
  const elements: JSX.Element[] = [];
  let listBuffer: string[] = [];
  let tableBuffer: string[] = [];

  const flushList = () => {
    if (!listBuffer.length) return;

    const isKeyValueList = listBuffer.every((item) =>
      /^\*\*(.+?)\*\*\s*[:\-–]\s*/.test(item)
    );

    if (isKeyValueList) {
      elements.push(
        <dl
          className="grid gap-4 md:grid-cols-2"
          key={`kv-${elements.length}`}
        >
          {listBuffer.map((item, index) => {
            const match = item.match(/^\*\*(.+?)\*\*\s*[:\-–]\s*(.*)$/);
            const label = match ? match[1].trim() : item;
            const value = match ? match[2].trim() : "";
            return (
              <div
                key={index}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm"
              >
                <dt className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold mb-1">
                  {label}
                </dt>
                <dd className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  {value || "—"}
                </dd>
              </div>
            );
          })}
        </dl>
      );
    } else {
      elements.push(
        <ul
          className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
          key={`list-${elements.length}`}
        >
          {listBuffer.map((item, index) => (
            <li key={index} className="leading-relaxed">
              {formatInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
    }

    listBuffer = [];
  };

  const flushTable = () => {
    if (tableBuffer.length < 2) {
      tableBuffer = [];
      return;
    }

    const [headerLine, separatorLine, ...rows] = tableBuffer;
    if (!/^(\|\s*:?-+:?\s*)+\|$/.test(separatorLine.trim())) {
      tableBuffer = [];
      return;
    }

    const headers = headerLine
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    const parsedRows = rows
      .map((row) =>
        row
          .split("|")
          .slice(1, -1)
          .map((cell) => cell.trim())
      )
      .filter((cells) => cells.some((cell) => cell.length));

    if (!headers.length || !parsedRows.length) {
      tableBuffer = [];
      return;
    }

    elements.push(
      <div className="overflow-x-auto" key={`table-${elements.length}`}>
        <table className="min-w-full border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {parsedRows.map((cells, rowIndex) => (
              <tr
                key={rowIndex}
                className="align-top hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {headers.map((_, cellIndex) => {
                  const cell = cells[cellIndex] ?? "—";
                  return (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                    >
                      {formatInlineMarkdown(cell)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    tableBuffer = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      flushTable();
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      flushTable();
      elements.push(
        <h3
          key={`subheading-${elements.length}`}
          className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-2"
        >
          {trimmed.replace(/^###\s*/, "")}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      tableBuffer.push(trimmed);
      return;
    }

    flushTable();

    if (trimmed.startsWith("- ")) {
      listBuffer.push(trimmed.replace(/^-+\s*/, ""));
      return;
    }

    flushList();

    elements.push(
      <p
        key={`p-${elements.length}`}
        className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-3"
      >
        {formatInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();
  flushTable();

  return <div className="space-y-4">{elements}</div>;
};

const formatInlineMarkdown = (text: string): JSX.Element | string => {
  const replacements: { regex: RegExp; replace: string }[] = [
    { regex: /\*\*(.*?)\*\*/g, replace: "<strong>$1</strong>" },
    { regex: /\*(.*?)\*/g, replace: "<em>$1</em>" },
    { regex: /`([^`]+)`/g, replace: "<code>$1</code>" },
  ];

  let formatted = text;
  replacements.forEach(({ regex, replace }) => {
    formatted = formatted.replace(regex, replace);
  });

  if (formatted.includes("<strong>") || formatted.includes("<em>") || formatted.includes("<code>")) {
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  }

  return text;
};

const ProspectVetting = () => {
  const [apiKey, setApiKey] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [report, setReport] = useState("");
  const [state, setState] = useState<RunState>("idle");
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState(0);

  const controllerRef = useRef<AbortController | null>(null);
  const runIdRef = useRef(0);

  useEffect(() => {
    if (apiKey) {
      openRouterGeminiService.initialize(apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const sections = useMemo(() => parseSections(report), [report]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!companyName.trim()) {
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setReport("");
    setState("loading");
    setError("");
    setActiveSection(0);

    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    try {
      const stream = openRouterGeminiService.generateProspectReportStream(
        companyName.trim(),
        controller.signal
      );

      setState("streaming");

      for await (const chunk of stream) {
        if (runIdRef.current !== runId) {
          break;
        }
        setReport((prev) => prev + chunk);
      }

      if (runIdRef.current === runId) {
        setState("completed");
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        return;
      }
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to generate prospect report."
      );
      setState("error");
    }
  };

  const isGenerating = state === "loading" || state === "streaming";

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Projects
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Prospect Vetting Assistant
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Stream an actionable prospect research brief in real-time using Gemini on OpenRouter. Provide a company name and receive a structured, seller-ready report with sources.
            </p>
          </div>

          <ApiKeyBar storageKey="openrouter_api_key" onChange={setApiKey} />

          <DemoVideo
            videoSrc="/videos/VettingAssistant.mp4"
            title="See It In Action"
            description="Watch how to generate a prospect research brief in seconds"
          />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="company-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Company Name
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder='e.g., "Stripe"'
                  disabled={isGenerating}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={isGenerating || !companyName.trim()}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isGenerating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    "Generate Brief"
                  )}
                </button>

                {isGenerating && (
                  <button
                    type="button"
                    onClick={() => controllerRef.current?.abort()}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}

                {report && (
                  <CopyButton text={report} label="Copy Markdown" />
                )}
              </div>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
              <strong className="font-semibold">Error:</strong> {error}
            </div>
          )}

          {state === "idle" && !report && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300">
              Enter a company name to start streaming an actionable prospect briefing. The report will populate live with sections for positioning, pain points, buyer personas, and recommended plays.
            </div>
          )}

          {report && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Streamed Report
              </h2>

              {sections.length === 0 ? (
                <div className="text-gray-600 dark:text-gray-300">
                  {state === "streaming" ? "Preparing sections..." : "No structured sections detected."}
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((section, index) => {
                    const isOpen = activeSection === index;
                    return (
                      <div
                        key={section.title}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setActiveSection((prev) =>
                              prev === index ? -1 : index
                            )
                          }
                          className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-left text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <span className="font-semibold">{section.title}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-300">
                            {isOpen ? "Hide" : "Show"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-4 py-4 bg-white dark:bg-gray-800">
                            {renderSectionBody(section.body, section.title)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProspectVetting;
