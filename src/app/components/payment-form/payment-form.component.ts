import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { DatosPagoStripe } from 'src/app/model/datosPagoStripe';
import { PedidoService } from 'src/app/services/pedido.service';
import { StripeService } from 'src/app/services/stripe.service';
import { AlertController } from '@ionic/angular';
import { IonCard, IonText, IonLabel, IonGrid, IonRow, IonCol, IonSpinner, IonButton, IonIcon } from "@ionic/angular/standalone";
import { SharedModule } from 'src/app/shared/shared.module';
import { constructOutline } from 'ionicons/icons';
import { environment } from 'src/environments/environment';
import { Pedido } from 'src/app/model/pedido';
import { PedidoNube } from 'src/app/model/pedidoNube';
import { Utilerias } from 'src/app/utilities/utilerias';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonSpinner, IonCol, IonRow, IonGrid, IonLabel, IonText, SharedModule, IonSpinner],
})
export class PaymentFormComponent implements OnInit, AfterViewInit {
  @ViewChild('cardInfo', { static: false }) cardInfo!: ElementRef;

  cardError!: string;
  card: any;

  botonPagoDeshabilitado: boolean;

// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
// LGDD fin

  administradorPedido: AdministradorPedido;
  constructor(private stripeService: StripeService, public alertController: AlertController,
    private router: Router, private pedidoSvc: PedidoService) {
    this.administradorPedido = AdministradorPedido.getInstance();
    this.botonPagoDeshabilitado = false;
  }

  ngOnInit() {
    this.initStripe();
    this.botonPagoDeshabilitado = false;
  }

  ngAfterViewInit() {
    //this.card = this.stripeService.initCardElement(this.administradorPedido.getSucursal());
    //this.card.mount(this.cardInfo.nativeElement);
    //this.card.addEventListener('change', this.onChange.bind(this));

    this.card = this.stripeService.initCardElement(this.administradorPedido.getSucursal());
    this.card.cardNumber.mount('#card-number');
    this.card.cardExpiry.mount('#card-expiry');
    this.card.cardCvc.mount('#card-cvc');
    this.card.postalCode.mount('#postal-code');
    this.card.cardNumber.addEventListener('change', this.onChange.bind(this));
    this.card.cardExpiry.addEventListener('change', this.onChange.bind(this));
    this.card.cardCvc.addEventListener('change', this.onChange.bind(this));
    this.card.postalCode.addEventListener('change', this.onChange.bind(this));
  }

  onChange(event: any) {
    const { error } = event;
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = null as any;
    }
  }

  initStripe() {
    // Lógica para inicializar Stripe Elements y montar el elemento de tarjeta
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    // Lógica para manejar la creación del token o PaymentMethod y enviarlo al servidor
  }

  async handleForm(e: Event) {
    //Deshabilita el botón para que no se envíe más de un pago
    this.botonPagoDeshabilitado = true;

    e.preventDefault(); // Esto evita que el formulario se envíe de la manera tradicional.

    const { token, error } = await this.stripeService.createToken(this.card.cardNumber);

    if (error) {
      console.log('Something is wrong:', error);
      // Aquí manejas el error, por ejemplo, mostrando un mensaje al usuario.
      this.mensajeErrorTarjeta(error.message);
      //Habilita el botón de pago para que se pueda intentar nuevamente
      this.botonPagoDeshabilitado = false;
    } else {
      console.log('Success! Token:', token.id);
      // Aquí envías el token.id a tu servidor para procesar el pago.
      let dps = new DatosPagoStripe();
      dps.claveSucursal = this.administradorPedido.getSucursal().clave;
      dps.amount = this.administradorPedido.getPedido().montoTotal() * 100; //El monto debe ser en centavos
      dps.token = token.id;
      dps.description = 'CHP ' + this.administradorPedido.getSucursal().nombreSucursal + ' ' + this.administradorPedido.getPedido().resumenPedido();

      //Enviando token y datos para el pago
// LGDD ini
      this.verificandoConexion = true;
      this.showSpinner = true;
// LGDD fin
      this.stripeService.procesaPagoStripe(dps).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.success) {
            let urlRecibo = res.charge.receipt_url;
            console.log(urlRecibo);
            this.enviarPedido(urlRecibo);
            this.router.navigateByUrl(environment.paginaSeleccionTipoEntrega);
            this.mensajePagoExitoso();
          } else {
            this.mensajeFalloPago();
            //Habilita el botón de pago para que se pueda intentar nuevamente
            this.botonPagoDeshabilitado = false;
          }
        },
        error: (error: any) => {
// LGDD ini
          this.verificandoConexion = false;
          this.showSpinner = false;
          this.mensajeErrorConexion();
// LGDD fin
          console.log('Error al procesar pago en stripe');
          console.log(error);
// LGDD ini
//          this.mensajeFalloPago();
// LGDD fin
          //Habilita el botón de pago para que se pueda intentar nuevamente
          this.botonPagoDeshabilitado = false;
        }
      })

    }
  }

  enviarPedido(urlRecibo: string) {
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
    pn.urlReciboPago = urlRecibo;

    pn.cantidadProductos = pedido.cantidadProductos();
    pn.resumenPedido = pedido.resumenPedido();

    console.log(pn);
    console.log(JSON.stringify(pn));

//Enviando pedido a la nube

    // Realizar la solicitud POST
    this.pedidoSvc.insertaPedidoNube(pn).subscribe({
      next: (res: any) => {
        let respuesta = res;
        console.log(respuesta);
      },
      error: (error: any) => {
// LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
// LGDD fin
        this.mensajeErrorConexion();
        console.log('Ocurrió un error al enviar el pedido:');
        console.log(error);
      }
    })

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
      message: 'No se pudo procesar tu pago, revisa los datos de tu tarjeta, asegúrate que tengas fondos suficientes e intenta nuevamente',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  async mensajeErrorTarjeta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Datos incorrectos',
      message: mensaje,
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
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
