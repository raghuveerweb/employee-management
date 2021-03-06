import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userId : any;
  userContactGroups : any;
  contactGroupExist : boolean = false;
  contactsExist : boolean = false;
  userContacts : any = [];

  displayedColumns: string[] = ['groupName', 'groupDescription','status', 'actions'];

  dataSource = new MatTableDataSource<contactGroupInterface>(this.userContactGroups);

  

  contactDisplayedColumns: string[] = ['name', 'phone','status', 'actions'];

  @ViewChild('contactGroups') paginator: MatPaginator;

  @ViewChild('sort1') sort: MatSort;

  contactDataSource = new MatTableDataSource<contactInterface>(this.userContacts);

  

  @ViewChild('contacts') contactPaginator : MatPaginator;

  @ViewChild('sort2') contactSort: MatSort;


  constructor(public db: AngularFireDatabase, private router : Router) { }

  getIndexOfelement(arrayTocheck, attr, value) {
    for (var i = 0; i < arrayTocheck.length; i += 1) {
      if (arrayTocheck[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }

  addGroupContact(row, event){
    event.preventDefault();
    this.router.navigateByUrl("/app/createGroupContact/"+row.groupName);
  }

  getIndexOfelementByMultipleAttrs(arrayTocheck, attr1, value1, attr2, value2) {
    for (var i = 0; i < arrayTocheck.length; i += 1) {
      if (arrayTocheck[i][attr1] === value1 && arrayTocheck[i][attr2] === value2) {
        return i;
      }
    }
    return -1;
  }


  editGroup(row,event){
    event.preventDefault();
    this.router.navigateByUrl("/app/editGroupInformation/"+row.groupName);
  }

  groupInfoAdd(row,event){
    event.preventDefault();
    this.router.navigateByUrl("/app/editContactGroup/"+row.groupName);
  }

  editContact(row,event){
    event.preventDefault();
    this.router.navigateByUrl("/app/editContact/contact/"+row.name+'/'+row.phone);
  }


  deleteGroup(row,event){
    event.preventDefault();
    let indexOfElement = this.getIndexOfelement(this.userContactGroups, 'groupName' ,row.groupName);
    this.userContactGroups.splice(indexOfElement,1);
    this.db.object('/contactInformation/'+this.userId+'/ContactGroups').set(this.userContactGroups);
  }

  deleteContact(row,event){
    event.preventDefault();
    let indexOfElement = this.getIndexOfelementByMultipleAttrs(this.userContacts, 'name' ,row.name , 'phone', row.phone);
    //alert(indexOfElement);
    if(indexOfElement != -1){
      this.userContacts.splice(indexOfElement,1);
      this.db.object('/contactInformation/'+this.userId+'/contacts').set(this.userContacts);
    }
  }

  applyFilterOnContactGroup(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterOnContacts(filterValue: string) {
    this.contactDataSource.filter = filterValue.trim().toLowerCase();
  }

  setDataSources(){
    this.dataSource = new MatTableDataSource<contactGroupInterface>(this.userContactGroups);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.contactDataSource = new MatTableDataSource<contactInterface>(this.userContacts);
    this.contactDataSource.paginator = this.contactPaginator;
    this.contactDataSource.sort = this.contactSort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.userId = localStorage.getItem("userId");
    this.db.list("/contactInformation/"+this.userId).valueChanges().subscribe(data=>{
      this.setDataSources();

      if(data.length != 0){
        this.contactGroupExist = this.contactsExist = true;
        this.userContactGroups = data[0];
        this.userContacts = data[1];
        this.setDataSources();

      }
    });
  }
}



export interface contactGroupInterface {
  groupName: string;
  groupDescription: string,
  status : string
}

export interface contactInterface {
  name: string;
  phone: number,
  status: string
}

