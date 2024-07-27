import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonAccordionGroup, IonRow, IonCol, IonAccordion, IonItem, IonChip, IonAvatar, IonLabel, IonCard, IonCardContent, IonButtons, IonBackButton, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from 'src/app/services/pedido.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PedidoNube } from 'src/app/model/pedidoNube';
import { Utilerias } from 'src/app/utilities/utilerias';
import { environment } from 'src/environments/environment';
import { Sucursal } from 'src/app/model/sucursal';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { AdministradorPedido } from 'src/app/model/administradorPedido';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.page.html',
  styleUrls: ['./historial-pedidos.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonIcon, IonButton, IonBackButton, IonButtons,
    IonCardContent, IonCard, IonLabel, IonAvatar, IonChip, IonItem,
    IonAccordion, IonCol, IonRow, IonAccordionGroup, IonGrid, IonContent,
    IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SharedModule]
})
export class HistorialPedidosPage implements OnInit {

  administradorPedido: AdministradorPedido;

  pedidos!: PedidoNube[];
  entregaEnSucursal: boolean = false;
  domicilioSucursal: string = '';
  idCliente!: string;
  totalPedidos: number = 0;
  registrosXPagina: number = 3;
  iniciaEn: number = 0;
  totalPaginas: number = 0;
  paginaActual: number = 1;
  verificandoConexion!: boolean;
// LGDD ini
//  reintento!: boolean;
  showSpinner!: boolean;
// LGDD fin
  deshabilitadoDecrementaPagina: boolean = true;
  deshabilitadoIncrementaPagina: boolean = true;
// LGDD fin

  constructor(
    private activatedRoute: ActivatedRoute, private pedidoSvc: PedidoService,
    private catalogosSvc: CatalogosService, private alertController: AlertController
  )
  { addIcons({ chevronBackOutline, chevronForwardOutline });
    this.administradorPedido = AdministradorPedido.getInstance();
  }

  ngOnInit() {
    this.verificandoConexion = true;
    this.showSpinner = true;
    const idCliente = this.administradorPedido.getCliente().idCliente;
    if (idCliente) {
      this.idCliente = idCliente;
      this.pedidoSvc.leeHistorialTotalPedidos(this.idCliente).subscribe({
        next: (res: any) => {
          this.totalPedidos = res.totalpedidos;
          let totalPedidos =  this.totalPedidos;
          this.totalPaginas = this.obtenerNumeroPaginas(totalPedidos);
// LGDD ini
          this.verificandoConexion = false;
          this.showSpinner = false;
          this.deshabilitarIncrementaDecrementaPagina();
          this.leeHistorialTotalPedidos();
// LGDD fin
        },
        error: (error: any) => {
// LGDD ini
          this.verificandoConexion = false;
          this.showSpinner = false;
          this.mensajeErrorConexion();
//          this.reintento = true;
// LGDD fin
          console.log('Error al leer datos del pedido:');
          console.log(error);
        }
      });
//      this.leeHistorialTotalPedidos();
    }

  }

  obtenerNumeroPaginas(totalPedidos: number) {
    let totalPaginas = totalPedidos / this.registrosXPagina;
    let totalPaginasValorEntero = ((totalPedidos - (totalPedidos % this.registrosXPagina)) / this.registrosXPagina);
    let totalPaginasValorResiduo = totalPedidos % this.registrosXPagina;
    if (totalPaginasValorResiduo > 0) {
      totalPaginasValorEntero++;
      totalPaginas = totalPaginasValorEntero;
    }
    return totalPaginas;
  }

  leeHistorialTotalPedidos() {
// LGDD ini
    this.showSpinner = true;
// LGDD fin
    this.iniciaEn = (this.paginaActual - 1) * this.registrosXPagina;
// TODO LGDD (punto 5 rojo) En los pedidos históricos, que aparezca la liga al recibo
    this.pedidoSvc.leeHistorialPedidos(this.idCliente, this.registrosXPagina, this.iniciaEn).subscribe({
      next: (res: any) => {
        this.pedidos = res;
        for (let index = 0; index < this.pedidos.length; index++) {
          this.entregaEnSucursal = this.pedidos[index].modalidadEntrega === environment.entregaSucursal;
        }
// LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
// LGDD fin
      },
      error: (error: any) => {
// LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
        this.mensajeErrorConexion();
//        this.reintento = true;
// LGDD fin
        console.log('Error al leer datos del pedido:');
        console.log(error);
      }
    });
  }

// TODO LGDD (punto 6 rojo) En los pedidos históricos, que se implemente la paginación
  deshabilitarIncrementaDecrementaPagina() {
    this.deshabilitadoIncrementaPagina = this.paginaActual >= this.totalPaginas ? true : false;
    this.deshabilitadoDecrementaPagina = this.paginaActual <= 1 ? true : false;
  }

  incrementaPagina() {
    if (this.paginaActual >= this.totalPaginas) {
      this.paginaActual = this.totalPaginas;
    } else {
      this.paginaActual += 1;
      this.leeHistorialTotalPedidos();
    }
    this.deshabilitarIncrementaDecrementaPagina();
  }

  decrementaPagina() {
    if (this.paginaActual <= 1) {
      this.paginaActual = 1;
    } else {
      this.paginaActual -= 1;
      this.leeHistorialTotalPedidos();
    }
    this.deshabilitarIncrementaDecrementaPagina();
  }

  convierteAFechaYFormatea(texto: string): string {
    return Utilerias.convertToDateAndFormat(texto);
  }

  textoModalidadEntrega(modalidadEntrega: string): string {
    return Utilerias.textoModalidadEntrega(modalidadEntrega);
  }

  leeDatosSucursal(claveSucursal: string) {
// LGDD ini
    this.showSpinner = true;
// LGDD fin
    this.catalogosSvc.leeListaSucursales().subscribe({
      next: (res: any) => {
        let sucursales: Sucursal[] = res;
        for (let suc of sucursales) {
          if (suc.clave === claveSucursal) {
            let sucursal = suc;
            this.domicilioSucursal = sucursal.domicilio;
          }
        }
// LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
// LGDD fin
      },
      error: (error: any) => {
// LGDD ini
        this.showSpinner = false;
        this.verificandoConexion = false;
        this.mensajeErrorConexion();
//        this.reintento = true;
// LGDD fin
        console.log('Error al leer la lista de sucursales:');
        console.log(error);
      }
    });
  }

  textoPipe2Array(texto: string): string[] {
    return Utilerias.textoPipe2Array(texto);
  }

  textoEstatusEntrega(texto: string): string {
    return Utilerias.textoEstatusPedido(texto);
  }

  async mensajeErrorConexion() {
    const alert = await this.alertController.create({
      header: 'Error de conexión',
      message: 'No pudimos conectarnos a los servidores de Cheese Pizza, '
        + 'por favor revisa tu conexión a Internet e intenta de nuevo.',
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            // Aquí defines lo que quieres que haga tu función al presionar OK
            this.ngOnInit();      
          }
        }],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

}
