import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AttendeeModel } from "../models/attendee-model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CommentModel } from "../models/comment-model";
import { FSEventModel } from "../models/fs-event-model";

@Injectable({
  providedIn: "root",
})
export class EventService {
  constructor(private readonly firestore: AngularFirestore) {}
  isSignedUp(
    attendees: AttendeeModel[],
    waitlist: AttendeeModel[],
    userId: string
  ) {
    return (
      attendees.filter((item) => item.userId === userId).length > 0 ||
      waitlist.filter((item) => item.userId === userId).length > 0
    );
  }
  async removeAttendee(
    eventId: string,
    waitListEnabled: boolean,
    id: string,
    waitlist: AttendeeModel[]
  ) {
    // remove attendee from DB
    await this.removeAttendeeFromDB(eventId, id).then();
    // Check if there is a waitlist
    // if so and there is a user on the waitlist
    if (waitListEnabled && waitlist.length > 0) {
      let nextUser = waitlist
        .sort((a, b) => (a.signUpDate < b.signUpDate ? 1 : -1))
        .pop();
      // remove them from the waitlist
      await this.removeWaitlistFromDB(eventId, nextUser.id).then();
      // add them to the attendee list
      await this.addAttendeeFirebase(eventId, nextUser).then();
    }
  }
  removeAttendeeFromDB(eventId: string, id: string) {
    return this.firestore.doc(`/events/${eventId}/attendees/${id}`).delete();
  }
  removeWaitlistFromDB(eventId: string, id: string) {
    return this.firestore.doc(`/events/${eventId}/waitlist/${id}`).delete();
  }
  addAttendeeFirebase(eventId: string, attendee: AttendeeModel) {
    return this.firestore
      .doc(`/events/${eventId}/attendees/${attendee.id}`)
      .set({ ...attendee }, { merge: true });
  }
  addWaitlistFirebase(eventId: string, attendee: AttendeeModel) {
    return this.firestore
      .doc(`/events/${eventId}/waitlist/${attendee.id}`)
      .set({ ...attendee }, { merge: true });
  }
  getEventWaitlist(id: string): Observable<any> {
    return this.firestore
      .collection(`/events/${id}/waitlist`)
      .valueChanges()
      .pipe(
        map<any[], AttendeeModel[]>((snapshot) => {
          return snapshot
            .map((attendee) => {
              attendee.signUpDate = attendee.signUpDate.toDate();
              return attendee as AttendeeModel;
            })
            .sort((a, b) => (a.signUpDate > b.signUpDate ? 1 : -1));
        })
      );
  }
  getComments(eventId: string) {
    return this.firestore
      .collection(`/events/${eventId}/comments`)
      .valueChanges()
      .pipe(
        map<any[], CommentModel[]>((snapshot) => {
          return snapshot
            .map((comment) => {
              comment.createdDate = comment.createdDate.toDate();
              return comment as CommentModel;
            })
            .sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1));
        })
      );
  }
  getEventAttendees(id: string): Observable<AttendeeModel[]> {
    return this.firestore
      .collection(`/events/${id}/attendees`)
      .valueChanges()
      .pipe(
        map<any[], AttendeeModel[]>((snapshot) => {
          return snapshot
            .map((attendee) => {
              attendee.signUpDate = attendee.signUpDate.toDate();
              return attendee as AttendeeModel;
            })
            .sort((a, b) => (a.signUpDate > b.signUpDate ? 1 : -1));
        })
      );
  }
  addEvent(event: FSEventModel) {
    return this.firestore.doc<FSEventModel>(`/events/${event.id}`).set(event);
  }
  addComment(eventId: string, comment: CommentModel) {
    return this.firestore
      .doc(`/events/${eventId}/comments/${comment.id}`)
      .set({ ...comment });
  }
  getEvents(): Observable<FSEventModel[]> {
    return (
      this.firestore
        .collection<any>(`/events/`)
        //.where('startDate', '>', new Date().toString())
        .valueChanges()
        .pipe(
          map((docs) => {
            return docs.map((doc) => {
              doc.startDate = doc.startDate.toDate();
              doc.endDate = doc.endDate.toDate();
              doc.attendees = [];
              doc.waitlist = [];
              return doc as FSEventModel;
            });
          })
        )
    );
  }
  getEvent(id: string): Observable<FSEventModel> {
    return this.firestore
      .doc<any>(`/events/${id}`)
      .valueChanges()
      .pipe(
        map((doc) => {
          doc.startDate = doc.startDate.toDate();
          doc.endDate = doc.endDate.toDate();
          doc.attendees = [];
          doc.waitlist = [];
          doc = doc as FSEventModel;
          return doc;
        })
      );
  }
}
