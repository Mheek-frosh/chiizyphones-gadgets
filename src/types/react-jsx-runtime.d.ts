declare module "react/jsx-runtime" {
  import type { ReactNode } from "react";
  export function jsx(type: unknown, props: Record<string, unknown>, key?: string): ReactNode;
  export function jsxs(type: unknown, props: Record<string, unknown>, key?: string): ReactNode;
  export const Fragment: ReactNode;
}
