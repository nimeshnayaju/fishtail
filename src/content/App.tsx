import { FunctionComponent, useEffect } from "react";
import { useInterpret } from "@xstate/react";
import { createTrailMachine } from "./machine";
import Trail from "./Trail";
import * as styles from "./App.css";

const machine = createTrailMachine();

const App: FunctionComponent = () => {
  const service = useInterpret(machine);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (service.getSnapshot().matches("growing")) {
        const point = [e.clientX, e.clientY, e.pressure ?? 0.5];
        service.send("POINT.ADD", { value: point });
      }
    };

    document.addEventListener("pointermove", onPointerMove);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, [service]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        (service.getSnapshot().matches("idle") ||
          service.getSnapshot().matches("shrinking")) &&
        e.code === "AltLeft"
      ) {
        service.send("GROW");
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [service]);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (service.getSnapshot().matches("growing") && e.code === "AltLeft") {
        service.send("SHRINK");
      }
    };

    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [service]);

  return (
    <svg className={styles.root}>
      <Trail service={service} />
    </svg>
  );
};

export default App;
