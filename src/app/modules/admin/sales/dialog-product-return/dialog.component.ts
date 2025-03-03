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
  selector: 'app-dialog-return-product',
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
export class DialogReturnProductComponent implements OnInit {
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
  constructor(
    private fb: FormBuilder,
    private _service: PageService,
    private dialogRef: MatDialogRef<DialogReturnProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fuseConfirmationService: FuseConfirmationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private toastr: ToastrService
  ) {

    console.log(this.data);

    this.form = this.fb.group({
      order_id: [data.order.id],
      reserve_ref_no: data.order.reserve_ref_no,
      return_date: DateTime.now().toFormat('yyyy-MM-dd'),
      remark: '',
      products: this.fb.array([])


    });
  }

  ngOnInit(): void {
    this.data.product.forEach(product => {
        let formProduct = this.fb.group({
            product_id: product.product_id,
            machine_model_id: product.machine_model_id,
            remark: '',
            images: this.fb.array([])
        });
        this.productsArray.push(formProduct);
    });
    console.log('form',this.form.value);

  }


  get productsArray(): FormArray {
    return this.form.get('products') as FormArray;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  filesPC: { [key: number]: File } = {}; // แยกไฟล์แต่ละแถว

  async onSelectsPC(event: { addedFiles: File[] }, i: number): Promise<void> {
    if (!event.addedFiles.length) return;

    const file = event.addedFiles[0];

    // ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
    if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
    }

    this.filesPC[i] = file; // ผูกไฟล์เฉพาะ index นี้
    const formData1 = new FormData();
    formData1.append('image', file);
    formData1.append('path', 'images/asset/');

    try {
        // อัปโหลดรูปภาพและรับ URL
        const im = await lastValueFrom(this._service.uploadImg(formData1));

        if (!im) {
            console.error("Invalid image response:", im);
            return;
        }

        console.log("Uploaded Image URL:", im); // สมมติว่า API ส่ง path กลับมาเป็น im.path

        // เข้าถึง FormArray 'products'
        const productCollections = this.form.get('products') as FormArray;
        if (!productCollections) {
            console.error("Products FormArray not found");
            return;
        }

        const productGroup = productCollections.at(i) as FormGroup; // ดึง FormGroup ตาม index
        if (!productGroup) {
            console.error("Product FormGroup not found at index", i);
            return;
        }

        // เข้าถึง FormArray 'images' ใน FormGroup
        let imagesArray = productGroup.get('images') as FormArray;
        if (!imagesArray) {
            console.error("Images FormArray not found in FormGroup, creating one.");
            imagesArray = this.fb.array([]);
            productGroup.setControl('images', imagesArray); // สร้างใหม่ถ้าไม่มี
        }

        imagesArray.push(this.fb.control(im)); // ✅ ใช้ push() กับ FormArray โดยตรง

        // แสดงค่า Form เพื่อ debug
        console.log("Updated Form Value:", this.form.value);

        // แปลงไฟล์เป็น URL เพื่อแสดงใน img
        const reader = new FileReader();
        reader.onload = (e: any) => {
            // this.imageUrls[i] = e.target.result;
        };
        reader.readAsDataURL(file);

        this._changeDetectorRef.markForCheck();

    } catch (error) {
        console.error("Upload failed", error);
    }
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
        let formValue = this.form.value;
        formValue.products = formValue.products.map(product => ({
          ...product,
          images: product.images === "" ? [] : product.images
        }));
        this._service.updateReturnProduct(formValue).subscribe({
          next: (resp: any) => {
             this.toastr.success('สำเร็จ')
            this.dialogRef.close(resp);
          },
          error: (err: any) => {
            this.toastr.error('เกิดข้อผิดผลาด')
          }
        })
      } else {

      }
    }))

  }


}



