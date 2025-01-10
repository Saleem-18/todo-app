import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from '../../Todo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-item',
  standalone: false,

  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  @Input() i!: number;
  @Output() todoDelete: EventEmitter<Todo> = new EventEmitter();
  @Output() todoCheckbox: EventEmitter<Todo> = new EventEmitter();
  @Output() todoUpdate: EventEmitter<Todo> = new EventEmitter();

  constructor(private router: Router) {}
  ngOnInit(): void {}

  onDelete(todo: Todo): void {
    this.todoDelete.emit(todo);
    console.log('onDelete has been called');
  }
  onEdit(todo: Todo): void {
    this.router.navigate(['/edit', todo.sno]);
  }

  onToggle(todo: Todo): void {
    todo.active = !todo.active;
    this.updateLocalStorage();
  }

  updateLocalStorage(): void {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const updatedTodos = todos.map((t: Todo) =>
      t.sno === this.todo.sno ? this.todo : t
    );
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  }
}
