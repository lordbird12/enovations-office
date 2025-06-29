

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LineService } from '../../line.service';
@Component({
    selector: 'form-news-list',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatRadioModule,
        MatAutocompleteModule,
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
        MatCheckboxModule,
        MatChipsModule

    ],
})
export class NewsComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    data: any[] = [];
    categoryData: any[] = [];
    selectedCategory: any = null;
    user: any
    pageType: any
    /**
     * Constructor
     */
    constructor(
        private _service: LineService,
        private _fb: FormBuilder,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        public activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,

    ) {

    }

    ngOnInit() {
        this.GetNews()
    }


    GetNews() {
        this._service.getCategoryNews().subscribe((resp: any) => {
            this.categoryData = resp.data
            this.selectedCategory = this.categoryData[0]; // optional: select first by default
            this.data = this.categoryData[0].news
            this._changeDetectorRef.markForCheck()

        })
    }

    selectCategory(category: any): void {
        this.selectedCategory = category;
        this.data = category.news;
        this._changeDetectorRef.markForCheck()
        // คุณสามารถดึงข่าวตาม category ที่เลือกได้ที่นี่
    }

    viewDetail(id: any) {
        this._router.navigate(['line/news/' + id])
    }

    goHome() {
        this._router.navigate(['/line/list/booking']);
    }
    newForm() {
        this._router.navigate(['/line/form']);
    }

    goCalendar() {
        this._router.navigate(['/line/calendar-timeline']);
    }

    goNews() {
        this._router.navigate(['/line/news']);
    }


}



