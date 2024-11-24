import { Component } from '@angular/core';
import { EstudianteComponent } from "../estudiante/estudiante.component";
import { PersonaComponent } from "../persona/persona.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EstudianteComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
