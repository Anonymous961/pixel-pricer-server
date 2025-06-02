import express from "express";
import sendMailRoute from "./sendMail";
import scrapeRoute from "./scrape";

const router = express.Router();

router.use("/scrape", scrapeRoute)

router.use("/sendMail", sendMailRoute);

export default router;