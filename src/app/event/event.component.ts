import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  DocumentChangeAction,
} from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { EventModel } from "../shared/models/event-model";
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.scss"],
})
export class EventComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  id: string;
  event: EventModel;
  constructor(
    public readonly authService: AuthService,
    private readonly firestore: AngularFirestore,
    private readonly route: ActivatedRoute
  ) {}
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

  private mapDocumentIdWithData(changes: DocumentChangeAction<{}>[]): any[] {
    let newData = changes.map((p) => {
      const data = p.payload.doc.data();
      const id = p.payload.doc.id;
      return { id, ...data };
    });

    return newData;
  }
}
