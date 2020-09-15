import {
  createFeatureSelector,
  MemoizedSelector,
  createSelector,
} from "@ngrx/store";
import { State } from "./state";

export const selectEventState: MemoizedSelector<
  object,
  State
> = createFeatureSelector<State>("event");

export const selectEvents = createSelector(
  selectEventState,
  (state: State): any => {
    return state;
  }
);
