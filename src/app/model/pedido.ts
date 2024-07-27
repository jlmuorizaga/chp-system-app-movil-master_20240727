import { Utilerias } from "../utilities/utilerias";
import { Pizza } from "./pizza";
import { Producto } from "./producto";

export class Pedido {
    id!: string;
    tipoPago!: string;
    modalidadEntrega!: string;
    estatus!: string;
    fechaHora!: string;
    pizzas!: Pizza[];
    productos!: Producto[];
    detalle!: string;
    //instrucciones!: string;
    monto!: number;

    public resumenPedido(): string {
        //TODO calcular el texto del resumen del pedido
        let resumen = '';
        let coma = '';
        if (this.pizzas) {
            let cantidad = 0;
            for (const pizza of this.pizzas) {
                cantidad += pizza.cantidad;
            }
            resumen += 'Pizzas: '+cantidad;
            coma = ', ';
        }
        if (this.productos) {
            let cantidad = 0;
            for (const producto of this.productos) {
                cantidad += producto.cantidad;
                console.log(producto);
            }
            resumen += coma + 'Otros Productos: ' + cantidad;
        }
        return resumen;
    }

    public cantidadProductos(): number {
        let cantidad = 0;
        if (this.pizzas) {
            for (const pizza of this.pizzas) {
                cantidad += pizza.cantidad;
            }
        }
        if (this.productos) {
            for (const producto of this.productos) {
                cantidad += producto.cantidad;
            }
        }
        return cantidad;
    }

    public montoTotal(): number {
        let total = 0;
        if (this.pizzas) {
            for (const pizza of this.pizzas) {
                total += pizza.subtotal;
            }
        }
        if (this.productos) {
            for (const producto of this.productos) {
                total += producto.subtotal;
            }
        }
        return total;
    }

    public montoTotalMoneda(): string {
        return Utilerias.convierteNumeroAMoneda(this.montoTotal());
    }
}