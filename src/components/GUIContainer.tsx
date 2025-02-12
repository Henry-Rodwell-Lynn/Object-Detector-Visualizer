import CustomizationGUI from "./CustomizationGUI";

const GUIContainer = () => {
  return (
    <div className="fixed top-0 right-0 h-screen w-[275px] bg-[#222222] p-4 overflow-y-auto">
      <CustomizationGUI />
    </div>
  );
};

export default GUIContainer;
