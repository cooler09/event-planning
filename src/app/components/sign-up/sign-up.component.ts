import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/shared/services/auth.service";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
  createUser(data: any) {
    this.authService.SignUp(data.username, data.pass, data.displayName);
  }
}
