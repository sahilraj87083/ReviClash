import { ContestParticipant } from "../models/contestParticipant.model.js";
import { finalizeContestSubmissionService } from "./contestParticipant.services.js"

const autoSubmitExpiredParticipants = async () => {
  const now = new Date();

  const expiredParticipants = await ContestParticipant.aggregate([
        {
            $match: {
                submissionStatus: "not_submitted",
                startedAt: { $ne: null }
            }
        },
        {
            $lookup: {
                from: "contests",
                localField: "contestId",
                foreignField: "_id",
                as: "contest"
            }
        },
        { $unwind: "$contest" },
        {
            $addFields: {
                deadline: {
                    $add: [
                        "$startedAt",
                        { $multiply: ["$contest.durationInMin", 60000] }
                    ]
                }
            }
        },
        {
            $match: {
                deadline: { $lte: now }
            }
        },
        {
            $project: {
                _id: 1,
                contestId: 1,
                userId: 1,
                contest: 1
            }
        }
    ]);

    if (expiredParticipants.length === 0) return;

    for (const p of expiredParticipants) {
        try {
            await finalizeContestSubmissionService({
                contest: p.contest,
                participant: p,
                userId: p.userId,
                attempts: null   // auto-submit → read DB attempts
            });
        } catch (err) {
            console.error("Auto-submit failed for participant", p._id, err);
        }
    }
};



export {
    autoSubmitExpiredParticipants
}