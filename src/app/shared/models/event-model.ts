import { AttendeeModel } from "./attendee-model";

export class EventModel {
  id: string;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  maxAttendees: number;
  userId: string;
  attendees: AttendeeModel[];
  waitListEnabled: boolean;
  waitList: AttendeeModel[];
  constructor() {
    this.waitListEnabled = true;
    this.attendees = [];
    this.waitList = [];
  }
}
