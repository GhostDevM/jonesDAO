
import { Router } from '@angular/router';
import { FormBuilder , FormControl, FormGroup , Validators} from '@angular/forms';
import { ConfigStaffService } from 'app/config/config.staff.service';
import { CommanService } from 'app/config/comman.service';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, Input, OnInit, OnDestroy, ViewChild, ChangeDetectorRef} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-staff-header-menu',
  templateUrl: './staff-header-menu.component.html',
  styleUrls: ['./staff-header-menu.component.css']
})
export class StaffHeaderMenuComponent implements OnInit {
    @Input() _getStaffList: Function;
    dtElement: DataTableDirective;
    ERROR_MESSAGE: boolean = false; 
    MODEL_OPEN: boolean = false;
    NEW_STAFF_MODEL_OPEN: boolean = false;
    SUCCESS_MESSAGE: boolean = false;
    addStaffForm: FormGroup;
    ADD_STAFF: boolean = false;
    STAFF_LIST: any = [];
    NAME: string = '';
    IMAGE: string = ''
    PERFORMENCE: any = 75;
    SPINNER_TEXT: string = 'Loading...';
    ROLE_TYPES: any = [];
  ROUTE_URLS = [ 
    { url:'/staff' , is_working: true, value: 'Staff list' },
    { url:'/staff/staff-access' , is_working: true, value: 'Staff access' },
    //{ url:'' , is_working: false, value: 'Staff Commission' },
    // { url:'/staff/finance' , is_working: true, value: 'Finance' },
    { url: '/staff/rota' , is_working: true,value:'Rota'},
    // { url:'' , is_working: false, value: 'Staff Performance' },
  ];
  STAFF_LIST_FLAG: boolean;

  CURRENT_ROUTE_LINK: string;
  dtTrigger: Subject<any> = new Subject();
  constructor(

    private staffService: ConfigStaffService,
    private route: Router,
    private commanService: CommanService,
    private changeDetection: ChangeDetectorRef,
    private configService: ConfigStaffService,
    private fb: FormBuilder , 
    public commonService: CommanService ,
    private spinner: NgxSpinnerService
    ) {
    
    
    this._initiateStaffForm();
    this._getStaffROleType();
    // this._getStaffList();
    this.CURRENT_ROUTE_LINK = this.route.url;
    // console.log('checkking------' , this.route.url)
   }

  ngOnInit(): void {

  }

  _openNewStaffPopup() {
    this.NEW_STAFF_MODEL_OPEN = true;
  }

  async _initiateStaffForm() {

    this.addStaffForm = this.fb.group({

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      number: ['', [Validators.required , Validators.maxLength(10)]],
      dateOfBirth: ['', Validators.required],
      gender: [this.commonService.GENDER_LIST[0].value, Validators.required],
      address: ['', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyContactNumber: ['', [Validators.required , Validators.maxLength(10)]],
      //performedServices: ['', Validators.required],
      role: [ , Validators.required],
      // monthlySales: ['' ],
      // commission: [''],
      // reviews: [''],
      // performance: [''],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      password: [''],
      employeeBio: ['', Validators.required],
      employeeImg: [''],

      // email: ['', [Validators.required, Validators.email]],
      // message: ['', [Validators.required, Validators.minLength(15)]],
    });
  }
  _closeStaffModel () {
    this.NEW_STAFF_MODEL_OPEN = false;
    this.MODEL_OPEN = false;
    this.SUCCESS_MESSAGE = false;
  } 
  async _addStaff(form: any) {
    console.log("addstaff function");
    let data = {
      firstName: this.addStaffForm.value.firstName,
      lastName: this.addStaffForm.value.lastName,
      number: this.addStaffForm.value.number,
      dateOfBirth: this.addStaffForm.value.dateOfBirth,
      gender: this.addStaffForm.value.gender,
      address: this.addStaffForm.value.address,
      emergencyContactName: this.addStaffForm.value.emergencyContactName,
      emergencyContactNumber: this.addStaffForm.value.emergencyContactNumber.toString(),
      performedServices: [
              1,
              2,
              3
      ],
      role: this.addStaffForm.value.role,
      monthlySales: "0",
      commission: "0",
      reviews: "0",
      performance: "0",
      email: this.addStaffForm.value.email,
      employeeBio: this.addStaffForm.value.employeeBio,
      employeeImg: this.IMAGE,
    }
  
    await (await this.configService._addStaff(data)).subscribe(
      async (response: any) => {

      },
      async (error: any) => {
        
        if (error.status == this.commonService.SUCCESS_CODE) {
          console.log("this is this.commonService.SUCCESS_CODE",this.commonService.SUCCESS_CODE);
          // this.SUCCESS_MESSAGE = true;

          this.addStaffForm.reset();
          this.NEW_STAFF_MODEL_OPEN = false;
          this.MODEL_OPEN = true;
          this.changeDetection.detectChanges();
          
        } else {
          this.NEW_STAFF_MODEL_OPEN = false;
          this.ERROR_MESSAGE = true;
          // alert('Staff not added. Server error occuered Please try again later')
         
        }
      }
    );

  }
  public errorMesages = {

    firstName: [
      { type: 'required', message: " First name is required" },
      // { type: 'maxlength', message: "Name cant be longer  than 100 characters" },
    ],
    lastName: [
      { type: 'required', message: "Last name is required" },
    ],
    number: [
      { type: 'required', message: "Phone number is required" },
      { type: 'maxlength', message: "Phone number can't be longer  than 10 " }
    ],
    dateOfBirth: [
      { type: 'required', message: "Date of birth is required" },
    ],
    gender: [
      { type: 'required', message: "Gender is required" },
    ],
    address: [
      { type: 'required', message: "Address is required" },
    ],
    emergencyContactName: [
      { type: 'required', message: "Emergency contact name is required" },
    ],
    emergencyContactNumber: [
      { type: 'required', message: "Emergency contact number is required" },
      { type: 'pattern', message: "Please enter a valid number" },
      { type: 'maxlength', message: "Phone number can't be longer  than 10 " }
    ],
    performedServices: [
      { type: 'required', message: "Services is required" },
    ],
    role: [
      { type: 'required', message: "Role is required" },
    ],
    email: [
      { type: 'required', message: "Email is required" },
      { type: 'pattern', message: "Please enter a valid email address" },
    ],
    password: [
      { type: '', message: "Password is required" },
    ],
    employeeBio: [
      { type: 'required', message: "Employee bio is required" },
    ],
    employeeImg: [
      { type: '', message: "Image is required" },
    ],

  }
  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  async _selectFile (event:any) {

    if (event.target.files && event.target.files[0]) {

      //await this.addStaffForm.patchValue({ employeeImg : event.target.files[0]})
     
      var reader = new FileReader();
  
                reader.onload = (event:any) => {

                  const image = new Image();
                  image.src = event.target.result;

                  image.onload = rs => {
                    
                    const img_height = rs.currentTarget['height'];
                    const img_width = rs.currentTarget['width'];

                  };

                 this.IMAGE =  event.target.result;
                  
                }

                reader.readAsDataURL(event.target.files[0]);

    } else {
      this.IMAGE = '';
      //await this.addStaffForm.patchValue({ employeeImg : ''})
    }
  }
  async _getStaffROleType () {

    await (await this.staffService._getStaffRoleType()).subscribe(
        (respopnse: any) => {
            
            this.ROLE_TYPES = respopnse;

            this.addStaffForm.patchValue({
                role: this.ROLE_TYPES.length > 0 ? this.ROLE_TYPES[0].role_id : 0
            })
        },
        async (error: any) => {


        }
    );
  }
  async _closeModel () {
    this.MODEL_OPEN = false;
    await this._getStaffList();
  }
  // async _getStaffList () {

  //   this.SPINNER_TEXT = 'Loading...';
    
  //   await this.spinner.show();
  //   await (await this.staffService.getAllStaff()).subscribe(
  //       async (respopnse: any) => {

  //           console.log('response staff list----' , respopnse);

            
  //           for (let value of respopnse) {

  //               let find_staff_role = await this.ROLE_TYPES.filter( data => data.role_id == value['role'])

  //               value.role_name = find_staff_role.length > 0 ? find_staff_role[0].roleName : '';
  //           }
  //           this.STAFF_LIST = respopnse;
  //           this.IMAGE = respopnse[0].employeeImg;
  //           this.NAME = respopnse[0].firstName + " " + respopnse[0].lastName;
            
  //           this.dtTrigger.next();
  //           this.spinner.hide();
  //           this.changeDetection.detectChanges();
            
  //       },
  //       (error: any) => {

  //           alert('Something went wrong on server side. Please try again later')
  //           this.spinner.hide();
  //           this.changeDetection.detectChanges();
           
  //       }
  //   );
  // }
  async _showDetails (staff_id:  any) {
        
    let selected_staff = await this.STAFF_LIST.filter( data => data.employee_id == staff_id);

    this.IMAGE = selected_staff[0].employeeImg;
    this.NAME = selected_staff[0].firstName + " " + selected_staff[0].lastName;
    this.changeDetection.detectChanges();
  }
  ngOnDestroy(): void {
        
    this.changeDetection.detectChanges();
    this.dtTrigger.unsubscribe();
  }
  // async _deleteStaff(staff_id: any) {

  //   if (confirm('Are you sure? you want to delete this user.')) {

  //      // await this.spinner.show();
  //       await (await this.staffService.deleteStaff(staff_id)).subscribe(
  //           (response: any) => {

  //           },
  //           async (error: any) => {

  //               if (error.status == this.commanService.SUCCESS_CODE) {

  //                   alert('Staff delete successfully');
  //                   // this.LIST = [];
  //                   // this.RESPONSE = [];
  //                   // this.FULL_RESPONSE = [];
                    
                    
  //                   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

  //                       // Destroy the table first
  //                       dtInstance.destroy();
                        
  //                       // Call the dtTrigger to rerender again
  //                       // setTimeout(() => {
  //                       //   this.dtTrigger.next();
  //                       // }, 4000); 
  //                     }).then(async ()=>{
  //                       await this._getStaffList();
                
  //                      });
                   
                    
  //               } else{

  //                   alert('Something went wrong on server side. Please try again later')
                   

                    
  //               }
  //           }

  //       )
  //   }
  // }
  get firstName() {
    return this.addStaffForm.get('firstName');
  }

  get lastName() {
    return this.addStaffForm.get('lastName');
  }

  get number() {
    return this.addStaffForm.get('number');
  }

  get gender() {
    return this.addStaffForm.get('gender');
  }

  get dateOfBirth() {
    return this.addStaffForm.get('dateOfBirth');
  }

  get address() {
    return this.addStaffForm.get('address');
  }

  get emergencyContactName() {
    return this.addStaffForm.get('emergencyContactName');
  }

  get emergencyContactNumber() {
    return this.addStaffForm.get('emergencyContactNumber');
  }

  get performedServices() {
    return this.addStaffForm.get('performedServices');
  }
  
  get role() {
    return this.addStaffForm.get('role');
  }
  
  get email() {
    return this.addStaffForm.get('email');
  }

  get password() {
    return this.addStaffForm.get('password');
  }
  
  get employeeBio() {
    return this.addStaffForm.get('employeeBio');
  }

  get employeeImg() {
    return this.addStaffForm.get('employeeImg');
  }

}
