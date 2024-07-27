import { Lugar } from "./lugar";

export class DomicilioCliente {

    idDomicilioCliente!: string;
    idCliente!: string;
    descripcion!: string;
    punto!: string;
    idLugar!: string;
    lugar!: Lugar;
    activo!: string;

}