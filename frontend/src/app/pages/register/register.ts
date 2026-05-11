import { Component, ChangeDetectorRef } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: "./register.html",
  styleUrls: ["./register.css"],
})
export class RegisterComponent {
  displayName = "";
  email = "";
  password = "";
  errorMessage = "";
  successMessage = "";

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  onRegister() {
    this.http.post<any>("http://localhost:3000/api/auth/register", {
      email: this.email,
      password: this.password,
      displayName: this.displayName,
    }).subscribe({
      next: () => {
        this.successMessage = "登録完了！ログインページへ移動します...";
        this.errorMessage = "";
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(["/login"]), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "登録に失敗しました";
        this.successMessage = "";
        this.cdr.detectChanges();
      },
    });
  }
}