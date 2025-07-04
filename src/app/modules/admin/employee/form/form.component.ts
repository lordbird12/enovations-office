import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { PageService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, lastValueFrom } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';

@Component({
    selector: 'form-employee',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
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
        MatRadioModule,
        CommonModule,
        NgxDropzoneModule,
        DataTablesModule
    ],
})
export class FormComponent implements OnInit {
    /**
     * Constructor
     */
    dtOptions: DataTables.Settings = {};
    public dataRow: any[];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    addForm2: FormGroup;
    isLoading: boolean = false;
    positions: any[];
    departments: any[];
    permissions: any[];
    teams: any[];
    flashMessage: 'success' | 'error' | null = null;
    selectedFile: File = null;
    Id: any;
    itemData: any;
    url_image: string;
    teamPositions = [
        { value: 'Boss', label: 'หัวหน้าทีม' },
        { value: 'User', label: 'เซล' },
        { value: 'Approve', label: 'ผู้มีสิทธิอนุมัติ' }
      ];
    constructor(
        private formBuilder: FormBuilder,
        private _service: PageService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        public activatedRoute: ActivatedRoute,
    ) {
        this.Id = this.activatedRoute.snapshot.paramMap.get('id');

        this.addForm = this.formBuilder.group({
            permission_id: [],
            department_id: [],
            position_id: [],
            username: [],
            password: [],
            name: [],
            email: [],
            phone: null,
            image: null,
            user_no: [],
            team_id: [],
            team_role: [],
            id:null
        });

        this.addForm2 = this.formBuilder.group({
            permission_id: [],
            department_id: [],
            position_id: [],
            username: [],
            password: [],
            name: [],
            email: [],
            phone: null,
            image: null,
            user_no: [],
            team_id: [],
            team_role: [],
        });
    }


    async ngOnInit(): Promise<void> {
        let response = await lastValueFrom(
            forkJoin({
                permissions: this._service.getPermission(),
                departments: this._service.getDepartment(),
                positions: this._service.getPosition(),
                teams: this._service.getTeam(),
            })
        )
            this.permissions = response.permissions.data;
            this.departments = response.departments.data;
            this.positions = response.positions.data;
            this.teams = response.teams.data;
        if(this.Id) {

            this._service.getById(this.Id).subscribe((resp: any)=>{
                this.itemData = resp.data;
                console.log(this.itemData);
                
                this.addForm.patchValue({
                    ...this.itemData,
                    permission_id: this.itemData.permission_id,
                    department_id: +this.itemData.department_id,
                    position_id: +this.itemData.position_id,
                    image: ''
   
                })
                this.url_image = this.itemData.image
            })
        }
  
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

    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    onSaveClick(): void {

        console.log(this.addForm.value, 'addForm');
        
        this.flashMessage = null;
        // this.addForm.patchValue({
        //     user_no: this.addForm2.value.user_no,
        //     name: this.addForm2.value.name,
        //     username: this.addForm2.value.username,
        //     password: this.addForm2.value.password,
        //     ot: this.addForm2.value.ot,
        // });

        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'เพิ่มข้อมูล',
            message: 'คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                if(this.Id) {
                    let formvalue = this.addForm.value 
                    if(formvalue.team_id === null) {
                        formvalue.team_id = ''
                    }
                    if(formvalue.team_role === null) {
                        formvalue.team_role = ''
                    }
                    delete formvalue.password
                    const formData = new FormData();
                    Object.entries(this.addForm.value).forEach(
                        ([key, value]: any[]) => {
                            formData.append(key, value);
                        }
                    );
                    this._service.update(formData).subscribe({
                        next: (resp: any) => {
                            this.showFlashMessage('success');
    
                            this._router.navigate(['admin/employee/list'])
    
                        },
                        error: (err: any) => {
                            this.addForm.enable();
                            this._fuseConfirmationService.open({
                                title: 'กรุณาระบุข้อมูล',
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'ยืนยัน',
                                        color: 'primary',
                                    },
                                    cancel: {
                                        show: false,
                                        label: 'ยกเลิก',
                                    },
                                },
                                dismissible: true,
                            });
                        },
                    });
                } else {
                    const formData = new FormData();
                    Object.entries(this.addForm.value).forEach(
                        ([key, value]: any[]) => {
                            formData.append(key, value);
                        }
                    );
                    this._service.create(formData).subscribe({
                        next: (resp: any) => {
                            this.showFlashMessage('success');
    
                            this._router.navigate(['admin/employee/list'])
    
                        },
                        error: (err: any) => {
                            this.addForm.enable();
                            this._fuseConfirmationService.open({
                                title: 'กรุณาระบุข้อมูล',
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'ยืนยัน',
                                        color: 'primary',
                                    },
                                    cancel: {
                                        show: false,
                                        label: 'ยกเลิก',
                                    },
                                },
                                dismissible: true,
                            });
                        },
                    });
                }
              
            }
        });
        // แสดง Snackbar ข้อความ "complete"
    }

    files: File[] = [];
    url_logo: string;
    onSelect(event: { addedFiles: File[] }): void {
        this.files.push(...event.addedFiles);
        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload = (e: any) => (this.url_logo = e.target.result);
        const file = this.files[0];
        this.addForm.patchValue({
            image: file,
        });

        setTimeout(() => {
            this.flashMessage = null;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 150);
        
        this.url_image = null
    }

    onRemove(file: File): void {
        const index = this.files.indexOf(file);
        this.url_image = this.itemData.image;
        if (index >= 0) {
            this.files.splice(index, 1);
        }
    }

     pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = null;
                that._service
                    .getPageIncomePaid(dataTablesParameters)
                    .subscribe((resp: any) => {
                        this.dataRow = resp.data;
                        console.log(this.dataRow,'dataRow');
                        
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }

                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
            },
            columns: [
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'name' },
                { data: 'email' },
                { data: 'tel' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };
    }
}
