import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaCalculator, FaSpinner } from 'react-icons/fa';
import TwoPane from '../../components/toolkit/TwoPane';
import CopyButton from '../../components/toolkit/CopyButton';
import ApiKeyBar from '../../components/toolkit/ApiKeyBar';
import { openaiService } from '../../services/openai';

interface AccountRow {
  name: string;
  url?: string;
  industry?: string;
  employees?: number;
  region?: string;
}

interface ScoredAccount extends AccountRow {
  score: number;
  reasoning: string;
  firstPlay: string;
}

interface ScoringResult {
  accounts: ScoredAccount[];
  summary: {
    total: number;
    highPriority: number;
    averageScore: number;
  };
}

const ICPScorer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<AccountRow[]>([]);
  const [scored, setScored] = useState<ScoringResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (apiKey) {
      openaiService.initialize(apiKey);
    }
  }, [apiKey]);

  const parseCSV = (text: string): AccountRow[] => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const row: any = {};
      headers.forEach((header, i) => {
        const value = (values[i] ?? '').trim();
        if (header === 'employees' && value) {
          row[header] = parseInt(value) || undefined;
        } else if (value) {
          row[header] = value;
        }
      });
      return row;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setScored(null);
    setError('');
    
    if (selectedFile) {
      try {
        const text = await selectedFile.text();
        const parsedRows = parseCSV(text);
        setRows(parsedRows);
      } catch (err) {
        setError('Failed to parse CSV file');
        setRows([]);
      }
    } else {
      setRows([]);
    }
  };

  const scoreAccounts = async () => {
    if (!apiKey) {
      setError('Please provide your OpenAI API key above.');
      return;
    }

    setLoading(true);
    setError('');
    setScored(null);
    
    try {
      const result = await openaiService.scoreAccounts(rows);
      setScored(result);
    } catch (e: any) {
      setError(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    const sampleData: AccountRow[] = [
      { name: 'TechCorp Inc', industry: 'Technology', employees: 5000, region: 'North America' },
      { name: 'Global Manufacturing', industry: 'Manufacturing', employees: 2500, region: 'Europe' },
      { name: 'StartupXYZ', industry: 'Technology', employees: 150, region: 'North America' },
      { name: 'Enterprise Solutions Ltd', industry: 'Professional Services', employees: 8000, region: 'North America' }
    ];
    
    setRows(sampleData);
    setScored(null);
    setError('');
  };

  const leftPane = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FaUpload className="inline mr-2" />
          Upload CSV File
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
        />
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {file ? file.name : 'No file selected'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Expected columns: name, industry, employees, region, url
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={scoreAccounts}
          disabled={!rows.length || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2 inline" />
              Scoring...
            </>
          ) : (
            <>
              <FaCalculator className="mr-2 inline" />
              Score Accounts
            </>
          )}
        </button>
        <button
          onClick={loadSample}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
        >
          Load Sample
        </button>
      </div>

      {rows.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Preview ({rows.length} accounts)
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-48 overflow-auto">
            <div className="space-y-2">
              {rows.slice(0, 5).map((row, i) => (
                <div key={i} className="text-xs text-gray-700 dark:text-gray-300">
                  <div className="font-medium">{row.name}</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {row.industry} • {row.employees} employees • {row.region}
                  </div>
                </div>
              ))}
              {rows.length > 5 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ...and {rows.length - 5} more accounts
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const rightPane = (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!scored && !error && (
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Upload a CSV file with account data and click "Score Accounts" to see prioritized results.
        </p>
      )}

      {scored && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Scoring Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-blue-600 dark:text-blue-400 font-medium">{scored.summary.total}</div>
                <div className="text-blue-700 dark:text-blue-300">Total Accounts</div>
              </div>
              <div>
                <div className="text-blue-600 dark:text-blue-400 font-medium">{scored.summary.highPriority}</div>
                <div className="text-blue-700 dark:text-blue-300">High Priority (&gt;75)</div>
              </div>
              <div>
                <div className="text-blue-600 dark:text-blue-400 font-medium">{scored.summary.averageScore}</div>
                <div className="text-blue-700 dark:text-blue-300">Average Score</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 dark:text-white">Prioritized Accounts</h3>
              <CopyButton text={JSON.stringify(scored, null, 2)} label="Export Results" />
            </div>
            
            <div className="space-y-3 max-h-96 overflow-auto">
              {scored.accounts.map((account, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border-l-4 border-l-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800 dark:text-white">{account.name}</h4>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      account.score > 75 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      account.score > 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                    }`}>
                      Score: {account.score}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {account.industry} • {account.employees} employees • {account.region}
                  </div>
                  
                  <div className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Reasoning:</strong> {account.reasoning}
                  </div>
                  
                  <div className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>First Play:</strong> {account.firstPlay}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
              ICP Scorer - Ideal Customer Profile Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Upload account data and get AI-powered scoring to prioritize your highest-value prospects.
            </p>
          </div>

          <ApiKeyBar onChange={setApiKey} />

          <TwoPane left={leftPane} right={rightPane} />
        </motion.div>
      </div>
    </div>
  );
};

export default ICPScorer;