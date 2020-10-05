import { EventModel } from "../models/event-model";
import { FSEventModel } from "../models/fs-event-model";

export default class EventHelper {
  static convertToFSEvent(reduxEvent: EventModel) {
    let fsEvent = new FSEventModel();
    fsEvent.id = reduxEvent.id;
    fsEvent.id = reduxEvent.id;
    fsEvent.location = reduxEvent.location;
    fsEvent.endDate = reduxEvent.endDate;
    fsEvent.startDate = reduxEvent.startDate;
    fsEvent.maxAttendees = reduxEvent.maxAttendees;
    fsEvent.name = reduxEvent.name;
    fsEvent.userId = reduxEvent.userId;
    fsEvent.waitListEnabled = reduxEvent.waitListEnabled;
    return fsEvent;
  }
  static convertToReduxEvent(fsEvent: FSEventModel) {
    let reduxEvent = new EventModel();
    reduxEvent.id = fsEvent.id;
    reduxEvent.location = fsEvent.location;
    reduxEvent.endDate = fsEvent.endDate;
    reduxEvent.startDate = fsEvent.startDate;
    reduxEvent.maxAttendees = fsEvent.maxAttendees;
    reduxEvent.name = fsEvent.name;
    reduxEvent.userId = fsEvent.userId;
    reduxEvent.waitListEnabled = fsEvent.waitListEnabled;
    return reduxEvent;
  }
}
