import getStroke from "perfect-freehand";
import type { Interpreter, State } from "xstate";
import { useSelector } from "@xstate/react";
import { getSvgPathFromStroke } from "./getSvgPathFromStroke";
import { TrailContext, TrailEvent } from "./machine";
import { useEffect, useRef } from "react";
import type { RgbaColor } from "react-colorful";

const TRAIL_SIZE = 16;

const pointsSelector = (state: State<TrailContext, TrailEvent>) => {
  return state.context.points;
};

interface TrailProps {
  service: Interpreter<TrailContext, any, TrailEvent, any, any>;
}

export default function Trail({ service }: TrailProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const points = useSelector(service, pointsSelector);

  const d = getSvgPathFromStroke(
    getStroke(points, {
      size: TRAIL_SIZE,
      streamline: 0.5,
      start: { taper: true },
      simulatePressure: false,
    })
  );

  useEffect(() => {
    const init = async () => {
      if (!pathRef.current) return;
      const res = await chrome.storage.local.get(["color"]);
      if (!res.color) return;
      const { r, g, b, a } = res.color as RgbaColor;
      pathRef.current.setAttribute("fill", `rgba(${r}, ${g}, ${b}, ${a})`);
    };
    init();
  }, []);

  useEffect(() => {
    const onStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: "sync" | "local" | "managed" | "session"
    ) => {
      if (!pathRef.current) return;

      if (areaName === "local" && changes.color && changes.color.newValue) {
        const { r, g, b, a } = changes.color.newValue as RgbaColor;
        pathRef.current.setAttribute("fill", `rgba(${r}, ${g}, ${b}, ${a})`);
      }
    };
    chrome.storage.onChanged.addListener(onStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(onStorageChange);
    };
  }, []);

  return <path ref={pathRef} d={d} />;
}
