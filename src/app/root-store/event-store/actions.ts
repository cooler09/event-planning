import { Action } from "@ngrx/store";
import { AttendeeModel } from "src/app/shared/models/attendee-model";
import { CommentModel } from "src/app/shared/models/comment-model";
import { EventModel } from "src/app/shared/models/event-model";

export enum EventTypes {
  Add = "[Event] Add Event",
  AddAttendees = "[Event] Add Attendees",
  AddWaitlist = "[Event] Add Waitlist",
  AddComments = "[Event] Add Comments",
}

export class AddEvent implements Action {
  public readonly type = EventTypes.Add;

  constructor(public payload: EventModel) {}
}
export class AddAttendees implements Action {
  public readonly type = EventTypes.AddAttendees;

  constructor(
    public payload: {
      eventId: string;
      attendees: AttendeeModel[];
    }
  ) {}
}
export class AddWaitlist implements Action {
  public readonly type = EventTypes.AddWaitlist;

  constructor(
    public payload: {
      eventId: string;
      waitlist: AttendeeModel[];
    }
  ) {}
}
export class AddComments implements Action {
  public readonly type = EventTypes.AddComments;

  constructor(
    public payload: {
      eventId: string;
      comments: CommentModel[];
    }
  ) {}
}
export type Actions = AddEvent | AddAttendees | AddWaitlist | AddComments;
