import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { Sucursal } from 'src/app/model/sucursal';
import { Producto } from 'src/app/model/producto';
import { Utilerias } from 'src/app/utilities/utilerias';
import { environment } from 'src/environments/environment';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { Router } from '@angular/router';
import { AlertController, IonBackButton, IonItem, IonSelect, IonSelectOption, IonSpinner } from '@ionic/angular/standalone';
import { SharedModule } from 'src/app/shared/shared.module';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-seleccion-sucursal',
  templateUrl: './seleccion-sucursal.page.html',
  styleUrls: ['./seleccion-sucursal.page.scss'],
  standalone: true,
  imports: [SharedModule, IonicModule, CommonModule, FormsModule,
    IonItem, IonSelect, IonSelectOption, IonBackButton,
    IonSpinner]
})
export class SeleccionSucursalPage implements OnInit {

  administradorPedido: AdministradorPedido;

  //Ubicación geográfica
  latitud!: number;
  longitud!: number;
  exactitud!: number;
  sucursales!: Sucursal[];
  tipoEntrega!: string;
  tipoEntregaStr!: string;
  sucursalSeleccionada!: Sucursal;

  sucursalSeleccionadaAnterior!: Sucursal;

  productos!: Producto[];
  textoDomicilio!: string;
  distancia!: number;

// LGDD ini
  verificandoConexion!: boolean;
  showSpinner = false;
// LGDD fin

  constructor(private catalogosSvc: CatalogosService, private router: Router,
    public alertController: AlertController, private locationService: LocationService) {
    this.administradorPedido = AdministradorPedido.getInstance();
    addIcons({ chevronForwardOutline });
  }

  ngOnInit() {
// LGDD ini
    this.verificandoConexion = true;
    this.showSpinner = true;
// LGDD fin
    //Limpia la sucursal por si se hubiera seleccionado previamente
    this.administradorPedido.limpiaSucursal();
    this.tipoEntrega = this.administradorPedido.getTipoEntrega().getTipo();
    console.log('El tipo de entrega recibida es:', this.tipoEntrega)
    this.tipoEntregaStr = Utilerias.textoEstatusTipoEntrega(this.administradorPedido);
    this.textoDomicilio = Utilerias.textoDomicilioTipoEntrega(this.administradorPedido);

    //Obteniendo listado de sucursales desde el API de catálogos
    console.log('Obteniendo listado de sucursales desde el API de catálogos');
    this.catalogosSvc.leeListaSucursales().subscribe({
      next: (res: any) => {
        this.sucursales = res;
        //Calculando distancia a cada sucursal
        //Calculando la distancia a partir de la coordenada del servicio de geolocalización
        this.locationService.getCurrentPosition().then((coordinates) => {
          console.log(`Latitud: ${coordinates.coords.latitude}, Longitud: ${coordinates.coords.longitude}, Exactitud: ${coordinates.coords.accuracy}`);
          for (let sucursal of this.sucursales) {
            this.latitud = coordinates.coords.latitude;
            this.longitud = coordinates.coords.longitude;
            this.exactitud = coordinates.coords.accuracy;
            //Coordenadas Sucursal
            const lat2: number = sucursal.latitud;
            const lon2: number = sucursal.longitud;
            const dist = Utilerias.haversine(this.latitud, this.longitud, lat2, lon2);
            sucursal.distanciaKm = dist;
          }
          //TODO ordenar por distancia, primero la más cercana
// LGDD ini
          this.verificandoConexion = false;
          this.showSpinner = false;
// LGDD fin
        }).catch((error) => {
// LGDD ini
          this.verificandoConexion = false;
          this.showSpinner = false;
          this.mensajeErrorConexion();
// LGDD fin
          console.error('Error obteniendo ubicación', error);
        });
        console.log(res);
        console.log(this.sucursales);
      },
      error: (error: any) => {
// LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
        this.mensajeErrorConexion();
// LGDD fin
        console.log('Ocurrió un error al leer las sucursales:');
        console.log(error);
      }
    });
  }

// LGDD ini
  buscarSucursalSeleccionada(claveSucursal: string) {
    this.sucursalSeleccionada = null as any;
    for (let sucursal of this.sucursales) {
      if (sucursal.clave === claveSucursal) {
        this.sucursalSeleccionada = sucursal;
      }
    }
  }

  async seleccionaSucursal(claveSucursal: string) {
// TODO LGDD (punto 3 rojo) Si se tiene un pedido en proceso
    this.buscarSucursalSeleccionada(claveSucursal);
    console.log('Sucursal anterior->', this.sucursalSeleccionadaAnterior?.clave);
    console.log('Sucursal seleccionada->', this.sucursalSeleccionada.clave);
    if (this.sucursalSeleccionadaAnterior !== this.sucursalSeleccionada) {
      console.log('son diferentes');
      if (this.sePuedeHacerPedido()) {
        console.log('si');
        let confirmacion = false;
        if (this.sucursalSeleccionadaAnterior !== undefined) {
          confirmacion = await this.mensajeCambioSucursal(this.sucursalSeleccionadaAnterior.nombreSucursal);
        } else {
          confirmacion = true;
        }
        console.log('confirmación->', confirmacion);
        if ((this.sucursalSeleccionada) && (confirmacion)) {
          this.administradorPedido.setSucursal(this.sucursalSeleccionada);
          console.log('La opción seleccionada es: ' + this.sucursalSeleccionada.nombreSucursal);
          this.sucursalSeleccionadaAnterior = this.sucursalSeleccionada;

          this.administradorPedido.limpiaMenu();
          this.administradorPedido.reiniciaPedido();
        }
        this.router.navigateByUrl(environment.paginaMenuPrincipal);
      } else {
        console.log('no');
        this.mensajeFueraHorario(this.sucursalSeleccionada);
      }
    } else {
      console.log('son iguales');
      this.router.navigateByUrl(environment.paginaMenuPrincipal);
    }
//    this.router.navigateByUrl(environment.paginaMenuPrincipal);

/*
    console.log('Sucursal: ' + claveSucursal);
    //Asigna sucursal a partir de clave
    this.sucursalSeleccionada = null as any;
    for (let sucursal of this.sucursales) {
      if (sucursal.clave === claveSucursal) {
        this.sucursalSeleccionada = sucursal;
      }
    }
    if (this.sucursalSeleccionada) {
      this.administradorPedido.setSucursal(this.sucursalSeleccionada);
      console.log('La opción seleccionada es: ' + this.sucursalSeleccionada.nombreSucursal);

      //TODO Reinicializar el menÃº sÃ³lo si cambiÃ³ de sucursal
      this.administradorPedido.limpiaMenu();
      this.administradorPedido.reiniciaPedido();
      this.router.navigateByUrl(environment.paginaMenuPrincipal);
    } else {
      this.mensajeFaltaSeleccion();
    }
*/
  }
// LGDD fin

// LGDD ini
// TODO LGDD (punto 2 rojo) Permitir realizar pedido sólo en horario de ventas
  sePuedeHacerPedido() {
    let horaInicio = parseInt(this.sucursalSeleccionada.horaInicio.substring(0.2)) * 100 
    + parseInt(this.sucursalSeleccionada.horaInicio.substring(3.5));
    let horaFin = parseInt(this.sucursalSeleccionada.horaFin.substring(0.2)) * 100 
    + parseInt(this.sucursalSeleccionada.horaFin.substring(3.5));
    const fechaActual = new Date();
    let horaActual = fechaActual.getHours() * 100 + fechaActual.getMinutes();
    let sePuedeHacerPedido = ((horaInicio <= horaActual) && (horaActual <= horaFin)) ? true : false;
    return sePuedeHacerPedido;
  }
// LGDD fin

/*  async mensajeFaltaSeleccion() {
    const alert = await this.alertController.create({
      header: 'Falta selección',
      message: 'Por favor selecciona la sucursal',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }*/

  getLocation(): void {
    console.log('Obteniendo coordenadas...');
    this.locationService.getCurrentPosition().then((coordinates) => {
      console.log(`Latitude: ${coordinates.coords.latitude}, Longitude: ${coordinates.coords.longitude}, Accuracy: ${coordinates.coords.accuracy}`);
      //console.log(coordinates);
    }).catch((error) => {
      console.error('Error obtaining location', error);
    });
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

// TODO LGDD (punto 2 rojo) Permitir realizar pedido sólo en horario de ventas
// LGDD ini
  async mensajeFueraHorario(sucursalSeleccionada: Sucursal) {
    const alert = await this.alertController.create({
      header: 'Pedido',
      message: 'En la sucursal ' + sucursalSeleccionada.nombreSucursal
      + '. No puede hacer su pedido. Esta fuera de horario',
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

  async mensajeCambioSucursal(nombreSucursal: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Cambiar de Sucursal',
        message: 'Esta en la sucursal ' + nombreSucursal + '.'
          + '¿Desea cambiar de sucursal? si así lo desea perderá el pedido actual y '
          + 'tendrá que comenzar un nuevo pedido en la otra sucursal, esto es necesario '
          + 'porque se manejan diferentes precios y productos entre sucursales.',
        buttons: [{
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            resolve(false); // El usuario ha cancelado la acción
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            resolve(true); // El usuario ha confirmado la acción
          }
        }]
      });
      await alert.present();
    });
  }
  // LGDD fin
}
