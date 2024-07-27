import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DomicilioCliente } from 'src/app/model/domicilioCliente';
import { AlertController, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonTitle, IonToolbar, ModalController, IonSpinner } from '@ionic/angular/standalone';
import { Cliente } from 'src/app/model/cliente';
import { Utilerias } from 'src/app/utilities/utilerias';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegistroClienteDomicilioPage } from '../registro-cliente-domicilio/registro-cliente-domicilio.page';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import { homeOutline, addOutline, personAddOutline, removeOutline } from 'ionicons/icons';
import { CorreoService } from 'src/app/services/correo.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.page.html',
  styleUrls: ['./registro-cliente.page.scss'],
  standalone: true,
  imports: [SharedModule, IonicModule, CommonModule, FormsModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonInput, IonList, IonItem, IonButton, IonIcon, IonSpinner
  ]
})
export class RegistroClientePage implements OnInit {

  correoValidado: string = '';
  domicilios: DomicilioCliente[] = [];
  formularioCliente!: FormGroup;
// LGDD ini
  verificandoConexion!: boolean;
  showSpinner = false;
// LGDD fin

  constructor(public fb: FormBuilder, public alertController: AlertController,
    private clienteSvc: ClienteService, private correoSvc: CorreoService,
    private router: Router, private modalController: ModalController,
    private dataService: DataService) {
    addIcons({ homeOutline, addOutline, personAddOutline, removeOutline });

    this.formularioCliente = this.fb.group({
// TODO LGDD (punto 2 verde) validación de estructura de datos
      'contrasenia': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      'confirmaContrasenia': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      'nombre': new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(30)]),
      'telefono': new FormControl("", [Validators.required, Validators.pattern(/^\d{3} \d{3} \d{4}$/)]),
    })
  }

  ngOnInit() {
    this.correoValidado = this.dataService.getCorreoRegistro();
    console.log('Correo validado: ', this.correoValidado);
  }

  registraCliente() {
    //Registro del cliente
    console.log('Se registrará el cliente');
    var f = this.formularioCliente.value;
    if (this.formularioCliente.invalid) {
      this.mensajeDatosIncompletos();
      return;
    }
    //Validando confirmación de contraseña
    let errorConfirmacion = false;
    let mensajeNoConfirmado = '';
    let conexionMensaje = '';
    if (f.contrasenia !== f.confirmaContrasenia) {
      errorConfirmacion = true;
      mensajeNoConfirmado += conexionMensaje + 'contraseña';
    }
    if (errorConfirmacion) {
      this.mensajeDatosNoConfirmados(mensajeNoConfirmado);
      return
    }

// LGDD ini
    this.showSpinner = true;
    this.verificandoConexion = true;
// LGDD fin
    //Validando nuevamente que el correo no está registrado
    this.clienteSvc.leeExisteCorreo(this.correoValidado).subscribe({
      next: (res: any) => {
        if (res.existe != '0') {
          console.log('El correo ya existe...');
          this.mensajeCorreo('Error de registro', 'El correo ya existe en los registros de Cheese Pizza. No puede haber dos registros con el mismo correo. Por favor revise su correo, o, si es correcto, utilice su cuenta existente para ingresar a la aplicación.');
        } else {
          //El correo no existe, por tanto se registra
          this.realizaRegistroCliente(f);
        }
// LGDD ini
        this.showSpinner = false;
        this.verificandoConexion = false;
// LGDD fin
      },
      error: (error: any) => {
// LGDD ini
        this.showSpinner = false;
        this.verificandoConexion = false;
// LGDD fin
        this.mensajeErrorConexion();
// LGDD fin
        console.log('Error al verificar si existe correo:');
        console.log(error);
      }
    });

  }

  private realizaRegistroCliente(f: any) {
    const cliente: Cliente = new Cliente;
    cliente.idCliente = Utilerias.generaIdUnico();
    cliente.fechaRegistro = Utilerias.fechaActual();
    cliente.correoElectronico = this.correoValidado;
    cliente.contrasenia = f.contrasenia;
    cliente.mantenerSesion = false;
    cliente.nombre = f.nombre;
    cliente.telefono = f.telefono;
    cliente.activo = 'S';

    //Se grabará el cliente en el servidor
    const clienteStr = JSON.stringify(cliente);
// LGDD ini
    this.showSpinner = true;
    this.verificandoConexion = true;
// LGDD fin
// Realizar la solicitud POST
    this.clienteSvc.insertaRegistroCliente(cliente).subscribe({
      next: (res: any) => {
        console.log(res);
        //Se registrarán los domicilios del cliente en el servidor
        for (let i = 0; i < this.domicilios.length; i++) {
          let domicilio = this.domicilios[i];
          domicilio.idCliente = cliente.idCliente;
          domicilio.idLugar = '11111111-1111-1111-1111-111111111111';
          domicilio.activo = 'S';
          this.clienteSvc.insertaDomicilioCliente(domicilio).subscribe({
            next: (res: any) => {
              console.log(res);
            },
            error: (error: any) => {
// LGDD ini
              this.showSpinner = false;
              this.verificandoConexion = false;
              this.mensajeErrorConexion();
// LGDD fin
              console.log('Ocurrió un error');
              console.log(error);
            }
          });
        }
      },
      error: (error: any) => {
// LGDD ini
        this.showSpinner = false;
        this.verificandoConexion = false;
        this.mensajeErrorConexion();
// LGDD fin
        console.log('Ocurrió un error: ' + error);
      }
    });
  }

  async abrirModalDomicilio() {
    const modal = await this.modalController.create({
      component: RegistroClienteDomicilioPage,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.domicilios.push(data.data);
      }
    });

    return await modal.present();
  }

  eliminaDomicilio(idDomicilioAEliminar: string) {
    console.log('Eliminando domicilio ' + idDomicilioAEliminar);
    this.domicilios = this.domicilios.filter(objeto => objeto.idDomicilioCliente != idDomicilioAEliminar);
  }

  async mensajeDatosIncompletos() {
    const alert = await this.alertController.create({
      header: 'Datos incompletos',
      message: 'Faltan datos del cliente',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  async mensajeDatosNoConfirmados(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Datos no confirmados',
      message: 'No coindiden los datos de ' + mensaje,
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  async mensajeRegistroExitoso() {
    const aviso = await this.alertController.create({
      header: 'Datos registrados',
      message: 'Se han registrado tus datos en Cheese Pizza Móvil',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          console.log('Salió del Alert de registro de datos del cliente exitoso');
          //Continuando con el proceso del login
          this.router.navigateByUrl(environment.paginaLogin);
        }
      }],
    });
    aviso.backdropDismiss = false;
    aviso.onclick
    await aviso.present();
  }

  async mensajeCorreo(encabezado: string, texto: string) {
    const alert = await this.alertController.create({
      header: encabezado,
      message: texto,
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
            //this.registraCliente();
            this.ngOnInit();
          }
        }],

    });
    alert.backdropDismiss = false;
    await alert.present();
  }

}
