import { useState } from "react";
import { FaPlay, FaExpand, FaTimes } from "react-icons/fa";

interface DemoVideoProps {
  videoSrc: string;
  title?: string;
  description?: string;
}

const DemoVideo = ({ videoSrc, title = "Watch Demo", description }: DemoVideoProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return null; // Don't show anything if video doesn't exist
  }

  return (
    <>
      {/* Inline Demo Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <FaPlay className="text-white text-sm ml-0.5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            )}
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden bg-black aspect-video shadow-lg">
          <video
            src={videoSrc}
            controls
            playsInline
            className="w-full h-full object-contain"
            onError={() => setHasError(true)}
            onLoadedData={() => setIsLoaded(true)}
          >
            Your browser does not support the video tag.
          </video>

          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-gray-400 text-sm">Loading video...</div>
            </div>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
            title="View Fullscreen"
          >
            <FaExpand />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          Don't have an API key? Watch the demo to see how this tool works.
        </p>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          >
            <FaTimes size={20} />
          </button>
          <video
            src={videoSrc}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </>
  );
};

export default DemoVideo;
