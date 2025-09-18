import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface CopyButtonProps {
  text: string;
  label?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
    >
      {copied ? (
        <>
          <FaCheck className="w-4 h-4 mr-2 text-green-500" />
          Copied!
        </>
      ) : (
        <>
          <FaCopy className="w-4 h-4 mr-2" />
          {label}
        </>
      )}
    </button>
  );
};

export default CopyButton;