import { Injectable, NgZone } from "@angular/core";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription, of, Observable, merge } from "rxjs";
import { UserService } from "./user.service";
import { User } from "../models/user";
import { StoreService } from "./store.service";
import { SetCurrentUser } from "src/app/root-store/user-store/actions";
import { selectCurrentUser } from "src/app/root-store/user-store/selectors";
import { GlobalObsService } from "./global-obs.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  _userData: User; // Save logged in user data
  subscriptions: Subscription;
  userDataSubscription: Subscription;

  // Returns true when user is logged in and email is verified
  get isLoggedIn(): boolean {
    let user = this.userData;
    return user !== null ? true : false;
  }

  get userData(): User {
    if (this._userData) return this._userData;

    let userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      this._userData = userData;
      return userData;
    }

    return null;
  }

  constructor(
    public readonly afs: AngularFirestore, // Inject Firestore service
    public readonly afAuth: AngularFireAuth, // Inject Firebase auth service
    public readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private readonly globalService: GlobalObsService,
    public readonly ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    this.userDataSubscription = new Subscription();
    this.subscriptions = new Subscription();

    this.subscriptions.add(
      this.storeService.select(selectCurrentUser).subscribe((currentUser) => {
        this.setLocalStorage(currentUser);
        if (currentUser && currentUser.events) {
          currentUser.events.forEach((event) => {
            this.globalService.registerEvent(event);
          });
        }
      })
    );
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.subscriptions.add(
      this.AuthState().subscribe((user) => {
        // if user is logged in
        if (user) {
          // subscribe to any changes in firebase
          this.userService
            .getUserData(user.uid)
            .valueChanges()
            .subscribe((_) => {
              console.log("User data", _);

              // checks if we have valid information
              if (_ && _["uid"]) {
                // set the redux store
                this.storeService.dispatch(
                  new SetCurrentUser(new User().setData(_))
                );
              } else {
                let data = new User().setData(user);
                this.userService.setUserData(data);
              }
            });
        } else {
          this.clearUserData();
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.userDataSubscription.unsubscribe();
  }
  AuthState(): Observable<firebase.User> {
    return this.afAuth.authState;
  }
  UpgradeAccount(email: string, password: string, displayName: string = "") {
    var credential = auth.EmailAuthProvider.credential(email, password);
    this.afAuth.currentUser.then((user) => {
      user.linkWithCredential(credential).then(
        (data) => {
          console.log("Anonymous account successfully upgraded", data);
          if (displayName) {
            this.clearUserData();
            data.user.updateProfile({
              displayName: displayName,
            });
          }
          /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
          this.SendVerificationMail(false);
        },
        (error) => {
          console.log("Error upgrading anonymous account", error);
        }
      );
    });
  }
  SignUpAnonymously(displayName: string) {
    return this.afAuth
      .signInAnonymously()
      .then((result) => {
        result.user
          .updateProfile({
            displayName: displayName ? displayName : "Anonymous",
          })
          .then();
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          let returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
          this.router.navigate([returnUrl]);
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email, password, displayName) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (displayName) {
          result.user.updateProfile({
            displayName: displayName,
          });
        }
        /* Call the SendVerificaitonMail() function when new user sign 
    up and returns promise */
        this.SendVerificationMail();
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  async SendVerificationMail(routeAway: boolean = true) {
    return (await this.afAuth.currentUser).sendEmailVerification().then(() => {
      if (routeAway) this.router.navigate(["verify-email-address"]);
    });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Sign in with Google
  GoogleAuth(migrateUser: string = null) {
    return this.AuthLogin(new auth.GoogleAuthProvider(), migrateUser);
  }
  FacebookAuth(migrateUser: string = null) {
    return this.AuthLogin(new auth.FacebookAuthProvider(), migrateUser);
  }

  // Auth logic to run auth providers
  AuthLogin(provider, migrateUser: string = null) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        if (migrateUser) {
          this.migrateUser(migrateUser, result.user.uid).then(() => {
            this.clearUserData();
            this.ngZone.run(() => {
              let returnUrl =
                this.route.snapshot.queryParams["returnUrl"] || "/";
              this.router.navigate([returnUrl]);
            });
          });
        } else {
          this.ngZone.run(() => {
            let returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
            this.router.navigate([returnUrl]);
          });
        }
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      this.clearUserData();
    });
  }
  private async migrateUser(refUserId: string, destUserId): Promise<void> {
    let doc = await this.afs.doc(`/users/${refUserId}`).get().toPromise();
    if (doc.exists) {
      let data = doc.data();
      if (data && data.events) {
        await this.afs.doc(`/users/${destUserId}`).set(
          {
            events: data.events,
          },
          { merge: true }
        );
        await this.afs.doc(`/users/${refUserId}`).delete();

        let promises = data.events.forEach((event) => {
          return new Promise(async () => {
            let attendeesRef = await this.afs
              .collection(`/events/${event}/attendees`, (ref) =>
                ref.where("userId", "==", refUserId)
              )
              .get()
              .toPromise();
            let attendees = attendeesRef.docs.map((doc) => {
              return new Promise(async () => {
                await this.afs.doc(`/events/${event}/attendees/${doc.id}`).set({
                  ...doc.data(),
                  userId: destUserId,
                });
              });
            });
            let waitlistRef = await this.afs
              .collection(`/events/${event}/waitlist`, (ref) =>
                ref.where("userId", "==", refUserId)
              )
              .get()
              .toPromise();
            let waitlistUsers = waitlistRef.docs.map((doc) => {
              return new Promise(async () => {
                await this.afs.doc(`/events/${event}/waitlist/${doc.id}`).set({
                  ...doc.data(),
                  userId: destUserId,
                });
              });
            });
            let commentsRef = await this.afs
              .collection(`/events/${event}/comments`, (ref) =>
                ref.where("userId", "==", refUserId)
              )
              .get()
              .toPromise();
            let comments = commentsRef.docs.map((doc) => {
              return new Promise(async () => {
                await this.afs.doc(`/events/${event}/comments/${doc.id}`).set({
                  ...doc.data(),
                  userId: destUserId,
                });
              });
            });

            await Promise.all(attendees);
            await Promise.all(waitlistUsers);
            await Promise.all(comments);
          });
        });
        await Promise.all(promises);
      }
    }
    return Promise.resolve();
  }

  private clearUserData() {
    console.log("clearing subs");
    this.storeService.dispatch(new SetCurrentUser(null));
    this.userDataSubscription.unsubscribe();
    this._userData = null;
    localStorage.removeItem("user");
  }
  private setLocalStorage(user) {
    this._userData = user;
    localStorage.setItem("user", user ? JSON.stringify(user) : user);
  }
}
