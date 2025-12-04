import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaQuestion, FaSpinner } from 'react-icons/fa';
import TwoPane from '../../components/toolkit/TwoPane';
import CopyButton from '../../components/toolkit/CopyButton';
import ApiKeyBar from '../../components/toolkit/ApiKeyBar';
import DemoVideo from '../../components/toolkit/DemoVideo';
import { openaiService } from '../../services/openai';

interface ObjectionResponse {
  answer: {
    bullets: string[];
    caveat?: string;
    talkTrack: string;
  };
  citations: {
    title: string;
    page?: number;
  }[];
  context: {
    title: string;
    page?: number;
    excerpt: string;
  }[];
}

const Objections: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [question, setQuestion] = useState('Why is this more expensive than Competitor X?');
  const [indexing, setIndexing] = useState(false);
  const [asking, setAsking] = useState(false);
  const [indexResult, setIndexResult] = useState<any>(null);
  const [askResult, setAskResult] = useState<ObjectionResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [docs, setDocs] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    if (apiKey) {
      openaiService.initialize(apiKey);
    }
  }, [apiKey]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files || []));
  };

  const indexDocs = async () => {
    if (!apiKey) {
      setError('Please provide your OpenAI API key above.');
      return;
    }

    setIndexing(true);
    setError('');
    setIndexResult(null);

    try {
      // Simulate indexing process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockIndexResult = {
        indexed: files.length,
        status: 'success'
      };

      const mockDocs = files.map((file, index) => ({
        id: `doc_${index}`,
        title: file.name
      }));

      setIndexResult(mockIndexResult);
      setDocs(mockDocs);
    } catch (e: any) {
      setError(e?.message || 'Network error');
    } finally {
      setIndexing(false);
    }
  };

  const askQuestion = async () => {
    if (!apiKey) {
      setError('Please provide your OpenAI API key above.');
      return;
    }

    setAsking(true);
    setError('');
    setAskResult(null);

    try {
      const documents = docs.map(doc => `Document: ${doc.title}`);
      const response = await openaiService.answerObjection(question, documents);
      setAskResult(response);
    } catch (e: any) {
      setError(e?.message || 'Network error');
    } finally {
      setAsking(false);
    }
  };

  const loadSample = async () => {
    setIndexResult(null);
    setAskResult(null);
    setError('');

    // Simulate loading sample documents
    const sampleDocs = [
      { id: 'sample_1', title: 'Product Pricing Guide.pdf' },
      { id: 'sample_2', title: 'Competitive Positioning.pdf' },
      { id: 'sample_3', title: 'ROI Case Studies.pdf' }
    ];

    setDocs(sampleDocs);
    setIndexResult({ indexed: 3, status: 'success' });
  };

  const leftPane = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FaUpload className="inline mr-2" />
          Upload Notes / PDFs
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          type="file"
          multiple
          accept=".pdf,.txt,.md"
          onChange={handleFileSelect}
        />
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {files.length ? `${files.length} file(s) selected` : 'No files selected'}
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={indexDocs}
            disabled={indexing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
          >
            {indexing ? (
              <>
                <FaSpinner className="animate-spin mr-2 inline" />
                Indexing...
              </>
            ) : (
              'Index to KB'
            )}
          </button>
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
          >
            Load Sample
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FaQuestion className="inline mr-2" />
          Ask an Objection
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter a common sales objection..."
        />
        <button
          onClick={askQuestion}
          disabled={asking}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
        >
          {asking ? (
            <>
              <FaSpinner className="animate-spin mr-2 inline" />
              Asking...
            </>
          ) : (
            'Ask Question'
          )}
        </button>
      </div>
    </div>
  );

  const rightPane = (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Knowledge Base</h3>
        {docs.length ? (
          <ul className="space-y-1">
            {docs.map(doc => (
              <li key={doc.id} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                📄 {doc.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-sm">No documents indexed yet.</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Answer</h3>
        {askResult ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Key Points:</h4>
              <ul className="list-disc list-inside space-y-1">
                {askResult.answer.bullets.map((bullet, i) => (
                  <li key={i} className="text-sm text-green-700 dark:text-green-300">{bullet}</li>
                ))}
              </ul>

              {askResult.answer.caveat && (
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                  <p className="text-xs text-green-600 dark:text-green-400">
                    <strong>Note:</strong> {askResult.answer.caveat}
                  </p>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                <h5 className="font-medium text-green-800 dark:text-green-300 mb-1">Talk Track:</h5>
                <p className="text-sm text-green-700 dark:text-green-300 italic">
                  "{askResult.answer.talkTrack}"
                </p>
              </div>
            </div>

            {askResult.citations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">Citations:</h4>
                <ul className="space-y-1">
                  {askResult.citations.map((citation, i) => (
                    <li key={i} className="text-xs text-gray-600 dark:text-gray-400">
                      📎 {citation.title}{citation.page ? ` (p.${citation.page})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <CopyButton text={JSON.stringify(askResult, null, 2)} label="Copy Response" />
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-sm">Ask a question to see AI-powered response with citations.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
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
              Objection Knowledge Base - AI-Powered Sales Support
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Upload sales documents and get AI-powered responses to customer objections with citations.
            </p>
          </div>

          <ApiKeyBar onChange={setApiKey} />

          <DemoVideo
            videoSrc="/videos/objections.mp4"
            title="See It In Action"
            description="Watch how to get AI-powered responses to customer objections"
          />

          <TwoPane left={leftPane} right={rightPane} />
        </motion.div>
      </div>
    </div>
  );
};

export default Objections;