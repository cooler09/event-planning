import { Injectable, NgZone } from "@angular/core";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  _userData: any; // Save logged in user data
  subscriptions: Subscription[] = [];

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    private readonly route: ActivatedRoute,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.subscriptions.push(
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.subscriptions.push(
            this.getUserData(user.uid).subscribe((_) => {
              if (_) {
                this.setLocalStorage(_);
              } else {
                this.afs
                  .doc(`/users/${user.uid}`)
                  .set(this.parseUserData(user), { merge: true });
              }
            })
          );
        } else {
          this.setLocalStorage(null);
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((_) => {
      _.unsubscribe();
    });
  }
  setLocalStorage(user) {
    this._userData = user;
    localStorage.setItem("user", user ? JSON.stringify(user) : user);
    JSON.parse(localStorage.getItem("user"));
  }
  get userData(): any {
    if (this._userData) return this._userData;

    let userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      this._userData = userData;
      return userData;
    }

    return null;
  }

  SignUpAnonymously() {
    return this.afAuth
      .signInAnonymously()
      .then((result) => {
        result.user.updateProfile({
          displayName: "Anonymous",
        });
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
        result.user.updateProfile({
          displayName: displayName,
        });
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  async SendVerificationMail() {
    return (await this.afAuth.currentUser).sendEmailVerification().then(() => {
      this.router.navigate(["verify-email-address"]);
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

  // Returns true when user is logged in and email is verified
  get isLoggedIn(): boolean {
    let user = this.userData;
    return user !== null ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          let returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
          this.router.navigate([returnUrl]);
        });
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  getUserData(id: string) {
    return this.afs.doc(`/users/${id}`).valueChanges();
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem("user");
    });
  }
  private parseUserData(user) {
    return {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
    };
  }
}
