import { Utilerias } from "../utilities/utilerias";
import { Salsa } from "./salsa";

export class Producto {
    id!: string;
    tipo!: string;
    descripcion!: string;
    tamanio!: string;
    usaSalsa!: string;
    salsas!: Salsa[];
    salsasStr!: string;
    precioNormal!: number;
    cantidad: number = 0;
    subtotal: number = 0;
    subtotalMXN!: string;

    public precioNormalMoneda(): string {
        return Utilerias.convierteNumeroAMoneda(this.precioNormal);
    }

    public subtotalMoneda(): string {
        return Utilerias.convierteNumeroAMoneda(this.subtotal);
    }

}