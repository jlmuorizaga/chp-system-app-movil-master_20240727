import { DomicilioCliente } from "./domicilioCliente";

export class Cliente {

    idCliente!: string;
    correoElectronico!: string;
    contrasenia!: string;
    mantenerSesion!: boolean;
    nombre!: string;
    telefono!: string;
    fechaRegistro!: string;
    activo!: string;
    domiciliosCliente!: DomicilioCliente[];

}