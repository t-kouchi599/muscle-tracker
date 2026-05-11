import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login";
import { RegisterComponent } from "./pages/register/register";
import { HomeComponent } from "./pages/home/home";
import { WorkoutDetailComponent } from "./pages/workout-detail/workout-detail";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "workouts/:id", component: WorkoutDetailComponent },
  { path: "", component: HomeComponent },
];