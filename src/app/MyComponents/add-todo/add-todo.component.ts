import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Todo } from '../../Todo';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-todo',
  standalone: false,

  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss',
})
export class AddTodoComponent implements OnInit {
  localItem: string | null = null;
  todos: Todo[] = [];
  title: string = '';
  desc: string = '';
  @Output() todoAdd: EventEmitter<Todo> = new EventEmitter();
  @Output() todoUpdate: EventEmitter<Todo> = new EventEmitter();
  editMode: boolean = false;
  editTodo: Todo | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
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
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const sno = params.get('sno');
      if (sno) {
        this.editMode = true;
        this.editTodo = this.todos.find((todo) => todo.sno === +sno) || null;
        if (this.editTodo) {
          this.title = this.editTodo.title;
          this.desc = this.editTodo.desc;
        }
      }
    });
  }

  onSubmit(): void {
    if (this.editMode && this.editTodo) {
      // Update existing todo
      this.editTodo.title = this.title;
      this.editTodo.desc = this.desc;

      const index = this.todos.findIndex(
        (todo) => todo.sno === this.editTodo!.sno
      );
      if (index !== -1) {
        this.todos[index] = this.editTodo;
        localStorage.setItem('todos', JSON.stringify(this.todos));
      }
      this.todoUpdate.emit(this.editTodo);

      Swal.fire({
        title: 'Success!',
        text: 'Todo updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        this.router.navigate(['/']); // Redirect to home after updating
      });

      this.editMode = false;
      this.editTodo = null;
    } else {
      // Check if either title or description is empty
      if (!this.title.trim() || !this.desc.trim()) {
        // alert('Both title and description are required!');
        Swal.fire({
          title: 'Error!',
          text: 'Both title and description are required!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }
      const sno = new Date().getTime();
      const todo = {
        sno,
        title: this.title,
        desc: this.desc,
        active: true,
      };
      this.todoAdd.emit(todo);
      // Add the todo to the local list
      this.addTodo(todo);

      // Show an alert after adding the todo
      // alert('Todo added successfully!');
      // Show a success modal
      // Show success toast
      Swal.fire({
        title: 'Success!',
        text: 'Todo added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        // After closing the success toast, navigate to the home page
        this.router.navigate(['/']); // Redirect to home
      });

      // Optionally clear the input fields after adding a todo
      this.title = '';
      this.desc = '';
    }
  }
  addTodo(todo: Todo): void {
    console.log('Add todo', todo);
    this.todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
  onEdit(todo: Todo): void {
    this.editMode = true;
    this.editTodo = todo;
    this.title = todo.title;
    this.desc = todo.desc;
  }
}
