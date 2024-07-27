import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardContent, IonButton, IonIcon, IonList, IonItem, IonLabel, IonGrid, IonCol, IonRow, IonAvatar, IonSpinner } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { Sucursal } from 'src/app/model/sucursal';
import { Especialidad } from 'src/app/model/especialidad';
import { Utilerias } from 'src/app/utilities/utilerias';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pedido-agrega-especialidad',
  templateUrl: './pedido-agrega-especialidad.page.html',
  styleUrls: ['./pedido-agrega-especialidad.page.scss'],
  standalone: true,
  imports: [IonAvatar, IonRow, IonCol, IonGrid, SharedModule, IonLabel, IonItem, IonList, IonIcon, IonButton, IonCardContent, IonCard,
    IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, RouterLink, IonCol, IonSpinner]
})
export class PedidoAgregaEspecialidadPage implements OnInit {

  administradorPedido: AdministradorPedido;
  sucursalSeleccionada!: Sucursal;
  tipoEntrega!: string;
  especialidades!: Especialidad[];
// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
// LGDD fin

  constructor(private catalogosSrv: CatalogosService, private router: Router, public alertController: AlertController) {
    this.administradorPedido = AdministradorPedido.getInstance();
  }

  ngOnInit() {
    const sucursal = this.administradorPedido.getSucursal();
    this.sucursalSeleccionada = sucursal;
    this.tipoEntrega = Utilerias.textoEstatusTipoEntrega(this.administradorPedido);

// LGDD ini
    this.showSpinner = true;
    this.verificandoConexion = true;
// LGDD fin
//Obteniendo listado de especialidades
    //console.log('Obteniendo listado de especialidades')

    this.catalogosSrv.leeEspecialidadesSucursal(this.sucursalSeleccionada.clave).subscribe({
      next: (res: any) => {
        this.especialidades = res;
        const catalogoEspecialidades: Especialidad[] = res;
        for (let e of catalogoEspecialidades) {
          e.urlImagenCompleta = environment.baseUrl + e.imgUrl;
        }
        this.administradorPedido.setMenuEspecialidades(this.especialidades);
        this.administradorPedido.cantidadesPorEspecialidad();
// LGDD ini
        this.showSpinner = false;
        this.verificandoConexion = false;
// LGDD fin
  },
      error: (error: any) => {
// LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
        this.mensajeErrorConexion();
// LGDD fin
        console.log('Error al leer el listado de especialidades');
        console.log(error);
      }
    })
  }

  irAPedido() {
    console.log('Ir a pedido')
    this.router.navigateByUrl(environment.paginaVistaPedido);
  }

  regresaAMenu() {
    this.router.navigateByUrl(environment.paginaMenuPrincipal);
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
