import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClienteService } from '../services/cliente.service';
import { PedidoService } from '../services/pedido.service';
import { CatalogosService } from '../services/catalogos.service';
import { CorreoService } from '../services/correo.service';
import { StripeService } from '../services/stripe.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [ClienteService, PedidoService, CatalogosService, CorreoService, StripeService]
})
export class SharedModule { }
