import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  constructor(private http: HttpClient) { }

  leeListaSucursales() {
    return this.http.get(environment.baseUrl + ':' + environment.puertoCatalogos + environment.sucursales);
  }

  leeEspecialidadesSucursal(claveSucursal: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoCatalogos + environment.especialidades + '/' + claveSucursal);
  }

  leeTiposProductoSucursal(claveSucursal: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoCatalogos + environment.tiposProducto + '/' + claveSucursal);
  }

  leeTamanioxExpecialidadxSucursal(claveSucursal: string, idEspecialidad: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoCatalogos + environment.tamaniosEspecialidad + '/' + claveSucursal + '/' + idEspecialidad);
  }

  leeProductoxTipoxSucursal(claveSucursal: string, idTipoProducto: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoCatalogos + environment.productos + '/' + claveSucursal + '/' + idTipoProducto);
  }

  leeSalsasSucursal(claveSucursal: string) {
    return this.http.get(environment.baseUrl + ':' + environment.puertoCatalogos + environment.salsas + '/' + claveSucursal);
  }
}
