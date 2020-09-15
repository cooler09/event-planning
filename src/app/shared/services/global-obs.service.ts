import { Injectable, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { merge, of } from "rxjs";
import { mergeAll } from "rxjs/operators";
import { AddEvent } from "src/app/root-store/event-store/actions";
import { AuthService } from "./auth.service";
import { EventService } from "./event.service";
import { StoreService } from "./store.service";

@Injectable({
  providedIn: "root",
})
export class GlobalObsService implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly firestore: AngularFirestore,
    private readonly storeService: StoreService,
    private readonly eventService: EventService
  ) {
    let obs = this.authService.userData.events.map((event) => {
      return this.eventService.getEvent(event);
    });
    merge(...obs).subscribe((event) => {
      this.storeService.dispatch(new AddEvent(event));
    });
  }
  ngOnInit(): void {}
}
