import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { v4 as uuid } from "uuid";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  formGroup: FormGroup;
  minutes: number[] = [];
  hours: number[] = [];

  constructor(private firestore: AngularFirestore) {
    this.formGroup = new FormGroup({
      name: new FormControl("", [Validators.required]),
      date: new FormControl("", [Validators.required]),
      startHour: new FormControl("", [Validators.required]),
      startMinute: new FormControl("", [Validators.required]),
      endHour: new FormControl("", [Validators.required]),
      endMinute: new FormControl("", [Validators.required]),
    });
    this.minutes = [0, 15, 30, 45];
    for (let index = 1; index <= 24; index++) {
      this.hours.push(index);
    }
  }

  ngOnInit(): void {}
  createEvent() {
    let name = this.formGroup.get("name").value;
    let date = this.formGroup.get("date").value;
    let startDate = new Date(date);
    startDate.setHours(this.formGroup.get("startHour").value);
    startDate.setMinutes(this.formGroup.get("startMinute").value);
    let endDate = new Date(date);
    endDate.setHours(this.formGroup.get("endHour").value);
    endDate.setMinutes(this.formGroup.get("endMinute").value);
    console.log(name);
    this.firestore.collection("events").doc(uuid()).set({
      name: name,
      startDate: startDate,
      endDate: endDate,
    });
  }
}
