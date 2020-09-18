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
  setData(user: any) {
    if (user["uid"]) this.uid = user["uid"];
    if (user["email"]) this.email = user["email"];
    if (user["displayName"]) this.displayName = user["displayName"];
    if (user["photoURL"]) this.photoURL = user["photoURL"];
    if (user["emailVerified"]) this.emailVerified = user["emailVerified"];
    if (user["events"]) this.events = user["events"];
    if (user["friends"]) this.friends = user["friends"];
    return this;
  }
}
