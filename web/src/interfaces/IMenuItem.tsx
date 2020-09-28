import { ReactNode } from "react";

export interface IMenuItem {
  id: number,
  name: string;
  link: string;
  icon: ReactNode;
}
