import { Component, OnInit, OnDestroy } from "@angular/core";
import { v4 as uuid } from "uuid";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EventModel } from "../shared/models/event-model";
import { AuthService } from "../shared/services/auth.service";
import { EventService } from "../shared/services/event.service";
import { UserService } from "../shared/services/user.service";
import { Subscription, merge } from "rxjs";
import DateHelper from "../shared/utils/date-helper";

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
  friendRef: any = {};
  friends: any[] = [];

  objectValues = Object.values;
  formatDate = DateHelper.formatDate;

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly eventService: EventService,
    private readonly userService: UserService
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
    if (this.authService.isLoggedIn) {
      this.subscription.add(
        this.userService
          .getUserData<any>(this.authService.userData.uid)
          .subscribe((userData) => {
            if (userData) {
              if (userData.events && userData.events.length > 0) {
                let events = userData.events.map((event) => {
                  return this.eventService.getEvent(event);
                });
                this.subscription.add(
                  merge<EventModel>(...events).subscribe((event) => {
                    this.eventRef[event.id] = event;
                    this.events = Object.values(this.eventRef) as EventModel[];
                  })
                );
              } else {
                this.eventRef = {};
                this.events = Object.values(this.eventRef) as EventModel[];
              }
              if (userData.friends && userData.friends.length > 0) {
                let friends = userData.friends.map((friend) => {
                  return this.userService.getFriendData(friend);
                });
                this.subscription.add(
                  merge<any>(...friends).subscribe((user) => {
                    this.friendRef[user.uid] = user;
                    this.friends = Object.values(this.friendRef) as any[];
                  })
                );
              } else {
                this.friendRef = {};
                this.friends = Object.values(this.friendRef) as any[];
              }
            }
          })
      );
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
