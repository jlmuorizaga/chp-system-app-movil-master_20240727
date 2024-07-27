import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DatosCorreo } from '../model/datosCorreo';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {

  constructor(private http: HttpClient) { }

  recuperaContrasenia(datosCorreo: DatosCorreo) {
    return this.http.post(environment.baseUrl + ':' + environment.puertoCorreos + environment.recuperaContrasenia, datosCorreo);
  }

  verificaCorreo(datosCorreo: DatosCorreo) {
    return this.http.post(environment.baseUrl + ':' + environment.puertoCorreos + environment.verificaCorreo, datosCorreo);
  }
}
