import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-done-screen',
  templateUrl: './notificationdonescreen.component.html',
  styleUrls: ['./notificationdonescreen.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class NotificationdonescreenComponent implements OnInit {
  tasks: any[] = [];
  userEmail:any;
  sessionToken:any;
  backgroundImageUrl = './assets/Background.jpg'; // Adjust the path as needed

  constructor(
    private apiService: ApiConnectionService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = this.userService.getUserEmail() || null;
    this.sessionToken = this.userService.getSessionToken() || null;
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.apiService.fetchTasks(this.sessionToken, this.userEmail).subscribe(
      (tasks: any[]) => this.tasks = tasks,
      error => console.error('Error fetching tasks', error)
    );
  }

  markTaskAsDone(taskId: string): void {
    this.apiService.markTaskAsDone(this.sessionToken, taskId).subscribe(
      () => this.fetchTasks(),
      error => console.error('Error marking task as done', error)
    );
  }

  goBack(): void {
    window.history.back();
  }
}
