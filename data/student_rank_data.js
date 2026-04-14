import { groupsData } from "./group_data.js";

const studentPerformanceMap = {
  "Aziza Karimova": {
    fullName: "Aziza Karimova",
    attendance: "96%",
    streak: "12 lesson",
    completedLessons: 18,
    averageResult: "94%",
    strengths: ["Writing", "Reading", "Speaking"],
    needsWork: ["Listening"],
    taskStats: [
      { type: "Video", correct: 16, wrong: 2, note: "Video darslarni deyarli to'liq va vaqtida tugatadi." },
      { type: "Vocabulary", correct: 42, wrong: 5, note: "Yangi so'zlarni tez eslab qoladi." },
      { type: "Listening", correct: 19, wrong: 7, note: "Asosiy g'oyani ushlaydi, lekin detail savollarda xato qiladi." },
      { type: "Reading", correct: 24, wrong: 4, note: "Reading testlarda yuqori aniqlik bor." },
      { type: "Writing", correct: 14, wrong: 3, note: "Essay tuzilishi kuchli, small grammar xatolar qolgan." }
    ],
    lessonIssues: [
      { lesson: "Lesson 4", task: "Listening", status: "wrong", note: "Detail savollarda 3 ta xato qilgan." },
      { lesson: "Lesson 6", task: "Vocabulary", status: "partial", note: "Flashcard topshirig'ini chala yakunlagan." },
      { lesson: "Lesson 8", task: "Writing", status: "missed", note: "Essay draft topshirig'ini yubormagan." },
      { lesson: "Lesson 10", task: "Reading", status: "wrong", note: "Reading detail savollarida noto'g'ri javoblar bergan." },
      { lesson: "Lesson 11", task: "Video", status: "partial", note: "Video lessonning oxirgi qismini tugatmagan." }
    ]
  },
  "Jamshid Aliyev": {
    fullName: "Jamshid Aliyev",
    attendance: "91%",
    streak: "8 lesson",
    completedLessons: 15,
    averageResult: "88%",
    strengths: ["Reading", "Vocabulary"],
    needsWork: ["Speaking", "Listening"],
    taskStats: [
      { type: "Video", correct: 14, wrong: 3, note: "Video materialni yaxshi kuzatadi." },
      { type: "Vocabulary", correct: 38, wrong: 6, note: "Lug'at ishlari yaxshi, qayta takrorlash foydali." },
      { type: "Listening", correct: 16, wrong: 8, note: "Tez gapirilgan audio qismlar qiyin bo'lmoqda." },
      { type: "Reading", correct: 21, wrong: 5, note: "Matn tahlili barqaror." },
      { type: "Speaking", correct: 12, wrong: 6, note: "Javob beradi, lekin ishonchi hali to'liq emas." }
    ],
    lessonIssues: [
      { lesson: "Lesson 3", task: "Speaking", status: "partial", note: "Speaking response yarimta qolgan." },
      { lesson: "Lesson 5", task: "Listening", status: "wrong", note: "Audio bo'yicha asosiy javoblar noto'g'ri bo'lgan." },
      { lesson: "Lesson 7", task: "Writing", status: "missed", note: "Homework writing topshirig'ini topshirmagan." }
    ]
  },
  "Sevinch Nur": {
    fullName: "Sevinch Nur",
    attendance: "88%",
    streak: "5 lesson",
    completedLessons: 13,
    averageResult: "81%",
    strengths: ["Video"],
    needsWork: ["Speaking", "Writing"],
    taskStats: [
      { type: "Video", correct: 15, wrong: 4, note: "Video orqali mavzuni yaxshi tushunadi." },
      { type: "Vocabulary", correct: 28, wrong: 9, note: "Ko'p takrorlash bilan yaxshilanmoqda." },
      { type: "Listening", correct: 14, wrong: 8, note: "Asosiy mazmunni tushunadi." },
      { type: "Writing", correct: 9, wrong: 7, note: "Gap tuzishda yordam kerak." },
      { type: "Speaking", correct: 8, wrong: 8, note: "Ko'proq amaliyot talab qilinadi." }
    ],
    lessonIssues: [
      { lesson: "Lesson 2", task: "Speaking", status: "missed", note: "Speaking practicega ulanmagan." },
      { lesson: "Lesson 4", task: "Writing", status: "partial", note: "Sentence taskni oxirigacha bajarmagan." },
      { lesson: "Lesson 6", task: "Vocabulary", status: "wrong", note: "Vocabulary matchingda ko'p xato qilgan." }
    ]
  },
  "Amina Yusuf": {
    attendance: "94%",
    streak: "10 lesson",
    completedLessons: 16,
    averageResult: "90%",
    strengths: ["Vocabulary", "Reading"],
    needsWork: ["Listening"],
    taskStats: [
      { type: "Video", correct: 13, wrong: 2, note: "Video topshiriqlarni muntazam bajaradi." },
      { type: "Vocabulary", correct: 40, wrong: 4, note: "So'z boyligi kuchli." },
      { type: "Listening", correct: 15, wrong: 6, note: "Audio tafsilotlar ustida ishlash kerak." },
      { type: "Reading", correct: 20, wrong: 3, note: "Matn bilan ishlashi yaxshi." },
      { type: "Writing", correct: 12, wrong: 4, note: "Oddiy yozma mashqlarda yaxshi natija." }
    ],
    lessonIssues: [
      { lesson: "Lesson 5", task: "Listening", status: "wrong", note: "Listening detail savollarida adashgan." },
      { lesson: "Lesson 9", task: "Writing", status: "partial", note: "Yozma mashqning bir qismi tugallanmagan." }
    ]
  },
  "Bekzod Olim": {
    attendance: "90%",
    streak: "7 lesson",
    completedLessons: 14,
    averageResult: "85%",
    strengths: ["Video", "Listening"],
    needsWork: ["Writing"],
    taskStats: [
      { type: "Video", correct: 14, wrong: 3, note: "Video bloklarida faolligi yaxshi." },
      { type: "Vocabulary", correct: 31, wrong: 7, note: "O'rta darajada." },
      { type: "Listening", correct: 18, wrong: 5, note: "Listening yaxshi ketmoqda." },
      { type: "Reading", correct: 16, wrong: 5, note: "Matn tezligini oshirish kerak." },
      { type: "Writing", correct: 9, wrong: 6, note: "Writing hali sustroq." }
    ],
    lessonIssues: [
      { lesson: "Lesson 2", task: "Writing", status: "missed", note: "Writing homeworkni yuklamagan." },
      { lesson: "Lesson 6", task: "Reading", status: "partial", note: "Reading taskning yarmini ishlagan." }
    ]
  },
  "Kamila Nor": {
    attendance: "83%",
    streak: "4 lesson",
    completedLessons: 11,
    averageResult: "77%",
    strengths: ["Video"],
    needsWork: ["Homework", "Vocabulary"],
    taskStats: [
      { type: "Video", correct: 12, wrong: 4, note: "Video topshiriqlar bajarilgan." },
      { type: "Vocabulary", correct: 22, wrong: 10, note: "Lug'at bo'yicha orqada qolmoqda." },
      { type: "Listening", correct: 12, wrong: 7, note: "Oddiy audio topshiriqlarda o'rtacha." },
      { type: "Reading", correct: 13, wrong: 7, note: "Reading ustida ko'proq ishlash kerak." },
      { type: "Writing", correct: 8, wrong: 7, note: "Writing topshiriqlari to'liq yakunlanmagan." }
    ],
    lessonIssues: [
      { lesson: "Lesson 1", task: "Vocabulary", status: "wrong", note: "Vocabulary testda ko'p xato qilgan." },
      { lesson: "Lesson 3", task: "Writing", status: "partial", note: "Writing task yarimda qolgan." },
      { lesson: "Lesson 5", task: "Reading", status: "missed", note: "Reading topshirig'ini ochmagan." }
    ]
  },
  "Malika Noor": {
    attendance: "95%",
    streak: "11 lesson",
    completedLessons: 17,
    averageResult: "92%",
    strengths: ["Speaking", "Pronunciation"],
    needsWork: ["Writing"],
    taskStats: [
      { type: "Video", correct: 15, wrong: 2, note: "Video practice juda yaxshi." },
      { type: "Vocabulary", correct: 35, wrong: 4, note: "New words ishlatishi yaxshi." },
      { type: "Listening", correct: 20, wrong: 4, note: "Listening comprehension kuchli." },
      { type: "Reading", correct: 18, wrong: 4, note: "Barqaror natija." },
      { type: "Speaking", correct: 19, wrong: 2, note: "Speaking blokining eng kuchli o'quvchilaridan." }
    ],
    lessonIssues: [
      { lesson: "Lesson 7", task: "Writing", status: "partial", note: "Writing feedbackdan keyin qayta topshirish kerak." }
    ]
  },
  "Sardor Xasanov": {
    attendance: "93%",
    streak: "9 lesson",
    completedLessons: 16,
    averageResult: "89%",
    strengths: ["Grammar", "Speaking"],
    needsWork: ["Vocabulary"],
    taskStats: [
      { type: "Video", correct: 14, wrong: 3, note: "Video darslarni yaxshi kuzatadi." },
      { type: "Vocabulary", correct: 27, wrong: 8, note: "Vocabulary qayta ishlash kerak." },
      { type: "Listening", correct: 17, wrong: 5, note: "Listening o'rtacha-yaxshi." },
      { type: "Reading", correct: 19, wrong: 4, note: "Reading natijasi yaxshi." },
      { type: "Speaking", correct: 18, wrong: 3, note: "Speaking tasklarda faol." }
    ],
    lessonIssues: [
      { lesson: "Lesson 3", task: "Vocabulary", status: "wrong", note: "Word usage testda xatolar bo'lgan." },
      { lesson: "Lesson 8", task: "Listening", status: "partial", note: "Listening task oxirigacha tugallanmagan." }
    ]
  },
  "Lola Tursun": {
    attendance: "86%",
    streak: "6 lesson",
    completedLessons: 13,
    averageResult: "80%",
    strengths: ["Listening"],
    needsWork: ["Vocabulary", "Speaking"],
    taskStats: [
      { type: "Video", correct: 12, wrong: 4, note: "Video tasklar bajarilgan." },
      { type: "Vocabulary", correct: 21, wrong: 11, note: "Lug'at bo'yicha ancha ishlash kerak." },
      { type: "Listening", correct: 17, wrong: 5, note: "Listening nisbatan yaxshi." },
      { type: "Reading", correct: 14, wrong: 6, note: "Reading o'rtacha." },
      { type: "Speaking", correct: 9, wrong: 7, note: "Speakingda ishonch kamroq." }
    ],
    lessonIssues: [
      { lesson: "Lesson 2", task: "Vocabulary", status: "missed", note: "Vocabulary homework topshirilmagan." },
      { lesson: "Lesson 4", task: "Speaking", status: "partial", note: "Speaking answer qisqa va chala bo'lgan." },
      { lesson: "Lesson 6", task: "Reading", status: "wrong", note: "Reading savollarida xatolar ko'p." }
    ]
  },
  "Muhammad Ali": {
    attendance: "97%",
    streak: "14 lesson",
    completedLessons: 20,
    averageResult: "95%",
    strengths: ["Reading", "Leadership", "Vocabulary"],
    needsWork: ["Listening"],
    taskStats: [
      { type: "Video", correct: 17, wrong: 1, note: "Video darslarni doim vaqtida tugatadi." },
      { type: "Vocabulary", correct: 43, wrong: 3, note: "Vocabulary darajasi juda yaxshi." },
      { type: "Listening", correct: 18, wrong: 5, note: "Qiyin audioda ba'zi xatolar bor." },
      { type: "Reading", correct: 26, wrong: 2, note: "Reading eng kuchli taraflaridan." },
      { type: "Writing", correct: 15, wrong: 3, note: "Yozuv ishlari ham kuchli." }
    ],
    lessonIssues: [
      { lesson: "Lesson 5", task: "Listening", status: "wrong", note: "Complex audio savollarida 2 ta xato qilgan." },
      { lesson: "Lesson 9", task: "Writing", status: "partial", note: "Writing task revisioni tugallanmagan." }
    ]
  }
};

function buildFallbackPerformance(student, group) {
  const scoreValue = Number.parseInt(student.score, 10) || 75;
  const correctBase = Math.max(8, Math.round(scoreValue / 4));

  return {
    fullName: student.name,
    attendance: `${Math.min(98, Math.max(82, scoreValue))}%`,
    streak: `${Math.max(4, Math.round(scoreValue / 10))} lesson`,
    completedLessons: Math.max(10, Math.round(scoreValue / 5)),
    averageResult: `${Math.min(96, scoreValue)}%`,
    strengths: [group.goals?.[0] ?? "Reading", group.goals?.[1] ?? "Vocabulary"],
    needsWork: [group.goals?.[2] ?? "Listening"],
    taskStats: [
      { type: "Video", correct: correctBase, wrong: 4, note: "Video topshiriqlarda yaxshi qatnashadi." },
      { type: "Vocabulary", correct: correctBase + 8, wrong: 6, note: "Vocabulary bo'yicha o'rtacha-yaxshi natija." },
      { type: "Listening", correct: correctBase - 2, wrong: 7, note: "Listening detail savollarida adashadi." },
      { type: "Reading", correct: correctBase + 2, wrong: 5, note: "Reading bo'yicha barqaror." },
      { type: "Writing", correct: correctBase - 1, wrong: 6, note: "Writingga ko'proq mashq kerak." }
    ],
    lessonIssues: [
      { lesson: "Lesson 2", task: "Vocabulary", status: "wrong", note: "Vocabulary topshirig'ida xatolar bo'lgan." },
      { lesson: "Lesson 4", task: "Writing", status: "partial", note: "Writing topshirig'i chala qolgan." },
      { lesson: "Lesson 5", task: "Listening", status: "missed", note: "Listening mashqi bajarilmagan." }
    ]
  };
}

export const studentRankData = groupsData.flatMap((group) =>
  group.students.map((student) => {
    const performance = studentPerformanceMap[student.name] ?? buildFallbackPerformance(student, group);
    return {
      id: `${group.id}-${student.name.toLowerCase().replaceAll(" ", "-")}`,
      firstName: student.name.split(" ")[0],
      lastName: student.name.split(" ").slice(1).join(" ") || student.name.split(" ")[0],
      fullName: performance.fullName ?? student.name,
      groupId: group.id,
      groupTitle: group.title,
      groupLevel: group.level,
      groupSchedule: group.subtitle,
      teacher: group.teacher,
      room: group.room,
      status: student.status,
      score: student.score,
      attendance: performance.attendance,
      streak: performance.streak,
      completedLessons: performance.completedLessons,
      averageResult: performance.averageResult,
      strengths: performance.strengths,
      needsWork: performance.needsWork,
      taskStats: performance.taskStats,
      lessonIssues: performance.lessonIssues
    };
  })
);

export function getStudentById(studentId) {
  return studentRankData.find((student) => student.id === studentId) || null;
}
