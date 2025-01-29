const InfoPanel = () => {
  return (
    <div className="fixed top-4 left-4 bg-[#222] text-white p-4 rounded-md shadow-lg border border-[#555] text-sm font-mono max-w-[300px]">
      <h1 className="text-lg font-bold text-[#ddd] mb-2">Object Detector Visualizer</h1>
      <p className="text-[#bbb] mb-3">
        A real-time AI visualization tool for designers to leverage the aesthetics of AI visuals associated with Object Detection.
      </p>
      
      <div className="border-t border-[#444] my-4"></div>

      <p className="text-[#bbb]"><strong>Version:</strong> 1.0.0</p>
      
      <div className="border-t border-[#444] my-4"></div>

      <div className="flex flex-col gap-1 text-[#bbb]">
        <a href="https://github.com/Henry-Rodwell-Lynn/Object-Detector-Visualizer" target="_blank" rel="noopener noreferrer" className="text-[#4af] hover:underline">
          GitHub
        </a>
        <a href="https://www.are.na/henry-rodwell-lynn/channels" target="_blank" rel="noopener noreferrer" className="text-[#4af] hover:underline">
          Are.na
        </a>
        <a href="https://www.instagram.com/_henryrodwell/" target="_blank" rel="noopener noreferrer" className="text-[#4af] hover:underline">
          Instagram
        </a>
        <a href="https://henryrodwell.com/" target="_blank" rel="noopener noreferrer" className="text-[#4af] hover:underline">
          Website
        </a>
        <div className="border-t border-[#444] my-4"></div>
        <a className="">
          By Henry Rodwell
        </a>
      </div>
    </div>
  );
};

export default InfoPanel;
