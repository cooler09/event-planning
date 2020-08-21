export class AttendeeModel {
  id: string;
  userId: string;
  signUpDate: Date;
  name: string;
  positions: string[];
  constructor(id: string, name: string, signUpDate: Date) {
    this.id = id;
    this.name = name;
    this.signUpDate = signUpDate;
    this.positions = [];
  }
  setPositions(positions: string[]) {
    this.positions = positions;
    return this;
  }
  setName(name: string) {
    this.name = name;
    return this;
  }
  setUserId(userId: string) {
    this.userId = userId;
    return this;
  }
  setSignUpDate(date: Date) {
    this.signUpDate = date;
    return this;
  }
}
