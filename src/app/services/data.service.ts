import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private correoRegistro!: string;

  constructor() { }

  setCorreoRegistro(correoRegistro: any) {
    this.correoRegistro = correoRegistro;
  }

  getCorreoRegistro() {
    return this.correoRegistro;
  }
}
