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
  comments: CommentModel[];
  constructor() {
    this.waitListEnabled = true;
    this.comments = [];
  }
}
