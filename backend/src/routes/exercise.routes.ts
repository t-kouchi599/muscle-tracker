import { Router, Request, Response } from "express";
import { ExerciseService } from "../services/exercise.service";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const exercises = await ExerciseService.findAll();
    res.json(exercises);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/muscle-group/:id", async (req: Request, res: Response) => {
  try {
    const muscleGroupId = Number(req.params.id);
    const exercises = await ExerciseService.findByMuscleGroup(muscleGroupId);
    res.json(exercises);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, muscleGroupId } = req.body;

    if (!name || !muscleGroupId) {
      res.status(400).json({ error: "種目名と部位を入力してください" });
      return;
    }

    const exercise = await ExerciseService.create(name, muscleGroupId, req.userId);
    res.status(201).json(exercise);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;