import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
    let userId = localStorage.getItem("userId");
    if(userId == ""){
      this.router.navigateByUrl("/login");  
    }
  }


  logout(){
    localStorage.removeItem("userId");
    this.router.navigateByUrl("/login");
  }
}
