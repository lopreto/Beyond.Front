import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResultDto } from '../models/responses/base-result.dto';
import { UpdateItemRequest } from '../models/requests/update-item.request';
import { AddItemRequest } from '../models/requests/add-item.request';
import { RegisterProgressionRequest } from '../models/requests/register-progression.request';
import { TodoItem } from '../models/responses/todo-item.dto';

@Injectable({
  providedIn: 'root'
})

export class TodoListService {

  private readonly apiUrl = 'https://localhost:7269'; // Cambia esto por tu base URL

  constructor(private http: HttpClient) {}

  getItems(): Observable<BaseResultDto<TodoItem[]>> {
    return this.http.get<BaseResultDto<TodoItem[]>>(`${this.apiUrl}/TodoList/PrintItems`);
  }

  addItem(request: AddItemRequest): Observable<BaseResultDto<number>> {
    return this.http.post<BaseResultDto<number>>(`${this.apiUrl}/TodoList`, request);
  }

  updateItem(id: number, request: UpdateItemRequest): Observable<BaseResultDto<boolean>> {
    return this.http.put<BaseResultDto<boolean>>(`${this.apiUrl}/TodoList/${id}`, request);
  }

  deleteItem(id: number): Observable<BaseResultDto<boolean>> {
    return this.http.delete<BaseResultDto<boolean>>(`${this.apiUrl}/TodoList/${id}`);
  }

  registerProgression(id: string, itemId: number, request: RegisterProgressionRequest): Observable<BaseResultDto<boolean>> {
    const params = new HttpParams().set('itemId', itemId.toString());
    return this.http.post<BaseResultDto<boolean>>(`${this.apiUrl}/TodoList/${id}/RegisterProgression`, request, { params });
  }
}
