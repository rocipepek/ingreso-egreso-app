import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>) {

    this.loginForm = fb.group({})
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading
    })
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  loginUsuario() {
    if (this.loginForm.invalid) return;

    this.store.dispatch(isLoading())

    /*  Swal.fire({
       title: 'Espere por favor',
       didOpen: () => {
         Swal.showLoading()
       }
     }) */

    const { correo, password } = this.loginForm.value;
    this.authService.loginUsuario(correo, password)
      .then(credenciales => {
        /* Swal.close(); */
        this.store.dispatch(stopLoading())
        this.router.navigate(['/'])
      })
      .catch(err => {
        this.store.dispatch(stopLoading())

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })
      })
  }

}
