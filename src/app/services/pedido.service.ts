import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PedidoNube } from '../model/pedidoNube';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient) { }

  leePedidosEnProceso(idCliente: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoPedidos + environment.pedido + '/cliente/' + idCliente);
  }

  leeDatosPedido(idPedido: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoPedidos + environment.pedido + '/' + idPedido);
  }

  insertaPedidoNube(pedidoNube:PedidoNube){
    return this.http.post(environment.baseUrl + ':' + environment.puertoPedidos + environment.pedido, pedidoNube);
  }

// LGDD ini
  leeHistorialTotalPedidos(idCliente: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoPedidos + environment.pedido + '/historico/' + idCliente);
  }

  leeHistorialPedidos(idCliente: string, registrosXPagina: number, iniciaEn: number) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoPedidos + environment.pedido + '/historico/' + idCliente + '/' + registrosXPagina + '/' + iniciaEn);
  }
// LGDD fin

}
