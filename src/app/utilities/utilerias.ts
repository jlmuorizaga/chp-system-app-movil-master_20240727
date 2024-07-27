import { v4 as uuidv4 } from 'uuid';

import { environment } from 'src/environments/environment';
import { AdministradorPedido } from '../model/administradorPedido';
import { CantidadDato } from './cantidadDato';
import { Salsa } from '../model/salsa';

export class Utilerias {

    static convierteNumeroAMoneda(numero: number): string {
        //console.log('Convirtiendo a moneda ' + numero);
        let resultado: string;
        if (numero) {
            const formatoMoneda: string = numero.toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });
            resultado = formatoMoneda;
        } else {
            resultado = "X";
        }
        //console.log('Resultado: ' + resultado);
        return resultado;
    }

    static textoEstatusPedido(estatusPedido: string): string {

        /*
        static ESTATUS_PEDIDO_NUBE = 'NP'; // 01 Pedido enviado a la nube desde la aplicación
        static ESTATUS_PEDIDO_RECIBIDO = 'RP'; // 02 Pedido recibido en la sucursal
        static ESTATUS_PEDIDO_CAPTURADO = 'CP'; // 03 En preparación (ha sido capturado en el punto de venta de la sucursal)
        static ESTATUS_PEDIDO_ENVIADO = 'EP'; // 04.1 Pedido enviado a domicilio
        static ESTATUS_PEDIDO_LISTO = 'LP'; // 04.2 Pedido listo para ser recogido en la sucursal
        static ESTATUS_PEDIDO_ATENDIDO = 'AP'; // 05 Pedido atendido (pasa al histórico)
        */

        if (estatusPedido) {
            switch (estatusPedido) {
                case environment.estatusPedidoNube:
                    return 'Pedido registrado';
                case environment.estatusPedidoRecibido:
                    return 'Recibido en sucursal';
                case environment.estatusPedidoCapturado:
                    return 'En preparación';
                case environment.estatusPedidoEnviado:
                    return 'Enviado al domicilio';
                case environment.estatusPedidoListo:
                    return 'Listo para pasar por él';
                case environment.estatusPedidoAtendido:
                    return 'Pedido atendido';
                default:
                    return 'Estatus ' + estatusPedido;
            }
        } else {
            return 'Estatus del pedido desconocido';
        }

    }

    static textoModalidadEntrega(modalidadEntrega: string): string {

        /*
        static ENTREGA_DOMICILIO = 'ED';
        static ENTREGA_SUCURSAL = 'ES';
        */

        if (modalidadEntrega) {
            switch (modalidadEntrega) {
                case environment.entregaDomicilio:
                    return 'Entrega a domicilio';
                case environment.entregaSucursal:
                    return 'Entrega en sucursal';
                default:
                    return 'Modalidad de entrega: ' + modalidadEntrega;
            }
        } else {
            return 'Modalidad de entrega desconocida';
        }

    }

    static textoEstatusTipoEntrega(administradorPedido: AdministradorPedido) {
        //Verificando las variables de entrada
        if (administradorPedido === undefined || administradorPedido === null) {
            return 'Tipo de entrega indefinido';
        }
        if (administradorPedido.getTipoEntrega() === undefined || administradorPedido.getTipoEntrega() === null) {
            return 'Tipo de entrega nulo';
        }
        //Termina verificación de variables de entrada
        let textoEntrega = 'Indefinido';
        const tipoEntrega = administradorPedido.getTipoEntrega().getTipo();
        switch (tipoEntrega) {
            case environment.entregaDomicilio:
                textoEntrega = 'Entrega a domicilio';
                break;
            case environment.entregaSucursal:
                textoEntrega = 'Entrega en sucursal';
                break;
            default:
                textoEntrega = 'Opción de entrega no válida';
        }
        return textoEntrega;
    }

    static textoDomicilioTipoEntrega(administradorPedido: AdministradorPedido) {
        //Verificando las variables de entrada
        if (administradorPedido === undefined || administradorPedido === null) {
            return 'Tipo de entrega indefinido';
        }
        if (administradorPedido.getTipoEntrega() === undefined || administradorPedido.getTipoEntrega() === null) {
            return 'Tipo de entrega nulo';
        }
        //Termina verificación de variables de entrada
        let textoDomicilio = '';
        const tipoEntrega = administradorPedido.getTipoEntrega().getTipo();
        switch (tipoEntrega) {
            case environment.entregaDomicilio:
                if (administradorPedido.getDomicilioCliente()) {
                    const domicilioCliente = administradorPedido.getDomicilioCliente().descripcion;
                    if (domicilioCliente) {
                        textoDomicilio += 'Domicilio del cliente: ' + domicilioCliente;
                    }
                }
                break;
            case environment.entregaSucursal:
                if (administradorPedido.getSucursal()) {
                    const domicilioSucursal = administradorPedido.getSucursal().domicilio;
                    if (domicilioSucursal) {
                        textoDomicilio += 'Domicilio sucursal: ' + domicilioSucursal;
                    }
                }
                break;
            default:
                textoDomicilio = 'Opción de entrega no válida';
        }
        return textoDomicilio;
    }

    //static generaIdUnico(claveSucursal: String) {
    //    let idUnico = claveSucursal
    //        + this.fechaActual()
    //        + this.generarNumeroAzar();
    //    return idUnico;
    //}


    static generaIdUnico() {
        const uuid = uuidv4();
        return uuid;
    }


    static fechaActual() {
        let fechaHoy = new Date();
        let anio = fechaHoy.getFullYear();
        let mes = fechaHoy.getMonth();
        let dia = fechaHoy.getDate();
        let hora = fechaHoy.getHours();
        let minuto = fechaHoy.getMinutes();
        let segundo = fechaHoy.getSeconds();
        let milisegundos = fechaHoy.getMilliseconds();
        let fechaStr = this.convertirNumero(anio, 4)
            + this.convertirNumero(mes + 1, 2)
            + this.convertirNumero(dia, 2)
            + this.convertirNumero(hora, 2)
            + this.convertirNumero(minuto, 2)
            + this.convertirNumero(segundo, 2)
            + this.convertirNumero(milisegundos, 3);
        return fechaStr;
    }

    private static convertirNumero(numero: number, longitud: number): string {
        let numeroString = numero.toString();

        while (numeroString.length < longitud) {
            numeroString = "0" + numeroString;
        }

        return numeroString;
    }

    
    public static generaCodigoVerificacion(): string {
        const longitud = 6;
        let numeroAzar = "";

        for (let i = 0; i < longitud; i++) {
            const digitoAzar = Math.floor(Math.random() * 10);
            numeroAzar += digitoAzar.toString();
        }

        return numeroAzar;
    }
    

    private static degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    //Fórmula de Haversine para calcular la distancia entre dos puntos de la superficie de la tierra
    static haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Radio de la Tierra en kilómetros

        const dLat = this.degreesToRadians(lat2 - lat1);
        const dLon = this.degreesToRadians(lon2 - lon1);

        const a =
            (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
            Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
            (Math.sin(dLon / 2) * Math.sin(dLon / 2));

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distancia en kilómetros

        return distance;
    }

    static resumenArraySalsas(array: Salsa[]): string {
        let resumen = '';
        if (array) {
            let arregloResumen: CantidadDato[] = [];
            for (let valor of array) {
                //Buscando el valor en el arreglo resumen
                let existe = false;
                for (let dato of arregloResumen) {
                    if (valor.descripcion === dato.dato) {
                        existe = true;
                        dato.cantidad += 1;
                        break;
                    }
                }
                if (!existe) {
                    let cantidadDato: CantidadDato = { "cantidad": 1, "dato": valor.descripcion };
                    arregloResumen.push(cantidadDato);
                }
            }
            let separador = '';
            for (let r of arregloResumen) {
                resumen += separador + r.cantidad + ' ' + r.dato;
                separador = ', ';
            }
        }
        return resumen;
    }

    static textoPipe2Array(texto: string): string[] {
        let arreglo: string[] = [];
        if (texto) {
            arreglo = texto.split('|');
        }
        return arreglo;
    }

    static convertToDateAndFormat(localDateString: string): string {
        let fechaFormateada = '';
        if (localDateString) {
            // Asume que la cadena tiene la forma "yyyyMMddHHmmssSSS"
            let year = parseInt(localDateString.substring(0, 4), 10);
            let month = parseInt(localDateString.substring(4, 6), 10) - 1; // Los meses en JS van de 0 a 11
            let day = parseInt(localDateString.substring(6, 8), 10);
            let hour = parseInt(localDateString.substring(8, 10), 10);
            let minute = parseInt(localDateString.substring(10, 12), 10);
            let second = parseInt(localDateString.substring(12, 14), 10);
            let millisecond = parseInt(localDateString.substring(14, 17), 10);

            let date = new Date(year, month, day, hour, minute, second, millisecond);

            // Convierte a formato local
            fechaFormateada = date.toLocaleString("es-mx", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" });

        }

        return fechaFormateada;
    }
}