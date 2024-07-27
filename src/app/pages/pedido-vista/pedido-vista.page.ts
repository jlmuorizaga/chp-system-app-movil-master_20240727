import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonTextarea, IonGrid, IonCol, IonRow, IonSpinner } from '@ionic/angular/standalone';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { Pizza } from 'src/app/model/pizza';
import { Producto } from 'src/app/model/producto';
import { Pedido } from 'src/app/model/pedido';
import { Utilerias } from 'src/app/utilities/utilerias';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import { bagCheckOutline, newspaperOutline, bagHandleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pedido-vista',
  templateUrl: './pedido-vista.page.html',
  styleUrls: ['./pedido-vista.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonRow, IonCol, IonGrid, IonTextarea, IonIcon, IonButton, IonLabel, IonItem, IonList, IonCardContent, IonCardTitle,
    IonCardHeader, IonCard, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule]
})
export class PedidoVistaPage implements OnInit {

  administradorPedido: AdministradorPedido;

  nombreSucursal!: string;
  modalidadEntrega!: string;
  textoDomicilio!: string;
  nombreCliente!: string;
  domicilio!: string;
  pizzas!: Pizza[];
  productos!: Producto[];
  total!: number;
  instrucciones!: string;
  pedido!: Pedido;

  constructor(private router: Router, private alertController: AlertController) {
    this.administradorPedido = AdministradorPedido.getInstance();
    addIcons({ bagCheckOutline, newspaperOutline, bagHandleOutline });
  }

  ngOnInit() {
    //Leer el pedido del administrador de pedido
    this.pedido = this.administradorPedido.getPedido();

    //Datos generales
    this.textoDomicilio = Utilerias.textoDomicilioTipoEntrega(this.administradorPedido);
    this.nombreSucursal = this.administradorPedido.getSucursal().nombreSucursal;
    this.modalidadEntrega = Utilerias.textoEstatusTipoEntrega(this.administradorPedido);
    this.nombreCliente = this.administradorPedido.getCliente().nombre;
    //Detalle del pedido
    this.pizzas = this.pedido.pizzas;
    this.productos = this.pedido.productos;
    this.instrucciones = this.administradorPedido.getInstruccionesEspeciales();
    this.total = 0.00;
  }

  regresaAMenu() {
    console.log('Instrucciones: ' + this.instrucciones);
    this.administradorPedido.setInstruccionesEspeciales(this.instrucciones);
    this.router.navigateByUrl(environment.paginaMenuPrincipal);
  }

// TODO LGDD (punto 1 rojo) Establecer un mínimo del pedido
  procederPago() {
// LGDD ini
    let tipoEntrega = this.administradorPedido.getTipoEntrega().getTipo();
    let montoTotal = this.pedido.montoTotal();
    let montoTotalMoneda = this.pedido.montoTotalMoneda();
    let montoMinimoEntregaSucursal = this.administradorPedido.getSucursal().montoMinimoEntregaSucursal;
    let montoMinimoEntregaDomicilio = this.administradorPedido.getSucursal().montoMinimoEntregaDomicilio;
    let montoMinimo = tipoEntrega === environment.entregaDomicilio ? montoMinimoEntregaDomicilio : montoMinimoEntregaSucursal;
    let montoMinimoMoneda = Utilerias.convierteNumeroAMoneda(montoMinimo);
    if (montoTotal < montoMinimo) {
      this.mensajeMontoMinimo(montoTotalMoneda, montoMinimoMoneda);
    } else {
      this.administradorPedido.setInstruccionesEspeciales(this.instrucciones);
      this.router.navigateByUrl(environment.paginaPago);
    }
  }

  async mensajeMontoMinimo(montoTotalMoneda: string, montoMinimoMoneda: string) {
    const alert = await this.alertController.create({
      header: 'Monto total',
      message: 'El total es de ' + montoTotalMoneda + ' y el monto mínimo es de $' + montoMinimoMoneda + '.' + ' Favor de seleccionar otro producto.',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }
// LGDD fin

}
