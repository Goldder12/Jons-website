import app from "./app.js";
import "dotenv/config";
import prisma from "./config/db.js";

await prisma.$queryRaw`SELECT NOW()`;


const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
