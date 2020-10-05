import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-guest-dialog",
  templateUrl: "./guest-dialog.component.html",
  styleUrls: ["./guest-dialog.component.scss"],
})
export class GuestDialogComponent implements OnInit {
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<GuestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formGroup = new FormGroup({
      displayName: new FormControl(data.displayName, [Validators.required]),
    });
  }

  ngOnInit(): void {}
  signUp(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close({
        displayName: this.formGroup.get("displayName").value,
      });
    }
  }
}
