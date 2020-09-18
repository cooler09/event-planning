import { Injectable, OnInit } from "@angular/core";
import { AddEvent } from "src/app/root-store/event-store/actions";
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
    this.eventSubscriptions[id] = this.eventService
      .getEvent(id)
      .subscribe((event) => {
        this.storeService.dispatch(
          new AddEvent(EventHelper.convertToReduxEvent(event))
        );
      });
  }
  registerAttendees(eventId: string) {
    if (this.attendeeSubscriptions[eventId]) return;
    this.attendeeSubscriptions[eventId] = this.eventService
      .getEventAttendees(eventId)
      .subscribe((event) => {
        //redux add
      });
  }
  unregisterEvent(id: string) {
    if (this.eventSubscriptions[id]) this.eventSubscriptions[id].unsubscribe();
  }
  unregisterAttendee(eventId: string) {
    if (this.attendeeSubscriptions[eventId])
      this.attendeeSubscriptions[eventId].unsubscribe();
  }
}
