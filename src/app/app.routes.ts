import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'seleccion-tipo-entrega',
    loadComponent: () => import('./pages/seleccion-tipo-entrega/seleccion-tipo-entrega.page').then(m => m.SeleccionTipoEntregaPage)
  },
  {
    path: 'registro-cliente',
    loadComponent: () => import('./pages/registro-cliente/registro-cliente.page').then(m => m.RegistroClientePage)
  },
  {
    path: 'seleccion-domicilio',
    loadComponent: () => import('./pages/seleccion-domicilio/seleccion-domicilio.page').then(m => m.SeleccionDomicilioPage)
  },
  {
    path: 'seleccion-sucursal',
    loadComponent: () => import('./pages/seleccion-sucursal/seleccion-sucursal.page').then(m => m.SeleccionSucursalPage)
  },
  {
    path: 'registro-cliente-domicilio',
    loadComponent: () => import('./pages/registro-cliente-domicilio/registro-cliente-domicilio.page').then(m => m.RegistroClienteDomicilioPage)
  },
  {
    path: 'menu-principal',
    loadComponent: () => import('./pages/menu-principal/menu-principal.page').then(m => m.MenuPrincipalPage)
  },
  {
    path: 'pedido-agrega-producto/:id',
    loadComponent: () => import('./pages/pedido-agrega-producto/pedido-agrega-producto.page').then(m => m.PedidoAgregaProductoPage)
  },
  {
    path: 'pedido-agrega-especialidad',
    loadComponent: () => import('./pages/pedido-agrega-especialidad/pedido-agrega-especialidad.page').then(m => m.PedidoAgregaEspecialidadPage)
  },
  {
    path: 'pedido-agrega-tamanio-pizza/:id',
    loadComponent: () => import('./pages/pedido-agrega-tamanio-pizza/pedido-agrega-tamanio-pizza.page').then(m => m.PedidoAgregaTamanioPizzaPage)
  },
  {
    path: 'pedido-vista',
    loadComponent: () => import('./pages/pedido-vista/pedido-vista.page').then( m => m.PedidoVistaPage)
  },
  {
    path: 'pagina-pago-dummy',
    loadComponent: () => import('./pages/pagina-pago-dummy/pagina-pago-dummy.page').then( m => m.PaginaPagoDummyPage)
  },
  {
    path: 'pedido-agrega-salsa',
    loadComponent: () => import('./pages/pedido-agrega-salsa/pedido-agrega-salsa.page').then( m => m.PedidoAgregaSalsaPage)
  },
  {
    path: 'pedido-proceso-datos/:id',
    loadComponent: () => import('./pages/pedido-proceso-datos/pedido-proceso-datos.page').then( m => m.PedidoProcesoDatosPage)
  },
  {
    path: 'login-recupera',
    loadComponent: () => import('./pages/login-recupera/login-recupera.page').then( m => m.LoginRecuperaPage)
  },
  {
    path: 'registro-cliente-correo',
    loadComponent: () => import('./pages/registro-cliente-correo/registro-cliente-correo.page').then( m => m.RegistroClienteCorreoPage)
  },
  {
    path: 'historial-pedidos',
    loadComponent: () => import('./pages/historial-pedidos/historial-pedidos.page').then( m => m.HistorialPedidosPage)
  },
  {
    path: 'pagina-pago',
    loadComponent: () => import('./pages/pagina-pago/pagina-pago.page').then( m => m.PaginaPagoPage)
  },
  {
    path: 'registro-cliente-modifica',
    loadComponent: () => import('./pages/registro-cliente-modifica/registro-cliente-modifica.page').then( m => m.RegistroClienteModificaPage)
  },
  
];
