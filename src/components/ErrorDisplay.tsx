import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-8"
      role="alert"
    >
      <p className="font-bold">エラーが発生しました</p>
      <p>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          再試行
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
