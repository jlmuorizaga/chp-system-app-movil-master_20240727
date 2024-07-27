import { Utilerias } from "../utilities/utilerias";
import { Especialidad } from "./especialidad";
import { Tamanio } from "./tamanio";

export class Pizza {
    especialidad!: Especialidad;
    tamanio!: Tamanio;
    cantidad: number = 0;
    subtotal: number = 0;

    public precioMoneda(): string {
        return Utilerias.convierteNumeroAMoneda(this.tamanio.precio);
    }

    public subtotalMoneda() {
        return Utilerias.convierteNumeroAMoneda(this.subtotal);
    }
}