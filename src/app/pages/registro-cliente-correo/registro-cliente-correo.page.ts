import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonButton, IonIcon, AlertController, IonSpinner } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { ClienteService } from 'src/app/services/cliente.service';
import { CorreoService } from 'src/app/services/correo.service';
import { DatosCorreo } from 'src/app/model/datosCorreo';
import { Utilerias } from 'src/app/utilities/utilerias';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-cliente-correo',
  templateUrl: './registro-cliente-correo.page.html',
  styleUrls: ['./registro-cliente-correo.page.scss'],
  standalone: true,
  imports: [SharedModule, IonIcon, IonButton, IonItem, IonList, IonCardContent, IonCardSubtitle, IonCardTitle,
    IonCardHeader, IonCard, IonCol, IonRow, IonGrid, IonBackButton, IonButtons, IonContent,
    IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule, ReactiveFormsModule, IonSpinner]
})
export class RegistroClienteCorreoPage implements OnInit {

  formularioCorreoCliente!: FormGroup;
  verificacionEnviada: boolean = false;
  codigoVerificacion: string = 'e8217896-c41f-474e-a853-4c85aacd4fd4';
  codigoVerificacionCapturado: string = '';
  codigoEnviado: boolean = false;
  textoBoton: string = 'Continuar';
  correoValidado: string = '';
// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
// LGDD fin

  constructor(public fb: FormBuilder, public alertController: AlertController,
    private clienteSvc: ClienteService, private correoSvc: CorreoService,
    private dataService: DataService, private router: Router) {

    addIcons({ chevronForwardOutline });

    this.formularioCorreoCliente = this.fb.group({
// TODO LGDD (punto 2 verde) validación de estructura de datos
      'correoElectronico': new FormControl("", [Validators.required, Validators.email]),
      'confirmaCorreoElectronico': new FormControl("", [Validators.required, Validators.email]),
    })
  }

  ngOnInit() {
    this.codigoEnviado = false;
  }

  verificaCorreo() {
    var f = this.formularioCorreoCliente.value;
    if (this.formularioCorreoCliente.invalid) {
      this.mensajeRegistro('Datos incompletos', 'Por favor escribe el correo con una estructura válida');
      return;
    }
    let correo = f.correoElectronico;
    let correoVerifica = f.confirmaCorreoElectronico;
    if (correo != correoVerifica) {
      this.mensajeRegistro('Datos no coincidentes', 'El correo no coincide, por favor verifica la escritura');
      return;
    }
// LGDD ini
    this.verificandoConexion = true;
    this.showSpinner = true;
// LGDD fin

    //Verificando que el correo no esté previamente registrado
    this.clienteSvc.leeExisteCorreo(f.correoElectronico).subscribe({
      next: (res: any) => {
        if (res.existe != '0') {
// LGDD ini
          this.verificandoConexion = false;
          this.showSpinner = false;
// LGDD fin
          console.log('El correo ya existe...');
          this.mensajeRegistro('Error de registro', 'El correo ya existe en los registros de Cheese Pizza. No puede haber dos registros con el mismo correo. Por favor revise su correo, o, si es correcto, utilice su cuenta existente para ingresar a la aplicación.');
        } else {
          //El correo no está registrado, procede con la siguiente parte del registro
          //Verificar correo real (con código enviado por correo)
          this.codigoVerificacion = Utilerias.generaCodigoVerificacion();

          let datosCorreo = new DatosCorreo();
          datosCorreo.correo = correo;
          datosCorreo.asunto = 'Código de verificación Cheese Pizza Móvil';
          datosCorreo.codigoVerificacion = this.codigoVerificacion;
          this.correoSvc.verificaCorreo(datosCorreo).subscribe({
            next: (res: any) => {
              this.codigoEnviado = true;
              this.mensajeRegistro('Código enviado','Hemos enviado un código de verificación a tu correo');
              this.textoBoton = 'Volver a enviar código';
              this.correoValidado = correo;
// LGDD ini
              this.verificandoConexion = false;
              this.showSpinner = false;
// LGDD fin
            },
            error: (error: any) => {
// LGDD ini
              this.verificandoConexion = false;
              this.showSpinner = false;
// LGDD fin
              this.mensajeErrorConexion();
              console.log('Error al enviar código de verificación del correo');
              console.log(error);
            }
          });
        }
      },
      error: (error: any) => {
// LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
        this.mensajeErrorConexion();
// LGDD fin
        console.log('Error al verificar si existe el correo');
        console.log(error);
      }
    });

  }

  verificaCodigo(){
    //Verificando que el código capturado sea igual al código enviado
    //console.log('Código enviado: [', this.codigoVerificacion,']');
    //console.log('Código capturado: [', this.codigoVerificacionCapturado,']');
    if(this.codigoVerificacion === this.codigoVerificacionCapturado.trim()){
      console.log('Código correcto');

      this.dataService.setCorreoRegistro(this.correoValidado);
      this.router.navigateByUrl('/registro-cliente');

    }else{
      console.log('Código incorrecto');
      this.mensajeRegistro('Código incorrecto','El código es incorrecto, por favor vuelve a escribirlo');
    }
  }

  async mensajeRegistro(encabezado: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: encabezado,
      message: mensaje,
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
            this.verificaCorreo();
          }
        }],

    });
    alert.backdropDismiss = false;
    await alert.present();
  }

}
