
import { Component ,OnInit, OnDestroy ,ViewChild,ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { CommanService } from 'app/config/comman.service';
import { ConfigStaffService } from 'app/config/config.staff.service';
import {Subject} from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder , FormControl, FormGroup , Validators} from '@angular/forms';


@Component({
    moduleId: module.id,
    selector: 'staff-cmp',
    templateUrl: './staff.component.html',
    styleUrls: ['staff.component.css']
})

export class StaffComponent {
    STAFF_DETAILS: any = [];
    STAFF_ID: any ;
    ERROR_MESSAGE: boolean = false; 
    MODEL_OPEN: boolean = false;
    NEW_STAFF_MODEL_OPEN: boolean = false;
    EDIT_STAFF_MODEL_OPEN: boolean = false;
    SUCCESS_MESSAGE: boolean = false;
    addStaffForm: FormGroup;
    ADD_STAFF: boolean = false;
    STAFF_LIST: any = [];
    STAFF_UPDATE_LIST: any = [];
    NAME: string = '';
    IMAGE: string = ''
    PERFORMENCE: any = 75;
    SPINNER_TEXT: string = 'Loading...';
    ROLE_TYPES: any = [];
    UPDATE_STAFF_FORM: FormGroup;
    SHOW_EDIT_HTML: boolean = true;



    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings =  {
        pagingType: 'full_numbers',
        pageLength: 20,
        order:[[0 , 'desc']],
        //ordering: false,
        searching: false,
        //lengthChange: false,
        lengthMenu : [5 , 10, 20 ,30 , 40],
        processing: true
    };
    dtTrigger: Subject<any> = new Subject();

    constructor (
        public router: Router,
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
        this._getStaffList();
        // this._getUpdateStaffList();
    }
    
    _openNewStaffPopup() {
        this.NEW_STAFF_MODEL_OPEN = true;
    }
    
    async _openEditStaffPopup(staffGetID: any) {
        
        this.EDIT_STAFF_MODEL_OPEN = true;
        this.STAFF_ID = staffGetID;
        console.log("this is satff id ", this.STAFF_ID);
        let selected_staff = await this.STAFF_LIST.filter( data => data.employee_id == this.STAFF_ID);
        this.UPDATE_STAFF_FORM = this.fb.group({

          id: [''],
          firstName: selected_staff[0].firstName,
          lastName: selected_staff[0].lastName,
          number: selected_staff[0].number,
          dateOfBirth: selected_staff[0].dateOfBirth,
          gender: selected_staff[0].gender,
          address: selected_staff[0].address,
          emergencyContactName: selected_staff[0].emergencyContactName,
          emergencyContactNumber: selected_staff[0].emergencyContactNumber,
          //performedServices: ['', Validators.required],
          role: selected_staff[0].role,
          // monthlySales: ['' ],
          // commission: [''],
          // reviews: [''],
          // performance: [''],
          // email: ['', [
          //   Validators.required,
          //   Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
          email: selected_staff[0].email,
          password: selected_staff[0].password,
          employeeBio: selected_staff[0].employeeBio,
          employeeImg: selected_staff[0].employeeImg,
       });
        
    }
    async _updateFormValue() {

        await this.changeDetection.detectChanges();
      }

    async _initiateStaffForm() {

        this.UPDATE_STAFF_FORM = this.fb.group({

            id: [''],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            number: ['', [Validators.required , Validators.maxLength(10)]],
            dateOfBirth: ['', Validators.required],
            gender: [, Validators.required],
            address: ['', Validators.required],
            emergencyContactName: ['', Validators.required],
            emergencyContactNumber: ['', [Validators.required , Validators.maxLength(10)]],
            //performedServices: ['', Validators.required],
            role: ['' , Validators.required],
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
         });
         await this._getStaffList();
    }

      _closeStaffModel () {
        this.NEW_STAFF_MODEL_OPEN = false;
        this.MODEL_OPEN = false;
        this.SUCCESS_MESSAGE = false;
      } 

      closeEditModel() {
        this.EDIT_STAFF_MODEL_OPEN = false;
      }

    // async _addStaff(form: any) {

    //     let data = {
    //       firstName: this.addStaffForm.value.firstName,
    //       lastName: this.addStaffForm.value.lastName,
    //       number: this.addStaffForm.value.number,
    //       dateOfBirth: this.addStaffForm.value.dateOfBirth,
    //       gender: this.addStaffForm.value.gender,
    //       address: this.addStaffForm.value.address,
    //       emergencyContactName: this.addStaffForm.value.emergencyContactName,
    //       emergencyContactNumber: this.addStaffForm.value.emergencyContactNumber.toString(),
    //       performedServices: [
    //               1,
    //               2,
    //               3
    //       ],
    //       role: this.addStaffForm.value.role,
    //       monthlySales: "0",
    //       commission: "0",
    //       reviews: "0",
    //       performance: "0",
    //       email: this.addStaffForm.value.email,
    //       employeeBio: this.addStaffForm.value.employeeBio,
    //       employeeImg: this.IMAGE,
    //     }
        
    //     await (await this.configService._addStaff(data)).subscribe(
    //       async (response: any) => {
    
    //       },
    //       async (error: any) => {
            
    //         if (error.status == this.commonService.SUCCESS_CODE) {
    //           console.log("this is this.commonService.SUCCESS_CODE",this.commonService.SUCCESS_CODE);
    //           // this.SUCCESS_MESSAGE = true;
    
    //           this.addStaffForm.reset();
    //           this.NEW_STAFF_MODEL_OPEN = false;
    //           this.MODEL_OPEN = true;
    //           this.changeDetection.detectChanges();
              
    //         } else {
    //           this.NEW_STAFF_MODEL_OPEN = false;
    //           this.ERROR_MESSAGE = true;
    //           // alert('Staff not added. Server error occuered Please try again later')
             
    //         }
    //       }
    //     );
    // }

    // public errorMesages = {

    //     firstName: [
    //       { type: 'required', message: " First name is required" },
    //       // { type: 'maxlength', message: "Name cant be longer  than 100 characters" },
    //     ],
    //     lastName: [
    //       { type: 'required', message: "Last name is required" },
    //     ],
    //     number: [
    //       { type: 'required', message: "Phone number is required" },
    //       { type: 'maxlength', message: "Phone number can't be longer  than 10 " }
    //     ],
    //     dateOfBirth: [
    //       { type: 'required', message: "Date of birth is required" },
    //     ],
    //     gender: [
    //       { type: 'required', message: "Gender is required" },
    //     ],
    //     address: [
    //       { type: 'required', message: "Address is required" },
    //     ],
    //     emergencyContactName: [
    //       { type: 'required', message: "Emergency contact name is required" },
    //     ],
    //     emergencyContactNumber: [
    //       { type: 'required', message: "Emergency contact number is required" },
    //       { type: 'pattern', message: "Please enter a valid number" },
    //       { type: 'maxlength', message: "Phone number can't be longer  than 10 " }
    //     ],
    //     performedServices: [
    //       { type: 'required', message: "Services is required" },
    //     ],
    //     role: [
    //       { type: 'required', message: "Role is required" },
    //     ],
    //     // monthlySales: [
    //     //   { type: 'required', message: "Monthly sales is required" },
    //     // ],
    //     // commission: [
    //     //   { type: 'required', message: "Commission is required" },
    //     // ],
    //     // reviews: [
    //     //   { type: 'required', message: "Reviews is required" },
    //     // ],
    //     // performance: [
    //     //   { type: 'required', message: "Performance is required" },
    //     // ],
    //     email: [
    //       { type: 'required', message: "Email is required" },
    //       { type: 'pattern', message: "Please enter a valid email address" },
    //     ],
    //     password: [
    //       { type: 'required', message: "Password is required" },
    //     ],
    //     employeeBio: [
    //       { type: 'required', message: "Employee bio is required" },
    //     ],
    //     employeeImg: [
    //       { type: 'required', message: "Image is required" },
    //     ],
    
    // }

    // numberOnlyValidation(event: any) {
    //     const pattern = /[0-9.,]/;
    //     let inputChar = String.fromCharCode(event.charCode);
    
    //     if (!pattern.test(inputChar)) {
    //       // invalid character, prevent input
    //       event.preventDefault();
    //     }
    // }

    // async _selectFile (event:any) {

    //     if (event.target.files && event.target.files[0]) {
    
    //       //await this.addStaffForm.patchValue({ employeeImg : event.target.files[0]})
         
    //       var reader = new FileReader();
      
    //                 reader.onload = (event:any) => {
    
    //                   const image = new Image();
    //                   image.src = event.target.result;
    
    //                   image.onload = rs => {
                        
    //                     const img_height = rs.currentTarget['height'];
    //                     const img_width = rs.currentTarget['width'];
    
    //                   };
    
    //                  this.IMAGE =  event.target.result;
                      
    //                 }
    
    //                 reader.readAsDataURL(event.target.files[0]);
    
    //     } else {
    //       this.IMAGE = '';
    //       //await this.addStaffForm.patchValue({ employeeImg : ''})
    //     }
    // }
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

        await (await this.configService._getStaffRoleType()).subscribe(
            async (respopnse: any) => {
                
                this.ROLE_TYPES = respopnse;
                await this.changeDetection.detectChanges();
            },
            async (error: any) => {
            }
        );
      }

    async _closeModel () {
        await this._getStaffList();
        this.MODEL_OPEN = false;
        await this.changeDetection.detectChanges();
       }
    async _getSaffListChild () {
      await this._getStaffList();
    }
    async _getStaffList () {
        console.log("this is parent function")
        this.SPINNER_TEXT = 'Loading...';
        
        await this.spinner.show();
        await (await this.staffService.getAllStaff()).subscribe(
            async (respopnse: any) => {

                console.log('response staff list----' , respopnse);

                
                for (let value of respopnse) {

                    let find_staff_role = await this.ROLE_TYPES.filter( data => data.role_id == value['role'])

                    value.role_name = find_staff_role.length > 0 ? find_staff_role[0].roleName : '';
                }
                this.STAFF_LIST = respopnse;
                console.log("this is staff list",this.STAFF_LIST)
                this.IMAGE = respopnse[0].employeeImg;
                this.NAME = respopnse[0].firstName + " " + respopnse[0].lastName;
                
                this.dtTrigger.next();
                this.spinner.hide();
                this.changeDetection.detectChanges();
                
            },
            (error: any) => {

                alert('Something went wrong on server side. Please try again later')
                this.spinner.hide();
                this.changeDetection.detectChanges();
               
            }
        );
    }

    async _showDetails (staff_id:  any) {
        
        let selected_staff = await this.STAFF_LIST.filter( data => data.employee_id == staff_id);

        this.IMAGE = selected_staff[0].employeeImg;
        this.NAME = selected_staff[0].firstName + " " + selected_staff[0].lastName;
        this.changeDetection.detectChanges();
    }


    //  ngOnDestroy(): void {
        
    //     this.changeDetection.detectChanges();
    //     this.dtTrigger.unsubscribe();
    // }
    async ngOnDestroy() {

        this.SHOW_EDIT_HTML = false;
        await this.changeDetection.detectChanges();
    }

    async _deleteStaff(staff_id: any) {

        if (confirm('Are you sure? you want to delete this user.')) {

           // await this.spinner.show();
            await (await this.staffService.deleteStaff(staff_id)).subscribe(
                (response: any) => {

                },
                async (error: any) => {

                    if (error.status == this.commanService.SUCCESS_CODE) {
                      
                        alert('Staff delete successfully');
                        await this._getStaffList();
              
                        // this.LIST = [];
                        // this.RESPONSE = [];
                        // this.FULL_RESPONSE = [];
                        
                        
                        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

                            // Destroy the table first
                            dtInstance.destroy();
                            
                            // Call the dtTrigger to rerender again
                            // setTimeout(() => {
                            //   this.dtTrigger.next();
                            // }, 4000); 
                          }).then(async ()=>{
                            await this._getStaffList();
                    
                           });
                       
                        
                    } else{
    
                        alert('Something went wrong on server side. Please try again later')
                       
    
                        
                    }
                }

            )
        }
        
    }

    

    // get firstName() {
    //     return this.addStaffForm.get('firstName');
    //   }
    
    //   get lastName() {
    //     return this.addStaffForm.get('lastName');
    //   }
    
    //   get number() {
    //     return this.addStaffForm.get('number');
    //   }
    
    //   get gender() {
    //     return this.addStaffForm.get('gender');
    //   }
    
    //   get dateOfBirth() {
    //     return this.addStaffForm.get('dateOfBirth');
    //   }
    
    //   get address() {
    //     return this.addStaffForm.get('address');
    //   }
    
    //   get emergencyContactName() {
    //     return this.addStaffForm.get('emergencyContactName');
    //   }
    
    //   get emergencyContactNumber() {
    //     return this.addStaffForm.get('emergencyContactNumber');
    //   }
    
    //   get performedServices() {
    //     return this.addStaffForm.get('performedServices');
    //   }
      
    //   get role() {
    //     return this.addStaffForm.get('role');
    //   }
    
      // get monthlySales() {
      //   return this.addStaffForm.get('monthlySales');
      // }
    
      // get commission() {
      //   return this.addStaffForm.get('commission');
      // }
    
      // get reviews() {
      //   return this.addStaffForm.get('reviews');
      // }
      
      // get performance() {
      //   return this.addStaffForm.get('performance');
      // }
    
    //   get email() {
    //     return this.addStaffForm.get('email');
    //   }
    
    //   get password() {
    //     return this.addStaffForm.get('password');
    //   }
      
    //   get employeeBio() {
    //     return this.addStaffForm.get('employeeBio');
    //   }
    
    //   get employeeImg() {
    //     return this.addStaffForm.get('employeeImg');
    //   }
    async _getUpdateStaffList () {

        this.SPINNER_TEXT = 'Loading...';
        await this.spinner.show();
        await this.changeDetection.detectChanges();
        
        await this.staffService.getStaff().subscribe(
            async (respopnse: any) => {
    
                respopnse = respopnse.filter( data => data.employee_id == this.STAFF_ID);
                this.STAFF_DETAILS = respopnse;
                
                await this.changeDetection.detectChanges();
                this.UPDATE_STAFF_FORM.patchValue({
                  id: this.STAFF_ID,
                  firstName: respopnse[0].firstName,
                  lastName: respopnse[0].lastName,
                  number: respopnse[0].number,
                  dateOfBirth: respopnse[0].dateOfBirth,
                  gender: respopnse[0].gender ? respopnse[0].gender : this.commonService.GENDER_LIST[0].value,
                  address: respopnse[0].address,
                  emergencyContactName: respopnse[0].emergencyContactName,
                  emergencyContactNumber: respopnse[0].emergencyContactNumber,
                  role: respopnse[0].role,
                  // monthlySales: respopnse[0].monthlySales,
                  // commission: respopnse[0].commission,
                  // reviews: respopnse[0].reviews,
                  // performance: respopnse[0].performance,
                  email: respopnse[0].email,
                  employeeBio: respopnse[0].employeeBio,
                });
    
                await this.spinner.hide();
                await this.changeDetection.detectChanges();
                this._updateFormValue();
    
            },
            async (error: any) => {
              await this.spinner.hide();
            }
        );
    }

    async _updateStaff(form: any) {
        
        this.SPINNER_TEXT = 'Updating...';
        
        let data = {
          employee_id: parseInt(this.STAFF_ID),
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          number: form.value.number,
          dateOfBirth: form.value.dateOfBirth,
          gender: form.value.gender,
          address: form.value.address,
          emergencyContactName: form.value.emergencyContactName,
          emergencyContactNumber: form.value.emergencyContactNumber,
          performedServices: [
                  1,
                  2,
                  3
          ],
          role: form.value.role,

          

        //   monthlySales: "",
        //   commission: "",
        //   reviews: "",
        //   performance: "",




          email: form.value.email,
          employeeBio: form.value.employeeBio,
        }
        if (this.IMAGE != '') {
          data['employeeImg'] = this.IMAGE; 
        } else {
    
          data['employeeImg'] = this.STAFF_DETAILS[0]['employeeImg']; 
        }
        
        await this.spinner.show();
        await (await this.configService._updateStaff(data)).subscribe(
          async (response: any) => {
    
          },
          async (error: any) => {
    
            if (error.status == 200) {
    
              this.spinner.hide();
              this.MODEL_OPEN = true; 
              this.changeDetection.detectChanges();
            } else {
    
              alert('servr error occuring')
            }
            
          }
        );
        this.EDIT_STAFF_MODEL_OPEN = false;
      }

    numberOnlyValidation(event: any) {
        const pattern = /[0-9.,]/;
        let inputChar = String.fromCharCode(event.charCode);
    
        if (!pattern.test(inputChar)) {
          // invalid character, prevent input
          event.preventDefault();
        }
      }
    public errorMesages = {

        firstName: [
          { type: 'required', message: " First name is required" },
          // { type: 'maxlength', message: "Name cant be longer  than 100 characters" },
        ],
        lastName: [
          { type: 'required', message: "Last namme is required" },
        ],
        number: [
          { type: 'required', message: "Phone number is required" },
          { type: 'maxlength', message: "Phone number can't be longer  than 10" }
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
          { type: 'maxlength', message: "Phone number can't be longer  than 10" }
        ],
        performedServices: [
          { type: 'required', message: "Services is required" },
        ],
        role: [
          { type: 'required', message: "Role is required" },
        ],
        monthlySales: [
          { type: 'required', message: "Monthly sales is required" },
        ],
        commission: [
          { type: 'required', message: "Commission is required" },
        ],
        reviews: [
          { type: 'required', message: "Reviews is required" },
        ],
        performance: [
          { type: 'required', message: "Performance is required" },
        ],
        email: [
          { type: 'required', message: "Email is required" },
          { type: 'pattern', message: "Please enter a valid email address" },
        ],
        password: [
          { type: 'required', message: "Password is required" },
        ],
        employeeBio: [
          { type: 'required', message: "Employee bio is required" },
        ],
        employeeImg: [
          { type: 'required', message: "Image is required" },
        ],
    
      }

    get firstName() {
        return this.UPDATE_STAFF_FORM.get('firstName');
      }
    
      get lastName() {
        return this.UPDATE_STAFF_FORM.get('lastName');
      }
    
      get number() {
        return this.UPDATE_STAFF_FORM.get('number');
      }
    
      get gender() {
        return this.UPDATE_STAFF_FORM.get('gender');
      }
    
      get dateOfBirth() {
        return this.UPDATE_STAFF_FORM.get('dateOfBirth');
      }
    
      get address() {
        return this.UPDATE_STAFF_FORM.get('address');
      }
    
      get emergencyContactName() {
        return this.UPDATE_STAFF_FORM.get('emergencyContactName');
      }
    
      get emergencyContactNumber() {
        return this.UPDATE_STAFF_FORM.get('emergencyContactNumber');
      }
    
      get performedServices() {
        return this.UPDATE_STAFF_FORM.get('performedServices');
      }
      
      get role() {
        return this.UPDATE_STAFF_FORM.get('role');
      }
    
      get monthlySales() {
        return this.UPDATE_STAFF_FORM.get('monthlySales');
      }
    
      get commission() {
        return this.UPDATE_STAFF_FORM.get('commission');
      }
    
      get reviews() {
        return this.UPDATE_STAFF_FORM.get('reviews');
      }
      
      get performance() {
        return this.UPDATE_STAFF_FORM.get('performance');
      }
    
      get email() {
        return this.UPDATE_STAFF_FORM.get('email');
      }
    
      get password() {
        return this.UPDATE_STAFF_FORM.get('password');
      }
      
      get employeeBio() {
        return this.UPDATE_STAFF_FORM.get('employeeBio');
      }
    
      get employeeImg() {
        return this.UPDATE_STAFF_FORM.get('employeeImg');
      }
    
}

