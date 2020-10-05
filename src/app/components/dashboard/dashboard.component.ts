import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/shared/services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  subscriptions: Subscription[];
  user: any;
  constructor(
    public readonly authService: AuthService,
    private readonly firestore: AngularFirestore
  ) {
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.firestore
        .doc(`/users/${this.authService.userData.uid}`)
        .valueChanges()
        .subscribe((user) => {
          console.log(user);
          this.user = user;
        })
    );
  }
  onDestroy() {
    this.subscriptions.forEach((_) => {
      _.unsubscribe();
    });
  }
}
