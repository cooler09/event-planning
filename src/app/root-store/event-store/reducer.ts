import { initialState, State } from "./state";
import { Actions } from "./actions";
export function eventReducer(state = initialState, action: Actions): State {
  return state;
}
