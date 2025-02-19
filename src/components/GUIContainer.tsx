import CustomizationGUI from "./CustomizationGUI";

const GUIContainer = () => {
  return (
    <div className="fixed top-0 right-0 h-screen w-[360px] bg-[#222222] p-4 pr-6 overflow-y-auto overflow-x-hidden">
      <CustomizationGUI />
    </div>
  );
};

export default GUIContainer;
