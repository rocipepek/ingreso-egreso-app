import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { setUser, unSetUser } from '../auth/auth.actions';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId!: string;
  unsub!: Unsubscribe

  constructor(public auth: Auth,
    private firestore: Firestore,
    private store: Store<AppState>) { }

  initAuthListener() {
    //Cuando sucede algun cambio con la autenticacion

    authState(this.auth).subscribe((async (fuser: any) => {
      if (fuser) {
        this.unsub = onSnapshot(doc(this.firestore, 'user', fuser.uid), (doc) => {
          const data = doc.data();
          console.log(data)
          this.userId = data?.['uid'];
          const user = Usuario.fromFirebase({ email: data?.['email'], uid: data?.['uid'], nombre: data?.['nombre'] })
          this.store.dispatch(setUser({ user }))
        })
      } else {
        this.unsub();
        this.store.dispatch(unSetUser())
      }
    }))

  }

  crearUsuario(nombre: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(/* fUser  */({ user }) => {
        const newUser = new Usuario(/* fUser. */user.uid, nombre, email)
        const userRef = doc(this.firestore, 'user', user.uid);

        return setDoc(userRef, { ...newUser });
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
