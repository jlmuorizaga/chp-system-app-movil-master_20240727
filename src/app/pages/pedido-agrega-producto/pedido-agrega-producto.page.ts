import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonList, IonItem, IonLabel, IonGrid, IonCol, IonRow, IonAlert, ModalController, IonSpinner } from '@ionic/angular/standalone';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { Sucursal } from 'src/app/model/sucursal';
import { Producto } from 'src/app/model/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilerias } from 'src/app/utilities/utilerias';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline, add, removeCircleOutline } from 'ionicons/icons';
import { PedidoAgregaSalsaPage } from '../pedido-agrega-salsa/pedido-agrega-salsa.page';

@Component({
  selector: 'app-pedido-agrega-producto',
  templateUrl: './pedido-agrega-producto.page.html',
  styleUrls: ['./pedido-agrega-producto.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonAlert, IonRow, IonCol, IonGrid, SharedModule, IonLabel, IonItem, IonList, IonIcon, IonButton, IonCardContent, IonCardSubtitle,
    IonCardTitle, IonCardHeader, IonCard, IonBackButton, IonButtons, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PedidoAgregaProductoPage implements OnInit {

  administradorPedido: AdministradorPedido;

  sucursalSeleccionada!: Sucursal;
  tipoEntrega!: string;
  tipoProductoDescripcion!: string;
  productos!: Producto[];
  tipoProductoId!: string;
  salsasCargadas: boolean = false;
// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
  marcoPrimerError!: boolean;
// LGDD fin

  constructor(private activatedRoute: ActivatedRoute, private catalogosSvc: CatalogosService,
    private router: Router, private modalController: ModalController, public alertController: AlertController) {
    this.administradorPedido = AdministradorPedido.getInstance();
    addIcons({ addOutline, removeOutline, add, removeCircleOutline });
  }

  ngOnInit() {
// LGDD ini
    this.showSpinner = true;
    this.verificandoConexion = true;
    this.marcoPrimerError = false;
// LGDD fin

    //Lee catálogo de salsas
    console.log('Leyendo catálogo de salsas');
    this.catalogosSvc.leeSalsasSucursal(this.administradorPedido.getSucursal().clave).subscribe({
      next: (res: any) => {
        console.log(res);
        this.administradorPedido.setSalsas(res);
        this.salsasCargadas = true;
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
        console.log('Error al leer el catálogo de salsas');
        console.log(error);
      }
    })

    const tpi = this.activatedRoute.snapshot.paramMap.get('id');
    if (tpi) {
      this.tipoProductoId = tpi;
    }
    console.log('Tipo de producto: ' + this.tipoProductoId)

    if (this.tipoProductoId) {
      const tpds = this.administradorPedido.getMenuTiposProducto();

      for (const elemento of tpds) {
        if (elemento.id === this.tipoProductoId) {
          this.tipoProductoDescripcion = elemento.descripcion;
        }
      }

    }

    const sucursal = this.administradorPedido.getSucursal();
    this.sucursalSeleccionada = sucursal;

    this.tipoEntrega = Utilerias.textoEstatusTipoEntrega(this.administradorPedido);

    //Obteniendo listado de productos
    console.log('Obteniendo listado de productos')

    //Leyendo los productos del servidor

// LGDD ini
    this.showSpinner = true;
    this.verificandoConexion = true;
// LGDD fin
    this.catalogosSvc.leeProductoxTipoxSucursal(this.sucursalSeleccionada.clave, this.tipoProductoId).subscribe({
      next: (res: any) => {
        const productosxTipo = res;
        console.log(productosxTipo);

        //Agregando los productos al menu
        this.administradorPedido.agregaProductosMenu(productosxTipo, this.tipoProductoId);

        //Leyendo los productos del menú para usarlos en la selección
        this.productos = this.administradorPedido.dameMenuProductosxTipo(this.tipoProductoId);

        console.log('Productos leidos: ');
        console.log(this.productos);
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
        console.log('Error al leer los productos por tipo');
        console.log(error);
      }
    })
  }

  incrementaCantidad(id: string) {
    console.log(id);
    for (const producto of this.productos) {
      if (producto.id === id) {
        producto.cantidad += 1;
        producto.subtotal = producto.precioNormal * producto.cantidad;
        producto.subtotalMXN = Utilerias.convierteNumeroAMoneda(producto.subtotal);
      }
    }
    this.administradorPedido.contabilizaProductosPorTipo();
  }

  decrementaCantidad(id: string) {
    console.log(id);
    for (const producto of this.productos) {
      if (producto.id === id) {
        producto.cantidad -= 1;
        if (producto.cantidad < 0) {
          producto.cantidad = 0;
        }
        producto.subtotal = producto.precioNormal * producto.cantidad;
        producto.subtotalMXN = Utilerias.convierteNumeroAMoneda(producto.subtotal);
      }
    }
    this.administradorPedido.contabilizaProductosPorTipo();
  }

  irAPedido() {
    console.log('Ir a pedido')
    this.router.navigateByUrl(environment.paginaVistaPedido);
  }

  regresaAMenu() {
    this.router.navigateByUrl(environment.paginaMenuPrincipal);
  }

  async agregaSalsa(productoId: string) {
    console.log('Agrega salsa para producto: ' + productoId);
    const modal = await this.modalController.create({
      component: PedidoAgregaSalsaPage,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        console.log('Agregando salsa...');
        console.log(data.data);
        //Agregando salsa en el producto correspondiente
        for (let producto of this.productos) {
          if (producto.id === productoId) {
            //Se asegura que exista el arreglo de salsas
            if (!producto.salsas) {
              producto.salsas = [];
            }
            producto.salsas.push(data.data);
            this.administradorPedido.setNombreProductoAgregandoSalsa(producto.descripcion);
            //Genera el resumen de las salsas
            producto.salsasStr = Utilerias.resumenArraySalsas(producto.salsas);

            //Contabiliza cantidad de producto
            this.contabilizaCantidadPorSalsas(producto);
          }
        }
      }
    });
    return await modal.present();
  }

  eliminaSalsa(idProducto: string, idSalsa: string) {
    for (let producto of this.productos) {
      if (producto.id === idProducto) {
        for (let salsa of producto.salsas) {
          if (salsa.id === idSalsa) {
            producto.salsas = producto.salsas.filter(objeto => objeto.id != idSalsa);
            //Genera el resumen de las salsas
            producto.salsasStr = Utilerias.resumenArraySalsas(producto.salsas);
            this.contabilizaCantidadPorSalsas(producto);
            break;
          }
        }
        break;
      }
    }
  }

  private contabilizaCantidadPorSalsas(producto: Producto) {
    producto.cantidad = producto.salsas.length;
    producto.subtotal = producto.precioNormal * producto.cantidad;
    producto.subtotalMXN = Utilerias.convierteNumeroAMoneda(producto.subtotal);
    this.administradorPedido.contabilizaProductosPorTipo();
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
