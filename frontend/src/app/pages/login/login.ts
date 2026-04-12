import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

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

  constructor(private router: Router) {}

  async onLogin() {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.errorMessage = data.error;
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      this.router.navigate(["/"]);
    } catch (error) {
      this.errorMessage = "サーバーに接続できません";
    }
  }
}