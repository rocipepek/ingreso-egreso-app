import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: Auth,
    private firestore: Firestore) { }

  initAuthListener() {
    //Cuando sucede algun cambio con la autenticacion
    authState(this.auth)
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(/* fUser  */({ user }) => {
        const newUser = new Usuario(/* fUser. */user.uid, nombre, email)
        const userRef = collection(this.firestore, 'user');

        return addDoc(userRef, { ...newUser });
      })
  }

  loginUsuario(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isAuth() {
    return authState(this.auth).pipe(
      map(fbUser => fbUser != null)
    );
  }
}
