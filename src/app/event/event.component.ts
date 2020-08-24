import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  DocumentChangeAction,
} from "@angular/fire/firestore";
import { v4 as uuid } from "uuid";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { EventModel } from "../shared/models/event-model";
import { AuthService } from "../shared/services/auth.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { AttendeeModel } from "../shared/models/attendee-model";
import DateHelper from "../shared/utils/date-helper";
import { EventService } from "../shared/services/event.service";
import { CommentModel } from "../shared/models/comment-model";
import { UserService } from "../shared/services/user.service";

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
  comments: CommentModel[];
  formGroup: FormGroup;
  positions: string[] = [];
  commentText: string = "test";
  formatDate = DateHelper.formatDate;
  constructor(
    public readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    public readonly router: Router,
    private readonly eventService: EventService,
    private readonly userService: UserService
  ) {
    this.formGroup = new FormGroup({
      positions: new FormControl("", [Validators.required]),
    });
    this.attendees = [];
    this.waitlist = [];
    this.comments = [];
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
              this.attendees = attendees;
            })
        );

        this.subscriptions.push(
          this.eventService.getEventWaitlist(this.id).subscribe((waitlist) => {
            this.waitlist = waitlist;
          })
        );
        this.subscriptions.push(
          this.eventService.getComments(this.id).subscribe((comments) => {
            this.comments = comments;
          })
        );
      })
    );
  }
  comment() {
    let comment = new CommentModel(
      uuid(),
      this.authService.userData.uid,
      new Date(),
      this.commentText
    ).setUsername(this.authService.userData.displayName);
    this.eventService.addComment(this.event.id, comment).then();
  }
  isSignedUp() {
    return (
      this.authService.isLoggedIn &&
      this.eventService.isSignedUp(
        this.attendees,
        this.waitlist,
        this.authService.userData.uid
      )
    );
  }
  removeAttendee(attendee: AttendeeModel) {
    this.eventService
      .removeAttendee(this.event, attendee.id, this.waitlist)
      .then((_) => {
        this.userService.removeEvent(attendee.userId, this.event.id).then();
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
      this.addWaitlistOrAttendee(
        this.event.id,
        this.authService.userData,
        attendee
      );
      this.formGroup.reset();
    }
  }
  signUpAsGuest() {
    if (!this.authService.isLoggedIn) {
      this.authService.SignUpAnonymously().then((_) => {
        console.log(_);
      });
    }
  }
  private addWaitlistOrAttendee(
    eventId: string,
    userData: any,
    attendee: AttendeeModel
  ) {
    this.userService.addEvent(userData, eventId);
    if (this.attendees.length < this.event.maxAttendees) {
      this.eventService.addAttendeeFirebase(eventId, attendee).then();
    } else {
      this.eventService.addWaitlistFirebase(eventId, attendee).then();
    }
  }
}
