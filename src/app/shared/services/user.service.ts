import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  subscriptions: Subscription[] = [];

  constructor(private readonly firestore: AngularFirestore) {}

  ngOnDestroy() {
    this.subscriptions.forEach((_) => {
      _.unsubscribe();
    });
  }
  getUserData(userId: string) {
    return this.firestore.doc<any>(`/users/${userId}`).valueChanges();
  }
  async removeEvent(userId: string, eventId: string): Promise<void> {
    let userRef = this.firestore.doc(`/users/${userId}`);
    let doc = await userRef.get().toPromise();
    let newEventList = [];
    if (!doc.exists) {
      return Promise.resolve();
    }
    if (doc.data() && doc.data().events) {
      newEventList = doc.data().events.filter((event) => {
        return event !== eventId;
      });
    }
    return await userRef.set(
      {
        events: newEventList,
      },
      { merge: true }
    );
  }
  addEvent(userData: any, eventId: string) {
    let userRef = this.firestore.doc(`/users/${userData.uid}`);

    let newEventList = [];
    if (userData.events) {
      userData.events.push(eventId);
      newEventList = [...new Set(userData.events)];
    } else {
      newEventList.push(eventId);
    }
    return userRef.set(
      {
        events: newEventList,
      },
      { merge: true }
    );
  }
}
