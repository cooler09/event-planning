import { initialState, State } from "./state";
import { Actions, EventTypes } from "./actions";
export function eventReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case EventTypes.Add:
      return addEvent(state, action);
    default:
      return state;
  }
}
function addEvent(state: State, action: Actions) {
  let event = action.payload;
  return Object.assign({}, state, {
    [event.id]: event,
  });
}
