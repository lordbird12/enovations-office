import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { LineService } from '../line.service';
import liff from '@line/liff';

@Component({
  selector: 'app-line-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class LineRegisterComponent implements OnInit {
  form: FormGroup;
  userIdFromLine: string = '';
  imageFromLine: string = '';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private _serviceLine: LineService,
    private _router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      user_no: [null, Validators.required]
    });

    this.userIdFromLine = this.activatedRoute.snapshot.queryParams['user_id'];
    this.imageFromLine = this.activatedRoute.snapshot.queryParams['image'];

    if (!this.userIdFromLine) {
      await this.initLiff();
    }

    if (this.userIdFromLine) {
      console.log('LINE User ID:', this.userIdFromLine);
    } else {
      alert('ไม่สามารถดึง user_id จาก LINE ได้');
    }
  }

  async initLiff() {
    try {
      await liff.init({ liffId: '2007657331-oyjNGORd' }); // 👈 เปลี่ยนเป็น LIFF ID ของคุณ
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        this.userIdFromLine = profile.userId;
        this.imageFromLine = profile.pictureUrl;
      } else {
        liff.login();
      }
    } catch (err) {
      console.error('LIFF init error:', err);
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !this.userIdFromLine) return;

    const payload = {
      user_id: this.userIdFromLine,
      user_no: this.form.value.user_no,
      image: this.imageFromLine
    };

    this._serviceLine.lineRegister(payload).subscribe({
      next: (resp: any) => {
        console.log('Register success:', resp);
        this._router.navigate(['line/list/booking']);
      },
      error: (err) => {
        console.error('Register failed:', err);
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }
}
