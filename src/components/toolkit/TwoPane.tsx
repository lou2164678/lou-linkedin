import React from 'react';

interface TwoPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

const TwoPane: React.FC<TwoPaneProps> = ({ left, right }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        {left}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 min-h-[300px]">
        {right}
      </div>
    </div>
  );
};

export default TwoPane;