declare module "next/link" {
  import { ComponentType } from "react";
  interface LinkProps {
    href: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
  const Link: ComponentType<LinkProps>;
  export default Link;
}
