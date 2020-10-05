import { initialState, State } from "./state";
import { Actions, UserTypes } from "./actions";
export function userReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case UserTypes.SetCurrentUser:
      return setCurrentUser(state, action);
    default:
      return state;
  }
}
function setCurrentUser(state: State, action: Actions) {
  let user = action.payload;
  return Object.assign({}, state, {
    currentUser: user,
  });
}
