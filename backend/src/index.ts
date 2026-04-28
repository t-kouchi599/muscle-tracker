import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";
import muscleGroupRoutes from "./routes/muscle-group.routes";
import exerciseRoutes from "./routes/exercise.routes";
import workoutRoutes from "./routes/workout.routes";
import { MuscleGroupService } from "./services/muscle-group.service";
import { ExerciseService } from "./services/exercise.service";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/muscle-groups", muscleGroupRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts", workoutRoutes);

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");
    await MuscleGroupService.seed();
    await ExerciseService.seed();
    console.log("Seed data initialized");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

export default app;