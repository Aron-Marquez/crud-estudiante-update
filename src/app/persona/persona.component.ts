import { Component } from '@angular/core';
import { Persona } from '../models/persona';
import { PersonaService } from '../services/persona.service';
import { MessageService } from 'primeng/api';
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
  selector: 'app-persona',
  standalone: true,
  imports: [
    TableModule, ButtonModule, DialogModule, RouterModule,
    InputTextModule, FormsModule, ConfirmDialogModule, ToastModule, CommonModule
  ],
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
})
export class PersonaComponent {
  personas: Persona[] = [];
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  persona: Persona = new Persona();
  titulo: string = '';
  modoEdicion: boolean = false;

  constructor(
    private personaService: PersonaService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarPersonas();
  }

  // Listar personas
  listarPersonas(): void {
    this.personaService.getPersonas().subscribe({
      next: (data) => {
        this.personas = data;
      },
      error: (error) => {
        this.mostrarMensaje('error', 'Error al cargar personas', error.message || 'No se pudo cargar la lista');
      }
    });
  }

  // Mostrar diálogo para crear persona
  abrirDialogoCrear(): void {
    this.titulo = 'Crear Persona';
    this.modoEdicion = false;
    this.limpiarFormulario();
    this.persona.estado = 'A'; // Asignar estado inicial
    this.visible = true;
  }

  // Mostrar diálogo para editar persona
  abrirDialogoEditar(persona: Persona): void {
    this.titulo = 'Editar Persona';
    this.modoEdicion = true;
    this.persona = { ...persona }; // Copiar datos de la persona seleccionada
    this.visible = true;
  }

  // Guardar (crear o editar)
  guardar(): void {
    if (this.validarPersona()) {
      this.modoEdicion ? this.actualizarPersona() : this.crearPersona();
    }
  }

  // Crear persona
  private crearPersona(): void {
    this.personaService.createPersona(this.persona).subscribe({
      next: () => {
        this.mostrarMensaje('success', 'Persona creada', 'La persona fue registrada exitosamente');
        this.cerrarDialogo();
        this.listarPersonas();
      },
      error: (error) => {
        this.mostrarMensaje('error', 'Error al crear persona', error.message || 'No se pudo crear la persona');
      }
    });
  }

  // Actualizar persona
  private actualizarPersona(): void {
    this.personaService.updatePersona(this.persona, this.persona.id).subscribe({
      next: () => {
        this.mostrarMensaje('success', 'Persona actualizada', 'La persona fue editada correctamente');
        this.cerrarDialogo();
        this.listarPersonas();
      },
      error: (error) => {
        this.mostrarMensaje('error', 'Error al actualizar persona', error.message || 'No se pudo actualizar la persona');
      }
    });
  }

  // Eliminar persona
  eliminarPersona(id: number): void {
    this.isDeleteInProgress = true;
    this.personaService.deletePersona(id).subscribe({
      next: () => {
        this.mostrarMensaje('success', 'Persona eliminada', 'La persona fue eliminada correctamente');
        this.listarPersonas();
        this.isDeleteInProgress = false;
      },
      error: (error) => {
        this.isDeleteInProgress = false;
        this.mostrarMensaje('error', 'Error al eliminar persona', error.message || 'No se pudo eliminar la persona');
      }
    });
  }

  // Validar datos de persona
  private validarPersona(): boolean {
    const { nombre, apellido, dni, correo, telefono } = this.persona;
    if (!nombre || !apellido || !dni || !correo || !telefono) {
      this.mostrarMensaje('warn', 'Campos incompletos', 'Todos los campos son obligatorios');
      return false;
    }
    return true;
  }

  // Limpiar formulario
  private limpiarFormulario(): void {
    this.persona = new Persona();
  }

  // Cerrar diálogo
  cerrarDialogo(): void {
    this.visible = false;
    this.limpiarFormulario();
  }

  // Mostrar mensajes de notificación
  private mostrarMensaje(severidad: string, resumen: string, detalle: string): void {
    this.messageService.add({ severity: severidad, summary: resumen, detail: detalle });
  }
}
