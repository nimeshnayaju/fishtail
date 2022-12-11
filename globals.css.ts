import { globalStyle } from "@vanilla-extract/css";
import { blue, slate } from "@radix-ui/colors";

globalStyle("*, ::before, ::after", {
  boxSizing: "border-box",
  margin: 0,
});

globalStyle("body", {
  fontSize: "100%",
  letterSpacing: 0.5,
  margin: 0,
  color: blue.blue12,
  backgroundColor: slate.slate1,
});
