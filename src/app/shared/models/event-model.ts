import { AttendeeModel } from "./attendee-model";

export class EventModel {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  maxAttendees: number;
  attendees: AttendeeModel[];
  constructor() {
    this.attendees = [];
  }
}
