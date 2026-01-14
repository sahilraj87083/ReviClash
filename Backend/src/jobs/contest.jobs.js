import cron from 'node-cron'
import { autoSubmitExpiredParticipants } from "../services/contestAutoSubmit.service.js";

cron.schedule("*/1 * * * *", async () => {
    try {
        await autoSubmitExpiredParticipants();
    } catch (err) {
        console.error("Auto-submit job failed", err);
    }
});