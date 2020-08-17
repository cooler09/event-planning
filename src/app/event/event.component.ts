import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  DocumentChangeAction,
} from "@angular/fire/firestore";
import { v4 as uuid } from "uuid";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { EventModel } from "../shared/models/event-model";
import { AuthService } from "../shared/services/auth.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { AttendeeModel } from "../shared/models/attendee-model";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.scss"],
})
export class EventComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  id: string;
  event: EventModel;
  formGroup: FormGroup;
  constructor(
    public readonly authService: AuthService,
    private readonly firestore: AngularFirestore,
    private readonly route: ActivatedRoute
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl("", [Validators.required]),
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((_) => {
      _.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.id = params["id"];
        this.subscriptions.push(
          this.firestore
            .doc<any>(`/events/${this.id}`)
            .valueChanges()
            .subscribe((_) => {
              _.startDate = _.startDate.toDate();
              _.endDate = _.endDate.toDate();
              _.attendees = _.attendees.map((attendee) => {
                if (attendee && attendee.signUpDate)
                  attendee.signUpDate = attendee.signUpDate.toDate();
                return attendee;
              });
              _.waitList = _.waitList.map((attendee) => {
                if (attendee && attendee.signUpDate)
                  attendee.signUpDate = attendee.signUpDate.toDate();
                return attendee;
              });
              this.event = _ as EventModel;
            })
        );
      })
    );
  }

  formatDate(d: Date) {
    let minutes =
        d.getMinutes().toString().length == 1
          ? "0" + d.getMinutes()
          : d.getMinutes(),
      hours =
        d.getHours().toString().length == 1 ? "0" + d.getHours() : d.getHours(),
      ampm = d.getHours() >= 12 ? "pm" : "am",
      months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      months[d.getMonth()] +
      " " +
      d.getDate() +
      " " +
      d.getFullYear() +
      " " +
      hours +
      ":" +
      minutes +
      ampm
    );
  }
  removeAttendee(id: string) {
    this.event.attendees = this.event.attendees.filter(
      (item) => item.id !== id
    );
    if (this.event.waitListEnabled && this.event.waitList.length > 0) {
      let nextUser = this.event.waitList
        .sort((a, b) => (a.signUpDate < b.signUpDate ? 1 : -1))
        .pop();
      this.event.attendees.push(nextUser);
    }
    this.firestore.doc(`/events/${this.id}`).set(
      {
        attendees: this.event.attendees.map((_) => Object.assign({}, _)),
        waitList: this.event.waitList.map((_) => Object.assign({}, _)),
      },
      { merge: true }
    );
  }
  addAttendee() {
    let name = this.formGroup.get("name").value;
    let attendee = new AttendeeModel();
    attendee.id = uuid();
    attendee.name = name;
    attendee.signUpDate = new Date();
    if (this.event.attendees.length < this.event.maxAttendees + 1) {
      this.event.attendees.push(attendee);
      this.firestore.doc(`/events/${this.id}`).set(
        {
          attendees: this.event.attendees.map((_) => Object.assign({}, _)),
        },
        { merge: true }
      );
    } else {
      this.event.waitList.push(attendee);
      this.firestore.doc(`/events/${this.id}`).set(
        {
          waitList: this.event.waitList.map((_) => Object.assign({}, _)),
        },
        { merge: true }
      );
    }

    this.formGroup.get("name").setValue("");
  }
}
