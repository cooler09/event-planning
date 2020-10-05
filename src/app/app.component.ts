import { Component, OnInit } from "@angular/core";
import { AuthService } from "./shared/services/auth.service";
import { MessagingService } from "./shared/messaging.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { GlobalObsService } from "./shared/services/global-obs.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "event-planning";
  message;
  notifications: any[];
  constructor(
    public readonly authService: AuthService,
    private readonly globalObs: GlobalObsService,
    private readonly messagingService: MessagingService,
    private readonly angularFireDB: AngularFirestore
  ) {
    this.notifications = [];
  }
  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.messagingService.requestPermission(this.authService.userData.uid);
      this.messagingService.receiveMessage(this.authService.userData.uid);
      this.message = this.messagingService.currentMessage;
      this.angularFireDB
        .collection(`users/${this.authService.userData.uid}/messages`)
        .valueChanges()
        .subscribe((_) => {
          this.notifications = _;
        });
    }
  }
}
