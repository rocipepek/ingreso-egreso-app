type User = {
    email: string,
    uid: string,
    nombre: string
}

export class Usuario {

    static fromFirebase(/* firebaseUser: any */ { email, uid, nombre }: User /* { email: string, uid: string, nombre: string } */) {

        return new Usuario(uid, nombre, email);
    }

    constructor(
        public uid: string,
        public nombre: string,
        public email: string
    ) { }
}