import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonCol, IonRow, IonList, IonLabel, IonItem, IonCardSubtitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonNavLink, IonSpinner, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { PedidoNube } from 'src/app/model/pedidoNube';
import { PedidoService } from 'src/app/services/pedido.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Utilerias } from 'src/app/utilities/utilerias';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { Sucursal } from 'src/app/model/sucursal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pedido-proceso-datos',
  templateUrl: './pedido-proceso-datos.page.html',
  styleUrls: ['./pedido-proceso-datos.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonNavLink, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonCardSubtitle, SharedModule, IonItem, IonLabel, IonList, IonRow, IonCol, IonGrid, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSpinner]
})
export class PedidoProcesoDatosPage implements OnInit {

  pedido: PedidoNube = new PedidoNube();
  domicilioSucursal: string = '';
  entregaEnSucursal: boolean = false;
// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
// LGDD fin

  constructor(private activatedRoute: ActivatedRoute, private pedidoSvc: PedidoService,
    private catalogosSvc: CatalogosService, public alertController: AlertController) { }

  ngOnInit() {
    const idPedido = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('Pedido en proceso: ' + idPedido);
    //Leyendo datos del pedido
    if (idPedido) {
      this.leeDatosPedido(idPedido);
    }
  }

  leeDatosPedido(idPedido: string) {
// LGDD ini
    this.verificandoConexion = true;
    this.showSpinner = true;
// LGDD fin
    console.log('Leyendo datos del pedido: ' + idPedido);
    this.pedidoSvc.leeDatosPedido(idPedido).subscribe({
      next: (res: any) => {
        console.log(res);
        this.pedido = res;
        this.entregaEnSucursal = this.pedido.modalidadEntrega === environment.entregaSucursal;
        this.leeDatosSucursal(this.pedido.claveSucursal);
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
        console.log('Error al leer los datos del pedido:');
        console.log(error);
      }
    });
  }

  leeDatosSucursal(claveSucursal: string) {
// LGDD ini
    this.verificandoConexion = true;
    this.showSpinner = true;
// LGDD fin
    this.catalogosSvc.leeListaSucursales().subscribe({
      next: (res: any) => {
        let sucursales: Sucursal[] = res;
        for (let suc of sucursales) {
          if (suc.clave === claveSucursal) {
            let sucursal = suc;
            this.domicilioSucursal = sucursal.domicilio;
          }
        }
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
        console.log('Error al leer la lista de sucursales:');
        console.log(error);
      }
    });
  }

  textoModalidadEntrega(modalidadEntrega: string): string {
    return Utilerias.textoModalidadEntrega(modalidadEntrega);
  }

  textoPipe2Array(texto: string): string[] {
    return Utilerias.textoPipe2Array(texto);
  }

  convierteAFechaYFormatea(texto: string): string {
    return Utilerias.convertToDateAndFormat(texto);
  }

  textoEstatusEntrega(texto: string): string {
    return Utilerias.textoEstatusPedido(texto);
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
