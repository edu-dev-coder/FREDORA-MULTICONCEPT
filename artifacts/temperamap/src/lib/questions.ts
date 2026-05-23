export interface Question {
  id: number;
  text: string;
  temperament: "Sanguine" | "Choleric" | "Melancholic" | "Phlegmatic" | "bonus";
  bonusCategory?: "couples" | "school" | "corporate" | "child_3_5" | "child_6_9" | "preteen_10_12" | "teen_13_17";
}

export const CORE_QUESTIONS: Question[] = [
  { id: 0,  text: "I love meeting new people and rarely feel awkward in social settings", temperament: "Sanguine" },
  { id: 1,  text: "I set ambitious goals and pursue them relentlessly, even when it is hard", temperament: "Choleric" },
  { id: 2,  text: "I think very carefully through decisions before I act on them", temperament: "Melancholic" },
  { id: 3,  text: "I remain calm and composed even when everything around me feels chaotic", temperament: "Phlegmatic" },
  { id: 4,  text: "I tend to speak before fully thinking things through", temperament: "Sanguine" },
  { id: 5,  text: "I prefer to lead rather than follow when working in a group", temperament: "Choleric" },
  { id: 6,  text: "I hold myself and others to very high standards of quality", temperament: "Melancholic" },
  { id: 7,  text: "I am a patient listener and people often come to me to talk things through", temperament: "Phlegmatic" },
  { id: 8,  text: "I get bored quickly when I have to do the same thing repeatedly", temperament: "Sanguine" },
  { id: 9,  text: "I make decisions quickly and confidently, even without all the facts", temperament: "Choleric" },
  { id: 10, text: "I notice small errors and details that most people around me miss", temperament: "Melancholic" },
  { id: 11, text: "I prefer peace and harmony in my surroundings over any kind of conflict", temperament: "Phlegmatic" },
  { id: 12, text: "People would describe me as enthusiastic, cheerful, and full of energy", temperament: "Sanguine" },
  { id: 13, text: "I become frustrated when others work too slowly or fail to meet expectations", temperament: "Choleric" },
  { id: 14, text: "I feel criticism deeply and reflect on it long after it was given", temperament: "Melancholic" },
  { id: 15, text: "I tend to put others' needs ahead of my own without being asked", temperament: "Phlegmatic" },
  { id: 16, text: "I find it easy to cheer people up when they are feeling down or discouraged", temperament: "Sanguine" },
  { id: 17, text: "I take charge naturally and confidently when a crisis or emergency arises", temperament: "Choleric" },
  { id: 18, text: "I work best in a neat, organized, and structured environment", temperament: "Melancholic" },
  { id: 19, text: "I am not easily upset or rattled by sudden or unexpected changes", temperament: "Phlegmatic" },
  { id: 20, text: "I make friends quickly and rarely run out of things to talk about", temperament: "Sanguine" },
  { id: 21, text: "I am direct in how I communicate and rarely sugarcoat the truth", temperament: "Choleric" },
  { id: 22, text: "I tend to dwell on past mistakes and wonder how I could have done better", temperament: "Melancholic" },
  { id: 23, text: "I adjust to others' preferences rather than insisting on my own way", temperament: "Phlegmatic" },
  { id: 24, text: "I enjoy being the center of attention at social events and gatherings", temperament: "Sanguine" },
  { id: 25, text: "I believe the outcome and results matter more than the process used to get there", temperament: "Choleric" },
  { id: 26, text: "I find it difficult to begin something if I cannot do it correctly the first time", temperament: "Melancholic" },
  { id: 27, text: "I am reliable and consistently follow through on what I have promised", temperament: "Phlegmatic" },
  { id: 28, text: "I follow my heart more than my head when making important decisions", temperament: "Sanguine" },
  { id: 29, text: "I trust my own judgment, even when the people around me disagree", temperament: "Choleric" },
  { id: 30, text: "I feel emotions very deeply, even when I do not show them on the outside", temperament: "Melancholic" },
  { id: 31, text: "I am slow to anger and rarely lose my temper with others", temperament: "Phlegmatic" },
  { id: 32, text: "I am easily drawn toward new, exciting, or stimulating experiences", temperament: "Sanguine" },
  { id: 33, text: "I am competitive and motivated strongly by the desire to win or come out ahead", temperament: "Choleric" },
  { id: 34, text: "I prefer a small number of deep friendships over a large circle of acquaintances", temperament: "Melancholic" },
  { id: 35, text: "I work at a steady, consistent pace rather than in short intense bursts of effort", temperament: "Phlegmatic" },
  { id: 36, text: "I forgive others easily and rarely hold onto grudges or resentment", temperament: "Sanguine" },
  { id: 37, text: "I prefer to handle things myself rather than delegate, because I trust my own way", temperament: "Choleric" },
  { id: 38, text: "I prefer to plan things carefully in advance rather than improvise on the spot", temperament: "Melancholic" },
  { id: 39, text: "I would rather give in than start a conflict, even when I know I am right", temperament: "Phlegmatic" },
  { id: 40, text: "I love telling stories and making the people around me laugh", temperament: "Sanguine" },
  { id: 41, text: "I become impatient when conversations or meetings go on longer than necessary", temperament: "Choleric" },
  { id: 42, text: "I use lists, detailed notes, or schedules to stay organized and on top of things", temperament: "Melancholic" },
  { id: 43, text: "I am a calming presence in groups and help prevent situations from escalating", temperament: "Phlegmatic" },
  { id: 44, text: "I stay optimistic and expect good outcomes, even in difficult or uncertain situations", temperament: "Sanguine" },
  { id: 45, text: "I rarely show emotional vulnerability or weakness to those around me", temperament: "Choleric" },
  { id: 46, text: "I find myself drawn to music, art, literature, or things of deep beauty", temperament: "Melancholic" },
  { id: 47, text: "I prefer familiar, predictable routines over exciting but unpredictable situations", temperament: "Phlegmatic" },
  { id: 48, text: "I prefer lively social environments and group activities over being alone", temperament: "Sanguine" },
  { id: 49, text: "Once I decide to do something, I am extremely hard to discourage or stop", temperament: "Choleric" },
  { id: 50, text: "I am often self-critical and sometimes struggle with feelings of not being good enough", temperament: "Melancholic" },
  { id: 51, text: "I have a small, close circle of deeply trusted friends rather than many casual ones", temperament: "Phlegmatic" },
  { id: 52, text: "I can energize and motivate a group of people just by being present in the room", temperament: "Sanguine" },
  { id: 53, text: "I perform best when I have clear authority and the freedom to work independently", temperament: "Choleric" },
  { id: 54, text: "I have a rich imagination and a vivid inner world of thoughts and ideas", temperament: "Melancholic" },
  { id: 55, text: "I tend to prioritize keeping the peace over expressing what I truly want", temperament: "Phlegmatic" },
  { id: 56, text: "I often feel restless when nothing exciting or stimulating is happening around me", temperament: "Sanguine" },
  { id: 57, text: "I am confident in my abilities and back myself fully, even under pressure", temperament: "Choleric" },
  { id: 58, text: "I am a private person and very selective about who I truly open up to", temperament: "Melancholic" },
  { id: 59, text: "I stay calm and composed during disagreements and rarely raise my voice", temperament: "Phlegmatic" },
];

export const COUPLES_BONUS_QUESTIONS: Question[] = [
  { id: 60, text: "I bring energy and enthusiasm into the relationship and keep things fun and lively", temperament: "bonus", bonusCategory: "couples" },
  { id: 61, text: "I take charge of decisions and naturally lead the direction of our relationship", temperament: "bonus", bonusCategory: "couples" },
  { id: 62, text: "I think deeply about our relationship and notice subtle changes in my partner's mood", temperament: "bonus", bonusCategory: "couples" },
  { id: 63, text: "I am the calm, steady presence that keeps the relationship peaceful during conflict", temperament: "bonus", bonusCategory: "couples" },
  { id: 64, text: "I get bored if our routine becomes too predictable and need variety to stay engaged", temperament: "bonus", bonusCategory: "couples" },
  { id: 65, text: "I set clear goals for our future together and expect us to work toward them", temperament: "bonus", bonusCategory: "couples" },
  { id: 66, text: "I feel hurt when my partner is insensitive or dismissive of my emotional needs", temperament: "bonus", bonusCategory: "couples" },
  { id: 67, text: "I prefer to avoid conflict and keep the peace rather than address every issue directly", temperament: "bonus", bonusCategory: "couples" },
  { id: 68, text: "I express love through physical affection, quality time, and being fully present", temperament: "bonus", bonusCategory: "couples" },
  { id: 69, text: "I need my partner to give me space to process before discussing sensitive topics", temperament: "bonus", bonusCategory: "couples" },
];

export const CORPORATE_BONUS_QUESTIONS: Question[] = [
  { id: 60, text: "I build strong professional relationships and keep the office atmosphere positive and energised", temperament: "bonus", bonusCategory: "corporate" as const },
  { id: 61, text: "I drive projects forward decisively and hold team members accountable for deadlines", temperament: "bonus", bonusCategory: "corporate" as const },
  { id: 62, text: "I produce high-quality, detail-oriented work and spot errors others miss before submission", temperament: "bonus", bonusCategory: "corporate" as const },
  { id: 63, text: "I remain calm under pressure and help stabilise the team during tight deadlines or crises", temperament: "bonus", bonusCategory: "corporate" as const },
  { id: 64, text: "I thrive in fast-paced environments with changing priorities and new challenges", temperament: "bonus", bonusCategory: "corporate" as const },
  { id: 65, text: "I prefer direct, no-nonsense communication and get frustrated by vague or lengthy discussions", temperament: "bonus", bonusCategory: "corporate" as const },
  { id: 66, text: "I work best with clear instructions, defined processes, and predictable workflows", temperament: "bonus", bonusCategory: "corporate" as const },
  { id: 67, text: "I am comfortable delegating tasks and trusting others to deliver without micromanaging", temperament: "bonus", bonusCategory: "corporate" as const },
  { id: 68, text: "I prefer working in quiet, focused settings over noisy, collaborative open-plan offices", temperament: "bonus", bonusCategory: "corporate" as const },
  { id: 69, text: "I resolve workplace conflicts by listening to all sides and finding fair compromises", temperament: "bonus", bonusCategory: "corporate" as const },
];

export const CHILD_3_5_BONUS_QUESTIONS: Question[] = [
  { id: 60, text: "I love playing games and activities with lots of other children around me", temperament: "bonus", bonusCategory: "child_3_5" },
  { id: 61, text: "I like to be the one who decides what game we play or what toy we use", temperament: "bonus", bonusCategory: "child_3_5" },
  { id: 62, text: "I feel upset or sad when someone laughs at me or makes fun of what I did", temperament: "bonus", bonusCategory: "child_3_5" },
  { id: 63, text: "I am happiest when my day follows the same routine every morning and night", temperament: "bonus", bonusCategory: "child_3_5" },
  { id: 64, text: "I get very excited and happy when something new or fun happens", temperament: "bonus", bonusCategory: "child_3_5" },
  { id: 65, text: "I want to win every game or race and feel frustrated when I lose", temperament: "bonus", bonusCategory: "child_3_5" },
  { id: 66, text: "I notice when someone is sad and try to make them feel better", temperament: "bonus", bonusCategory: "child_3_5" },
  { id: 67, text: "I like to play alone with my favorite toy for a long time without getting bored", temperament: "bonus", bonusCategory: "child_3_5" },
  { id: 68, text: "I get scared or worried when I have to try something I have never done before", temperament: "bonus", bonusCategory: "child_3_5" },
  { id: 69, text: "I love giving hugs and being close to the people I care about", temperament: "bonus", bonusCategory: "child_3_5" },
];

export const CHILD_6_9_BONUS_QUESTIONS: Question[] = [
  { id: 60, text: "I learn best when I can work together with other students on a shared task", temperament: "bonus", bonusCategory: "child_6_9" },
  { id: 61, text: "I like to have clear instructions and know exactly what is expected before I start a task", temperament: "bonus", bonusCategory: "child_6_9" },
  { id: 62, text: "I feel nervous or uncomfortable when I am called on suddenly in class", temperament: "bonus", bonusCategory: "child_6_9" },
  { id: 63, text: "I enjoy creative projects where I have the freedom to express my own ideas", temperament: "bonus", bonusCategory: "child_6_9" },
  { id: 64, text: "I prefer to finish one subject or task completely before moving on to the next", temperament: "bonus", bonusCategory: "child_6_9" },
  { id: 65, text: "I get along easily with most of the students in my class", temperament: "bonus", bonusCategory: "child_6_9" },
  { id: 66, text: "I like being in charge or taking the lead when working on a group project", temperament: "bonus", bonusCategory: "child_6_9" },
  { id: 67, text: "I work hard to make sure my schoolwork is as complete and well-done as possible", temperament: "bonus", bonusCategory: "child_6_9" },
  { id: 68, text: "I prefer to keep my thoughts and feelings to myself rather than sharing them openly", temperament: "bonus", bonusCategory: "child_6_9" },
  { id: 69, text: "I feel energized and happy after spending time with my friends and classmates", temperament: "bonus", bonusCategory: "child_6_9" },
];

export const PRETEEN_10_12_BONUS_QUESTIONS: Question[] = [
  { id: 60, text: "I feel stressed when I have too much homework or school pressure at once", temperament: "bonus", bonusCategory: "preteen_10_12" },
  { id: 61, text: "I prefer working in a group with friends rather than doing assignments alone", temperament: "bonus", bonusCategory: "preteen_10_12" },
  { id: 62, text: "I like to have a clear plan for my schoolwork and feel uncomfortable when things are disorganized", temperament: "bonus", bonusCategory: "preteen_10_12" },
  { id: 63, text: "I enjoy being the one who organizes activities or plans events for my friend group", temperament: "bonus", bonusCategory: "preteen_10_12" },
  { id: 64, text: "I feel deeply hurt when a friend excludes me or stops talking to me suddenly", temperament: "bonus", bonusCategory: "preteen_10_12" },
  { id: 65, text: "I get bored quickly when a lesson is too slow or when I already know the material", temperament: "bonus", bonusCategory: "preteen_10_12" },
  { id: 66, text: "I prefer to think carefully about my answers before speaking up in class", temperament: "bonus", bonusCategory: "preteen_10_12" },
  { id: 67, text: "I feel calm and steady even when my friends are arguing or the classroom gets loud", temperament: "bonus", bonusCategory: "preteen_10_12" },
  { id: 68, text: "I enjoy trying new hobbies, sports, or clubs even if I might not be good at them at first", temperament: "bonus", bonusCategory: "preteen_10_12" },
  { id: 69, text: "I find it hard to move on when someone criticizes my work or corrects me in front of others", temperament: "bonus", bonusCategory: "preteen_10_12" },
];

export const TEEN_13_17_BONUS_QUESTIONS: Question[] = [
  { id: 60, text: "I feel strongly about my personal beliefs and values and am willing to stand up for them", temperament: "bonus", bonusCategory: "teen_13_17" },
  { id: 61, text: "I prefer making my own decisions about my future rather than following what others expect of me", temperament: "bonus", bonusCategory: "teen_13_17" },
  { id: 62, text: "I feel anxious about what will happen after I finish school and what career I should pursue", temperament: "bonus", bonusCategory: "teen_13_17" },
  { id: 63, text: "I enjoy being around a large group of friends and feel lonely when I am alone for too long", temperament: "bonus", bonusCategory: "teen_13_17" },
  { id: 64, text: "I like to take charge in group projects, team sports, or student organizations", temperament: "bonus", bonusCategory: "teen_13_17" },
  { id: 65, text: "I often reflect deeply on my emotions and try to understand why I feel the way I do", temperament: "bonus", bonusCategory: "teen_13_17" },
  { id: 66, text: "I prefer a small circle of close, trusted friends over being popular with many people", temperament: "bonus", bonusCategory: "teen_13_17" },
  { id: 67, text: "I stay calm and supportive when my friends are going through difficult times or stress", temperament: "bonus", bonusCategory: "teen_13_17" },
  { id: 68, text: "I get frustrated when adults do not take my opinions seriously or treat me like a child", temperament: "bonus", bonusCategory: "teen_13_17" },
  { id: 69, text: "I feel energized by new experiences, travel, challenges, and stepping outside my comfort zone", temperament: "bonus", bonusCategory: "teen_13_17" },
];

export function getQuestionsForTestType(testType: string): Question[] {
  if (testType === "couples_test") return [...CORE_QUESTIONS, ...COUPLES_BONUS_QUESTIONS];
  if (testType === "corporate_team") return [...CORE_QUESTIONS, ...CORPORATE_BONUS_QUESTIONS];
  if (testType === "child_3_5") return [...CORE_QUESTIONS, ...CHILD_3_5_BONUS_QUESTIONS];
  if (testType === "child_6_9") return [...CORE_QUESTIONS, ...CHILD_6_9_BONUS_QUESTIONS];
  if (testType === "preteen_10_12") return [...CORE_QUESTIONS, ...PRETEEN_10_12_BONUS_QUESTIONS];
  if (testType === "teen_13_17") return [...CORE_QUESTIONS, ...TEEN_13_17_BONUS_QUESTIONS];
  return CORE_QUESTIONS;
}

export function computeTemperament(answers: Record<string, number>) {
  const sanguineQs  = [0,  4,  8,  12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56];
  const cholericQs  = [1,  5,  9,  13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57];
  const melancholicQs = [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58];
  const phlegmaticQs  = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59];

  const sum = (indices: number[]) =>
    indices.reduce((acc, i) => acc + (answers[i.toString()] ?? 0), 0);

  const scores = {
    Sanguine:   sum(sanguineQs),
    Choleric:   sum(cholericQs),
    Melancholic: sum(melancholicQs),
    Phlegmatic: sum(phlegmaticQs),
  };

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return {
    primaryTemp:   sorted[0][0],
    secondaryTemp: sorted[1][0],
    blend: `${sorted[0][0]}-${sorted[1][0]}`,
    results: scores as Record<string, number>,
  };
}

export const OPTIONS = [
  { value: 0, label: "Not at all like me" },
  { value: 1, label: "Slightly like me" },
  { value: 2, label: "Somewhat like me" },
  { value: 3, label: "Mostly like me" },
  { value: 4, label: "Very much like me" },
];
