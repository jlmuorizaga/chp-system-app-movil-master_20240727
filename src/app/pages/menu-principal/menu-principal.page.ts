import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonButtons, IonBackButton, IonCardContent, IonButton, IonIcon, IonList, IonItem, IonLabel, IonGrid, IonCol, IonRow, IonRouterLinkWithHref, IonCardSubtitle, IonCardHeader, IonCardTitle, IonAvatar, IonSpinner } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { Sucursal } from 'src/app/model/sucursal';
import { TipoProducto } from 'src/app/model/tipoProducto';
import { Especialidad } from 'src/app/model/especialidad';
import { Utilerias } from 'src/app/utilities/utilerias';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { addIcons } from 'ionicons';
import { bagHandleOutline, newspaperOutline } from 'ionicons/icons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.page.html',
  styleUrls: ['./menu-principal.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonAvatar, IonCardTitle, IonCardHeader, IonCardSubtitle, IonRow, IonCol,
    IonGrid, SharedModule, IonLabel, IonItem, IonList, IonIcon, IonButton, IonCardContent,
    IonBackButton, IonButtons, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, RouterLink, IonGrid, IonCol, IonSpinner]
})
export class MenuPrincipalPage implements OnInit {

  administradorPedido: AdministradorPedido;

  sucursalSeleccionada!: Sucursal;
  tipoEntrega!: string;
  textoDomicilio!: string;
  catalogoTiposProducto!: TipoProducto[];

  tienePizzas!: boolean;
  especialidades!: Especialidad[];

  urlImagenPizza: string;

// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
  marcoPrimerError!: boolean;
// LGDD fin

  constructor(private catalogosSvc: CatalogosService, private router: Router, public alertController: AlertController) {
    this.administradorPedido = AdministradorPedido.getInstance();
    addIcons({ bagHandleOutline, newspaperOutline });
    //TODO tomar el nombre del archivo de imagen de la pizza desde el API a partir de un registro en la base de datos
    this.urlImagenPizza = environment.baseUrl + environment.imagenMenuPizzas;
  }

  ngOnInit() {
    console.log('Entrando al menú principal');

// LGDD ini
    this.showSpinner = true;
    this.verificandoConexion = true;
    this.marcoPrimerError = false;
// LGDD fin

    const sucursal = this.administradorPedido.getSucursal();
    this.sucursalSeleccionada = sucursal;

    this.tipoEntrega = Utilerias.textoEstatusTipoEntrega(this.administradorPedido);
    this.textoDomicilio = Utilerias.textoDomicilioTipoEntrega(this.administradorPedido);

    //Verificando si la sucursal tiene pizzas capturadas
    this.catalogosSvc.leeEspecialidadesSucursal(this.sucursalSeleccionada.clave).subscribe({
      next: (res: any) => {
        this.especialidades = res;
        this.tienePizzas = this.especialidades.length > 0;
// LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
// LGDD fin
},
      error: (error: any) => {
// LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
        this.marcoPrimerError = true;
        this.mensajeErrorConexion();
// LGDD fin
        console.log('Error al leer las especialidades');
        console.log(error);
      }
    });

// LGDD ini
    this.showSpinner = true;
    this.verificandoConexion = true;
// LGDD fin
    this.catalogosSvc.leeTiposProductoSucursal(this.sucursalSeleccionada.clave).subscribe({
      next: (res: any) => {
        console.log(res);
        const catalogoTiposProducto: TipoProducto[] = res;
        for (let tp of catalogoTiposProducto) {
          tp.urlImagenCompleta = environment.baseUrl + tp.imgUrl;
        }
        this.administradorPedido.setMenuTiposProducto(catalogoTiposProducto);
        this.catalogoTiposProducto = this.administradorPedido.getMenuTiposProducto();
// LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
// LGDD fin
      },
      error: (error: any) => {
// LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
        if (!this.marcoPrimerError) {
          this.mensajeErrorConexion();
        }
// LGDD fin
        console.log('Error al leer los tipos de productos');
        console.log(error);
      }
    });
  }

  irAPedido() {
    console.log('Ir a pedido')
    this.router.navigateByUrl('/pedido-vista');
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
