import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>) {

    this.registroForm = this.fb.group({});
  }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
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

  crearUsuario() {
    if (this.registroForm.invalid) return;

    this.store.dispatch(isLoading())

    /*  Swal.fire({
       title: 'Espere por favor',
       didOpen: () => {
         Swal.showLoading()
       }
     }) */

    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password)
      .then(() => {
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
