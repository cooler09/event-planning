import { eventReducer } from "./event-store/reducer";

export const rootReducer = {
  event: eventReducer,
};
