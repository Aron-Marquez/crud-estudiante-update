import { Persona } from "./persona";

export class Estudiante {
    id: number;
  codigo: string;
  persona: Persona;
  estado : string;

  constructor(
    id: number = 0,
    codigo: string = '',
    persona: Persona = new Persona(),
    estado : string = 'A'
  ) {
    this.id = id;
    this.codigo = codigo;
    this.persona = persona;
    this.estado = estado;
  }
}
