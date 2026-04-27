import app from "./app.js";

const PORT = process.env.PORT || 5501;

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
