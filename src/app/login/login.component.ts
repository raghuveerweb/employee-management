import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup;
  
  username : FormControl;
  password : FormControl 

  constructor(public snackBar: MatSnackBar,public db: AngularFireDatabase,private fb: FormBuilder, private auth : AuthService, private router : Router) {
    
  }

  ngOnInit() {
    let isLoggedIn = localStorage.getItem("userId");
    if(isLoggedIn){
      this.router.navigateByUrl("/app/dashboard");
    }
    this.createControls();
    this.createForm();
  }

  login(){
    this.auth.emailLogin(this.username.value, this.password.value).then(
      (data: any) => {
        console.log('data:::',data);
        if(data.code){
          this.snackBar.open("Please check your username or password","Close");
        }else{
          localStorage.setItem('userId',data.uid);
          localStorage.setItem('email',this.username.value);

          this.router.navigateByUrl("/app/dashboard");
        }
      }
    )
  }

  createControls() {
    this.username = new FormControl('', [
      Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@inmar.com$')
    ])
    this.password = new FormControl('', [
      Validators.required
    ])
    
  }

  createForm() {
    this.loginForm = new FormGroup({
      username: this.username,
      password: this.password
    });
  }

}
