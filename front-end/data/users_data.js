export const usersStorageKey = "johns-users";

const defaultUsers = [
  {
    id: 1,
    role: "admin",
    firstName: "Admin",
    lastName: "User",
    username: "admin",
    phone: "+998900000001",
    email: "admin@johns.com",
    password: "12345",
    groupId: null,
    group: "Administration",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 2,
    role: "student",
    firstName: "John",
    lastName: "Doe",
    username: "john_doe",
    phone: "+998901234567",
    email: "john@example.com",
    password: "12345",
    groupId: "ielts-morning",
    group: "IELTS Morning Group",
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  {
    id: 3,
    role: "student",
    firstName: "Aziza",
    lastName: "Karimova",
    username: "aziza_karimova",
    phone: "+998901112233",
    email: "aziza@johns.com",
    password: "12345",
    groupId: "ielts-writing-lab",
    group: "IELTS Writing Lab",
    avatar: "https://i.pravatar.cc/150?img=32"
  },
  {
    id: 4,
    role: "student",
    firstName: "Muhammad",
    lastName: "Ali",
    username: "muhammad_ali",
    phone: "+998901223344",
    email: "muhammad@johns.com",
    password: "12345",
    groupId: "general-english-teens",
    group: "General English Teens",
    avatar: "https://i.pravatar.cc/150?img=15"
  },
  {
    id: 5,
    role: "student",
    firstName: "Lina",
    lastName: "Ahmed",
    username: "lina_ahmed",
    phone: "+998901334455",
    email: "lina@johns.com",
    password: "12345",
    groupId: "general-english-teens",
    group: "General English Teens",
    avatar: "https://i.pravatar.cc/150?img=23"
  },
  {
    id: 6,
    role: "student",
    firstName: "Sardor",
    lastName: "Xasanov",
    username: "sardor_xasanov",
    phone: "+998901445566",
    email: "sardor@johns.com",
    password: "12345",
    groupId: "grammar-focus",
    group: "Grammar Focus",
    avatar: "https://i.pravatar.cc/150?img=29"
  },
  {
    id: 7,
    role: "student",
    firstName: "Malika",
    lastName: "Noor",
    username: "malika_noor",
    phone: "+998901556677",
    email: "malika@johns.com",
    password: "12345",
    groupId: "speaking-booster",
    group: "Speaking Booster",
    avatar: "https://i.pravatar.cc/150?img=41"
  }
];

function cloneUsers(value) {
  return JSON.parse(JSON.stringify(value));
}

function persistUsers(nextUsers) {
  localStorage.setItem(usersStorageKey, JSON.stringify(nextUsers));
}

function readUsers() {
  try {
    const storedUsers = localStorage.getItem(usersStorageKey);
    if (!storedUsers) {
      const seededUsers = cloneUsers(defaultUsers);
      persistUsers(seededUsers);
      return seededUsers;
    }

    return cloneUsers(JSON.parse(storedUsers));
  } catch {
    const fallbackUsers = cloneUsers(defaultUsers);
    persistUsers(fallbackUsers);
    return fallbackUsers;
  }
}

export let users = readUsers();

export function getUsers() {
  users = readUsers();
  return users;
}

export function saveUsers(nextUsers) {
  users = cloneUsers(nextUsers);
  persistUsers(users);
  return users;
}

export function findUserByEmailAndPassword(email, password) {
  return getUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  ) || null;
}

export function findUserById(userId) {
  return getUsers().find((user) => user.id === userId) || null;
}

export function findUserByEmail(email) {
  return getUsers().find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findUserByUsername(username) {
  return getUsers().find((user) => user.username.toLowerCase() === username.toLowerCase()) || null;
}

export function registerUser(userData) {
  const nextUsers = getUsers();
  const nextId = nextUsers.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1;
  const nextUser = {
    id: nextId,
    role: "student",
    groupId: "ielts-morning",
    group: "IELTS Morning Group",
    avatar: "https://i.pravatar.cc/150?img=47",
    ...userData
  };

  nextUsers.push(nextUser);
  saveUsers(nextUsers);
  return nextUser;
}

export function updateUser(updatedUser) {
  const nextUsers = getUsers().map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user));
  saveUsers(nextUsers);
  return findUserById(updatedUser.id);
}
