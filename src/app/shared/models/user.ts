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
  safeParse(data: any) {
    let parsedData = {};
    if (data["uid"]) parsedData["uid"] = data["uid"];
    if (data["email"]) parsedData["email"] = data["email"];
    if (data["name"]) parsedData["displayName"] = data["name"];
    if (data["displayName"]) parsedData["displayName"] = data["displayName"];
    if (data["photoURL"]) parsedData["photoURL"] = data["photoURL"];
    if (data["picture"]) parsedData["photoURL"] = data["picture"];
    if (data["emailVerified"])
      parsedData["emailVerified"] = data["emailVerified"];
    if (data["verified_email"])
      parsedData["emailVerified"] = data["verified_email"];
    return parsedData;
  }
}
