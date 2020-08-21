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
import DateHelper from "../shared/utils/date-helper";
import { EventService } from "../shared/services/event.service";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.scss"],
})
export class EventComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  id: string;
  event: EventModel;
  attendees: AttendeeModel[];
  waitlist: AttendeeModel[];
  formGroup: FormGroup;
  positions: string[] = [];
  formatDate = DateHelper.formatDate;
  constructor(
    public readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly eventService: EventService
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl("", [Validators.required]),
      positions: new FormControl("", [Validators.required]),
    });
    this.attendees = [];
    this.waitlist = [];
    this.positions = [
      "Setter",
      "Libero",
      "Middle Hitter",
      "Outside Hitter",
      "Opposite Hitter",
    ];
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
          this.eventService.getEvent(this.id).subscribe((event) => {
            this.event = event;
          })
        );

        this.subscriptions.push(
          this.eventService
            .getEventAttendees(this.id)
            .subscribe((attendees) => {
              console.log(attendees);
              this.attendees = attendees;
            })
        );

        this.subscriptions.push(
          this.eventService.getEventWaitlist(this.id).subscribe((waitlist) => {
            console.log(waitlist);
            this.waitlist = waitlist;
          })
        );
      })
    );
  }

  isSignedUp() {
    return this.eventService.isSignedUp(
      this.attendees,
      this.waitlist,
      this.authService.userData.uid
    );
  }
  removeAttendee(id: string) {
    this.eventService
      .removeAttendee(this.event, id, this.waitlist)
      .then((_) => {
        console.log(`user ${id} was removed`);
      });
  }
  signUp() {
    if (this.authService.isLoggedIn) {
      let attendee = new AttendeeModel(
        uuid(),
        this.authService.userData.displayName,
        new Date()
      )
        .setPositions(this.formGroup.get("positions").value)
        .setUserId(this.authService.userData.uid);
      this.addWaitlistOrAttendee(this.event.id, attendee);
    }
  }
  addAttendee() {
    let name = this.formGroup.get("name").value;
    if (name) {
      let attendee = new AttendeeModel(uuid(), name, new Date()).setPositions(
        this.formGroup.get("positions").value
      );
      this.addWaitlistOrAttendee(this.event.id, attendee);
      this.formGroup.get("positions").setValue("");
      this.formGroup.get("name").setValue("");
    }
  }
  private addWaitlistOrAttendee(eventId: string, attendee: AttendeeModel) {
    if (this.attendees.length < this.event.maxAttendees) {
      this.eventService.addAttendeeFirebase(eventId, attendee).then();
    } else {
      this.eventService.addWaitlistFirebase(eventId, attendee).then();
    }
  }
}
