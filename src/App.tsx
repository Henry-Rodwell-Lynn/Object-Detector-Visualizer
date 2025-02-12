import GUIContainer from "./components/GUIContainer";
import ObjectDetector from "./components/ObjectDetector";

function App() {
  return (
    <div className="relative w-screen h-screen flex">
      {/* Object Detector Visualizer */}
      <div className="flex-1 fixed bg-gray-100 overflow-hidden h-[100vh]">
        <ObjectDetector />
      </div>

      <div className="overflow-scroll">
        <GUIContainer />
      </div>
    </div>
  );
}

export default App;
