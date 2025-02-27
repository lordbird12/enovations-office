import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  productData: any[] = [];
  itemData: any;

  constructor(
    private fb: FormBuilder,
    private _service: PageService,
    private dialogRef: MatDialogRef<DialogAddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.data.order);
    
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
  }

          /**
       * On destroy
       */  protected _onDestroy = new Subject<void>();

  createUserGroup(user: any): FormGroup {
    return this.fb.group({
      user_id: [user?.user_id],
      start_date: [user?.start_date],
      end_date: [user?.end_date]
    });
  }

  createMachineModelGroup(model: any): FormGroup {
    return this.fb.group({
      id: [model.id],
      machine_model_id: model?.machine_model?.id,
      machine_name: model?.machine_model?.name,
      products: this.fb.array(model.products.map(prod => this.createProductGroup(prod)))
    });
  }

  createTransducerGroup(transducer: any): FormGroup {
    return this.fb.group({
      id: [transducer.id],
      products: this.fb.array(transducer.products.map(prod => this.createProductGroup(prod)))
    });
  }

  createProductGroup(product: any): FormGroup {
    return this.fb.group({
      product_id: [product.product_id]
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

  addProduct(machineModelIndex: number): void {
    const machineModel = this.machineModelsArray.at(machineModelIndex);
    this.itemData = this.productData.find((resp:any) => resp.id ===  machineModel.value.machine_model_id) 
    console.log(this.itemData.products);
    this.filterProduct.next(this.itemData.products.slice());
    const productsArray = machineModel.get('products') as FormArray;
    let formValue = this.fb.group({
      product_id: '',
      product_name: ''
    })
    productsArray.push(this.createProductGroup(formValue));
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

  removeProduct(machineModelIndex: number, productIndex: number): void {
    const machineModel = this.machineModelsArray.at(machineModelIndex);
    const productsArray = machineModel.get('products') as FormArray;
    productsArray.removeAt(productIndex);

  }

  removeTra(index: number, productIndex: number): void {
    const machineModel = this.transducersArray.at(index);
    const productsArray = machineModel.get('products') as FormArray;
    productsArray.removeAt(productIndex);

  }


  saveData(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
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
        start_date: '',
        end_date: '',
      })
      this.usersArray.push(this.createUserGroup(formValue));
    }
  
    removeUser(index: number): void {
      this.usersArray.removeAt(index);
    }
}


