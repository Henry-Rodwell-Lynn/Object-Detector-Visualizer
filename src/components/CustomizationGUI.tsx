import { useControls, folder } from "leva";
import useAppStore from "../stores/useAppStore";

const CustomizationGUI = () => {
  const {
    maskObjects,
    setMaskObjects,
    maskColor,
    setMaskColor,
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
  } = useAppStore();

  useControls({
    "Object Detector Controls": folder({
      Threshold: {
        value: threshold,
        min: 0.1,
        max: 0.9,
        step: 0.1,
        onChange: setThreshold,
      },
    }),

    "Bounding Box Controls": folder({
      Fill: {
        value: fill,
        label: "Fill Box",
        onChange: setFill,
      },
      FillColor: {
        value: fillColor,
        label: "Fill Color",
        onChange: setFillColor,
      },
      Border: {
        value: border,
        label: "Show Border",
        onChange: setBorder,
      },
      BorderColor: {
        value: borderColor,
        label: "Border Color",
        onChange: setBorderColor,
      },
      BoxLineWidth: {
        value: boxLineWidth,
        min: 1,
        max: 20,
        step: 1,
        label: "Border Width",
        onChange: setBoxLineWidth,
      },
      MaskObjects: {
        value: maskObjects,
        label: "Mask Objects",
        onChange: setMaskObjects,
      },
      MaskColor: {
        value: maskColor,
        label: "Mask Color",
        onChange: setMaskColor,
      },
    }),

    "Text Controls": folder({
      Label: {
        value: labelVisible,
        label: "Show Label",
        onChange: setLabelVisible,
      },
      Percentage: {
        value: percentageVisible,
        label: "Show Percentage",
        onChange: setPercentageVisible,
      },
      TextSize: {
        value: textSize,
        min: 8,
        max: 30,
        step: 1,
        label: "Label Size",
        onChange: setTextSize,
      },
      TextColor: {
        value: textColor,
        label: "Label Color",
        onChange: setTextColor,
      },
    }),

    "Node Controls": folder({
      "Node Types": folder({
        NearestNodes: {
          value: nearestNodes,
          label: "Nearest Nodes",
          onChange: setNearestNodes,
        },
        ThreeNearestNodes: {
          value: threeNearestNodes,
          label: "Three Nearest Nodes",
          onChange: setThreeNearestNodes,
        },
      }),
      NodeColor: {
        value: nodeColor,
        label: "Node Color",
        onChange: setNodeColor,
      },
      NodeWidth: {
        value: nodeWidth,
        min: 1,
        max: 10,
        step: 1,
        label: "Node Width",
        onChange: setNodeWidth,
      },
    }),
  });

  return null;
};

export default CustomizationGUI;
