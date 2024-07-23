declare module "react-d3-speedometer/slim" {
    import * as React from "react";
  
    interface SpeedometerProps {
      value: number;
      minValue?: number;
      maxValue?: number;
      segments?: number;
      maxSegmentLabels?: number;
      needleColor?: string;
      startColor?: string;
      endColor?: string;
      needleTransition?: string;
      needleTransitionDuration?: number;
      needleHeightRatio?: number;
      ringWidth?: number;
      textColor?: string;
      valueTextFontSize?: string;
      valueTextFontWeight?: string;
      labelFontSize?: string;
      currentValueText?: string;
      customSegmentLabels?: Array<{
        text: string;
        position: string;
        fontSize: string;
        color: string;
      }>;
      forceRender?: boolean;
      width?: number;
      height?: number;
      fluidWidth?: boolean;
      className?: string;
      id?: string;
      customCss?: React.CSSProperties;
      formatTextValue?: (value: number) => string;
    }
  
    const Speedometer: React.FC<SpeedometerProps>;
    export default Speedometer;
  }
  