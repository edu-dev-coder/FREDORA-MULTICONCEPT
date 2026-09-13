export type Temperament = "Sanguine" | "Choleric" | "Melancholic" | "Phlegmatic";

export interface AdultLearningProfile {
  style: string;
  description: string;
  primaryModality: string;
  studyMethods: string[];
  idealEnvironment: string;
  retention: string;
  avoid: string[];
  tools: string[];
}

export const ADULT_LEARNING: Record<Temperament, AdultLearningProfile> = {
  Sanguine: {
    style: "The Interactive Social Learner",
    description: "You learn best when learning is alive — through conversation, collaboration, and energy. Your mind lights up when you can talk through ideas, teach what you know, and turn material into stories. Isolation drains your learning; connection fuels it. If you can make studying a social act, you will absorb and retain far more than you ever will alone.",
    primaryModality: "Social + Verbal",
    studyMethods: [
      "Explain new concepts out loud to a friend, partner, or study buddy",
      "Join or create a study group — debate and discussion lock ideas in",
      "Turn material into stories, analogies, or memorable examples",
      "Teach what you have just learned — teaching forces real understanding",
      "Record yourself summarizing each topic and replay it while commuting",
      "Use games, quizzes, and friendly competition to make review playful",
    ],
    idealEnvironment: "Lively and collaborative — a group study room, a café with light background buzz, or a video call with classmates. You thrive where there is energy, but keep an agenda so the session stays on track.",
    retention: "You remember what you have discussed, taught, or performed. Vivid stories, emotional hooks, and shared experiences stick; silent re-reading alone rarely does.",
    avoid: [
      "Long, solitary silent reading marathons",
      "Studying in isolation for extended periods",
      "Monotonous repetition without any variety",
      "Rigid schedules that allow no social or creative breaks",
    ],
    tools: [
      "Study groups",
      "Flashcard apps with gamified review (e.g., Anki)",
      "Voice memos for self-explanations",
      "Quiz-style review games (e.g., Kahoot)",
      "Group video calls and live study sessions",
    ],
  },
  Choleric: {
    style: "The Goal-Driven Achiever",
    description: "You learn with purpose and speed. Give you a clear target and you will hit it — vague, open-ended study drains you, but a deadline, a challenge, or a measurable goal activates your full focus. You learn fastest by doing, by applying, and by being tested. Set the objective, execute, measure, improve.",
    primaryModality: "Action + Results",
    studyMethods: [
      "Set a specific, measurable goal for every study session",
      "Use self-tests and timed quizzes to create challenge and urgency",
      "Learn by doing — build projects, solve real problems, apply immediately",
      "Race the clock with focused sprints (Pomodoro-style) and reward completion",
      "Teach or present the material — accountability forces mastery",
      "Compete: leaderboards, timed drills, or a study partner who pushes your pace",
    ],
    idealEnvironment: "Efficient and distraction-free — your own space where you control the pace, with a visible target, timer, and checklist. You need the freedom to drive the session without interruption.",
    retention: "You remember what you have applied, solved, or been tested on. Wins, completed challenges, and results you produced yourself stay with you.",
    avoid: [
      "Passive lectures or long stretches of unstructured reading",
      "Vague, open-ended study with no clear objective",
      "Group sessions that waste time or lack accountability",
      "Pacing set by others that feels too slow",
    ],
    tools: [
      "Goal and task trackers (Todoist, Notion)",
      "Pomodoro timers",
      "Self-test quizzes and practice exams",
      "Project-based learning platforms",
      "Spaced-repetition apps with hard deadlines",
    ],
  },
  Melancholic: {
    style: "The Deep Analytical Scholar",
    description: "You learn at depth. Where others skim, you dive — reading, analyzing, and building systems of understanding that last. You thrive on structure: detailed notes, organized outlines, and the quiet space to think something all the way through. Given time and order, you master subjects others only encounter.",
    primaryModality: "Reading + Analytical",
    studyMethods: [
      "Write detailed, structured notes in your own words",
      "Build outlines and mind maps that connect ideas into systems",
      "Read primary sources and go deeper than the overview",
      "Create checklists and workflows that make study repeatable",
      "Connect new knowledge to what you already know and reflect in a journal",
      "Take regular deep-work blocks for focused, uninterrupted study",
    ],
    idealEnvironment: "Quiet, organized, and low-stimulation — a library or private study space with no noise and no interruptions. Predictable routines and a tidy workspace let your mind go deep.",
    retention: "You remember what you have read, written, or analyzed in depth — patterns, interconnections, and the logic behind things stay with you for years.",
    avoid: [
      "Chaotic or noisy environments",
      "Being rushed or pressured to answer before you are ready",
      "Shallow overviews that never go deep",
      "Disorganized group work with unclear standards",
      "Public performance before you have fully prepared",
    ],
    tools: [
      "Note-taking apps (Obsidian, Notion)",
      "Mind-mapping tools (XMind, Miro)",
      "Reference and citation managers",
      "Detailed outlines and checklists",
      "Deep-work time blocks",
    ],
  },
  Phlegmatic: {
    style: "The Steady Practical Learner",
    description: "You learn with calm, patient consistency. You are not the flashiest student, but you are among the most dependable — steady practice, applied to real situations, builds knowledge that genuinely lasts. You learn best at your own pace, in a calm and familiar environment, turning ideas into habits through gentle repetition rather than frantic cramming.",
    primaryModality: "Practical + Steady",
    studyMethods: [
      "Space learning over time — study a little every day rather than cramming",
      "Apply each concept to a real situation in your own life",
      "Use step-by-step guides and checklists to move methodically",
      "Practice repeatedly at a comfortable, unhurried pace",
      "Learn alongside a trusted, low-pressure partner",
      "Take short, regular breaks to keep the session calm and sustainable",
    ],
    idealEnvironment: "Calm, familiar, and predictable — a comfortable routine, the same time and place each day, and an atmosphere free of pressure or surprise.",
    retention: "You remember what you have practiced repeatedly and applied calmly. Routines, familiar patterns, and real-life use anchor your knowledge.",
    avoid: [
      "High-pressure cramming and sudden deadlines",
      "Chaotic group work with constant change",
      "Being put on the spot to perform publicly",
      "Frequent disruptions to your routine",
    ],
    tools: [
      "Habit and streak trackers",
      "Step-by-step tutorials and guides",
      "Practical, real-world projects",
      "Daily review sessions",
      "A calm, consistent study partner",
    ],
  },
};

export const SECONDARY_INFLUENCE: Record<string, string> = {
  "Sanguine-Choleric": "Your secondary Choleric turns learning into a mission — set visible goals, race the clock, and make review competitive. Your drive will keep the momentum alive long after the excitement fades.",
  "Sanguine-Melancholic": "Your secondary Melancholic adds depth to your social energy — pair lively discussion with detailed notes, and give yourself quiet time to reflect. Talk and thought together make you unstoppable.",
  "Sanguine-Phlegmatic": "Your secondary Phlegmatic steadies your enthusiasm — consistent routines and a calm study partner turn bursts of interest into lasting, dependable progress.",
  "Choleric-Sanguine": "Your secondary Sanguine softens your drive with warmth — lead study groups and explain goals out loud. People make the mission more enjoyable and keep you motivated.",
  "Choleric-Melancholic": "Your secondary Melancholic adds precision to your speed — plan in detail before you act, and combine your drive with careful research for truly formidable results.",
  "Choleric-Phlegmatic": "Your secondary Phlegmatic brings patience to your urgency — a sustainable pace and steady routines let you achieve big results without burning out.",
  "Melancholic-Choleric": "Your secondary Choleric turns deep analysis into action — set firm deadlines for your research so thoroughness produces results instead of delay.",
  "Melancholic-Sanguine": "Your secondary Sanguine brings life to your deep thinking — share your insights out loud and in groups. Teaching others sharpens your understanding.",
  "Melancholic-Phlegmatic": "Your secondary Phlegmatic keeps your analysis calm and steady — slow, consistent, organized study lets your depth flourish without overwhelm.",
  "Phlegmatic-Choleric": "Your secondary Choleric adds initiative to your steadiness — set small, ambitious goals and combine calm persistence with real forward momentum.",
  "Phlegmatic-Sanguine": "Your secondary Sanguine makes learning social and enjoyable — pair your calm consistency with group discussion to stay engaged and energized.",
  "Phlegmatic-Melancholic": "Your secondary Melancholic deepens your practical approach — thoughtful planning and careful attention enrich your steady, applied way of learning.",
};

export function getAdultLearning(
  primary: string,
  secondary?: string | null
): { profile: AdultLearningProfile | undefined; secondaryNote?: string } {
  const profile = ADULT_LEARNING[primary as Temperament];
  if (!profile) return { profile: undefined };
  const secondaryNote =
    secondary && secondary !== primary
      ? SECONDARY_INFLUENCE[`${primary}-${secondary}`]
      : undefined;
  return { profile, secondaryNote };
}
