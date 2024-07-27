// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  //Constantes servicio y endpoints
  //baseUrl: 'http://localhost',
  //baseUrl: 'http://192.168.0.12',//IP local para poder probar desde el dispositivo móvil conectado a la misma red
  //baseUrl: 'http://ec2-52-53-193-189.us-west-1.compute.amazonaws.com',
  baseUrl: 'http://ec2-54-153-58-93.us-west-1.compute.amazonaws.com',
  puertoClientes: 3000,
  puertoPedidos: 3000,
  puertoCatalogos: 3001,
  puertoStripe: 3002,
  puertoCorreos: 3003,
  accesoCliente: '/clientes/acceso',
  datosCliente: '/clientes',
  domicilioCliente: '/domicilios-cliente',
  pedido: '/pedidos',
  sucursales: '/sucursales',
  especialidades: '/especialidades',
  tiposProducto: '/tipoproductos',
  tamaniosEspecialidad: '/tamanios',
  productos: '/productos',
  salsas: '/salsas',
  imagenMenuPizzas: '/img/menu/menu_pizzas.jpg',
  recuperaContrasenia: '/recupera-correo',
  verificaCorreo: '/verifica-correo',
  pagoStripe: '/stripe/charge',

  //Constantes almacenamiento local
  clienteLocalStoreID: 'cliente_chpsystem_movil_ccba5b83-6c83-438a-9e56-5e38e1229adc',

  //Constantes estatus pedido
  estatusPedidoNube: 'NP', // 01 Pedido enviado a la nube desde la aplicación
  estatusPedidoRecibido: 'RP', // 02 Pedido recibido en la sucursal
  estatusPedidoCapturado: 'CP', // 03 En preparación (ha sido capturado en el punto de venta de la sucursal)
  estatusPedidoEnviado: 'EP', // 04.1 Pedido enviado a domicilio
  estatusPedidoListo: 'LP', // 04.2 Pedido listo para ser recogido en la sucursal
  estatusPedidoAtendido: 'AP', // 05 Pedido atendido (pasa al histórico)

  //Constantes tipo de entrega
  entregaDomicilio: 'ED',
  entregaSucursal: 'ES',

  //Constantes tipo de pago
  pagoEnLinea: 'PL',

  //Constantes Urls de páginas
  paginaSeleccionTipoEntrega: '/seleccion-tipo-entrega',
  paginaLogin: '/login',
  paginaRecuperaLogin: '/login-recupera',
  paginaRegistroCliente: '/registro-cliente',
  paginaRegistroCorreoCliente: '/registro-cliente-correo',
  paginaSeleccionDomicilio: '/seleccion-domicilio',
  paginaSeleccionSucursal: '/seleccion-sucursal',
  paginaMenuPrincipal: '/menu-principal',
  paginaVistaPedido: '/pedido-vista',
  paginaAgregaEspecialidadAPedido: '/pedido-agrega-especialidad',
  paginaPago: '/pagina-pago',
  paginaHistorialPedidos: '/historial-pedidos',
  paginaRegistroClienteModifica: '/registro-cliente-modifica',

  //Constantes generales
  id_nula: '00000000-0000-0000-0000-000000000000',
  separadorDatos: '|',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
