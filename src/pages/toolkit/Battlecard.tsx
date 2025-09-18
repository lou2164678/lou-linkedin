import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import TwoPane from '../../components/toolkit/TwoPane';
import CopyButton from '../../components/toolkit/CopyButton';
import ApiKeyBar from '../../components/toolkit/ApiKeyBar';
import { openaiService } from '../../services/openai';

interface Competitor {
  id: string;
  sourceType: 'url' | 'text' | 'file';
  title?: string;
  raw: string;
}

interface BattlecardResult {
  competitivePositioning: {
    ourStrengths: string[];
    competitorWeaknesses: string[];
    differentiators: string[];
  };
  objectionHandling: Array<{
    objection: string;
    response: string;
    evidence: string;
  }>;
  talkTracks: {
    [persona: string]: string[];
  };
  featureComparison: Array<{
    feature: string;
    us: string;
    competitors: { [name: string]: string };
  }>;
}

const Battlecard: React.FC = () => {
  const [ourSummary, setOurSummary] = useState('We help revenue teams consolidate tooling with faster time-to-value and strong integrations.');
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { id: 'c1', sourceType: 'text', title: 'Competitor A', raw: 'Competitor A focuses on enterprise with premium pricing and SSO/SCIM.' },
  ]);
  const [personas, setPersonas] = useState<string[]>(['AE']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BattlecardResult | null>(null);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (apiKey) {
      openaiService.initialize(apiKey);
    }
  }, [apiKey]);

  const togglePersona = (persona: string) => {
    setPersonas(prev => 
      prev.includes(persona) 
        ? prev.filter(p => p !== persona)
        : [...prev, persona]
    );
  };

  const updateCompetitor = (index: number, update: Partial<Competitor>) => {
    setCompetitors(prev => 
      prev.map((comp, i) => i === index ? { ...comp, ...update } : comp)
    );
  };

  const addCompetitor = () => {
    const newId = `c${competitors.length + 1}`;
    setCompetitors(prev => [...prev, { 
      id: newId, 
      sourceType: 'text', 
      title: '', 
      raw: '' 
    }]);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(prev => prev.filter((_, i) => i !== index));
  };

  const loadSample = () => {
    setOurSummary('Consolidate enablement workflows with fast rollout, enterprise security, and deep integrations to reduce TCO and speed up cycles.');
    setCompetitors([
      { id: 'c1', sourceType: 'text', title: 'AlphaCorp', raw: 'Enterprise-first platform with custom pricing, strong reporting, and SSO/SCIM. Longer deployments.' },
      { id: 'c2', sourceType: 'text', title: 'BetaSuite', raw: 'Starter-friendly pricing, limited integrations. Focus on SMB with quick setup.' }
    ]);
    setPersonas(['SDR', 'AE', 'CS']);
    setResult(null);
    setError('');
  };

  const generateBattlecard = async () => {
    if (!apiKey) {
      setError('Please provide your OpenAI API key above.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const battlecardResult = await openaiService.generateBattlecard(ourSummary, competitors, personas);
      setResult(battlecardResult);
    } catch (e: any) {
      setError(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const leftPane = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Our Product Summary
        </label>
        <textarea
          value={ourSummary}
          onChange={(e) => setOurSummary(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your solution and key value propositions..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Competitors
          </label>
          <button
            onClick={addCompetitor}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            <FaPlus className="inline mr-1" />
            Add Competitor
          </button>
        </div>
        
        <div className="space-y-3">
          {competitors.map((competitor, i) => (
            <div key={competitor.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={competitor.title || ''}
                  onChange={(e) => updateCompetitor(i, { title: e.target.value })}
                  placeholder="Competitor name"
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                />
                <select
                  value={competitor.sourceType}
                  onChange={(e) => updateCompetitor(i, { sourceType: e.target.value as any })}
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                >
                  <option value="text">Text</option>
                  <option value="url">URL</option>
                  <option value="file" disabled>File</option>
                </select>
                <button
                  onClick={() => removeCompetitor(i)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={competitor.raw}
                onChange={(e) => updateCompetitor(i, { raw: e.target.value })}
                rows={2}
                placeholder={competitor.sourceType === 'url' ? 'https://...' : 'Paste competitor description or notes...'}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Personas
        </label>
        <div className="flex flex-wrap gap-3">
          {['SDR', 'AE', 'CS'].map(persona => (
            <label key={persona} className="flex items-center">
              <input
                type="checkbox"
                checked={personas.includes(persona)}
                onChange={() => togglePersona(persona)}
                className="mr-2 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{persona}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={generateBattlecard}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2 inline" />
              Generating...
            </>
          ) : (
            'Generate Battlecard'
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
  );

  const rightPane = (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!result && !error && (
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Configure your product summary and competitors, then click "Generate Battlecard" to create competitive intelligence.
        </p>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">Competitive Battlecard</h3>
            <CopyButton text={JSON.stringify(result, null, 2)} label="Export Battlecard" />
          </div>

          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Our Competitive Strengths</h4>
            <ul className="list-disc list-inside space-y-1">
              {result.competitivePositioning.ourStrengths.map((strength, i) => (
                <li key={i} className="text-sm text-green-700 dark:text-green-300">{strength}</li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Competitor Weaknesses</h4>
            <ul className="list-disc list-inside space-y-1">
              {result.competitivePositioning.competitorWeaknesses.map((weakness, i) => (
                <li key={i} className="text-sm text-yellow-700 dark:text-yellow-300">{weakness}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Objection Handling</h4>
            <div className="space-y-3">
              {result.objectionHandling.map((objection, i) => (
                <div key={i} className="bg-white dark:bg-blue-800/30 rounded p-3">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    "{objection.objection}"
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    <strong>Response:</strong> {objection.response}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    <strong>Evidence:</strong> {objection.evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Talk Tracks by Persona</h4>
            <div className="space-y-3">
              {Object.entries(result.talkTracks).map(([persona, tracks]) => (
                <div key={persona}>
                  <div className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">{persona}:</div>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {tracks.map((track, i) => (
                      <li key={i} className="text-sm text-purple-700 dark:text-purple-300">{track}</li>
                    ))}
                  </ul>
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
              Battlecard Builder - Competitive Intelligence AI
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Generate comprehensive competitive battlecards with AI-powered analysis and strategic positioning.
            </p>
          </div>

          <ApiKeyBar onChange={setApiKey} />

          <TwoPane left={leftPane} right={rightPane} />
        </motion.div>
      </div>
    </div>
  );
};

export default Battlecard;