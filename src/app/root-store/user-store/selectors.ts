import {
  createFeatureSelector,
  MemoizedSelector,
  createSelector,
  DefaultProjectorFn,
} from "@ngrx/store";
import { User } from "src/app/shared/models/user";
import { State } from "./state";

export const selectUserState: MemoizedSelector<
  object,
  State
> = createFeatureSelector<State>("user");

export const selectUsers = createSelector(
  selectUserState,
  (state: State): User[] => {
    return Object.values(state);
  }
);
export const selectCurrentUser = createSelector(
  selectUserState,
  (state: State): User => state.currentUser
);
export const selectUser: (
  id: string
) => MemoizedSelector<object, any, DefaultProjectorFn<User>> = (id: string) =>
  createSelector(selectUserState, (state: State): User => state[id]);
