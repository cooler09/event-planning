export class User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  events: string[];
  friends: string[];
  constructor() {
    this.events = [];
    this.friends = [];
  }
}
