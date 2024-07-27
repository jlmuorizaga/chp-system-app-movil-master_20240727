import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { DomicilioCliente } from 'src/app/model/domicilioCliente';
import { Utilerias } from 'src/app/utilities/utilerias';
import { environment } from 'src/environments/environment';
import { Lugar } from 'src/app/model/lugar';
import { ClienteService } from 'src/app/services/cliente.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlertController, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, IonTitle, IonToolbar, ModalController, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RegistroClienteDomicilioPage } from '../registro-cliente-domicilio/registro-cliente-domicilio.page';
import { addIcons } from 'ionicons';
import { homeOutline, addOutline, removeOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-seleccion-domicilio',
  templateUrl: './seleccion-domicilio.page.html',
  styleUrls: ['./seleccion-domicilio.page.scss'],
  standalone: true,
  imports: [SharedModule, IonicModule, CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonList, IonRadioGroup, IonItem, IonButton, IonIcon, IonRadio, IonLabel,
    IonSpinner]
})
export class SeleccionDomicilioPage implements OnInit {

  administradorPedido: AdministradorPedido;
  modoEliminacionDomicilios = false;
  domicilios!: DomicilioCliente[];
  tipoEntrega!: string;
  tipoEntregaStr!: string;
  domicilioSeleccionado!: DomicilioCliente;
  //Variable con la selección de los radiobuttons
  idDomicilioSeleccionado!: string;
// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
// LGDD fin

  constructor(private clienteSvc: ClienteService, public alertController: AlertController,
    private router: Router, private modalController: ModalController) {
    this.administradorPedido = AdministradorPedido.getInstance();
    addIcons({ homeOutline, addOutline, removeOutline, chevronForwardOutline });
  }

  ngOnInit() {
// LGDD ini
    this.showSpinner = true;
    this.verificandoConexion = true;
// LGDD fin
    this.tipoEntrega = this.administradorPedido.getTipoEntrega().getTipo();
    console.log('El tipo de entrega recibida es:', this.tipoEntrega)
    this.tipoEntregaStr = Utilerias.textoEstatusTipoEntrega(this.administradorPedido);
  
    this.domicilios = [{
      descripcion: 'Obteniendo la lista de domicilios del cliente',
      idDomicilioCliente: environment.id_nula,
      idCliente: environment.id_nula,
      idLugar: environment.id_nula,
      punto: '0,0',
      lugar: new Lugar(),
      activo: 'N'
    }];
  
    //Obteniendo listado de domicilios desde el API del cliente
    console.log('Obteniendo listado de domicilios del cliente desde el API del cliente')
    this.clienteSvc.leeListaDomiciliosCliente(this.administradorPedido.getCliente().idCliente).subscribe({
      next: (res: any) => {
        this.domicilios = res;
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
// LGDD fin
        console.log('Ocurrió un error al leer los domicilios del cliente:');
        console.log(error);
      }
    });
  }

  onClickButton() {
      console.log('La id del domicilio seleccionado es: ' + this.idDomicilioSeleccionado);
      if (this.idDomicilioSeleccionado) {
        console.log('Sí se seleccionó un domicilio, se verificará que sea un domicilio correcto');
        //Verifica que no sea el domicilio error (no se pudo conectar al listado de domicilios)
        //Verificando que se haya podido leer el listado de domicilios
        if (this.idDomicilioSeleccionado === environment.id_nula) {
          this.mensajeFaltaSeleccion();
        } else {
          console.log('Se buscará el id del domicilio en la lista del domicilio');
          //Obtiene los datos del domicilio desde la lista de domicilios
          for (let domicilio of this.domicilios) {
            if (domicilio.idDomicilioCliente === this.idDomicilioSeleccionado) {
              this.domicilioSeleccionado = domicilio;
            }
          }
          this.administradorPedido.setDomicilioCliente(this.domicilioSeleccionado);
          console.log(this.administradorPedido.getDomicilioCliente());

          this.modoEliminacionDomicilios = false;
          //TODO Reinicializar el menú sólo si cambió de sucursal
          this.administradorPedido.reiniciaPedido();

          this.router.navigateByUrl(environment.paginaSeleccionSucursal);
        }
      } else {
        this.mensajeFaltaSeleccion();
      }
  }

  async agregaDomicilio() {
    console.log('Se abrirá ventana para agregar un nuevo domicilio');
    //Abre ventana modal de domicilios
    const modal = await this.modalController.create({
      component: RegistroClienteDomicilioPage,
    });

    modal.onDidDismiss().then(async (data) => {
      if (data.data) {
        this.domicilios.push(data.data);
        //Grabar domcilio en la cuenta del usuario
        let domicilio: DomicilioCliente = data.data;
        domicilio.idCliente = this.administradorPedido.getCliente().idCliente;
        domicilio.idLugar = '11111111-1111-1111-1111-111111111111';
        domicilio.activo = 'S';
// LGDD ini
        this.showSpinner = true;
        this.verificandoConexion = true;
// LGDD fin
        this.clienteSvc.insertaDomicilioCliente(domicilio).subscribe({
          next: (res: any) => {
            console.log(res);
// LGDD
            this.verificandoConexion = false;
            this.showSpinner = false;
          },
          error: (error: any) => {
// LGDD ini
            this.verificandoConexion = false;
            this.showSpinner = false;
            this.mensajeErrorConexion();
// LGDD fin
            console.log('Ocurrió un error al insertar un domicilio:');
            console.log(error);
          }
        })
      }
    });
    return await modal.present();
  }

  async eliminaDomicilio(domicilio: DomicilioCliente) {

    const confirmacion = await this.confirmaEliminarDomicilio(domicilio.descripcion);
    let idDomicilioAEliminar = domicilio.idDomicilioCliente;
    console.log('Decisión sobre borrado: ' + confirmacion);
    if (confirmacion) {
      console.log('Eliminando domicilio ' + idDomicilioAEliminar);
      //Quitando la selección si era el domicilio seleccionado
      if (this.idDomicilioSeleccionado === idDomicilioAEliminar) {
        this.idDomicilioSeleccionado = undefined as any;
      }
      this.domicilios = this.domicilios.filter(objeto => objeto.idDomicilioCliente != idDomicilioAEliminar);

// LGDD ini
      this.showSpinner = true;
      this.verificandoConexion = true;
// LGDD fin
      this.clienteSvc.eliminaDomicilioCliente(idDomicilioAEliminar).subscribe({
        next: (res: any) => {
          console.log(res);
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
// LGDD fin
          console.log('Ocurrió un error al eliminar un domicilio:');
          console.log(error);
        }
      });
    }
  }

  activaModoEliminaDomicilios() {
    this.modoEliminacionDomicilios = !this.modoEliminacionDomicilios;
  }

  async confirmaEliminarDomicilio(descripcion: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Estás seguro de querer eliminar este domicilio?: ' + descripcion,
        buttons: [
          {
            text: 'No borrar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(false); // El usuario ha cancelado la acción
            }
          },
          {
            text: 'Borrar el domicilio',
            handler: () => {
              resolve(true); // El usuario ha confirmado la acción
            }
          }
        ]
      });
      await alert.present();
    });
  }

  async mensajeFaltaSeleccion() {
    const alert = await this.alertController.create({
      header: 'Falta selección',
      message: 'Por favor selecciona un domicilio',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
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
