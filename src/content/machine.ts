import { createMachine, assign, send } from "xstate";
import { Point } from "./types";

const SHRINK_RATE = 0.05;

export interface TrailContext {
  points: Point[];
}

export type TrailEvent =
  | {
      type: "POINT.ADD";
      value: Point;
    }
  | {
      type: "SHRINK";
    }
  | {
      type: "GROW";
    };

export function createTrailMachine() {
  return createMachine<TrailContext, TrailEvent>(
    {
      context: {
        points: [],
      },
      id: "trail",
      initial: "idle",
      predictableActionArguments: true,
      states: {
        idle: {
          entry: assign<TrailContext>({
            points: [],
          }),
          on: {
            GROW: {
              target: "growing",
            },
          },
        },
        growing: {
          on: {
            SHRINK: {
              target: "shrinking",
            },
            "POINT.ADD": {
              actions: "addPoints",
            },
          },
        },
        shrinking: {
          invoke: {
            id: "shrinker",
            src: "shrinker",
          },
          always: {
            target: "idle",
            cond: "isShrunk",
          },
          on: {
            SHRINK: {
              actions: "shrink",
            },
            GROW: {
              target: "idle",
              actions: send((_, event) => ({
                type: "GROW",
              })),
            },
          },
        },
      },
      on: {},
    },
    {
      actions: {
        addPoints: assign({
          points: (context, event) => {
            if (event.type !== "POINT.ADD") {
              return context.points;
            }
            return [...context.points, event.value];
          },
        }),
        shrink: assign({
          points: (context, event) => {
            if (event.type !== "SHRINK") {
              return context.points;
            }
            return context.points.slice(
              Math.ceil(context.points.length * SHRINK_RATE)
            );
          },
        }),
      },
      services: {
        shrinker: (ctx, _) => (cb) => {
          const interval = setInterval(() => {
            cb("SHRINK");
          }, 32);

          return () => clearInterval(interval);
        },
      },
      guards: {
        isShrunk: (ctx) => ctx.points.length <= 0,
      },
    }
  );
}
