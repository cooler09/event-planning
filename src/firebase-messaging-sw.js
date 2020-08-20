// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "#{firebase.apiKey}#",
  authDomain: "#{firebase.authDomain}#",
  databaseURL: "#{firebase.databaseURL}#",
  projectId: "#{firebase.projectId}#",
  storageBucket: "#{firebase.storageBucket}#",
  messagingSenderId: "#{firebase.messagingSenderId}#",
  appId: "#{firebase.appId}#",
  measurementId: "#{firebase.measurementId}#",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
