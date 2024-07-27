import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cliente } from '../model/cliente';
import { DomicilioCliente } from '../model/domicilioCliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  leeVerificaCliente(ce: string, pw: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoClientes + environment.accesoCliente + '/' + ce + '/' + pw);
  }

  leeExisteCorreo(ce: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoClientes + environment.accesoCliente + '/' + ce);
  }

  leeDatosCliente(ce: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoClientes + environment.datosCliente + '/' + ce);
  }

  insertaRegistroCliente(cliente: Cliente) {
    return this.http.post(environment.baseUrl + ':' + environment.puertoClientes + environment.datosCliente, cliente);
  }

// TODO LGDD (punto 1 verde) Administración de datos del cliente
// LGDD ini
  actualizaRegistroCliente(cliente: Cliente) {
    return this.http.put(environment.baseUrl + ':' + environment.puertoClientes + environment.datosCliente, cliente);
  }
// LGDD fin

  insertaDomicilioCliente(domicilio: DomicilioCliente) {
    return this.http.post(environment.baseUrl + ':' + environment.puertoClientes + environment.domicilioCliente, domicilio);
  }

  leeListaDomiciliosCliente(idCliente: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoClientes + environment.domicilioCliente + '/' + idCliente);
  }

  eliminaDomicilioCliente(idDomicilioAEliminar: string) {
    return this.http.delete(environment.baseUrl + ':' + environment.puertoClientes + environment.domicilioCliente + '/' + idDomicilioAEliminar);
  }
}
