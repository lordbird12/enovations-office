

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, Location, NgClass } from '@angular/common';
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
import liff from '@line/liff';
@Component({
    selector: 'form-news-view',
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
export class NewsDetailComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    newsItem: any;
    categoryData: any[] = [];
    user: any
    pageType: any
    Id: any;
    userIdFromLine: string = '';
    displayName: string = '';
    pictureUrl: string = '';
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
        private location: Location

    ) {
        this.Id = this.activatedRoute.snapshot.params.id

    }

    async ngOnInit() {
        // await this.initializeLiff();
        this.GetById(this.Id)
    }


    GetById(id: any) {
        this._service.getNewsById(id).subscribe((resp: any) => {
            this.newsItem = resp.data
            this._changeDetectorRef.markForCheck()

        })
    }

    goBack(): void {
        this.location.back();
    }
}
