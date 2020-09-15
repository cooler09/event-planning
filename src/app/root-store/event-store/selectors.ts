import {
  createFeatureSelector,
  MemoizedSelector,
  createSelector,
  DefaultProjectorFn,
} from "@ngrx/store";
import { EventModel } from "src/app/shared/models/event-model";
import { State } from "./state";

export const selectEventState: MemoizedSelector<
  object,
  State
> = createFeatureSelector<State>("event");

export const selectEvents = createSelector(
  selectEventState,
  (state: State): EventModel[] => {
    return Object.values(state);
  }
);
export const selectEvent: (
  id: string
) => MemoizedSelector<object, any, DefaultProjectorFn<EventModel>> = (
  id: string
) => createSelector(selectEventState, (state: State): EventModel => state[id]);
