import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EmployeeRegisterComponent } from './employee-register/employee-register.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactGroupComponent } from './contact-group/contact-group.component';
import { EditContactGroupComponent } from './edit-contact-group/edit-contact-group.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { CreateGroupContactComponent } from './create-group-contact/create-group-contact.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register',component:EmployeeRegisterComponent },
  { 
    path: 'app', component: HeaderComponent,
    children:[
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path:'dashboard',component: DashboardComponent},
      {path:'contactGroup',component: ContactGroupComponent},
      {path:'editContactGroup/:id',component: EditContactGroupComponent},
      {path:'contact',component: AddContactComponent},
      {path:'editContact/:type/:name/:phone',component: EditContactComponent},
      {path:'createGroupContact/:groupName', component: CreateGroupContactComponent}
    ]
  },
];



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', useHash : true })
  ],
  declarations: []
})


export class AppRoutingModule { }
