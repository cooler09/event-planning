import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  DocumentChangeAction,
} from "@angular/fire/firestore";
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
            .doc<EventModel>(`/events/${this.id}`)
            .valueChanges()
            .subscribe((_) => {
              this.event = _;
            })
        );
      })
    );
  }
  addAttendee() {
    let name = this.formGroup.get("name").value;
    let attendee = new AttendeeModel();
    attendee.name = name;
    this.event.attendees.push(attendee);
    this.firestore.doc<EventModel>(`/events/${this.id}`).set(this.event);
  }
}
