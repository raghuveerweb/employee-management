import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-edit-group-information',
  templateUrl: './edit-group-information.component.html',
  styleUrls: ['./edit-group-information.component.css']
})
export class EditGroupInformationComponent implements OnInit {

  contactGroups : any = [];
  userId : any;
  groupIndex : any;
  groupsPresent : boolean = false;
  contactGroupForm : FormGroup;
  groupName: FormControl;
  groupDescription: FormControl;
  status : FormControl;


  getIndexOfelement(arrayTocheck, attr, value) {
    for (var i = 0; i < arrayTocheck.length; i += 1) {
      if (arrayTocheck[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public db: AngularFireDatabase, private snackBar : MatSnackBar) { }

  ngOnInit() {
    this.userId = localStorage.getItem("userId");
    this.createControls();
    this.createForm();
    this.fetchContactGroups();
    this.status.setValue("Active");
    
  }

  setValues(){
    console.log('groups:::', this.contactGroups);
    this.groupIndex = this.getIndexOfelement(this.contactGroups,'groupName',this.activatedRoute.snapshot.params["id"]);
    //alert(this.groupIndex);
    if(this.groupIndex != -1){
      this.groupName.setValue(this.contactGroups[this.groupIndex].groupName);
      this.groupDescription.setValue(this.contactGroups[this.groupIndex].groupDescription);
      this.status.setValue(this.contactGroups[this.groupIndex].status);
    }else{
      this.snackBar.open("Could not find the group","Close");
    }
  }

  updateGroup(){
    this.contactGroups[this.groupIndex].groupName = this.groupName.value;
    this.contactGroups[this.groupIndex].groupDescription = this.groupDescription.value;
    this.contactGroups[this.groupIndex].status = this.status.value;
    let updateInfo = this.db.object('/contactInformation/'+this.userId+'/ContactGroups').set(this.contactGroups);
    this.snackBar.open("Group updated successfully","Close");
    this.router.navigateByUrl("/app/dashboard");
  }

  fetchContactGroups(){
    this.db.list("/contactInformation/"+this.userId).valueChanges().subscribe(data=>{
      console.log("data::::",data);
        this.contactGroups = data[0];
        this.setValues();
    });
  }

  createControls() {
    this.groupName = new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]+$')
    ])
    this.groupDescription = new FormControl('', [
      Validators.required
    ])
    this.status = new FormControl('', [
      Validators.required
    ])
  }

  createForm() {
    this.contactGroupForm = new FormGroup({
      groupName: this.groupName,
      groupDescription: this.groupDescription,
      status : this.status
    });
  }



}
