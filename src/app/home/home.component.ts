import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { v4 as uuid } from "uuid";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EventModel } from "../shared/models/event-model";
import { AuthService } from "../shared/services/auth.service";
import { EventService } from "../shared/services/event.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  formGroup: FormGroup;
  minutes: number[] = [];
  hours: number[] = [];
  userRef: AngularFirestoreDocument<any>;

  constructor(
    public readonly authService: AuthService,
    private readonly firestore: AngularFirestore,
    private readonly router: Router,
    private readonly eventService: EventService
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl("", [Validators.required]),
      location: new FormControl("", [Validators.required]),
      date: new FormControl("", [Validators.required]),
      startHour: new FormControl("", [Validators.required]),
      startMinute: new FormControl("", [Validators.required]),
      endHour: new FormControl("", [Validators.required]),
      endMinute: new FormControl("", [Validators.required]),
      hasMaxAttendees: new FormControl(true, [Validators.required]),
      waitListEnabled: new FormControl(true, [Validators.required]),
      maxAttendees: new FormControl(12, []),
    });
    this.minutes = [0, 15, 30, 45];
    for (let index = 1; index <= 24; index++) {
      this.hours.push(index);
    }
  }

  ngOnInit(): void {
    this.userRef = this.firestore.doc(`users/${this.authService.userData.uid}`);
  }
  createEvent() {
    let name = this.formGroup.get("name").value;
    let location = this.formGroup.get("location").value;
    let date = this.formGroup.get("date").value;
    let startDate = new Date(date);
    startDate.setHours(this.formGroup.get("startHour").value);
    startDate.setMinutes(this.formGroup.get("startMinute").value);
    let endDate = new Date(date);
    endDate.setHours(this.formGroup.get("endHour").value);
    endDate.setMinutes(this.formGroup.get("endMinute").value);
    let id = uuid();
    let eventModel = new EventModel();
    eventModel.id = id;
    eventModel.name = name;
    eventModel.location = location;
    eventModel.startDate = startDate;
    eventModel.endDate = endDate;
    eventModel.maxAttendees = +this.formGroup.get("maxAttendees").value;
    eventModel.waitListEnabled = this.formGroup.get("waitListEnabled").value;
    eventModel.userId = this.authService.userData.uid;
    let parsedEvent = Object.assign({}, eventModel);
    delete parsedEvent["attendees"];
    delete parsedEvent["waitList"];
    delete parsedEvent["comments"];
    Promise.all([
      this.firestore.doc<EventModel>(`/events/${id}`).set({ ...parsedEvent }),
      ...[].map((attendee) =>
        this.eventService.addAttendeeFirebase(id, attendee)
      ),
      ...[].map((attendee) =>
        this.eventService.addWaitlistFirebase(id, attendee)
      ),
    ]).then(() => {
      this.router.navigate(["event", id]);
    });
  }
}
