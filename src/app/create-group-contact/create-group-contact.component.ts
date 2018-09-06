import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-group-contact',
  templateUrl: './create-group-contact.component.html',
  styleUrls: ['./create-group-contact.component.css']
})
export class CreateGroupContactComponent implements OnInit {

  userId : any;
  contactGroupArray :  any = [];
  contactArray : any = [];
  contactsPresent : boolean = false;
  contactForm : FormGroup;
  phone: FormControl;
  name : FormControl;

  constructor(public db: AngularFireDatabase,private fb: FormBuilder, private activatedRoute : ActivatedRoute, private router : Router, private snackBar : MatSnackBar) { }

  ngOnInit() {
    this.userId = localStorage.getItem("userId");
    this.createControls();
    this.createForm();
    this.fetchContacts();
  }
  
  fetchContacts(){
    this.db.list("/contactInformation/"+this.userId).valueChanges().subscribe(data=>{
      console.log("DATA::::",data);
      this.contactGroupArray = data[0];
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

  addContact(){
    if(this.contactForm.valid){
      let contactGroupIndex = this.getIndexOfelement(this.contactGroupArray,'groupName',this.activatedRoute.snapshot.params["groupName"]);
      if(contactGroupIndex != -1){
        if(this.contactGroupArray[contactGroupIndex].contacts){
          this.contactArray = this.contactGroupArray[contactGroupIndex].contacts;
          this.contactArray.push(this.contactForm.value);
        }else{
          this.contactGroupArray[contactGroupIndex].contacts = [];
          this.contactGroupArray[contactGroupIndex].contacts.push(this.contactForm.value);
        }
        
        let updateInfo = this.db.object('/contactInformation/'+this.userId+'/ContactGroups').set(this.contactGroupArray);
        this.snackBar.open("Conacted Added to Group",'Close');
        this.router.navigateByUrl("/app/editContactGroup/"+this.activatedRoute.snapshot.params["groupName"]);
      }else{
        this.snackBar.open("Could not find any group to add contact","Close");
      }
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
