export class FSEventModel {
  id: string;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  maxAttendees: number;
  userId: string;
  waitListEnabled: boolean;
  constructor() {
    this.waitListEnabled = true;
  }
}
