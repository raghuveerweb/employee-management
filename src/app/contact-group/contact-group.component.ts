import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscriber } from 'rxjs';
import { FirebaseApp } from 'angularfire2';
import { environment } from '../../environments/environment.prod';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-contact-group',
  templateUrl: './contact-group.component.html',
  styleUrls: ['./contact-group.component.css']
})
export class ContactGroupComponent implements OnInit {

  userId : any;
  contactGroupArray : any = [];
  groupsPresent : boolean = false;
  contactGroupForm : FormGroup;
  groupName: FormControl;
  groupDescription: FormControl;

  constructor(public db: AngularFireDatabase,private fb: FormBuilder, private router: Router, private snackBar : MatSnackBar) { }

  ngOnInit() {
    this.userId = localStorage.getItem("userId");
    this.createControls();
    this.createForm();
    this.db.list("/contactInformation/"+this.userId).valueChanges().subscribe(data=>{
      console.log("DATA::::",data);
      if(data.length != 0){
        this.groupsPresent = true;
        this.contactGroupArray = data[0];
        //console.log(this.contactGroupArray);
      }
    });
  }

  getIndexOfelement(arrayTocheck, attr, value) {
    for (var i = 0; i < arrayTocheck.length; i += 1) {
      if (arrayTocheck[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }

  addContactGroup(){
    if(this.getIndexOfelement(this.contactGroupArray,'groupName', this.groupName.value) == -1){
      //alert(this.contactGroupForm.valid);
      if(this.contactGroupForm.valid){
        this.contactGroupArray.push(this.contactGroupForm.value);
        let updateInfo = this.db.object('/contactInformation/'+this.userId+'/ContactGroups').set(this.contactGroupArray);
        this.snackBar.open("Group added successfully","Close");
        this.router.navigateByUrl("/app/dashboard");
      }
    }else{
      this.snackBar.open("Group already exist","Close");
    }
  }

  createControls() {
    this.groupName = new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]+$')
    ])
    this.groupDescription = new FormControl('', [
      Validators.required
    ])
  }

  createForm() {
    this.contactGroupForm = new FormGroup({
      groupName: this.groupName,
      groupDescription: this.groupDescription
    });
  }
}
