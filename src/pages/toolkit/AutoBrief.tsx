import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import ApiKeyBar from '../../components/toolkit/ApiKeyBar';
import CopyButton from '../../components/toolkit/CopyButton';
import { openaiService } from '../../services/openai';

interface CompanyBrief {
  company: {
    name: string;
    website?: string;
    industry: string;
    size: string;
    headquarters: string;
  };
  keyPeople: Array<{
    name: string;
    title: string;
    background?: string;
  }>;
  businessModel: {
    description: string;
    revenue: string;
    keyProducts: string[];
  };
  painPoints: string[];
  talkingPoints: string[];
  competitiveLandscape: string[];
  recentNews: string[];
}

const AutoBrief: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [briefData, setBriefData] = useState<CompanyBrief | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    if (apiKey) {
      openaiService.initialize(apiKey);
    }
  }, [apiKey]);

  const generateBrief = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!companyName.trim() || isLoading) return;

    if (!apiKey) {
      setError('Please provide your OpenAI API key above.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setBriefData(null);

    try {
      const briefResult = await openaiService.generateCompanyBrief(companyName);
      setBriefData(briefResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the brief.');
    } finally {
      setIsLoading(false);
    }
  }, [companyName, apiKey, isLoading]);

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
              AutoBrief AI - Account Research Automation
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Generate comprehensive company briefs and talking points for B2B sales teams in minutes.
            </p>
          </div>

          <ApiKeyBar onChange={setApiKey} />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <form onSubmit={generateBrief}>
              <div className="mb-4">
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    id="company-name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., 'Salesforce' or 'HubSpot'"
                    className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !companyName.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2 inline" />
                        Generating...
                      </>
                    ) : (
                      'Generate Brief'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-8">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          )}

          {isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Researching and compiling brief for <strong className="text-gray-800 dark:text-white">{companyName}</strong>...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment.</p>
            </div>
          )}

          {briefData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Company Brief: {briefData.company.name}
                </h2>
                <CopyButton text={JSON.stringify(briefData, null, 2)} label="Copy JSON" />
              </div>
              
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Company Overview</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p><strong>Industry:</strong> {briefData.company.industry}</p>
                    <p><strong>Size:</strong> {briefData.company.size}</p>
                    <p><strong>Headquarters:</strong> {briefData.company.headquarters}</p>
                    {briefData.company.website && (
                      <p><strong>Website:</strong> <a href={briefData.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">{briefData.company.website}</a></p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Key People</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {briefData.keyPeople.map((person, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <p><strong>{person.name}</strong> - {person.title}</p>
                        {person.background && <p className="text-sm text-gray-600 dark:text-gray-400">{person.background}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Strategic Talking Points</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <ul className="list-disc list-inside space-y-1">
                      {briefData.talkingPoints.map((point, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Identified Pain Points</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <ul className="list-disc list-inside space-y-1">
                      {briefData.painPoints.map((point, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Recent News & Updates</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <ul className="list-disc list-inside space-y-1">
                      {briefData.recentNews.map((news, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{news}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AutoBrief;