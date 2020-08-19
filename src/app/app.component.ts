import { Component, OnInit } from "@angular/core";
import { AuthService } from "./shared/services/auth.service";
import { MessagingService } from "./shared/messaging.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "event-planning";
  message;
  constructor(
    public readonly authService: AuthService,
    private readonly messagingService: MessagingService
  ) {}
  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      console.log(this.authService.userData);
      this.messagingService.requestPermission(this.authService.userData.uid);
      this.messagingService.receiveMessage();
      this.message = this.messagingService.currentMessage;
    }
  }
}
