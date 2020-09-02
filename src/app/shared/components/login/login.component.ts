import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  @Output() fbClick: EventEmitter<any> = new EventEmitter();
  @Output() googleClick: EventEmitter<any> = new EventEmitter();
  @Output() createClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
