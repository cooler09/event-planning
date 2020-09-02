import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-account-upgrade-dialog",
  templateUrl: "./account-upgrade-dialog.component.html",
  styleUrls: ["./account-upgrade-dialog.component.scss"],
})
export class AccountUpgradeDialogComponent implements OnInit {
  constructor(
    public readonly authService: AuthService,
    public dialogRef: MatDialogRef<AccountUpgradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
  createUser(data: any) {
    this.authService.UpgradeAccount(data.username, data.pass, data.displayName);
  }
}
