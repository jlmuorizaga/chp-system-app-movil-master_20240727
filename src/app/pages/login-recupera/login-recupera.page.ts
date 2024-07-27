import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonCol, IonRow, IonButton, IonIcon, IonBackButton, IonSpinner } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from '@ionic/angular';
import { ClienteService } from 'src/app/services/cliente.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { CorreoService } from 'src/app/services/correo.service';
import { DatosCorreo } from 'src/app/model/datosCorreo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-recupera',
  templateUrl: './login-recupera.page.html',
  styleUrls: ['./login-recupera.page.scss'],
  standalone: true,
  imports: [SharedModule, IonIcon, IonBackButton, IonButton, IonRow, IonCol, IonGrid,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    ReactiveFormsModule, IonicModule, IonSpinner]
})

export class LoginRecuperaPage implements OnInit {

  formularioRecuperaLogin: FormGroup;
// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
// LGDD fin

  constructor(public fb: FormBuilder, public alertController: AlertController,
    private clienteSvc: ClienteService, private correoSvc: CorreoService,
    private router: Router) {
    this.formularioRecuperaLogin = this.fb.group({
// TODO LGDD (punto 2 verde) validación de estructura de datos
      'correoElectronico': new FormControl("", [Validators.required, Validators.email]),
    })
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

  realizaRecuperacion() {
    console.log('Recuperando contraseña')
    if (this.formularioRecuperaLogin.valid) {
      console.log('Correo:', this.formularioRecuperaLogin.value.correoElectronico);
      //Recupera el correo
      //Primero verifica que el correo ya esté registrado
      let correo = this.formularioRecuperaLogin.value.correoElectronico;
// LGDD ini
      this.verificandoConexion = true;
      this.showSpinner = true;
// LGDD fin
      this.clienteSvc.leeExisteCorreo(correo).subscribe({
        next: (res: any) => {
          if (res.existe != '0') {
            console.log('El correo existe...')
            //Enviando correo electrónico de recuperación de contraseña
            let datosCorreo = new DatosCorreo();
            datosCorreo.correo = correo;
            datosCorreo.asunto = 'Recuperación de contraseña de Chess Pizza Móvil'

            this.correoSvc.recuperaContrasenia(datosCorreo).subscribe({
              next: (res: any) => {
                this.mensajeCorreo('Correo enviado', res.respuesta);
// LGDD ini
                this.verificandoConexion = false;
                this.showSpinner = false;
// LGDD fin
                //Regresa a la página de login
                this.router.navigateByUrl('/login')
              },
              error: (error: any) => {
// LGDD ini
                this.verificandoConexion = false;
                this.showSpinner = false;
                this.mensajeErrorConexion();
// LGDD fin
                console.log('Ocurrió un error al enviar el correo de recuperación:');
                console.log(error);
              }
            });
          } else {
// LGDD ini
            this.verificandoConexion = false;
            this.showSpinner = false;
// LGDD fin
            console.log('El correo no existe...')
            this.mensajeCorreo('Correo no registrado', "El correo no está registrado en nuestra aplicación, verifica que lo hayas escrito correctamente. Si está correctamente escrito, por favor considera registrarte en la aplicación.")
          }
        },
        error: (error: any) => {
// LGDD ini
          this.verificandoConexion = false;
          this.showSpinner = false;
          this.mensajeErrorConexion();
  // LGDD fin
          console.log('Error al leer el servicio existe correo:');
          console.log(error);
        }
      });
    } else {
      if (this.formularioRecuperaLogin.controls['correoElectronico'].errors) {
        console.log('Errores de validación en el correo:', this.formularioRecuperaLogin.controls['correoElectronico'].errors);
        let errorMessage = '';
        if (this.formularioRecuperaLogin.controls['correoElectronico'].errors) {
          if (this.formularioRecuperaLogin.controls['correoElectronico'].errors['required']) {
            errorMessage += 'El correo electrónico es obligatorio.';
          }
          if (this.formularioRecuperaLogin.controls['correoElectronico'].errors['email']) {
            errorMessage += 'Por favor, introduce un correo electrónico con un formato válido.';
          }
        }
        this.mensajeDatosIncompletos(errorMessage);
      }
    }
  }

  async mensajeDatosIncompletos(textoError: string) {
    const alert = await this.alertController.create({
      header: 'Error en la captura',
      message: textoError,
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
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
            this.realizaRecuperacion();
          }
        }],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

}
