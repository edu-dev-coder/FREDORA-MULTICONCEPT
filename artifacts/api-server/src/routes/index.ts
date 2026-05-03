import { Router, type IRouter } from "express";
import healthRouter from "./health";
import divisionsRouter from "./divisions";
import homepageRouter from "./homepage";
import messagesRouter from "./messages";
import adminRouter from "./admin";
import storageRouter from "./storage";
import galleryRouter from "./gallery";
import productsRouter from "./products";
import testimonialsRouter from "./testimonials";
import newsletterRouter from "./newsletter";
import heroSlidesRouter from "./hero-slides";
import servicesRouter from "./services";
import postsRouter from "./posts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(divisionsRouter);
router.use(homepageRouter);
router.use(messagesRouter);
router.use(adminRouter);
router.use(storageRouter);
router.use(galleryRouter);
router.use(productsRouter);
router.use(testimonialsRouter);
router.use(newsletterRouter);
router.use(heroSlidesRouter);
router.use(servicesRouter);
router.use(postsRouter);

export default router;
