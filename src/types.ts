import { QueueFnList, QueueInterface } from 'App';

export interface IAppContext {
  isAuth: boolean;
  setIsAuth: (arg: boolean) => void;
  logout: () => void;
  queue: React.MutableRefObject<QueueInterface[]>;
  setQueueUpdated: (arg: []) => void;
  QueueFnList: typeof QueueFnList;
  pushToQueue: (arg: QueueInterface) => void;
}

export interface ApiResponseInterface {
  data?: any;
  status: number;
}
