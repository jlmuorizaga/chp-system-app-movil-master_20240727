import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { environment } from 'src/environments/environment';
import { Cliente } from 'src/app/model/cliente';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner]
})
export class InicioPage implements OnInit {

// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
// LGDD fin

  private administradorPedido: AdministradorPedido;

  constructor(private clienteSvc: ClienteService, private router: Router,
    public alertController: AlertController) {
    this.administradorPedido = AdministradorPedido.getInstance();
    addIcons({ refreshOutline });
  }

  ngOnInit() {
    this.verificaCliente();
  }

  verificaCliente() {
// LGDD ini
    this.verificandoConexion = true;
    this.showSpinner = true;
// LGDD fin
    //Verificando si el cliente ya está logueado o si debe pedir login
    console.log('Inicio');
    //Verificando cliente
    console.log('Recuperando al cliente del localStorage');
    const clienteGuardado = localStorage.getItem(environment.clienteLocalStoreID);
    if (clienteGuardado) {
      //Sí hay un cliente guardado
      console.log('Sí hay un cliente en el localStorage');
      const cliente: Cliente = JSON.parse(clienteGuardado);
      console.log('Cliente: ' + cliente.nombre);
      //Verifica si tiene marcado mantener la sesión abierta
      if (cliente.mantenerSesion) {
        //Mantiene la sesión abierta, verifica credenciales con el servicio
        console.log('Se mantiene la sesión abierta');
        console.log('Verificando credenciales en el servicio');
        let ce = cliente.correoElectronico;
        let pw = cliente.contrasenia;
        let ms = cliente.mantenerSesion;
        //Verificando cliente
        this.clienteSvc.leeVerificaCliente(ce, pw).subscribe({
          next: (res: any) => {
            const respuestaVerificaCliente = res;
            console.log(respuestaVerificaCliente)
            if (respuestaVerificaCliente && respuestaVerificaCliente.acceso === '1') {
              console.log('Login correcto');
              //Obteniendo datos del cliente
              this.clienteSvc.leeDatosCliente(ce).subscribe({
                next: (res: any) => {
                  const respuestaDatosCliente = res;
                  if (respuestaDatosCliente) {
                    console.log('Respuesta de datos del cliente:');
                    console.log(respuestaDatosCliente);
                    let cliente: Cliente = new Cliente;
                    cliente.idCliente = respuestaDatosCliente.idCliente;
                    cliente.correoElectronico = respuestaDatosCliente.correoElectronico;
                    cliente.contrasenia = pw;
                    cliente.nombre = respuestaDatosCliente.nombre;
                    cliente.telefono = respuestaDatosCliente.telefono;
                    //cliente.domicilios = respuestaVerificaCliente.domicilios;
                    //cliente.formasPago = respuestaVerificaCliente.formasPago;
                    cliente.fechaRegistro = respuestaDatosCliente.fechaRegistro;
                    cliente.activo = respuestaDatosCliente.activo;

                    cliente.mantenerSesion = ms;
                    //Grabando en el localStore para posteriores logueos
                    let clienteStr = JSON.stringify(cliente);
                    localStorage.setItem(environment.clienteLocalStoreID, clienteStr);
                    //Pasando datos cliente al AdministradorPedido para su uso en el resto de la aplicación
                    this.administradorPedido.setCliente(cliente);
// LGDD ini
                    this.verificandoConexion = false;
                    this.showSpinner = false;
// LGDD fin
                    console.log('Login correcto');
                    console.log('Saltando a seleccionar el tipo de entrega');
                    this.router.navigateByUrl(environment.paginaSeleccionTipoEntrega);
                  } else {
                    //Datos incorrectos
// LGDD ini
                    this.showSpinner = false;
                    this.verificandoConexion = false;
// LGDD fin
                    console.log('Datos incorrectos');
                    console.log('Navegando a la página de login');
                    this.router.navigateByUrl(environment.paginaLogin);
                  }                  
                },
                error: (error: any) => {
// LGDD ini
                  this.verificandoConexion = false;
                  this.showSpinner = false;
// LGDD fin
                  console.log('Error al leer datos del cliente:');
                  console.log(error);
                  this.mensajeErrorConexion();
                }
              })
            } else {
// LGDD ini
              this.showSpinner = false;
              this.verificandoConexion = false;
// LGDD fin
              //Login incorrecto
              console.log('Login incorrecto');
              console.log('Navegando a la página de login');
              this.router.navigateByUrl(environment.paginaLogin);
            }

          },
          error: (error: any) => {
// LGDD ini
            this.verificandoConexion = false;
            this.showSpinner = false;
// LGDD fin
            console.log('Error al leer datos del cliente:');
            console.log(error);
            this.mensajeErrorConexion();
          }
        })
      } else {
        //No mantiene la sesión abierta, salta a la página de login
        console.log('No se mantiene la sesión abierta');
        console.log('Navegando a la página de login');
        this.router.navigateByUrl(environment.paginaLogin);
      }
    } else {
      //No hay ningún cliente guardado, se va al login
      console.log('No hay un cliente en el localStorage');
      console.log('Navegando a la página de login');
      this.router.navigateByUrl(environment.paginaLogin);
    }
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
            this.verificaCliente();
          }
        }],
      });
    alert.backdropDismiss = false;
    await alert.present();
  }

}
