import { initialState, State } from "./state";
import { Actions, EventTypes } from "./actions";
import { EventModel } from "src/app/shared/models/event-model";
import { AttendeeModel } from "src/app/shared/models/attendee-model";
import { CommentModel } from "src/app/shared/models/comment-model";
export function eventReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case EventTypes.Add:
      return addEvent(state, action);
    case EventTypes.AddAttendees:
      return addAttendees(state, action);
    case EventTypes.AddComments:
      return addComments(state, action);
    case EventTypes.AddWaitlist:
      return addWaitlistUsers(state, action);
    default:
      return state;
  }
}
function addEvent(state: State, action: Actions) {
  let event = action.payload as EventModel;
  return Object.assign({}, state, {
    [event.id]: event,
  });
}
function addWaitlistUsers(state: State, action: Actions) {
  let eventId = action.payload["eventId"];
  let waitlist = action.payload["waitlist"] as AttendeeModel[];
  let event = state[eventId] as EventModel;
  return Object.assign({}, state, {
    [eventId]: Object.assign({}, event, {
      waitlist: waitlist,
    }),
  });
}
function addAttendees(state: State, action: Actions) {
  let eventId = action.payload["eventId"];
  let attendees = action.payload["attendees"] as AttendeeModel[];
  let event = state[eventId] as EventModel;
  return Object.assign({}, state, {
    [eventId]: Object.assign({}, event, {
      attendees: attendees,
    }),
  });
}
function addComments(state: State, action: Actions) {
  let eventId = action.payload["eventId"];
  let comments = action.payload["comments"] as CommentModel[];
  let event = state[eventId] as EventModel;
  return Object.assign({}, state, {
    [eventId]: Object.assign({}, event, {
      comments: comments,
    }),
  });
}
