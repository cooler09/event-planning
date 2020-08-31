import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/shared/services/auth.service";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.component.html",
  styleUrls: ["./friends.component.scss"],
})
export class FriendsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  formGroup: FormGroup;
  searchResults: any[] = [];
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {
    this.subscription = new Subscription();
    this.formGroup = new FormGroup({
      name: new FormControl("", [Validators.required]),
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {}
  async search() {
    let username = this.formGroup.get("name").value;
    if (username) {
      this.searchResults = await this.userService.getUsers(username);
    }
  }
  async addFriend(friendId: string) {
    await this.userService.addFriend(friendId, this.authService.userData.uid);
  }
}
