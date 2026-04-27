import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

app.use("/api/auth", authRoute);


export default app;