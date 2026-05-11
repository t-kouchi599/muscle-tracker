import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";
import { WorkoutService } from "../services/workout.service";

const router = Router();

router.use(authMiddleware);

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { date, note } = req.body;
    if (!date) {
      res.status(400).json({ error: "日付を入力してください" });
      return;
    }
    const workout = await WorkoutService.create(req.userId!, date, note);
    res.status(201).json(workout);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const workouts = await WorkoutService.findAllByUser(req.userId!);
    res.json(workouts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const workout = await WorkoutService.findById(String(req.params.id), req.userId!);
    res.json(workout);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/:id/exercises", async (req: AuthRequest, res: Response) => {
  try {
    const { exerciseId, sortOrder } = req.body;
    if (!exerciseId) {
      res.status(400).json({ error: "種目を選択してください" });
      return;
    }
    const workoutExercise = await WorkoutService.addExercise(
      String(req.params.id),
      exerciseId,
      sortOrder || 0
    );
    res.status(201).json(workoutExercise);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/:id/exercises/:exerciseId/sets", async (req: AuthRequest, res: Response) => {
  try {
    const { setNumber, weight, reps } = req.body;
    if (!weight || !reps) {
      res.status(400).json({ error: "重量とレップ数を入力してください" });
      return;
    }
    const set = await WorkoutService.addSet(
      Number(req.params.exerciseId),
      setNumber || 1,
      weight,
      reps
    );
    res.status(201).json(set);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await WorkoutService.deleteWorkout(String(req.params.id), req.userId!);
    res.json({ message: "削除しました" });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:id/exercises/:exerciseId", async (req: AuthRequest, res: Response) => {
  try {
    await WorkoutService.removeExercise(Number(req.params.exerciseId));
    res.json({ message: "種目を削除しました" });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:id/exercises/:exerciseId/sets/:setId", async (req: AuthRequest, res: Response) => {
  try {
    await WorkoutService.removeSet(Number(req.params.setId));
    res.json({ message: "セットを削除しました" });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.put("/:id/exercises/:exerciseId/sets/:setId", async (req: AuthRequest, res: Response) => {
  try {
    const { weight, reps } = req.body;
    if (!weight || !reps) {
      res.status(400).json({ error: "重量とレップ数を入力してください" });
      return;
    }
    const set = await WorkoutService.updateSet(Number(req.params.setId), weight, reps);
    res.json(set);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;