import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {

  userId : any;
  contactArray : any = [];
  contactsPresent : boolean = false;
  contactForm : FormGroup;
  phone: FormControl;
  name : FormControl;

  constructor(public db: AngularFireDatabase,private fb: FormBuilder, private router : Router, private snackBar : MatSnackBar) { }

  ngOnInit() {
    this.userId = localStorage.getItem("userId");
    this.createControls();
    this.createForm();
    this.fetchContacts();
  }
  
  fetchContacts(){
    this.db.list("/contactInformation/"+this.userId+'/contacts').valueChanges().subscribe(data=>{
      console.log("DATA::::",data);
      if(data.length != 0){
        this.contactsPresent = true;
        this.contactArray = data;
        console.log(this.contactArray);
      }
    });
  }

  addContact(){
      if(this.contactForm.valid){
        this.contactArray.push(this.contactForm.value);
        console.log(this.contactArray);
        let updateInfo = this.db.object('/contactInformation/'+this.userId+'/contacts').set(this.contactArray);
        this.snackBar.open("Contact Created Successfully","Close");
        this.router.navigateByUrl("/app/dashboard");
      }
  }
  createControls() {
    this.name = new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]+$')
    ])
    this.phone = new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$')
    ])
  }

  createForm() {
    this.contactForm = new FormGroup({
      name: this.name,
      phone: this.phone
    });
  }

}
