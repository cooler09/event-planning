export class AttendeeModel {
  id: string;
  userId: string;
  signUpDate: Date;
  name: string;
  positions: string[];
  constructor() {
    this.positions = [];
  }
}
