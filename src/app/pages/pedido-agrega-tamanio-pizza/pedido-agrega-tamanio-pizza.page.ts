import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonList, IonItem, IonLabel, IonGrid, IonCol, IonRow, IonSpinner } from '@ionic/angular/standalone';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { Sucursal } from 'src/app/model/sucursal';
import { Tamanio } from 'src/app/model/tamanio';
import { Especialidad } from 'src/app/model/especialidad';
import { Pizza } from 'src/app/model/pizza';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilerias } from 'src/app/utilities/utilerias';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/shared/shared.module';
import { addIcons } from 'ionicons';
import { addOutline, newspaperOutline, removeOutline, bagHandleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pedido-agrega-tamanio-pizza',
  templateUrl: './pedido-agrega-tamanio-pizza.page.html',
  styleUrls: ['./pedido-agrega-tamanio-pizza.page.scss'],
  standalone: true,
  imports: [IonRow, IonCol, IonGrid, SharedModule, IonLabel, IonItem, IonList, IonIcon, IonButton, IonCardContent, IonCardSubtitle,
    IonCardTitle, IonCardHeader, IonCard, IonBackButton, IonButtons, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule, IonSpinner]
})
export class PedidoAgregaTamanioPizzaPage implements OnInit {

  administradorPedido: AdministradorPedido;

  nombreEspecialidadPizza!: string;
  ingredientesEspecialidad!: string;
  sucursalSeleccionada!: Sucursal;
  nombreSucursal!: string;
  tipoEntrega!: string;
  tamanios!: Tamanio[];
  especialidadId!: string;
  especialidad!: Especialidad;
  pizzas!: Pizza[];

// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
// LGDD fin

  constructor(private activatedRoute: ActivatedRoute, private catalogosSvc: CatalogosService,
    private router: Router, public alertController: AlertController) {
    this.administradorPedido = AdministradorPedido.getInstance();
    addIcons({ addOutline, newspaperOutline, removeOutline, bagHandleOutline });
  }

  ngOnInit() {
// LGDD ini
    this.verificandoConexion = true;
    this.showSpinner = true;
// LGDD fin
    console.log('Entrando a selección de tamaños de pizza');
    const sucursal = this.administradorPedido.getSucursal();
    this.sucursalSeleccionada = sucursal;
    console.log('Sucursal seleccionada: ' + this.sucursalSeleccionada.nombreSucursal);
    const idesp = this.activatedRoute.snapshot.paramMap.get('id');

    if (idesp) {
      this.especialidadId = idesp;
      console.log('idEspecialidad: ' + this.especialidadId);
    }

    if (this.especialidadId) {
      console.log('Se buscará el nombre de la especialidad')
      const tpds = this.administradorPedido.getMenuEspecialidades();
      console.log(tpds);

      this.especialidad = this.administradorPedido.getEspecialidadMenu(this.especialidadId);
      this.nombreEspecialidadPizza = this.especialidad.nombre;
      this.ingredientesEspecialidad = this.especialidad.ingredientes;
    }

    console.log('Especialidad: ' + this.nombreEspecialidadPizza);

    this.tipoEntrega = Utilerias.textoEstatusTipoEntrega(this.administradorPedido);

    //Obteniendo listado de tamanios
    console.log('Obteniendo listado de tamanios')

    this.catalogosSvc.leeTamanioxExpecialidadxSucursal(this.sucursalSeleccionada.clave, this.especialidadId).subscribe({
      next: (res: any) => {
        const tamanios = res;
        if (tamanios) {
          //Creando arreglo de pizzas
          const pizzas: Pizza[] = [];
          for (const t of tamanios) {
            //Creando una pizza u agregándola al arreglo
            const pizza: Pizza = new Pizza();
            pizza.tamanio = t;
            pizza.especialidad = this.especialidad;
            pizzas.push(pizza);
          }
          //Agrega las pizzas al administrador
          this.administradorPedido.agregaPizzasMenu(pizzas);
          //Obtiene las pizzas que corresponden solamente a la especialidad abierta
          this.pizzas = this.administradorPedido.dameMenuPizzasEspecialidad(this.especialidadId);
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
        console.log('Error al leer tamaños de especialidad:');
        console.log(error);
      }
    })

  }

  incrementaCantidad(id: string) {
    console.log(id);
    for (const pizza of this.pizzas) {
      if (pizza.tamanio.idTamanioPizza === id) {
        pizza.cantidad += 1;
        pizza.subtotal = pizza.cantidad * pizza.tamanio.precio;
      }
    }
    this.administradorPedido.cantidadesPorEspecialidad();
  }

  decrementaCantidad(id: string) {
    console.log(id);
    for (const pizza of this.pizzas) {
      if (pizza.tamanio.idTamanioPizza === id) {
        pizza.cantidad -= 1;
        if (pizza.cantidad < 0) {
          pizza.cantidad = 0;
        }
        pizza.subtotal = pizza.cantidad * pizza.tamanio.precio;
      }
    }
    this.administradorPedido.cantidadesPorEspecialidad();
  }

  irAPedido() {
    console.log('Ir a pedido')
    this.router.navigateByUrl(environment.paginaVistaPedido);
  }

  regresaAEspecialidades() {
    this.router.navigateByUrl(environment.paginaAgregaEspecialidadAPedido);
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
