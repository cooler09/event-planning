import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-social-login",
  templateUrl: "./social-login.component.html",
  styleUrls: ["./social-login.component.scss"],
})
export class SocialLoginComponent implements OnInit {
  @Output() googleClick: EventEmitter<void> = new EventEmitter();
  @Output() facebookClick: EventEmitter<void> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
