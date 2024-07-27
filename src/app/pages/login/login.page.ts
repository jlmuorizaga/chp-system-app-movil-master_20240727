import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertController, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonContent, IonHeader, IonInput, IonTitle, IonToolbar, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAddOutline, logInOutline } from 'ionicons/icons';
import { ClienteService } from 'src/app/services/cliente.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Cliente } from 'src/app/model/cliente';
import { environment } from 'src/environments/environment';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { Router } from '@angular/router';
// TODO LGDD (punto 3 azul) es para el backbutton
// LGDD ini para el backbutton
import { Platform } from '@ionic/angular';
// LGDD fin para el backbutton

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [SharedModule, IonicModule, CommonModule, FormsModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonInput, IonCheckbox, IonButton,
    IonSpinner
  ]
})
export class LoginPage /*implements OnInit*/ {

  formularioLogin!: FormGroup;
  private administradorPedido: AdministradorPedido;
// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
// LGDD fin
  constructor(public fb: FormBuilder, public alertController: AlertController,
    private clienteSvc: ClienteService, private router: Router,
// TODO LGDD (punto 3 azul) es para el backbutton
    // LGDD ini para el backbutton
    private platform: Platform) {
// LGDD fin para el backbutton
    this.administradorPedido = AdministradorPedido.getInstance();
    addIcons({ personAddOutline, logInOutline });

    this.formularioLogin = this.fb.group({
// TODO LGDD (punto 2 verde) validación de estructura de datos
      'correoElectronico': new FormControl("", [Validators.required, Validators.email]),
      'contrasenia': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      'sesionAbierta': new FormControl(false),
    })
  }

  ngOnInit() {
    this.platform.backButton.unsubscribe();
  }

// TODO LGDD (punto 3 azul) es para el backbutton
// LGDD ini para el backbutton
  initializeBackButtonCustomHandler(): void {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // Aquí puedes implementar alguna lógica si es necesario
      // Para esta página específica, no haremos nada al presionar el botón de retroceso
    });
  }

  ionViewWillLeave() {
    this.platform.backButton.unsubscribe();
  }
// LGDD fin para el backbutton
// LGDD ini
  ionViewWillEnter() {
// TODO LGDD (punto 4 verde) reinicializar el formulario
    this.formularioLogin.reset();
  }
// LGDD fin

  async realizaLogin() {
    console.log('Se realizará el login');
    var f = this.formularioLogin.value;
    if (this.formularioLogin.invalid) {
      this.mensajeDatosIncompletos();
      return;
    }
    //Verificando login correcto con el servicio
    const ce = f.correoElectronico;
    const pw = f.contrasenia;
    const ms = f.sesionAbierta;
    console.log('Sesión abierta: ' + ms);
// LGDD ini
    this.verificandoConexion = true;
    this.showSpinner = true;
// LGDD fin
    //Verificando cliente
    this.clienteSvc.leeVerificaCliente(ce, pw).subscribe({
      next: (res: any) => {
        const respuestaVerificaCliente = res;
        //Checa si el login fue correcto
        if (respuestaVerificaCliente && respuestaVerificaCliente.acceso === '1') {
          console.log('Login correcto');
          //Obteniendo datos del cliente
          this.clienteSvc.leeDatosCliente(ce).subscribe({
            next: (res: any) => {
              const datosCliente = res;
              if (datosCliente) {
                console.log('Respuesta de datos del cliente:');
                console.log(datosCliente);
                let cliente: Cliente = new Cliente;
                cliente.idCliente = datosCliente.idCliente;
                cliente.correoElectronico = datosCliente.correoElectronico;
                cliente.contrasenia = pw;
                cliente.nombre = datosCliente.nombre;
                cliente.telefono = datosCliente.telefono;
                cliente.fechaRegistro = datosCliente.fechaRegistro;
                cliente.activo = datosCliente.activo;
                cliente.mantenerSesion = ms;
                //Grabando en el localStore
                let clienteStr = JSON.stringify(cliente);
                localStorage.setItem(environment.clienteLocalStoreID, clienteStr);
                //Pasando datos cliente al AdministradorPedido para su uso en el resto de la aplicación
                this.administradorPedido.setCliente(cliente);
// LGDD ini
                this.verificandoConexion = false;
                this.showSpinner = false;
// LGDD fin
                console.log('Saltando a seleccionar el tipo de entrega');
                console.log('Ya va a saltar')
                this.router.navigateByUrl(environment.paginaSeleccionTipoEntrega);
              } else {
// LGDD ini
                this.verificandoConexion = false;
                this.showSpinner = false;
// LGDD fin
                console.log('No se pudieron obtener los datos del cliente ' + ce);
              }
            },
            error: (error: any) => {
// LGDD ini
              this.showSpinner = false;
              this.verificandoConexion = false;
// LGDD fin
              this.mensajeErrorConexion();
              console.log('Error al leer datos del cliente:');
              console.log(error);
            }
          })
        } else {
// LGDD ini
          this.showSpinner = false;
          this.verificandoConexion = false;
// LGDD fin
          console.log('Login incorrecto');
          this.mensajeErrorLogin();
        }
      },
      error: (error: any) => {
// LGDD ini
        this.showSpinner = false;
        this.verificandoConexion = false;
        this.mensajeErrorConexion();
// LGDD fin
        console.log('Error al leer datos del cliente:');
        console.log(error);
      }
    });
  }

  async mensajeDatosIncompletos() {
    const alert = await this.alertController.create({
      header: 'Datos incompletos',
      message: 'Faltan datos para ingresar',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  async mensajeErrorLogin() {
    const alert = await this.alertController.create({
      header: 'Datos incorrectos',
      message: 'El correo o la contraseña son incorrectos',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  navegaRegistro() {
    console.log('Se irá a registro')
    this.router.navigateByUrl(environment.paginaRegistroCorreoCliente);
  }

  navegaRecuperaContrasenia(){
    console.log('Se irá a recuperar contraseña')
    this.router.navigateByUrl(environment.paginaRecuperaLogin);
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
            this.realizaLogin();
          }
        }],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

}
