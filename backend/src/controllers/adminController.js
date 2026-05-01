import { demoActivity } from "../data/db.js";
import { demoStudents } from "../data/db.js";

export async function getDashboardData(req, res) {
  return res.status(200).json({
    message: "Dashboard data retrieved successfully!",
    data: {
      activity: demoActivity,
      students: demoStudents,
    },
  });
}