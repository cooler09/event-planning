import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  @Output() fbClick: EventEmitter<any> = new EventEmitter();
  @Output() googleClick: EventEmitter<any> = new EventEmitter();
  @Output() createClick: EventEmitter<any> = new EventEmitter();

  formGroup: FormGroup;

  constructor() {
    this.formGroup = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      displayName: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit(): void {}
  create() {
    if (this.formGroup.valid) {
      this.createClick.emit({
        username: this.formGroup.get("email").value,
        pass: this.formGroup.get("password").value,
        displayName: this.formGroup.get("displayName").value,
      });
    }
  }
}
