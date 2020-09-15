import { Action } from "@ngrx/store";

export enum ActionTypes {
  Empty = "[Changes] Empty Changes",
}

export class EventInitAction implements Action {
  public readonly type = "";

  constructor(public payLoad: any) {}
}
export type Actions = EventInitAction;
