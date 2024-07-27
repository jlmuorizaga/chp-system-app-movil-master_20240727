import { Component/*, OnInit*/ } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { Cliente } from 'src/app/model/cliente';
import { PedidoService } from 'src/app/services/pedido.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertController, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, IonRow, IonTitle, IonToolbar, IonSpinner } from '@ionic/angular/standalone';
import { TipoEntrega } from 'src/app/model/tipoEntrega';
import { SharedModule } from 'src/app/shared/shared.module';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, logOutOutline, pencilOutline } from 'ionicons/icons';

@Component({
  selector: 'app-seleccion-tipo-entrega',
  templateUrl: './seleccion-tipo-entrega.page.html',
  styleUrls: ['./seleccion-tipo-entrega.page.scss'],
  standalone: true,
  imports: [SharedModule, IonicModule, CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonHeader, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonList, IonItem, IonLabel, IonRadioGroup, IonRadio, IonButton,
    IonGrid, IonRow, IonCol, RouterLink, IonSpinner]
  })
export class SeleccionTipoEntregaPage /* LGDD ini implements OnInit LGDD fin*/ {

  administradorPedido: AdministradorPedido;

  opcionSeleccionada!: string;
  nombreCliente!: string;
// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
// TODO LGDD (punto 5 verde) detener verificaciones de pedidos
  private intervalId: any; // Tipo any para almacenar el ID del intervalo
// LGDD fin

  constructor(private pedidoSvc: PedidoService, private router: Router, public alertController: AlertController) {
    this.administradorPedido = AdministradorPedido.getInstance();
    addIcons({ chevronForwardOutline, pencilOutline });
  }

// TODO LGDD (punto 5 verde) detener verificaciones de pedidos
// LGDD ini
  ionViewWillEnter() {
    this.ngOnInit();    
  }
  // LGDD fin

  ngOnInit() {
// LGDD ini
    this.verificandoConexion = true;
    this.showSpinner = true;
// LGDD fin
    const cliente = this.administradorPedido.getCliente();
      this.nombreCliente = cliente.nombre;
      this.consultaPedidosEnProceso(cliente);
      //Reconsulta los pedidos en proceso cada 5 segundos por si hay cambios de estado
// TODO LGDD (punto 5 verde) detener verificaciones de pedidos
      this.startInterval(cliente);
  }

// TODO LGDD (punto 5 verde) detener verificaciones de pedidos
// LGDD ini
  // se ejecuta justo antes de que Angular elimine un componente del DOM y lo destruya completamente. Esto sucede cuando el componente ya no es necesario, ya sea porque se ha navegado a otra parte de la aplicación o porque se ha eliminado dinámicamente (por ejemplo, al cerrar un modal o una ventana).
  ngOnDestroy(): void {
    this.stopInterval();
  }

  startInterval(cliente: any): void {
    this.intervalId = setInterval(() => {
      console.log("Reconsultando...");
      this.consultaPedidosEnProceso(cliente);
    }, 5000);
  }

  stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null; // Limpia el ID del intervalo
    }
  }
// LGDD fin

  consultaPedidosEnProceso(cliente: Cliente) {
    //Lee pedidos en proceso en la nube
    //console.log('Consultando pedidos en proceso')
    this.pedidoSvc.leePedidosEnProceso(cliente.idCliente).subscribe({
      next: (res: any) => {
        //console.log(res);
        const pedidosEnProceso = res;
        this.administradorPedido.setPedidosEnProceso(pedidosEnProceso);
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
// LGDD fin
        console.log('Error al leer datos del pedido:');
        console.log(error);
      }
    });
  }

  cerrarSesion() {
// LGDD ini
    this.showSpinner = false;
    this.verificandoConexion = false;
// LGDD fin
    localStorage.clear();
// TODO LGDD (punto 5 verde) detener verificaciones de pedidos
    this.stopInterval();
    this.router.navigateByUrl(environment.paginaLogin);
  }

  onClickSucursal() {
    console.log('Selección entrega en sucursal');
    this.opcionSeleccionada = environment.entregaSucursal;
    let tipoEntrega: TipoEntrega;
    tipoEntrega = new TipoEntrega();
    tipoEntrega.setTipo(this.opcionSeleccionada);
    this.administradorPedido.setTipoEntrega(tipoEntrega);
    //Como no es entrega a domicilio, salta directamente a la selección de la sucursal
// LGDD ini
    this.showSpinner = false;
    this.verificandoConexion = false;
// TODO LGDD (punto 5 verde) detener verificaciones de pedidos
    this.stopInterval();
// LGDD fin
    this.router.navigateByUrl(environment.paginaSeleccionSucursal);
  }

  onClickDomicilio() {
    console.log('Selección entrega en domicilio');
    this.opcionSeleccionada = environment.entregaDomicilio;
    let tipoEntrega: TipoEntrega;
    tipoEntrega = new TipoEntrega();
    tipoEntrega.setTipo(this.opcionSeleccionada);
    this.administradorPedido.setTipoEntrega(tipoEntrega);
    //Salta a la selección del domiclio para la entrega
// LGDD ini
    this.showSpinner = false;
    this.verificandoConexion = false;
// TODO LGDD (punto 5 verde) detener verificaciones de pedidos
    this.stopInterval();
// LGDD fin
    this.router.navigateByUrl(environment.paginaSeleccionDomicilio);
  }

  muestraHistorialPedidos() {
// LGDD ini
    this.showSpinner = false;
    this.verificandoConexion = false;
// TODO LGDD (punto 5 verde) detener verificaciones de pedidos
    this.stopInterval();
// LGDD fin
    this.router.navigateByUrl(environment.paginaHistorialPedidos);
  }

  async mensajeErrorConexion() {
// TODO LGDD (punto 5 verde) detener verificaciones de pedidos
    this.stopInterval();
    const alert = await this.alertController.create({
      header: 'Error de conexión',
      message: 'No pudimos conectarnos a los servidores de Cheese Pizza, '
        + 'por favor revisa tu conexión a Internet e intenta de nuevo. ',
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

  modificarDatosCliente() {
    this.router.navigateByUrl(environment.paginaRegistroClienteModifica);    
  }
}
