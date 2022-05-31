import { ActionTypes } from './actionTypes';
import { initialState } from './initialState';

export const SetAllAction = (
  payload: typeof initialState,
) => {
  return {
    type: ActionTypes.SET_ALL,
    payload,
  };
};

export const SetFirstnameAction = (payload: string) => {
  return {
    type: ActionTypes.SET_FIRSTNAME,
    payload,
  };
};

export const SetLastnameAction = (payload: string) => {
  return {
    type: ActionTypes.SET_LASTNAME,
    payload,
  };
};

export const SetPatronymicAction = (payload: string) => {
  return {
    type: ActionTypes.SET_PATRONYMIC,
    payload,
  };
};

export const SetQuestionAction = (payload: string) => {
  return {
    type: ActionTypes.SET_QUESTION,
    payload,
  };
};

export const SetAnswerAction = (payload: string) => {
  return {
    type: ActionTypes.SET_ANSWER,
    payload,
  };
};
