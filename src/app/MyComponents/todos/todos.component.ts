import { Component, OnInit } from '@angular/core';
import { Todo } from '../../Todo';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-todos',
  standalone: false,

  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
  localItem: string | null = null;
  todos: Todo[] = [];
  title = 'This is my Todos Application';
  constructor() {
    setTimeout(() => {
      this.title = 'Ready to add your Todos? ';
    }, 3000);

    if (typeof window !== 'undefined' && localStorage) {
      this.localItem = localStorage.getItem('todos');
      try {
        this.todos = this.localItem ? JSON.parse(this.localItem) : [];
        if (!Array.isArray(this.todos)) {
          this.todos = [];
        }
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
        this.todos = [];
      }
    } else {
      this.todos = [];
    }
  }

  ngOnInit(): void {}

  // get sortedTodos(): Todo[] {
  //   return this.todos.sort((a, b) => Number(b.active) - Number(a.active));
  // }
  // Sort the todos so that completed ones appear first
  get sortedTodos(): Todo[] {
    return this.todos.sort((a, b) =>
      a.active === b.active ? 0 : a.active ? 1 : -1
    );
  }
  // deleteTodo(todo: Todo): void {
  //   console.log('Delete todo', todo);
  //   const index = this.todos.indexOf(todo);
  //   this.todos.splice(index, 1);
  //   localStorage.setItem('todos', JSON.stringify(this.todos));
  // }
  deleteTodo(todo: Todo): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the todo titled "${todo.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, delete the todo
        const index = this.todos.indexOf(todo);
        if (index !== -1) {
          this.todos.splice(index, 1);
          localStorage.setItem('todos', JSON.stringify(this.todos));

          // Show success toast after deletion
          Swal.fire({
            title: 'Deleted!',
            text: 'Your todo has been deleted.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  }

  updateTodo(todo: Todo): void {
    const index = this.todos.indexOf(todo);
    this.todos[index] = todo;
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}
