import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertController, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonTitle, IonToolbar, IonSpinner } from '@ionic/angular/standalone';
import { Cliente } from 'src/app/model/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { addIcons } from 'ionicons';
import { peopleOutline } from 'ionicons/icons';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registro-cliente-modifica',
  templateUrl: './registro-cliente-modifica.page.html',
  styleUrls: ['./registro-cliente-modifica.page.scss'],
  standalone: true,
  imports: [SharedModule, IonicModule, CommonModule, FormsModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
    IonInput, IonButton, IonIcon, IonSpinner
  ]
})

// TODO LGDD (punto 1 verde) Administración de datos del cliente
export class RegistroClienteModificaPage implements OnInit {
  administradorPedido: AdministradorPedido;
  cliente!: Cliente;
  correoValidado: string = '';
  formularioCliente!: FormGroup;
// LGDD ini
  verificandoConexion!: boolean;
  showSpinner = false;
// LGDD fin

  constructor(public fb: FormBuilder, public alertController: AlertController,
    private clienteSvc: ClienteService, private router: Router) {
    addIcons({ peopleOutline });
    this.administradorPedido = AdministradorPedido.getInstance();
    this.formularioCliente = this.fb.group({
// TODO LGDD (punto 2 verde) validación de estructura de datos
      'nombre': new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(30)]),
      'telefono': new FormControl("", [Validators.required, Validators.pattern(/^\d{3} \d{3} \d{4}$/)]),
    })
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
// LGDD ini
    this.showSpinner = true;
    this.verificandoConexion = true;
// LGDD fin
    console.log('Se modificará el cliente');
    this.cliente = this.administradorPedido.getCliente();
    console.log('cliente->', this.cliente);
    this.formularioCliente.patchValue({
      nombre: this.cliente.nombre,
      telefono: this.cliente.telefono
    });
// LGDD ini
    this.showSpinner = false;
    this.verificandoConexion = false;
// LGDD fin
  }

  modificaCliente() {
    //Modifica el cliente
    var f = this.formularioCliente.value;
    if (this.formularioCliente.invalid) {
      this.mensajeDatosIncompletos();
      return;
    }
    this.cliente.nombre = f.nombre;
    this.cliente.telefono = f.telefono;
    console.log('cliente->', this.cliente);
// LGDD ini
    this.showSpinner = true;
    this.verificandoConexion = true;
// LGDD fin
// Realizar la solicitud PUT
    this.clienteSvc.actualizaRegistroCliente(this.cliente).subscribe({
      next: (res: any) => {
        console.log(res);
        console.log('Se modificó el cliente');
        this.mensajeRegistroExitoso();
// LGDD ini
        this.showSpinner = false;
        this.verificandoConexion = false;
// LGDD fin
      },
      error: (error: any) => {
        console.log(error);
        console.log('No se modificó el cliente');
// LGDD ini
        this.showSpinner = false;
        this.verificandoConexion = false;
// LGDD fin
      }
    });
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

  async mensajeRegistroExitoso() {
    const aviso = await this.alertController.create({
      header: 'Datos registrados',
      message: 'Se han modificado tus datos en Cheese Pizza Móvil',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          console.log('Salió del Alert de registro de datos del cliente exitoso');
          //Continuando con el proceso del login
          this.router.navigateByUrl(environment.paginaSeleccionTipoEntrega);
        }
      }],
    });
    aviso.backdropDismiss = false;
    aviso.onclick
    await aviso.present();
  }

}
