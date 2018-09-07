import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-edit-contact-group',
  templateUrl: './edit-contact-group.component.html',
  styleUrls: ['./edit-contact-group.component.css']
})
export class EditContactGroupComponent implements OnInit {

  userContacts : any = [];
  userId : any;
  contactGroups : any = [];
  canAddContacts : boolean = false;
  groupNameIndex : any;
  displayedColumns: string[] = ['name', 'phone','status', 'actions'];

  dataSource = new MatTableDataSource<contactsInformation>(this.userContacts);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  getIndexOfelement(arrayTocheck, attr, value) {
    for (var i = 0; i < arrayTocheck.length; i += 1) {
      if (arrayTocheck[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public db: AngularFireDatabase) { }

  ngOnInit() {
    this.userId = localStorage.getItem("userId");
    this.fetchContactGroups();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addGroupContact(){
    this.router.navigateByUrl("/app/createGroupContact/"+this.contactGroups[this.groupNameIndex].groupName);
  }

  getIndexOfelementByMultipleAttrs(arrayTocheck, attr1, value1, attr2, value2) {
    for (var i = 0; i < arrayTocheck.length; i += 1) {
      if (arrayTocheck[i][attr1] === value1 && arrayTocheck[i][attr2] === value2) {
        return i;
      }
    }
    return -1;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editContact(row,event){
    event.preventDefault();
    this.router.navigateByUrl("/app/editContact/gp-"+this.activatedRoute.snapshot.params["id"]+"/"+row.name+'/'+row.phone);
  }

  deleteContact(row,event){
    event.preventDefault();
    let indexOfElement = this.getIndexOfelementByMultipleAttrs(this.contactGroups[this.groupNameIndex].contacts, 'name' ,row.name , 'phone', row.phone);
    
    if(indexOfElement != -1){
      this.contactGroups[this.groupNameIndex].contacts.splice(indexOfElement,1);
      this.db.object('/contactInformation/'+this.userId+'/ContactGroups').set(this.contactGroups);
    }
  }

  setDataSources(){
    this.dataSource = new MatTableDataSource<contactsInformation>(this.userContacts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchContactGroups(){
    this.db.list("/contactInformation/"+this.userId).valueChanges().subscribe(data=>{
      console.log("DATA at value change::::",data[0]);
      
        this.setDataSources();
        this.groupNameIndex = this.getIndexOfelement(data[0],'groupName',this.activatedRoute.snapshot.params["id"]);
        //alert(groupNameIndex);
        this.contactGroups = data[0];
        
        if(this.groupNameIndex != -1){
          if(this.contactGroups[this.groupNameIndex].status == "Active"){
            this.canAddContacts = true;
          }
          if(this.contactGroups[this.groupNameIndex].contacts){
            this.userContacts = this.contactGroups[this.groupNameIndex].contacts;
            this.setDataSources();
          }
        }
    });
  }

}
export interface contactsInformation {
  name: string;
  phone: number;
  status : string;
}
