import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import firebase from "firebase";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string;
  password: string;

  constructor(public auth: AngularFireAuth) {
  }
  login() {

    var userCredentialPromise = this.auth.signInWithEmailAndPassword(this.email, this.password);
    console.log(userCredentialPromise);
  }
  logout() {
    this.auth.signOut();
  }

}
