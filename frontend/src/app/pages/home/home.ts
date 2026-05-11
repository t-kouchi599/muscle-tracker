import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./home.html",
  styleUrls: ["./home.css"],
})
export class HomeComponent implements OnInit {
  newDate = "";
  newNote = "";
  workouts: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.router.navigate(["/login"]);
      return;
    }
    this.loadWorkouts();
  }

  loadWorkouts() {
    this.loading = true;
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>("http://localhost:3000/api/workouts", { headers }).subscribe({
      next: (data) => {
        this.workouts = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(["/login"]);
      },
    });
  }

  createWorkout() {
    if (!this.newDate) return;

    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    this.http.post("http://localhost:3000/api/workouts", { date: this.newDate, note: this.newNote }, { headers }).subscribe({
      next: () => {
        this.newDate = "";
        this.newNote = "";
        this.loadWorkouts();
      },
    });
  }

  goToDetail(workoutId: string) {
    this.router.navigate(["/workouts", workoutId]);
  }

  deleteWorkout(workoutId: string) {
    if (!confirm("この記録を削除しますか？")) return;

    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`http://localhost:3000/api/workouts/${workoutId}`, { headers }).subscribe({
      next: () => {
        this.loadWorkouts();
      },
    });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(["/login"]);
  }
}