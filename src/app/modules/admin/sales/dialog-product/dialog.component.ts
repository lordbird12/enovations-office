import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { PageService } from '../page.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateTime } from 'luxon';
import { FuseConfirmationService } from '@fuse/services/confirmation';

interface OrderData {
  order_id: string;
  users: { user_id: number; start_date: string; end_date: string }[];
  machine_models: { id: string; products: { product_id: string }[] }[];
  transducers: { id: string; products: { product_id: string }[] }[];
}

@Component({
  selector: 'app-dialog-add-product',
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
    MatAutocompleteModule
  ]
})
export class DialogAddProductComponent implements OnInit {
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
    private dialogRef: MatDialogRef<DialogAddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fuseConfirmationService: FuseConfirmationService
  ) {
    console.log(this.data.order);
    this._service.getUser().subscribe((resp: any) => {
      this.saleData = resp.data
      this.filterSale.next(this.saleData.slice());
    })
    this._service.getMachineModelAll().subscribe((resp: any) => {
      this.productData = resp.data
      
      // this.filterProduct.next(this.productData.slice());
    })

    this.form = this.fb.group({
      order_id: [data.order.id],
      users: this.fb.array(data?.order?.order_users.map(user => this.createUserGroup(user))),
      machine_models: this.fb.array(
        data?.order?.machine_models.map(model => this.createMachineModelGroup(model))
      ),
      transducers: this.fb.array(
        data?.order?.transducers.map(transducer => this.createTransducerGroup(transducer))
      )
    });
  }

  ngOnInit(): void {
    this.productFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this._filterCar();
      });

    this.saleFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this._filterSale();
      });
  }

  protected _filterSale() {
    if (!this.saleData) {
      return;
    }
    let search = this.saleFilter.value;
    if (!search) {
      this.filterSale.next(this.saleData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterSale.next(
      this.saleData.filter(item => item.name.toLowerCase().indexOf(search) > -1)
    );
  }

  onSelectSale(event: any, type: any) {
    console.log(event);

    const selectedName = event;
    const selected = this.saleData.find(item => item.name === selectedName);

    if (selected) {
      const existingItem = this.usersArray.controls.find(
        (control) => control.get('user_id')?.value === selected.id
      );
      console.log(existingItem);
      
      if (existingItem) {
        alert('เลือกพนักงานซ้ำ')
        this.saleFilter.setValue(null); // ล้างค่าในช่อง input
      } else {
        let item = this.fb.group({
          user_id: selected.id,
          name: selected.name,
          start_date: '',
          end_date: ''
        });

        this.usersArray.push(item)
        this.saleFilter.setValue(null); // ล้างค่าในช่อง input
      }


    }
  }

          /**
       * On destroy
       */  protected _onDestroy = new Subject<void>();

  createUserGroup(user: any): FormGroup {
    return this.fb.group({
      user_id: [user?.user_id],
      name: user?.user?.name,
      start_date: [user?.start_date],
      end_date: [user?.end_date]
    });
  }

  dateChange(form: any) {
    const datePipe = new DatePipe("en-US");
    console.log(form)
    if (form.value.start_date && form.value.end_date) {
      const datestart = datePipe.transform(
        form.value.start_date,
        "YYYY-MM-dd"
      );
      const dateend = datePipe.transform(
        form.value.end_date,
        "YYYY-MM-dd"
      );
      console.log()
      form.patchValue({
        start_date: datestart,
        end_date: dateend,
      })
    }
  }

  createMachineModelGroup(model: any): FormGroup {
    return this.fb.group({
      id: model?.machine_model?.id,
      machine_name: model?.machine_model?.name,
      products: this.fb.array(model.products.map(prod => this.createProductGroup(prod)))
    });
  }

  createTransducerGroup(transducer: any): FormGroup {
    return this.fb.group({
      id: [transducer?.machine_model?.id],
      machine_name: transducer?.machine_model?.name,
      products: this.fb.array(transducer.products.map(prod => this.createProductGroup(prod)))
    });
  }

  createProductGroup(product: any): FormGroup {
    return this.fb.group({
      product_id: +product.product_id
    });
  }

  get usersArray(): FormArray {
    return this.form.get('users') as FormArray;
  }

  get machineModelsArray(): FormArray {
    return this.form.get('machine_models') as FormArray;
  }

  get transducersArray(): FormArray {
    return this.form.get('transducers') as FormArray;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addProduct(machineModelIndex: number, type: any): void {
    if (type === 'machine_model') {
      const machineModel = this.machineModelsArray.at(machineModelIndex);
      this.itemData = this.data.product.find((resp: any) => resp.id === machineModel.value.machine_model_id)
      // this.filterProduct.next(this.itemData?.products.slice());
      const productsArray = machineModel.get('products') as FormArray;
      let formValue = this.fb.group({
        product_id: '',
        product_name: ''
      })
      productsArray.push(this.createProductGroup(formValue));
    } else {
      const machineModel = this.transducersArray.at(machineModelIndex);
      this.itemData1 = this.data.product.find((resp: any) => resp.id === machineModel.value.machine_model_id)
      // this.filterProduct1.next(this.itemData?.products.slice());
      const productsArray = machineModel.get('products') as FormArray;
      let formValue = this.fb.group({
        product_id: '',
        product_name: ''
      })
      productsArray.push(this.createProductGroup(formValue));
    }

  }

  addTra(index: number): void {
    const data = this.transducersArray.at(index);
    const productsArray = data.get('products') as FormArray;
    let formValue = this.fb.group({
      product_id: '',
      product_name: ''
    })
    productsArray.push(formValue);
  }

  removeProduct(machineModelIndex: number, productIndex: number, type: string): void {
    if (type === 'machine_model') {
      const machineModel = this.machineModelsArray.at(machineModelIndex);
      const productsArray = machineModel.get('products') as FormArray;
      productsArray.removeAt(productIndex);

    } else {
      const machineModel = this.transducersArray.at(machineModelIndex);
      const productsArray = machineModel.get('products') as FormArray;
      productsArray.removeAt(productIndex);

    }

  }

  removeTra(index: number, productIndex: number): void {
    const machineModel = this.transducersArray.at(index);
    const productsArray = machineModel.get('products') as FormArray;
    productsArray.removeAt(productIndex);

  }


  saveData(): void {
    
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

        // formValue.start_date = DateTime.fromISO(this.form.value.start_date).toFormat('yyyy-MM-dd')
        // formValue.end_date = DateTime.fromISO(this.form.value.end_date).toFormat('yyyy-MM-dd')

        this._service.updateMachineModelProduct(formValue).subscribe({
          next: (resp: any) => {
            this.dialogRef.close(resp);
            // this._router.navigate(['admin/sales/list'])
          },
          error: (err: any) => {
            this._fuseConfirmationService.open({
              "title": "กรุณาระบุข้อมูล",
              "message": err.error.message,
              "icon": {
                "show": true,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
              },
              "actions": {
                "confirm": {
                  "show": false,
                  "label": "ยืนยัน",
                  "color": "primary"
                },
                "cancel": {
                  "show": false,
                  "label": "ยกเลิก",

                }
              },
              "dismissible": true
            });
          }
        })
      } else {

      }
    }))

  }

  protected _filterCar() {


    if (!this.itemData.products) {
      return;
    }
    let search = this.productFilter.value;
    if (!search) {
      // this.filterProduct.next(this.itemData.products.slice());
      return;
    } else {

      search = search.toString().toLowerCase();
    }
    this.filterProduct.next(
      this.itemData.products.filter(item =>
        item.name.toLowerCase().includes(search)
      )
    );
  }

  onSelectMachineModel(event: any, type: any) {
    console.log(type);

    const selectedName = event.option.value;
    const selected = this.productData.find(item => item.name === selectedName);

    if (selected) {
      if (type === 'machine_models') {
        const existingItem = this.machineModelsArray.controls.find(
          (control) => control.get('machine_model_id')?.value === selected.id
        );
        if (existingItem) {
          alert('เลือกเครื่องซ้ำ')
          this.productFilter.setValue(null); // ล้างค่าในช่อง input
        } else {

          let item = this.fb.group({
            machine_model_id: selected.id,
            machine_model_name: selected.name,
            qty: 1,
          });
          this.machineModelsArray.push(item)
          this.productFilter.setValue(null); // ล้างค่าในช่อง input
        }
      } else {
        const existingItem = this.transducersArray.controls.find(
          (control) => control.get('transducers')?.value === selected.id
        );
        if (existingItem) {
          alert('เลือกเครื่องซ้ำ')
          this.productFilter.setValue(null); // ล้างค่าในช่อง input
        } else {

          let item = this.fb.group({
            product_id: selected.id,
            qty: 1,
          });
          this.transducersArray.push(item)
          this.productFilter.setValue(null); // ล้างค่าในช่อง input
        }
      }
    }
  }
  /** เพิ่ม/ลบ Transducers */
  addTransducer(): void {
    let formValue = this.fb.group({
      product_id: '',
    })
    this.transducersArray.push(formValue);
  }

  removeTransducer(index: number): void {
    this.transducersArray.removeAt(index);
  }

  /** เพิ่ม/ลบ Users */
  addUser(): void {
    let formValue = this.fb.group({
      user_id: '',
      name: '',
      start_date: '',
      end_date: '',
    })
    this.usersArray.push(this.createUserGroup(formValue));
  }

  removeUser(index: number): void {
    this.usersArray.removeAt(index);
  }
}


