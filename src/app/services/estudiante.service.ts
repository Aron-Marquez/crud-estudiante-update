import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante } from '../models/estudiante';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  // URL del backend donde se gestionan los estudiantes
  private apiUrl = 'http://localhost:8080/api/estudiantes';

  constructor(private http: HttpClient) {}

  // Obtener todos los estudiantes
  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  // Obtener un estudiante por ID
  getEstudianteById(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo estudiante
  createEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, estudiante);
  }

  // Actualizar un estudiante existente
  updateEstudiante(estudiante: Estudiante, id: number): Observable<Estudiante> {
    // En vez de `${estudiante.id}`, simplemente usamos `${id}` que es más claro
    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, estudiante);
  }

  // Eliminar un estudiante
  deleteEstudiante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
