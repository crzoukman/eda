import { ITasks } from "pages/Tasks/types";

export interface IProps {
  showFilters: boolean;
  closeFilters: () => void;
  tasks: ITasks[];
  setSorted: (arg: ITasks[]) => void;
}