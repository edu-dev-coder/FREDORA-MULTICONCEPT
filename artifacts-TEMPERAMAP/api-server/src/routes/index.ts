import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profilesRouter from "./profiles";
import testsRouter from "./tests";
import paymentsRouter from "./payments";
import reportsRouter from "./reports";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profilesRouter);
router.use(testsRouter);
router.use(paymentsRouter);
router.use(reportsRouter);
router.use(adminRouter);

export default router;
