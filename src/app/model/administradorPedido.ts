import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Sucursal } from './sucursal';
import { TipoEntrega } from './tipoEntrega';
import { Pedido } from './pedido';
import { TipoProducto } from './tipoProducto';
import { Especialidad } from './especialidad';
import { Pizza } from './pizza';
import { Producto } from './producto';
import { DomicilioCliente } from './domicilioCliente';
import { PedidoNube } from './pedidoNube';
import { Utilerias } from '../utilities/utilerias';
import { Salsa } from './salsa';

@Injectable()
export class AdministradorPedido {
    private static instance: AdministradorPedido;

    //Pedidos en proceso
    private pedidosEnProceso!: PedidoNube[];

    //Pedido actual
    private cliente!: Cliente;
    private sucursal!: Sucursal;
    private tipoEntrega!: TipoEntrega;
    private domicilioCliente!: DomicilioCliente;
    private pedido!: Pedido;
    private menuTiposProducto!: TipoProducto[];
    private menuProductos!: Producto[];
    private menuEspecialidades!: Especialidad[];
    private menuPizzas!: Pizza[];
    private instruccionesEspeciales!: string;
    private catalogoSalsas!: Salsa[];
    private nombreProductoAgregandoSalsa!: string;

    private constructor() {
    }

    public static getInstance(): AdministradorPedido {
        if (!AdministradorPedido.instance) {
            AdministradorPedido.instance = new AdministradorPedido();
        }
        return AdministradorPedido.instance;
    }

    public setPedidosEnProceso(pedidos: PedidoNube[]) {
        this.pedidosEnProceso = pedidos;
        //Asigna textos de estatus y de modalidad de entrega
        for (let pedido of pedidos) {
            pedido.textoEstatus = Utilerias.textoEstatusPedido(pedido.estatus);
            pedido.textoModalidadEntrega = Utilerias.textoModalidadEntrega(pedido.modalidadEntrega);
        }
    }

    public getPedidosEnProceso(): PedidoNube[] {
        return this.pedidosEnProceso;
    }

    public getCantidadPedidosEnProceso(): number {
        if (this.pedidosEnProceso) {
            return this.pedidosEnProceso.length;
        } else {
            return 0;
        }
    }

    public limpiaSucursal() {
        this.sucursal = undefined as any;
    }

    public limpiaMenu() {
        this.menuTiposProducto = undefined as any;
        this.menuProductos = undefined as any;
        this.menuEspecialidades = undefined as any;
        this.menuPizzas = undefined as any;
    }

    public cantidadesPorEspecialidad() {
        if (this.menuEspecialidades) {
            for (const especialidad of this.menuEspecialidades) {
                let nombre = especialidad.nombre;
                let cantidad = this.cuentaCantidadPorEspecialidad(especialidad.idEspecialidad);
                if (cantidad > 0) {
                    nombre += ' (' + cantidad + ')';
                }
                especialidad.nombreMenu = nombre;
            }
        }
    }

    private cuentaCantidadPorEspecialidad(idEspecialidad: string) {
        let cantidad = 0;
        if (this.menuPizzas) {
            for (const pizza of this.menuPizzas) {
                if (pizza.especialidad.idEspecialidad === idEspecialidad && pizza.cantidad > 0) {
                    cantidad += pizza.cantidad;
                }
            }
        }
        return cantidad;
    }

    public cantidadPizzasStr(): string {
        let cantidad = 0;
        let cantidadStr = '';
        if (this.menuPizzas) {
            for (const pizza of this.menuPizzas) {
                cantidad += pizza.cantidad;
            }
        }
        if (cantidad > 0) {
            cantidadStr = ' (' + cantidad + ')';
        }
        return cantidadStr;
    }

    public contabilizaProductosPorTipo() {
        if (this.menuTiposProducto) {
            for (const tipoProducto of this.menuTiposProducto) {
                const productos = this.dameMenuProductosxTipo(tipoProducto.id);
                let cantidad = 0;
                for (const producto of productos) {
                    cantidad += producto.cantidad;
                }
                tipoProducto.cantidadPedido = cantidad;
                let descripcionMenu = tipoProducto.descripcion;
                if (tipoProducto.cantidadPedido > 0) {
                    descripcionMenu += ' (' + tipoProducto.cantidadPedido + ')';
                }
                tipoProducto.descripcionMenu = descripcionMenu;
            }
        }
    }

    public textoBotonPedido() {
        let texto = '¡Agrega algo a tu pedido! *';
        //Verifica si hay elementos en el pedido
        let [cantidad, total] = this.cantidadElementosPedido();
        if (cantidad > 0) {
            let totalMXN = Utilerias.convierteNumeroAMoneda(total);
            texto = 'Ver tu pedido (' + cantidad + ') ' + totalMXN;
        }
        return texto;
    }

    public botonPedidoDeshabilitado() {
        let botonDeshabilitado = true;
        let [cantidad, total] = this.cantidadElementosPedido();
        botonDeshabilitado = !(cantidad > 0);
        return botonDeshabilitado;
    }

    private cantidadElementosPedido(): [number, number] {
        let cantidadElementos = 0;
        let total = 0;
        if (this.menuPizzas) {
            for (const pizza of this.menuPizzas) {
                if (pizza.cantidad > 0) {
                    cantidadElementos += pizza.cantidad;
                    total += (pizza.cantidad * pizza.tamanio.precio);
                }
            }
        }
        if (this.menuProductos) {
            for (const producto of this.menuProductos) {
                if (producto.cantidad > 0)
                    cantidadElementos += producto.cantidad;
                total += (producto.cantidad * producto.precioNormal);
            }
        }
        return [cantidadElementos, total];
    }

    public reiniciaPedido() {
        if (this.menuProductos) {
            for (const producto of this.menuProductos) {
                producto.cantidad = 0;
            }
        }
        if (this.menuPizzas) {
            for (const pizza of this.menuPizzas) {
                pizza.cantidad = 0;
            }
        }
        this.instruccionesEspeciales = undefined as any;
    }

    public setCliente(cliente: Cliente) {
        this.cliente = cliente;
    }

    public getCliente(): Cliente {
        return this.cliente;
    }

    public setSalsas(salsas: Salsa[]) {
        this.catalogoSalsas = salsas;
    }

    public getSalsas(): Salsa[] {
        return this.catalogoSalsas;
    }

    public setNombreProductoAgregandoSalsa(nombreProducto: string) {
        this.nombreProductoAgregandoSalsa = nombreProducto;
    }

    public getNombreProductoAgregandoSalsa() {
        return this.nombreProductoAgregandoSalsa;
    }

    public setSucursal(sucursal: Sucursal) {
        this.sucursal = sucursal;
    }

    public getSucursal(): Sucursal {
        return this.sucursal;
    }

    public setTipoEntrega(tipoEntrega: TipoEntrega) {
        this.tipoEntrega = tipoEntrega;
    }

    public getTipoEntrega(): TipoEntrega {
        return this.tipoEntrega;
    }

    public setDomicilioCliente(domicilioCliente: DomicilioCliente) {
        this.domicilioCliente = domicilioCliente;
    }

    public getDomicilioCliente(): DomicilioCliente {
        return this.domicilioCliente;
    }

    public setInstruccionesEspeciales(instrucciones: string) {
        this.instruccionesEspeciales = instrucciones;
    }

    public getInstruccionesEspeciales(): string {
        return this.instruccionesEspeciales;
    }

    /*
    public setPedido(pedido: Pedido) {
        this.pedido = pedido;
    }
    */

    public getPedido(): Pedido {
        //Actualizando pizzas y productos del pedido
        const pizzas: Pizza[] = [];
        const productos: Producto[] = [];
        //Agregando al pedido solo las pizzas del menú que tengan una selección mayor a cero
        if (this.menuPizzas) {
            for (const pizza of this.menuPizzas) {
                if (pizza.cantidad > 0) {
                    pizzas.push(pizza);
                }
            }
        }
        //Agregando al pedido solo los productos del menú que tengan una selección mayor a cero
        if (this.menuProductos) {
            for (const producto of this.menuProductos) {
                if (producto.cantidad > 0) {
                    productos.push(producto);
                }
            }
        }
        this.pedido = new Pedido();
        this.pedido.pizzas = pizzas;
        this.pedido.productos = productos;

        return this.pedido;
    }

    public setMenuTiposProducto(menuTiposProducto: TipoProducto[]) {
        this.menuTiposProducto = menuTiposProducto;
        for (const tipoProducto of this.menuTiposProducto) {
            tipoProducto.cantidadPedido = 0;
            tipoProducto.descripcionMenu = tipoProducto.descripcion;
        }
    }

    public getMenuTiposProducto(): TipoProducto[] {
        return this.menuTiposProducto;
    }

    private cantidadProductosPorTipo(idTipoProducto: string): number {
        let cantidad = 0;
        if (this.menuProductos) {
            for (const producto of this.menuProductos) {
                if (producto.tipo === idTipoProducto) {
                    cantidad += producto.cantidad;
                }
            }
        }
        return cantidad;
    }

    public setMenuEspecialidades(menuEspecialidades: Especialidad[]) {
        this.menuEspecialidades = menuEspecialidades;
    }

    public getMenuEspecialidades(): Especialidad[] {
        return this.menuEspecialidades;
    }

    public dameMenuPizzasEspecialidad(idEspecialidad: string): Pizza[] {
        const pizzasEsp: Pizza[] = [];
        for (const p of this.menuPizzas) {
            if (p.especialidad.idEspecialidad === idEspecialidad) {
                pizzasEsp.push(p);
            }
        }
        return pizzasEsp;
    }

    public agregaPizzasMenu(pizzas: Pizza[]) {
        //Agrega solamente las pizzas que falten
        if (this.menuPizzas) {
            //Ya hay pizzas, se agregarán solamente las que falten
            for (const pizn of pizzas) {
                if (!this.existePizzaMenu(pizn)) {
                    //No existe la pizza, entonces se agrega
                    this.menuPizzas.push(pizn);
                }
            }
        } else {
            //No hay ninguna pizza, agrega el arreglo completo
            this.menuPizzas = pizzas;
        }
    }

    public getEspecialidadMenu(idEspecialidad: string): Especialidad {
        let resultado!: Especialidad;
        for (const e of this.menuEspecialidades) {
            if (e.idEspecialidad === idEspecialidad) {
                resultado = e;
            }
        }
        return resultado;
    }

    private existePizzaMenu(pizzaNueva: Pizza): boolean {
        let existe = false;
        //Verifica si existe en el arreglo de pizzas
        for (const p of this.menuPizzas) {
            if (p.especialidad.idEspecialidad === pizzaNueva.especialidad.idEspecialidad
                && p.tamanio.idTamanioPizza === pizzaNueva.tamanio.idTamanioPizza) {
                existe = true;
            }
        }
        return existe;
    }

    public dameMenuProductosxTipo(idTipoProducto: string): Producto[] {
        const productosxTipo: Producto[] = [];
        for (const p of this.menuProductos) {
            if (p.tipo === idTipoProducto) {
                productosxTipo.push(p);
            }
        }
        return productosxTipo;
    }

    public agregaProductosMenu(productos: Producto[], idTipoProducto: string) {
        //Agregando datos complementarios
        for (const p of productos) {
            p.tipo = idTipoProducto;
            p.cantidad = 0;
            p.subtotal = 0;
        }

        //Agrega solamente los productos que falten
        if (this.menuProductos) {
            //Ya hay productos, se agregarán solamente los que falten
            for (const pron of productos) {
                if (!this.existeProductoMenu(pron)) {
                    //No existe el producto, entonces se agrega
                    console.log('Se agregará el producto');
                    console.log(pron);
                    this.menuProductos.push(pron);
                }
            }
        } else {
            //No hay ningun producto, agrega el arreglo completo
            this.menuProductos = productos;
        }
        console.log('Productos en el menú');
        console.log(this.menuProductos);
    }

    private existeProductoMenu(productoNuevo: Producto): boolean {
        let existe = false;
        //Verifica si existe en el arreglo de productos
        for (const p of this.menuProductos) {
            if (p.id === productoNuevo.id) {
                existe = true;
            }
        }
        return existe;
    }
}