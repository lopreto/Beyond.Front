import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoListService } from '../../services/todo-list-service';
import { TodoItem } from '../../models/responses/todo-item.dto';
import { AddItemRequest } from '../../models/requests/add-item.request';
import { RegisterProgressionRequest } from '../../models/requests/register-progression.request';
import { Progression } from '../../models/responses/progression.dto';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class TodoListComponent implements OnInit {
  addItemForm!: FormGroup;
  items: TodoItem[] = [];
  progressionForms: { [itemId: number]: FormGroup } = {};
  editedDescriptions: { [itemId: number]: string } = {};

  constructor(private fb: FormBuilder, private todoService: TodoListService) { }

  ngOnInit(): void {
    this.addItemForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: ['']
    });

    this.loadItems();
  }

  loadItems(): void {
    this.todoService.getItems().subscribe(res => {
      if (res.errorMessage) {
        alert(`Error: ${res.errorMessage}`);
        return;
      }

      this.items = res.data ?? [];
      this.items.forEach(item => {
        this.progressionForms[item.id] = this.fb.group({
          date: ['', Validators.required],
          percent: [null, [Validators.required, Validators.min(1), Validators.max(100)]]
        });
      });
    });
  }

  createItem(): void {
    const request: AddItemRequest = this.addItemForm.value;
    this.todoService.addItem(request).subscribe(res => {
      if (res.errorMessage) {
        alert(`Error: ${res.errorMessage}`);
        return;
      }

      this.addItemForm.reset();
      this.loadItems();
    });
  }

  addProgression(itemId: number): void {
    const form = this.progressionForms[itemId];
    if (!form.valid) return;

    const request: RegisterProgressionRequest = form.value;
    this.todoService.registerProgression(itemId.toString(), itemId, request).subscribe({
      next: res => {
        if (res.errorMessage) {
          alert(`Error: ${res.errorMessage}`);
          return;
        }

        form.reset();
        this.loadItems();
      }
    });
  }
  getAccumulatedPercent(progressions: Progression[], index: number): number {
    return progressions
      .slice(0, index + 1)
      .reduce((sum, p) => sum + p.percent, 0);
  }
}
