import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

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

  constructor(private router: Router) {}

  async onRegister() {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          displayName: this.displayName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.errorMessage = data.error;
        this.successMessage = "";
        return;
      }

      this.successMessage = "登録完了！ログインページへ移動します...";
      this.errorMessage = "";
      setTimeout(() => this.router.navigate(["/login"]), 2000);
    } catch (error) {
      this.errorMessage = "サーバーに接続できません";
    }
  }
}