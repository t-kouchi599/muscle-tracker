import { Router, Request, Response } from "express";
import { MuscleGroupService } from "../services/muscle-group.service";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const muscleGroups = await MuscleGroupService.findAll();
    res.json(muscleGroups);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;