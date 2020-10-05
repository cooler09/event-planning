import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user";

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
  getUserData<T>(userId: string): AngularFirestoreDocument<T> {
    return this.firestore.doc<T>(`/users/${userId}`);
  }
  getFriendData(userId: string) {
    return this.getUserData<any>(userId)
      .valueChanges()
      .pipe(
        map((user) => {
          return {
            uid: user.uid,
            displayName: user.displayName,
          };
        })
      );
  }
  async addFriend(friendId: string, userId: string) {
    let userRef = await this.firestore.doc<User>(`/users/${userId}`);

    let refFriends = (await userRef.get().toPromise()).get("friends");
    let newFriendsList = [];
    if (refFriends && refFriends.length > 0) {
      refFriends.push(friendId);
      newFriendsList = [...new Set(refFriends)];
    } else {
      newFriendsList.push(friendId);
    }
    return userRef.set(
      {
        friends: newFriendsList,
      } as User,
      { merge: true }
    );
  }
  async getUsers(username: string) {
    return (
      await this.firestore.collection<User>("users").get().toPromise()
    ).docs
      .map((_) => _.data())
      .filter((user) => {
        let lowerUsername = username.toLocaleLowerCase();
        return (
          user.displayName?.toLowerCase().includes(lowerUsername) ||
          user.email?.toLowerCase().includes(lowerUsername)
        );
      });
  }
  async removeEvent(userId: string, eventId: string): Promise<void> {
    let userRef = this.firestore.doc<User>(`/users/${userId}`);
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
      } as User,
      { merge: true }
    );
  }
  addEvent(userData: User, eventId: string) {
    let userRef = this.firestore.doc<User>(`/users/${userData.uid}`);
    let newEventList = [];
    if (userData.events) {
      let tempArray = [...userData.events];
      tempArray.push(eventId);
      newEventList = [...new Set(tempArray)];
    } else {
      newEventList.push(eventId);
    }
    return userRef.set(
      {
        events: newEventList,
      } as User,
      { merge: true }
    );
  }
  setUserData(user: any) {
    // create user information
    this.firestore.doc(`/users/${user.uid}`).set({ ...user }, { merge: true });
  }
}
