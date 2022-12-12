import { RgbaColorPicker, type RgbaColor } from "react-colorful";
import { useCallback, useEffect, useState } from "react";
import * as styles from "./App.css";

function App() {
  const [color, setColor] = useState<RgbaColor>();

  useEffect(() => {
    const init = async () => {
      const res = await chrome.storage.local.get(["color"]);
      if (!res.color) return;
      setColor(res.color as RgbaColor);
    };
    init();
  }, []);

  const onColorChange = useCallback(
    debounce(async (color: RgbaColor) => {
      try {
        await chrome.storage.local.set({ color });
      } catch (err) {
        console.warn(err);
      }
    }),
    []
  );

  if (!color) return null;

  return (
    <div className={styles.root}>
      <RgbaColorPicker color={color} onChange={onColorChange} />
    </div>
  );
}

export default App;

const debounce = (fn: Function, ms = 200) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
