import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl} from '@angular/forms'

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  constructor() {
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log("color value: ", value);
    });
  }
  welcome = "Welcome";
  tasks = signal([
    "instalar angular CLI",
    "crear componentes",
    "crear proyecto"
  ]);
  age = 18;
  name = signal('Andres');
  clickHandler() {
    alert("Hola");
  }

  changeInputHandler(event: Event) {
    console.log(event);
  }

  keyDownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
    console.log(input.value);
  }

  colorCtrl = new FormControl();
  widthCrl = new FormControl(50, {
    nonNullable: true
  });
}
