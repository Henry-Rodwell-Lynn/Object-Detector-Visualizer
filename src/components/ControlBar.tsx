import useAppStore from "../stores/useAppStore";

const ControlBar = ({ onStartRecording, onStopRecording, recording }) => {
  const { videoWidth, videoHeight, resetSettings } = useAppStore();

  const handleResetClick = () => {
    resetSettings();
  };

  const handleNewFileClick = () => {
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 w-100 bg-[#292D39] text-gray-200 shadow-md flex items-center justify-between px-4 py-3 rounded-lg drop-shadow-lg">
      <p className="text-xs font-mono">
        Video: {videoWidth} x {videoHeight}
      </p>

      <div className="w-[2px] h-6 bg-gray-400 opacity-50 mx-4"></div>

      <button
        onClick={handleResetClick}
        className="bg-[#373C4B] hover:bg-[#535760] text-white text-xs px-4 py-2 rounded-md shadow"
      >
        Reset Settings
      </button>

      <div className="w-[2px] h-6 bg-gray-400 opacity-50 mx-4"></div>

      <button
        onClick={recording ? onStopRecording : onStartRecording}
        className={`text-white text-xs px-4 py-2 rounded-md shadow ${
          recording ? "bg-red-600 hover:bg-red-700" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      <div className="w-[2px] h-6 bg-gray-400 opacity-50 mx-4"></div>

      <button onClick={handleNewFileClick} className="bg-[#373C4B] hover:bg-[#535760] text-white text-xs px-4 py-2 rounded-md shadow">
        New File
      </button>
    </div>
  );
};

export default ControlBar;
