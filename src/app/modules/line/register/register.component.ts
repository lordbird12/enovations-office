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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private _serviceLine: LineService,
    private _router: Router
  ) {

  }

  ngOnInit(): void {
    this.userIdFromLine = this.activatedRoute.snapshot.queryParams['user_id'] // สมมุติจาก LINE SDK

    this.form = this.fb.group({
      user_no: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.userIdFromLine) return;

    const payload = {
      user_id: this.userIdFromLine,
      user_no: this.form.value.user_no
    };

    this._serviceLine.lineRegister(payload).subscribe({
      next: (resp: any) => {
        // ✅ เมื่อสำเร็จ
        console.log('Register success:', resp);
        this._router.navigate(['line/list/booking'])
        // ทำงานหลังจากบันทึกเรียบร้อย เช่น redirect หรือแจ้งเตือน
      },
      error: (err) => {
        // ❌ เกิดข้อผิดพลาด
        console.error('Register failed:', err);
        // แจ้งเตือนหรือแสดง error message
      },
      complete: () => {
        // ✅ ทำงานเมื่อ Observable จบ (ไม่ค่อยใช้ในกรณี HTTP)
        console.log('Request completed.');
      }
    });
  }
}
