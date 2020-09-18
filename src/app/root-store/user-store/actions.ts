import { Action } from "@ngrx/store";
import { User } from "src/app/shared/models/user";

export enum UserTypes {
  SetCurrentUser = "[Current User] Set User",
  Add = "[User] Add User",
}
export class SetCurrentUser implements Action {
  public readonly type = UserTypes.SetCurrentUser;

  constructor(public payload: User) {}
}

export class AddUser implements Action {
  public readonly type = UserTypes.Add;

  constructor(public payload: User) {}
}
export type Actions = AddUser | SetCurrentUser;
