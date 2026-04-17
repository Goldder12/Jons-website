const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, "..", "front-end");
const HTML_DIR = path.join(FRONTEND_DIR, "html");
const USERS_FILE = path.join(__dirname, "data", "users.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(FRONTEND_DIR));

async function readUsers() {
  const file = await fs.readFile(USERS_FILE, "utf8");
  return JSON.parse(file);
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function validateRegisterPayload(payload) {
  const fields = ["firstName", "lastName", "username", "phone", "email", "password"];
  const missingField = fields.find((field) => !String(payload[field] || "").trim());

  if (missingField) {
    return `${missingField} is required`;
  }

  if (!/^\S+@\S+\.\S+$/.test(String(payload.email).trim())) {
    return "Valid email is required";
  }

  if (String(payload.password).trim().length < 5) {
    return "Password must be at least 5 characters";
  }

  return "";
}

app.post("/api/register", async (req, res) => {
  try {
    const validationError = validateRegisterPayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const users = await readUsers();
    const email = String(req.body.email).trim().toLowerCase();
    const username = String(req.body.username).trim().toLowerCase();

    if (users.some((user) => user.email.toLowerCase() === email)) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    if (users.some((user) => user.username.toLowerCase() === username)) {
      return res.status(409).json({ success: false, message: "Username already exists" });
    }

    const nextUser = {
      id: users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1,
      role: "student",
      firstName: String(req.body.firstName).trim(),
      lastName: String(req.body.lastName).trim(),
      username: String(req.body.username).trim(),
      phone: String(req.body.phone).trim(),
      email,
      password: String(req.body.password).trim(),
      group: "IELTS Intermediate",
      avatar: "https://i.pravatar.cc/150?img=47"
    };

    users.push(nextUser);
    await writeUsers(users);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: sanitizeUser(nextUser)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to register user"
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const users = await readUsers();
    const matchedUser = users.find(
      (user) => user.email.toLowerCase() === email && user.password === password
    );

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: sanitizeUser(matchedUser)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login"
    });
  }
});

app.post("/api/change-password", async (req, res) => {
  try {
    const userId = Number(req.body.userId);
    const currentPassword = String(req.body.currentPassword || "").trim();
    const newPassword = String(req.body.newPassword || "").trim();

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid user id is required"
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters"
      });
    }

    const users = await readUsers();
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (users[userIndex].password !== currentPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password incorrect"
      });
    }

    users[userIndex] = {
      ...users[userIndex],
      password: newPassword
    };

    await writeUsers(users);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      user: sanitizeUser(users[userIndex])
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to change password"
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(HTML_DIR, "index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(HTML_DIR, "index.html"));
});

app.get("/student.html", (req, res) => {
  res.sendFile(path.join(HTML_DIR, "student.html"));
});

app.listen(PORT, () => {
  console.log(`Johns server running on http://localhost:${PORT}`);
});
