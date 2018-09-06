import { Component, OnInit } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';



@Component({
  selector: 'app-employee-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.css']
})
export class EmployeeRegisterComponent implements OnInit {

  registerForm : FormGroup;
  firstname: FormControl;
  lastname: FormControl;
  email:FormControl;
  password:FormControl;

  userId : any;

  constructor(public snackBar: MatSnackBar,public db: AngularFireDatabase,private fb: FormBuilder, private auth : AuthService, private router : Router) { }



  ngOnInit() {
    this.createControls();
    this.createForm();
  }


  register(){
    
    if(this.registerForm.valid){
      this.auth.emailSignUp(this.email.value,this.password.value).then(
        (data: any) => {
          console.log(data);
          this.userId = data.uid;
          this.db.object('/employees/'+this.userId).set(this.registerForm.value);
          this.snackBar.open("Registration successful","Close");
          this.router.navigateByUrl("/login");
        }
      );
    }
  }

  createControls() {
    this.firstname = new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]+$')
    ])
    this.lastname = new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]+$')
    ])
    
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@inmar.com$')
    ])
    
    this.password = new FormControl('', [
      Validators.required
    ])
    
    
  }

  createForm() {
    this.registerForm = new FormGroup({

      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password
    });
  }

}
