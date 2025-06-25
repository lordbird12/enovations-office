import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { lastValueFrom, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { PageService } from '../page.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateTime } from 'luxon';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ToastrModule, ToastrService } from 'ngx-toastr';

interface OrderData {
  order_id: string;
  users: { user_id: number; start_date: string; end_date: string }[];
  machine_models: { id: string; products: { product_id: string }[] }[];
  transducers: { id: string; products: { product_id: string }[] }[];
}

@Component({
  selector: 'app-dialog-return-product-wait-approved',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
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
    MatRadioModule,
    CommonModule,
    MatDialogModule,
    MatAutocompleteModule,
    NgxDropzoneModule,
    ToastrModule
  ]
})
export class DialogReturnProductWaitApprovedComponent implements OnInit {
  form: FormGroup;
  formFieldHelpers: string[] = ['fuse-mat-dense'];
  productFilter = new FormControl('');
  filterProduct: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filterProduct1: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  productData: any[] = [];
  itemData: any;
  itemData1: any;
  ///sale_user
  saleFilter = new FormControl('');
  filterSale: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  saleData: any[] = [];

  productArray:[{Id:number,status:string,remark:string}];
  
  constructor(
    private fb: FormBuilder,
    private _service: PageService,
    private dialogRef: MatDialogRef<DialogReturnProductWaitApprovedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fuseConfirmationService: FuseConfirmationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private toastr: ToastrService
  ) {

    console.log('data',this.data);

  }

  ngOnInit(): void {
    // Initialize the form
    this.form = this.fb.group({
      products: this.fb.array(this.data.product.map(product => this.fb.group({
        name: [product.product.name],
        id: [product.return_product_id],
        status: ['approved'],
        remark: ['']
      })))
    });

    console.log('form', this.form.value);
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveData(): void {

    console.log('form',this.form.value);

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
      if (result === 'confirmed') {
        const formValue = this.form.value;
        const products = formValue.products;
        
        // Create an array of API calls
        const apiCalls = products.map(product => {
          const payload = {
            id: product.id,
            status: product.status,
            remark: product.remark
          };
          
          return this._service.updateStatusReturn(payload);
        });
        
        // Use Promise.all to wait for all API calls to complete
        Promise.all(apiCalls.map(call => lastValueFrom(call)))
          .then(responses => {
            this.toastr.success('บันทึกข้อมูลสำเร็จ');
            this.dialogRef.close(responses);
          })
          .catch(error => {
            this.toastr.error('เกิดข้อผิดพลาด');
            console.error('Error updating products:', error);
          });
      }
    }))
  }
}



