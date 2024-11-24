import { Component } from '@angular/core';
import { Estudiante } from '../models/estudiante';
import { Persona } from '../models/persona';
import { EstudianteService } from '../services/estudiante.service';
import { PersonaService } from '../services/persona.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [
    TableModule, ButtonModule, DialogModule, RouterModule,
    InputTextModule, FormsModule, ConfirmDialogModule, ToastModule, CommonModule
  ],
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css'],
})
export class EstudianteComponent {
  estudiantes: Estudiante[] = [];
  estudiante: Estudiante = new Estudiante();
  persona: Persona = new Persona();
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  titulo: string = '';
  modoEdicion: boolean = false;

  constructor(
    private estudianteService: EstudianteService,
    private personaService: PersonaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarEstudiantes();
  }

  listarEstudiantes(): void {
    this.estudianteService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data;
      },
      error: (error) => {
        this.mostrarMensaje('error', 'Error al cargar estudiantes', error.message || 'No se pudo cargar la lista');
      }
    });
  }

  abrirDialogoCrear(): void {
    this.titulo = 'Crear Estudiante';
    this.modoEdicion = false;
    this.limpiarFormulario();
    this.visible = true;
  }

  abrirDialogoEditar(estudiante: Estudiante): void {
    this.titulo = 'Editar Estudiante';
    this.modoEdicion = true;
    this.estudiante = { ...estudiante }; // Copiar datos del estudiante
    this.persona = { ...estudiante.persona }; // Copiar datos de la persona asociada
    this.visible = true;
  }

  guardar(): void {
    if (this.modoEdicion) {
      this.actualizarEstudiante();
    } else {
      this.crearEstudiante();
    }
  }

  private crearEstudiante(): void {
    this.persona.estado = 'A'; // Estado predeterminado
    this.personaService.createPersona(this.persona).subscribe({
      next: (persona) => {
        this.estudiante.persona = persona;
        this.estudiante.estado = 'A'; // Estado predeterminado

        this.estudianteService.createEstudiante(this.estudiante).subscribe({
          next: () => {
            this.mostrarMensaje('success', 'Estudiante creado', 'El estudiante fue registrado exitosamente');
            this.cerrarDialogo();
            this.listarEstudiantes();
          },
          error: (error) => {
            this.mostrarMensaje('error', 'Error al crear estudiante', error.message || 'No se pudo crear el estudiante');
          }
        });
      },
      error: (error) => {
        this.mostrarMensaje('error', 'Error al crear persona', error.message || 'No se pudo crear la persona');
      }
    });
  }

  private actualizarEstudiante(): void {
    this.personaService.updatePersona(this.persona, this.persona.id).subscribe({
      next: () => {
        this.estudianteService.updateEstudiante(this.estudiante, this.estudiante.id).subscribe({
          next: () => {
            this.mostrarMensaje('success', 'Estudiante actualizado', 'El estudiante fue editado correctamente');
            this.cerrarDialogo();
            this.listarEstudiantes();
          },
          error: (error) => {
            this.mostrarMensaje('error', 'Error al actualizar estudiante', error.message || 'No se pudo actualizar el estudiante');
          }
        });
      },
      error: (error) => {
        this.mostrarMensaje('error', 'Error al actualizar persona', error.message || 'No se pudo actualizar la persona');
      }
    });
  }

  eliminarEstudiante(id: number): void {
    this.isDeleteInProgress = true;
    this.estudianteService.deleteEstudiante(id).subscribe({
      next: () => {
        const estudianteAEliminar = this.estudiantes.find(est => est.id === id);
        if (estudianteAEliminar && estudianteAEliminar.persona) {
          this.personaService.deletePersona(estudianteAEliminar.persona.id).subscribe({
            next: () => {
              this.mostrarMensaje('success', 'Estudiante y persona eliminados', 'El estudiante y su persona fueron eliminados correctamente');
              this.listarEstudiantes();
            },
            error: (error) => {
              this.isDeleteInProgress = false;
              this.mostrarMensaje('error', 'Error al eliminar persona', error.message || 'No se pudo eliminar la persona asociada');
            }
          });
        } else {
          this.isDeleteInProgress = false;
          this.mostrarMensaje('error', 'Estudiante no encontrado', 'No se encontró la persona asociada al estudiante');
        }
      },
      error: (error) => {
        this.isDeleteInProgress = false;
        this.mostrarMensaje('error', 'Error al eliminar estudiante', error.message || 'No se pudo eliminar el estudiante');
      }
    });
  }

  showDialogDelete(id: number): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este estudiante y su información asociada?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminarEstudiante(id),
    });
  }

  private validarEstudiante(): boolean {
    const { codigo, persona } = this.estudiante;
    if (
      !codigo || !persona.nombre || !persona.apellido || !persona.dni || 
      !persona.correo || !persona.telefono || !persona.estado
    ) {
      this.mostrarMensaje('warn', 'Campos incompletos', 'Todos los campos son obligatorios');
      return false;
    }
    return true;
  }

  private limpiarFormulario(): void {
    this.estudiante = new Estudiante();
    this.persona = new Persona();
  }

  cerrarDialogo(): void {
    this.visible = false;
    this.limpiarFormulario();
  }

  private mostrarMensaje(severidad: string, resumen: string, detalle: string): void {
    this.messageService.add({ severity: severidad, summary: resumen, detail: detalle });
  }
}