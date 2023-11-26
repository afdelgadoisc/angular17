import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Task } from './../../models/task.model';
import { Filters } from './../../enums/filters';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  constructor(){
  }

  ngOnInit() {
    const storage = localStorage.getItem("tasks");
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }

  all = Filters.all;
  completed = Filters.completed;
  pending = Filters.pending;

  currentFilter = signal(this.all);

  tasks = signal<Task[]>([]);

  inputNewTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern('^\\S.*$'),
      Validators.minLength(3),
    ],
  });

  inputEditTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern('^\\S.*$'),
      Validators.minLength(3),
    ],
  });

  tasksByFilter = computed(() => {
    const filter: Filters = this.currentFilter();
    const tasks = this.tasks();

    const tasksMap: Record<Filters, ()=> Task[]> = {
      [Filters.completed]: () => tasks.filter( task => task.completed),
      [Filters.pending]: () => tasks.filter( task => !task.completed),
      [Filters.all]: () => tasks
    };
    return tasksMap[filter]();
  });

  injector = inject(Injector);

  trackTasks(){
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }, {injector: this.injector});
  }

  newTaskHandler() {
    if (this.inputNewTaskCtrl.valid) {
      const title = this.inputNewTaskCtrl.value.trim();
      this.addTask(title);
      this.inputNewTaskCtrl.setValue('');
    }
  }

  addTask(title: string) {
    const newTask: Task = {
      id: Date.now(),
      title: title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  changeStatusTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, positition) => {
        if (positition === index) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    });
  }

  editingTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, positition) => {
        if (positition === index) {
          this.inputEditTaskCtrl.setValue(task.title);
          return {
            ...task,
            editing: true,
          };
        }
        return {
          ...task,
          editing: false,
        };
      });
    });
  }

  changeTitleTask(index: number, event: Event) {
    if (this.inputEditTaskCtrl.valid) {
      const input = event.target as HTMLInputElement;
      this.tasks.update((tasks) => {
        return tasks.map((task, positition) => {
          if (positition === index) {
            return {
              ...task,
              title: input.value,
              editing: false,
            };
          }
          return task;
        });
      });
    }
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.filter((_, positition) => {
        return index !== positition;
      });
    });
  }
  
  changeFilter(filter: Filters) {
    this.currentFilter.set(filter);
  }
}
