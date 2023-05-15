import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-staff-access',
  templateUrl: './staff-access.component.html',
  styleUrls: ['./staff-access.component.css']
})
export class StaffAccessComponent implements OnInit {

  checkflag: boolean = false;
  ACCESS_LIST: any = [

    { id: 1 , page_name: 'HomePage', business_owner: true , manager: false , senior_staff: false  , staff: false},
    { id: 2 , page_name: 'Clients', business_owner: true , manager: false , senior_staff: false  , staff: false},
    { id: 3 , page_name: 'Staff', business_owner: true , manager: false , senior_staff: false  , staff: false},
    { id: 4 , page_name: 'Reports', business_owner: true , manager: false , senior_staff: false  , staff: false},
    { id: 5 , page_name: 'Pos', business_owner: true , manager: false , senior_staff: false  , staff: false},
    { id: 6 , page_name: 'Marketing', business_owner: true , manager: false , senior_staff: false  , staff: false},
    { id: 7 , page_name: 'Stock', business_owner: true , manager: false , senior_staff: false  , staff: false},
  ];

  // ACCESS_LIST: any = [

  //   { id: 1 , page_name: 'HomePage', business_owner: true , manager: false , senior_staff: true  , staff: true},
  //   { id: 2 , page_name: 'Clients', business_owner: true , manager: false , senior_staff: true  , staff: false},
  //   { id: 3 , page_name: 'Staff', business_owner: false , manager: false , senior_staff: true  , staff: false},
  //   { id: 4 , page_name: 'Reports', business_owner: true , manager: false , senior_staff: true  , staff: false},
  //   { id: 5 , page_name: 'Pos', business_owner: false , manager: false , senior_staff: true  , staff: true},
  //   { id: 6 , page_name: 'Marketing', business_owner: true , manager: false , senior_staff: true  , staff: false},
  //   { id: 7 , page_name: 'Stock', business_owner: false , manager: false , senior_staff: true  , staff: false},
  // ];

  constructor() { 
    console.log(JSON.stringify(this.ACCESS_LIST))
  }

  ngOnInit(): void {
  }

  checkCheckBoxvalue() {

    this.checkflag = !this.checkflag;
    if(this.checkflag){
      console.log("checked")
    }
    else{
      console.log("unchecked")
    }
  }
  checkOwner(index: any) {
    this.ACCESS_LIST[index].business_owner = !this.ACCESS_LIST[index].business_owner;
  }
  checkManager(index: any) {
    this.ACCESS_LIST[index].manager = !this.ACCESS_LIST[index].manager;
  }
  checkSenior(index:any) {
    this.ACCESS_LIST[index].senior_staff = !this.ACCESS_LIST[index].senior_staff;
  }
  checkStaff(index:any) {
    this.ACCESS_LIST[index].staff = !this.ACCESS_LIST[index].staff;
  }
}
