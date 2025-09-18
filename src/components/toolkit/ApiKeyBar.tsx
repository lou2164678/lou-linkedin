import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaSave } from 'react-icons/fa';

interface ApiKeyBarProps {
  storageKey?: string;
  onChange?: (key: string) => void;
}

const ApiKeyBar: React.FC<ApiKeyBarProps> = ({ 
  storageKey = 'llm_api_key', 
  onChange 
}) => {
  const [apiKey, setApiKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem(storageKey) || '';
    setApiKey(savedKey);
    onChange?.(savedKey);
  }, [storageKey, onChange]);

  const handleSave = () => {
    localStorage.setItem(storageKey, apiKey);
    onChange?.(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-800 dark:text-white">
            OpenRouter API Key
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Optional: API key stored in environment. You can also enter manually for testing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              className="w-64 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type={visible ? 'text' : 'password'}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <button
            onClick={() => setVisible(!visible)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            title={visible ? 'Hide' : 'Show'}
          >
            {visible ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {saved ? (
              <>
                <FaSave className="w-4 h-4 mr-1" />
                Saved!
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4 mr-1" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyBar;