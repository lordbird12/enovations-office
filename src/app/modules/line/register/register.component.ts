import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-line-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports:[
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
) {
    
}

  ngOnInit(): void {
    this.userIdFromLine = 'test006'; // สมมุติจาก LINE SDK
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

    this.http.post('/api/registere_line', payload).subscribe({
      next: (res) => console.log('Register Success', res),
      error: (err) => console.error('Register Failed', err)
    });
  }
}
