import { Action } from "@ngrx/store";
import { EventModel } from "src/app/shared/models/event-model";

export enum EventTypes {
  Add = "[Event] Add Event",
}

export class AddEvent implements Action {
  public readonly type = EventTypes.Add;

  constructor(public payload: EventModel) {}
}
export type Actions = AddEvent;
