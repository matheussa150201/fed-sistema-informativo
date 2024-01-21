import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng-lts/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isCadastrar = false;
  msgs = [{}];

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      if (!this.isCadastrar) {
        this.chamadaLogin();
      } else {
        this.chamadaCadastrar();
      }
    }
  }

  chamadaLogin() {
    const authenticationData = this.loginForm.value;
    this.loginService.login(authenticationData).subscribe(
      (response) => {
        this.router.navigate(['/home']);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Credenciais inválidas.',
        });

        setTimeout(() => {
          this.messageService.clear();
        }, 3000);
      }
    );
  }

  chamadaCadastrar() {
    const authenticationData = this.loginForm.value;
    this.loginService.cadastrar(authenticationData).subscribe(
      (response) => {
        this.isCadastrar = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Faça login.',
        });

        setTimeout(() => {
          this.messageService.clear();
        }, 3000);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Erro ao Cadastrar.',
        });

        setTimeout(() => {
          this.messageService.clear();
        }, 3000);
      }
    );
  }

  cadastrar() {
    this.isCadastrar = true;
  }

  fazerLogin() {
    this.isCadastrar = false;
  }
}
