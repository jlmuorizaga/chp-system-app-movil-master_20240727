import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonLabel, IonButton, IonIcon, IonGrid, IonCol, IonRow, IonSpinner } from '@ionic/angular/standalone';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Pedido } from 'src/app/model/pedido';
import { PedidoNube } from 'src/app/model/pedidoNube';
import { Utilerias } from 'src/app/utilities/utilerias';
import { PedidoService } from 'src/app/services/pedido.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-pagina-pago-dummy',
  templateUrl: './pagina-pago-dummy.page.html',
  styleUrls: ['./pagina-pago-dummy.page.scss'],
  standalone: true,
  imports: [IonRow, IonCol, IonGrid, SharedModule, IonIcon, IonButton, IonLabel, IonCardSubtitle, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSpinner]
})
export class PaginaPagoDummyPage implements OnInit {

  administradorPedido: AdministradorPedido;
  claveSucursal!: string;
  monto!: number;
// LGDD ini
  showSpinner = false;
  reintento!: boolean;
  verificandoConexion!: boolean;
// LGDD fin

  constructor(public alertController: AlertController,
    private router: Router, private pedidoSvc: PedidoService) {
    this.administradorPedido = AdministradorPedido.getInstance();
  }

  ngOnInit() {
    this.datosParaPago();
  }

  datosParaPago() {
    this.claveSucursal = this.administradorPedido.getSucursal().clave;
    this.monto = this.administradorPedido.getPedido().montoTotal();
  }

  pagoExitoso() {
    console.log('Pago exitoso');
    this.mensajePagoExitoso();
    //Enviar el pedido a la sucursal
    this.enviarPedido();
    this.router.navigateByUrl(environment.paginaSeleccionTipoEntrega);
  }

  pagoFracaso() {
    console.log('No se pudo realizar el pago')
    this.mensajeFalloPago();
    this.router.navigateByUrl(environment.paginaVistaPedido)
  }

  async mensajePagoExitoso() {
    const alert = await this.alertController.create({
      header: 'Pago exitoso',
      message: 'Se ha procesado exitosamente tu pago',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  async mensajeFalloPago() {
    const alert = await this.alertController.create({
      header: 'Falló pago',
      message: 'No se pudo procesar tu pago, intenta nuevamente',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  enviarPedido() {
    console.log("Enviando pedido");

    let pedido: Pedido = this.administradorPedido.getPedido();

    let pn: PedidoNube;
    pn = new PedidoNube();

    pn.idPedido = Utilerias.generaIdUnico();
    pn.idCliente = this.administradorPedido.getCliente().idCliente;
    pn.datosCliente = this.administradorPedido.getCliente().nombre
      + environment.separadorDatos + this.administradorPedido.getCliente().telefono;
    //Asignando datos del domicilio sólo si es entrega a domicilio
    if (this.administradorPedido.getTipoEntrega().getTipo() === environment.entregaDomicilio) {
      pn.idDomicilioCliente = this.administradorPedido.getDomicilioCliente().idDomicilioCliente;
      pn.datosDomicilioCliente = this.administradorPedido.getDomicilioCliente().descripcion;
    }
    pn.claveSucursal = this.administradorPedido.getSucursal().clave;
    pn.datosSucursal = this.administradorPedido.getSucursal().nombreSucursal;
    pn.fechaHora = Utilerias.fechaActual();
    pn.estatus = environment.estatusPedidoNube;
    pn.modalidadEntrega = this.administradorPedido.getTipoEntrega().getTipo();
    pn.montoTotal = pedido.montoTotal();
    //Asignando el detalle del pedido
    {
      let detalle = '';
      let separador = '';
      //Agregando pizzas al pedido
      for (const pizza of pedido.pizzas) {
        if (pizza.cantidad > 0) {
          detalle += separador + pizza.cantidad + ' ' + pizza.especialidad.nombre + ' ' + pizza.tamanio.nombre;
          separador = environment.separadorDatos;
        }
      }
      //Agregando productos al pedido
      console.log(pedido.productos);
      for (const producto of pedido.productos) {
        if (producto.cantidad > 0) {
          detalle += separador + producto.cantidad + ' ' + producto.descripcion + ' ' + producto.tamanio;
          if (producto.usaSalsa === 'S') {
            detalle += ' (' + producto.salsasStr + ')';
          }
          separador = environment.separadorDatos;
        }
      }
      pn.detallePedido = detalle;
    }
    if (this.administradorPedido.getInstruccionesEspeciales()) {
      pn.instruccionesEspeciales = this.administradorPedido.getInstruccionesEspeciales();
    }
    //Asignando las promociones aplicadas
    pn.promocionesAplicadas = 'Pendiente de aplicar las promociones';
    pn.tipoPago = environment.pagoEnLinea;

    pn.cantidadProductos = pedido.cantidadProductos();
    pn.resumenPedido = pedido.resumenPedido();

    console.log(pn);
    console.log(JSON.stringify(pn));

// LGDD ini
    this.showSpinner = true;
    this.verificandoConexion = true;
// LGDD fin
    //Enviando pedido a la nube

    // Realizar la solicitud POST
    this.pedidoSvc.insertaPedidoNube(pn).subscribe({
      next: (res: any) => {
        let respuesta = res;
        console.log(respuesta);
// LGDD
        this.showSpinner = false;
      },
      error: (error: any) => {
// LGDD ini
        this.showSpinner = false;
        this.mensajeErrorConexion();
        this.verificandoConexion = false;
        this.reintento = true;
// LGDD fin
        console.log('Ocurrió un error al enviar el pedido:');
        console.log(error);
      }
    })

  }

  async mensajePedidoRegistrado() {
    const aviso = await this.alertController.create({
      header: 'Pedido registrado',
      message: 'Se ha enviado tu pedido a la sucursal',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          console.log('Salió del Alert');
          //Limpiando el pedido
          this.administradorPedido.reiniciaPedido();
          //this.navCtrl.navigateForward(Constantes.PAGINA_SELECCION_TIPO_ENTREGA);
        }
      }],
    });

    aviso.backdropDismiss = false;
    aviso.onclick;
    await aviso.present();
  }

  async mensajeErrorConexion() {
    const alert = await this.alertController.create({
      header: 'Error de conexión',
      message: 'No pudimos conectarnos a los servidores de Cheese Pizza, '
        + 'por favor revisa tu conexión a Internet e intenta de nuevo.',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  reintentarConexion() {
    this.enviarPedido();
    this.reintento = false;
  }

}
