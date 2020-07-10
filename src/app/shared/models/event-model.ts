import { AttendeeModel } from "./attendee-model";

export class EventModel {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  maxAttendees: number;
  userId: string;
  attendees: AttendeeModel[];
  constructor() {
    this.attendees = [];
  }
}
