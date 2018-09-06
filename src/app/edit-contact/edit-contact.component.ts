import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActivatedRoute, Router } from '@angular/router';
import { leave } from '@angular/core/src/profile/wtf_impl';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {

  userId : any;
  contactArray : any = [];
  contactsPresent : boolean = false;
  contactForm : FormGroup;
  typeSplit : any = [];
  phone: FormControl;
  Formname:any;
  FormPhone : any;
  name : FormControl;
 
  constructor(public db: AngularFireDatabase,private fb: FormBuilder, private activatedRoute : ActivatedRoute, private router : Router, private snackBar : MatSnackBar) { }

  ngOnInit() {
    this.userId = localStorage.getItem("userId");
    this.createControls();
    this.createForm();
    
    this.fetchContacts();
    this.Formname = this.activatedRoute.snapshot.params["name"];
    this.FormPhone = this.activatedRoute.snapshot.params["phone"];
    this.setValues();
  }
  
  fetchContacts(){
    let url;
    //alert(this.activatedRoute.snapshot.params["type"]);
    let type = this.activatedRoute.snapshot.params["type"];
    if(type == "contact"){
      url = "/contactInformation/"+this.userId+'/contacts';
    }else{
      this.typeSplit = type.split("-");
      url = "/contactInformation/"+this.userId+'/ContactGroups';
    }
    
    this.db.list(url).valueChanges().subscribe(data=>{
      console.log("DATA::::",data);
      console.log(data)  
      this.contactArray = data;  
      console.log(this.contactArray);
    });
  }

  setValues(){
    //alert(this.activatedRoute.snapshot.params["name"]);
    this.name.setValue(this.Formname);
    this.phone.setValue(this.FormPhone);
  }

  getIndexOfelementByMultipleAttrs(arrayTocheck, attr1, value1, attr2, value2) {
    for (var i = 0; i < arrayTocheck.length; i += 1) {
      if (arrayTocheck[i][attr1] === value1 && arrayTocheck[i][attr2] === value2) {
        return i;
      }
    }
    return -1;
  }

  getIndexOfelement(arrayTocheck, attr, value) {
    for (var i = 0; i < arrayTocheck.length; i += 1) {
      if (arrayTocheck[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }


  updateContact(){
    if(this.contactForm.valid){
      let url;
      if(this.typeSplit.length != 0){
        let groupIndex = this.getIndexOfelement(this.contactArray,'groupName',this.typeSplit[1]);
        if(groupIndex != -1){
          let contactIndex = this.getIndexOfelementByMultipleAttrs(this.contactArray[groupIndex].contacts,'name',this.Formname,'phone', this.FormPhone);
          if(contactIndex != -1){
            this.contactArray[groupIndex].contacts[contactIndex].name = this.name.value;
            this.contactArray[groupIndex].contacts[contactIndex].phone = this.phone.value;
            url = '/contactInformation/'+this.userId+'/ContactGroups'; 
            let updateInfo = this.db.object(url).set(this.contactArray); 
            this.snackBar.open("Contact updated successfully","Close");
            this.router.navigateByUrl("/app/editContactGroup/"+this.typeSplit[1]);
          }else{
            this.snackBar.open("No contact reference found in group","Close");
          }
        }else{
          this.snackBar.open("No Group found to update the Contact","Close");
        }
      }else{
        let contactIndex = this.getIndexOfelementByMultipleAttrs(this.contactArray,'name',this.Formname,'phone', this.FormPhone);
        if(contactIndex !=  -1){
          this.contactArray[contactIndex].name = this.name.value;
          this.contactArray[contactIndex].phone = this.phone.value;
          url = '/contactInformation/'+this.userId+'/contacts';
          let updateInfo = this.db.object(url).set(this.contactArray);
          this.snackBar.open("Contact updated successfully","Close");
          this.router.navigateByUrl("/app/dashboard");
        }else{
          this.snackBar.open("Could not find Contact","Close");
        }
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
