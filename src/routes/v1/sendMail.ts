import express from "express"
import { sendMail } from "../../services/smtp";

const router = express.Router();

router.post("/sendMail", async (req, res, next) => {
    try {
        const { from, to, subject, html } = req.body;
        if (!from || !to || !subject || !html) {
            // throw new Error("All fields are required");
            res.status(400).json({ message: "All fields are required", success: false });
            return;
        }
        const mailFields = { from, to, subject, html };
        await sendMail(mailFields);
        res.json({ message: "sent", success: true })
    } catch (err) {
        res.status(200).json(err);
        // next(err);
    }
})


export default router;