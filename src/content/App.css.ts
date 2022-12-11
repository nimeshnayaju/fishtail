import { style } from "@vanilla-extract/css";

export const root = style({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 999999999,
});
