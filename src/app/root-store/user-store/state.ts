import { User } from "src/app/shared/models/user";

export interface State {
  currentUser: User;
}

export const initialState: State = {
  currentUser: null,
};
