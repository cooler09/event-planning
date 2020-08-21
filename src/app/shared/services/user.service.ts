import { Injectable, NgZone } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  subscriptions: Subscription[] = [];

  constructor(
    public readonly firestore: AngularFirestore,
    public router: Router,
    public ngZone: NgZone
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach((_) => {
      _.unsubscribe();
    });
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
