import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-workout-detail",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./workout-detail.html",
  styleUrls: ["./workout-detail.css"],
})
export class WorkoutDetailComponent implements OnInit {
  workout: any = null;
  muscleGroups: any[] = [];
  filteredExercises: any[] = [];
  selectedMuscleGroupId = "";
  selectedExerciseId = "";
  newWeight: { [key: number]: number } = {};
  newReps: { [key: number]: number } = {};
  editingSetId: number | null = null;
  editWeight = 0;
  editReps = 0;

  constructor(
    private route: ActivatedRoute,
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
    this.loadWorkout();
    this.loadMuscleGroups();
  }

  private getHeaders() {
    const token = localStorage.getItem("token");
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  }

  loadWorkout() {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const id = this.route.snapshot.paramMap.get("id");

    this.http.get<any>(`http://localhost:3000/api/workouts/${id}`, { headers }).subscribe({
      next: (data) => {
        this.workout = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.router.navigate(["/"]);
      },
    });
  }

  loadMuscleGroups() {
    this.http.get<any[]>("http://localhost:3000/api/muscle-groups").subscribe({
      next: (data) => {
        this.muscleGroups = data;
        this.cdr.detectChanges();
      },
    });
  }

  onMuscleGroupChange() {
    if (!this.selectedMuscleGroupId) {
      this.filteredExercises = [];
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/exercises/muscle-group/${this.selectedMuscleGroupId}`).subscribe({
      next: (data) => {
        this.filteredExercises = data;
        this.selectedExerciseId = "";
        this.cdr.detectChanges();
      },
    });
  }

  addExercise() {
    const sortOrder = (this.workout.workoutExercises?.length || 0) + 1;

    this.http.post(
      `http://localhost:3000/api/workouts/${this.workout.id}/exercises`,
      { exerciseId: Number(this.selectedExerciseId), sortOrder },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.selectedMuscleGroupId = "";
        this.selectedExerciseId = "";
        this.filteredExercises = [];
        this.loadWorkout();
      },
    });
  }

  addSet(workoutExerciseId: number) {
    const weight = this.newWeight[workoutExerciseId];
    const reps = this.newReps[workoutExerciseId];
    if (!weight || !reps) return;

    const we = this.workout.workoutExercises.find(
      (w: any) => w.id === workoutExerciseId
    );
    const setNumber = (we?.sets?.length || 0) + 1;

    this.http.post(
      `http://localhost:3000/api/workouts/${this.workout.id}/exercises/${workoutExerciseId}/sets`,
      { setNumber, weight, reps },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.newWeight[workoutExerciseId] = 0;
        this.newReps[workoutExerciseId] = 0;
        this.loadWorkout();
      },
    });
  }

  removeExercise(workoutExerciseId: number) {
    if (!confirm("この種目を削除しますか？")) return;

    this.http.delete(
      `http://localhost:3000/api/workouts/${this.workout.id}/exercises/${workoutExerciseId}`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.loadWorkout();
      },
    });
  }

  removeSet(workoutExerciseId: number, setId: number) {
    if (!confirm("このセットを削除しますか？")) return;

    this.http.delete(
      `http://localhost:3000/api/workouts/${this.workout.id}/exercises/${workoutExerciseId}/sets/${setId}`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.loadWorkout();
      },
    });
  }

  startEdit(set: any) {
    this.editingSetId = set.id;
    this.editWeight = set.weight;
    this.editReps = set.reps;
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.editingSetId = null;
    this.cdr.detectChanges();
  }

  saveEdit(workoutExerciseId: number, setId: number) {
    this.http.put(
      `http://localhost:3000/api/workouts/${this.workout.id}/exercises/${workoutExerciseId}/sets/${setId}`,
      { weight: this.editWeight, reps: this.editReps },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.editingSetId = null;
        this.loadWorkout();
      },
    });
  }

  goBack() {
    this.router.navigate(["/"]);
  }
}