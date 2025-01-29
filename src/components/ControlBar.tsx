import useAppStore from "../stores/useAppStore";

const ControlBar = () => {
  // Access video dimensions from Zustand store
  const { videoWidth, videoHeight } = useAppStore();

  // Refresh the site to reset everything
  const handleNewFileClick = () => {
    window.location.reload(); // Reloads the current page
  };

  return (
    <div className="fixed bottom-4 w-100% bg-[#292D39] text-gray-200 shadow-md flex items-center gap-5 px-4 py-4 rounded-lg drop-shadow-lg">
      {/* Video Dimensions */}
      <p className="text-xs font-mono">
        Video Dimensions: {videoWidth} x {videoHeight}
      </p>

      {/* New File Button */}
      <button
        onClick={handleNewFileClick}
        className="bg-[#373C4B] hover:bg-[#535760] text-white text-xs px-4 py-2 rounded-md shadow"
      >
        New File
      </button>
    </div>
  );
};

export default ControlBar;