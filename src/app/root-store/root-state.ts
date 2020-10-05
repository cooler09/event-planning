import { EventStoreState } from "./event-store";
import { UserStoreState } from "./user-store";

export interface State {
  event: EventStoreState.State;
  user: UserStoreState.State;
}
