import { Empresa } from "./empresa";
import { Estudiante } from "./estudiante";

export class Solicitud {
    id:number;
    estudiante: Estudiante;
    empresa: Empresa;
    estado_de_solicitud: string;
    constructor(id: number=0, estudiante: Estudiante = new Estudiante(), empresa: Empresa = new Empresa, estado_de_solicitud: string=''){
        this.id=id;
        this.estudiante=estudiante;
        this.empresa=empresa;
        this.estado_de_solicitud=estado_de_solicitud;
    }
}
