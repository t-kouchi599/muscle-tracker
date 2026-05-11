import { Component, ChangeDetectorRef } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: "./login.html",
  styleUrls: ["./login.css"],
})
export class LoginComponent {
  email = "";
  password = "";
  errorMessage = "";

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin() {
    this.http.post<any>("http://localhost:3000/api/auth/login", {
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        this.router.navigate(["/"]);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "ログインに失敗しました";
        this.cdr.detectChanges();
      },
    });
  }
}