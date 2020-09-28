import { Component, OnInit, OnDestroy } from "@angular/core";
import { v4 as uuid } from "uuid";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EventModel } from "../shared/models/event-model";
import { AuthService } from "../shared/services/auth.service";
import { EventService } from "../shared/services/event.service";
import { Subscription, merge } from "rxjs";
import DateHelper from "../shared/utils/date-helper";
import { MatDialog } from "@angular/material/dialog";
import { AccountUpgradeDialogComponent } from "../shared/components/account-upgrade-dialog/account-upgrade-dialog.component";
import { StoreService } from "../shared/services/store.service";
import { selectEvent } from "../root-store/event-store/selectors";
import EventHelper from "../shared/utils/event-helper";
import { selectCurrentUser } from "../root-store/user-store/selectors";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  formGroup: FormGroup;
  minutes: number[] = [];
  hours: number[] = [];
  userRef: any;
  eventRef: any = {};
  events: EventModel[] = [];
  publicEvents: EventModel[] = [];
  friendRef: any = {};
  friends: any[] = [];

  objectValues = Object.values;
  formatDate = DateHelper.formatDate;

  constructor(
    public readonly authService: AuthService,
    private readonly storeService: StoreService,
    public readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly eventService: EventService
  ) {
    this.subscription = new Subscription();
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
    this.subscription.add(
      this.storeService.select(selectCurrentUser).subscribe((currentUser) => {
        console.log(currentUser);
        if (currentUser && currentUser.events) {
          let obs = currentUser.events.map((eventId) => {
            return this.storeService.select(selectEvent(eventId));
          });
          this.subscription.add(
            merge(...obs).subscribe((event) => {
              if (event) {
                console.log(event);
                this.eventRef[event.id] = event;
                this.events = Object.values(this.eventRef) as EventModel[];
              }
            })
          );
        }
      })
    );
    this.subscription.add(
      this.eventService.getEvents().subscribe((events) => {
        if (events) {
          this.publicEvents = events.map((event) =>
            EventHelper.convertToReduxEvent(event)
          );
        }
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  upgradeAccount() {
    this.dialog.open(AccountUpgradeDialogComponent, {
      width: "500px",
      data: { displayName: "" },
    });
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
    Promise.all([
      this.eventService.addEvent(parsedEvent),
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
