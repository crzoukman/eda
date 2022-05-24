import { ActionTypes } from './actionTypes';
import { initialState } from './initialState';

export const reducer = (
  state = initialState,
  action: {
    type: string;
    payload: string | typeof initialState;
  },
) => {
  if (action.type === ActionTypes.SET_ALL) {
    const payload = action.payload as typeof initialState;
    return { ...state, ...payload };
  }

  if (action.type === ActionTypes.SET_FIRSTNAME) {
    const payload = action.payload as string;
    return { ...state, firstname: payload };
  }

  if (action.type === ActionTypes.SET_LASTNAME) {
    const payload = action.payload as string;
    return { ...state, lastname: payload };
  }

  if (action.type === ActionTypes.SET_PATRONYMIC) {
    const payload = action.payload as string;
    return { ...state, patronymic: payload };
  }

  if (action.type === ActionTypes.SET_QUESTION) {
    const payload = action.payload as string;
    return { ...state, question: payload };
  }

  if (action.type === ActionTypes.SET_ANSWER) {
    const payload = action.payload as string;
    return { ...state, answer: payload };
  }

  return state;
};
