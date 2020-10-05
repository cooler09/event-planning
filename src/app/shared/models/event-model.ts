import { AttendeeModel } from "./attendee-model";
import { CommentModel } from "./comment-model";

export class EventModel {
  id: string;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  maxAttendees: number;
  userId: string;
  waitListEnabled: boolean;
  attendees: AttendeeModel[];
  waitlist: AttendeeModel[];
  comments: CommentModel[];
  constructor() {
    this.waitListEnabled = true;
    this.attendees = [];
    this.waitlist = [];
    this.comments = [];
  }
}
