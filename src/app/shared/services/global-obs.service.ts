import { Injectable, OnInit } from "@angular/core";
import {
  AddAttendees,
  AddComments,
  AddEvent,
  AddWaitlist,
} from "src/app/root-store/event-store/actions";
import EventHelper from "../utils/event-helper";
import { EventService } from "./event.service";
import { StoreService } from "./store.service";

@Injectable({
  providedIn: "root",
})
export class GlobalObsService implements OnInit {
  eventSubscriptions: any = {};
  attendeeSubscriptions: any = {};
  constructor(
    private readonly storeService: StoreService,
    private readonly eventService: EventService
  ) {}
  ngOnInit(): void {}
  registerEvent(id: string) {
    if (this.eventSubscriptions[id]) return;
    this.eventSubscriptions[id] = {
      event: this.eventService.getEvent(id).subscribe((event) => {
        this.storeService.dispatch(
          new AddEvent(EventHelper.convertToReduxEvent(event))
        );
      }),
      attendees: this.eventService
        .getEventAttendees(id)
        .subscribe((attendees) => {
          this.storeService.dispatch(
            new AddAttendees({ eventId: id, attendees })
          );
        }),
      waitlist: this.eventService.getEventWaitlist(id).subscribe((waitlist) => {
        this.storeService.dispatch(new AddWaitlist({ eventId: id, waitlist }));
      }),
      comments: this.eventService.getComments(id).subscribe((comments) => {
        this.storeService.dispatch(new AddComments({ eventId: id, comments }));
      }),
    };
  }
  unregisterEvent(id: string) {
    if (this.eventSubscriptions[id]) {
      this.eventSubscriptions[id].event.unsubscribe();
      this.eventSubscriptions[id].attendees.unsubscribe();
      this.eventSubscriptions[id].waitlist.unsubscribe();
      this.eventSubscriptions[id].comments.unsubscribe();
    }
  }
}
