

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageService } from '../page.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'form-customer',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        NgClass,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
        MatPaginatorModule,
        MatTableModule,
        DataTablesModule,
        MatCheckboxModule
    ],

})
export class FormComponent implements OnInit {
        addForm: FormGroup;
    MenuList: any = [];
    gender: any = [
      {
        key: 'M',
        name: 'ผู้ชาย'
      },
      {
        key: 'F',
        name: 'ผู้หญิง'
      }
    ]
    provinces: string[] = [
      'กรุงเทพมหานคร',
      'อำนาจเจริญ',
      'อ่างทอง',
      'บึงกาฬ',
      'บุรีรัมย์',
      'ฉะเชิงเทรา',
      'ชัยนาท',
      'ชัยภูมิ',
      'จันทบุรี',
      'เชียงใหม่',
      'เชียงราย',
      'ชลบุรี',
      'ชุมพร',
      'กาฬสินธุ์',
      'กำแพงเพชร',
      'กาญจนบุรี',
      'ขอนแก่น',
      'กระบี่',
      'ลำปาง',
      'ลำพูน',
      'เลย',
      'ลพบุรี',
      'แม่ฮ่องสอน',
      'มหาสารคาม',
      'มุกดาหาร',
      'นครนายก',
      'นครปฐม',
      'นครพนม',
      'นครราชสีมา',
      'นครสวรรค์',
      'นครศรีธรรมราช',
      'น่าน',
      'นราธิวาส',
      'หนองบัวลำภู',
      'หนองคาย',
      'นนทบุรี',
      'ปทุมธานี',
      'ปัตตานี',
      'พังงา',
      'พัทลุง',
      'พะเยา',
      'เพชรบูรณ์',
      'เพชรบุรี',
      'พิจิตร',
      'พิษณุโลก',
      'แพร่',
      'ภูเก็ต',
      'ปราจีนบุรี',
      'ประจวบคีรีขันธ์',
      'ระนอง',
      'ราชบุรี',
      'ระยอง',
      'ร้อยเอ็ด',
      'สระแก้ว',
      'สกลนคร',
      'สมุทรปราการ',
      'สมุทรสาคร',
      'สมุทรสงคราม',
      'สระบุรี',
      'สตูล',
      'สิงห์บุรี',
      'ศรีสะเกษ',
      'สงขลา',
      'สุโขทัย',
      'สุพรรณบุรี',
      'สุราษฎร์ธานี',
      'สุรินทร์',
      'ตาก',
      'ตรัง',
      'ตราด',
      'อุบลราชธานี',
      'อุดรธานี',
      'อุทัยธานี',
      'อุตรดิตถ์',
      'ยะลา',
      'ยโสธร'
  ];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _Service: PageService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {
        this.addForm = this._formBuilder.group({
            code: '',
            name: '',
            email: '',
            idcard: '',
            company: '',
            phone: '',
            phone2: '',
            address : '',
            age: '',
            status: '',
            gender: '',
            province: '',
        })
    }

    ngOnInit(): void {

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    backTo() {
        this._router.navigate(['admin/customer/list'])
    }

    onSubmit() : void {

        const dialogRef = this._fuseConfirmationService.open({
            "title": "บันทึกข้อมูล",
            "message": "คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?",
            "icon": {
              "show": true,
              "name": "heroicons_outline:exclamation-triangle",
              "color": "accent"
            },
            "actions": {
              "confirm": {
                "show": true,
                "label": "ตกลง",
                "color": "primary"
              },
              "cancel": {
                "show": true,
                "label": "ยกเลิก"
              }
            },
            "dismissible": true
          })

          dialogRef.afterClosed().subscribe((result => {
            if(result === 'confirmed') {
                console.log('complete')
            } else {
                console.log('cancel');
            }
          }))
    }
}

