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
import { MatDialog } from "@angular/material/dialog";
import { GuestDialogComponent } from "../shared/components/guest-dialog/guest-dialog.component";
import { StoreService } from "../shared/services/store.service";
import { selectEvent } from "../root-store/event-store/selectors";
import { GlobalObsService } from "../shared/services/global-obs.service";

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
  positions: string[] = [];
  commentText: string = "";
  formatDate = DateHelper.formatDate;
  constructor(
    public readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    public readonly router: Router,
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private readonly globalObsService: GlobalObsService,
    public readonly dialog: MatDialog
  ) {
    this.formGroup = new FormGroup({
      positions: new FormControl("", [Validators.required]),
    });
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
        this.globalObsService.registerEvent(this.id);
        this.subscriptions.push(
          this.storeService.select(selectEvent(this.id)).subscribe((event) => {
            this.event = event;
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
        this.event.attendees,
        this.event.waitlist,
        this.authService.userData.uid
      )
    );
  }
  removeAttendee(attendee: AttendeeModel) {
    this.eventService
      .removeAttendee(
        this.event.id,
        this.event.waitListEnabled,
        attendee.id,
        this.event.waitlist
      )
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
    const dialogRef = this.dialog.open(GuestDialogComponent, {
      width: "500px",
      data: { displayName: "" },
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.displayName) {
          this.authService.SignUpAnonymously(result.displayName).then();
        }
      })
    );
  }
  private addWaitlistOrAttendee(
    eventId: string,
    userData: any,
    attendee: AttendeeModel
  ) {
    this.userService.addEvent(userData, eventId);
    if (this.event.attendees.length < this.event.maxAttendees) {
      this.eventService.addAttendeeFirebase(eventId, attendee).then();
    } else {
      this.eventService.addWaitlistFirebase(eventId, attendee).then();
    }
  }
}
