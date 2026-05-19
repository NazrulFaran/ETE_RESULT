import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cuetRouter from "./cuet";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cuetRouter);

export default router;
