import { Router, type IRouter } from "express";
import healthRouter from "./health";
import divisionsRouter from "./divisions";
import homepageRouter from "./homepage";
import messagesRouter from "./messages";
import adminRouter from "./admin";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(divisionsRouter);
router.use(homepageRouter);
router.use(messagesRouter);
router.use(adminRouter);
router.use(storageRouter);

export default router;
