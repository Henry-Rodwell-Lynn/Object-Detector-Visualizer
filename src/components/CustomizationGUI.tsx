import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";
import useAppStore from "../stores/useAppStore";

const CustomizationGUI = () => {
  console.log("CustomizationGUI mounted!");

  const paneRef = useRef<Pane | null>(null);

  const {
    threshold,
    setThreshold,
    fill,
    setFill,
    fillColor,
    setFillColor,
    border,
    setBorder,
    borderColor,
    setBorderColor,
    boxLineWidth,
    setBoxLineWidth,
    maskObjects,
    setMaskObjects,
    maskColor,
    setMaskColor,
    labelVisible,
    setLabelVisible,
    percentageVisible,
    setPercentageVisible,
    textSize,
    setTextSize,
    textColor,
    setTextColor,
    nearestNodes,
    setNearestNodes,
    threeNearestNodes,
    setThreeNearestNodes,
    nodeColor,
    setNodeColor,
    nodeWidth,
    setNodeWidth,
    objectToggles,
    toggleObject,
  } = useAppStore();

  useEffect(() => {
    if (paneRef.current) return; // Prevent multiple instances

    console.log("Tweakpane initializing...");

    const pane = new Pane({
      title: "Customization Panel",
      expanded: true,
    });

    paneRef.current = pane;

    // ✅ Object Detector Controls
    const detectorFolder = pane.addFolder({ title: "Object Detector Controls" });
    detectorFolder.addBinding({ threshold }, "threshold", {
      min: 0.1,
      max: 0.9,
      step: 0.1,
    }).on("change", (ev) => setThreshold(ev.value));

    // ✅ Bounding Box Controls (With Tabs)
    const bboxFolder = pane.addFolder({ title: "Bounding Box Controls" });

    // ✅ Tabs: "All Objects" & "Selected Objects"
    const bboxTabs = bboxFolder.addTab({
      pages: [
        { title: "All Objects" },
        { title: "Selected Objects" },
      ],
    });

    // 📌 "All Objects" Tab - Existing Bounding Box Controls
    const allObjects = bboxTabs.pages[0];
    allObjects.addBinding({ fill }, "fill").on("change", (ev) => setFill(ev.value));
    allObjects.addBinding({ fillColor }, "fillColor").on("change", (ev) => setFillColor(ev.value));
    allObjects.addBinding({ border }, "border").on("change", (ev) => setBorder(ev.value));
    allObjects.addBinding({ borderColor }, "borderColor").on("change", (ev) => setBorderColor(ev.value));
    allObjects.addBinding({ boxLineWidth }, "boxLineWidth", {
      min: 1,
      max: 20,
      step: 1,
    }).on("change", (ev) => setBoxLineWidth(ev.value));
    allObjects.addBinding({ maskObjects }, "maskObjects").on("change", (ev) => setMaskObjects(ev.value));
    allObjects.addBinding({ maskColor }, "maskColor").on("change", (ev) => setMaskColor(ev.value));

    // 📌 "Selected Objects" Tab - Object Visibility Toggles
    const selectedObjects = bboxTabs.pages[1];
    const objectFolder = selectedObjects.addFolder({ title: "Object Visibility" });

    Object.keys(objectToggles).forEach((key) => {
      objectFolder.addBinding({ [key]: objectToggles[key] }, key)
        .on("change", (ev) => toggleObject(key, ev.value));
    });

    // ✅ Text Controls - Moved Outside Tabs
    const textFolder = pane.addFolder({ title: "Text Controls" });
    textFolder.addBinding({ labelVisible }, "labelVisible").on("change", (ev) => setLabelVisible(ev.value));
    textFolder.addBinding({ percentageVisible }, "percentageVisible").on("change", (ev) => setPercentageVisible(ev.value));
    textFolder.addBinding({ textSize }, "textSize", {
      min: 8,
      max: 30,
      step: 1,
    }).on("change", (ev) => setTextSize(ev.value));
    textFolder.addBinding({ textColor }, "textColor").on("change", (ev) => setTextColor(ev.value));

    // ✅ Node Visualization Folder
    const nodeFolder = pane.addFolder({ title: "Node Visualization" });
    nodeFolder.addBinding({ nearestNodes }, "nearestNodes").on("change", (ev) => setNearestNodes(ev.value));
    nodeFolder.addBinding({ threeNearestNodes }, "threeNearestNodes").on("change", (ev) => setThreeNearestNodes(ev.value));
    nodeFolder.addBinding({ nodeColor }, "nodeColor").on("change", (ev) => setNodeColor(ev.value));
    nodeFolder.addBinding({ nodeWidth }, "nodeWidth", {
      min: 1,
      max: 10,
      step: 1,
    }).on("change", (ev) => setNodeWidth(ev.value));

    console.log("Tweakpane setup complete!");

    return () => {
      console.log("CustomizationGUI unmounted but NOT disposing Tweakpane (persistent).");
    };
  }, []);

  return null;
};

export default CustomizationGUI;
