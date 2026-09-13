export interface Question {
  id: number;
  text: string;
  temperament: "Sanguine" | "Choleric" | "Melancholic" | "Phlegmatic" | "bonus" | "response";
  bonusCategory?: "couples" | "corporate" | "teen_13_17";
  reverseScored?: boolean;
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

export const CORPORATE_RESPONSE_QUESTIONS: Question[] = [
  { id: 70, text: "I always complete every task at work exactly on time, without exception.", temperament: "response" as const },
  { id: 71, text: "I have never felt annoyed by a teammate or manager.", temperament: "response" as const },
  { id: 72, text: "I never make mistakes at work.", temperament: "response" as const },
  { id: 73, text: "To confirm you are reading carefully, select 'Very much like me'.", temperament: "response" as const },
];

export const CHILD_3_5_QUESTIONS: Question[] = [
  { id: 0,  text: "Smiles easily when meeting familiar people.", temperament: "Sanguine" },
  { id: 1,  text: "Enjoys being the centre of attention.", temperament: "Sanguine" },
  { id: 2,  text: "Talks or babbles a lot during play.", temperament: "Sanguine" },
  { id: 3,  text: "Laughs loudly and often.", temperament: "Sanguine" },
  { id: 4,  text: "Makes friends quickly with other children.", temperament: "Sanguine" },
  { id: 5,  text: "Likes playing in groups more than alone.", temperament: "Sanguine" },
  { id: 6,  text: "Greets visitors happily.", temperament: "Sanguine" },
  { id: 7,  text: "Enjoys singing, dancing, or pretending.", temperament: "Sanguine" },
  { id: 8,  text: "Easily starts conversations with adults or children.", temperament: "Sanguine" },
  { id: 9,  text: "Shares exciting experiences with others.", temperament: "Sanguine" },
  { id: 10, text: "Expresses emotions openly.", temperament: "Sanguine" },
  { id: 11, text: "Enjoys entertaining family members.", temperament: "Sanguine" },
  { id: 12, text: "Is cheerful most of the time.", temperament: "Sanguine" },
  { id: 13, text: "Quickly joins games without encouragement.", temperament: "Sanguine" },
  { id: 14, text: "Easily recovers after being corrected or disappointed.", temperament: "Sanguine" },
  { id: 15, text: "Likes to be in charge during play.", temperament: "Choleric" },
  { id: 16, text: "Gives instructions to other children.", temperament: "Choleric" },
  { id: 17, text: "Insists on doing things independently.", temperament: "Choleric" },
  { id: 18, text: "Becomes frustrated when unable to lead.", temperament: "Choleric" },
  { id: 19, text: "Is confident trying new activities.", temperament: "Choleric" },
  { id: 20, text: "Enjoys challenges.", temperament: "Choleric" },
  { id: 21, text: "Persists until a task is completed.", temperament: "Choleric" },
  { id: 22, text: "Expresses opinions strongly.", temperament: "Choleric" },
  { id: 23, text: "Dislikes waiting for turns.", temperament: "Choleric" },
  { id: 24, text: "Wants things done immediately.", temperament: "Choleric" },
  { id: 25, text: "Takes initiative without being told.", temperament: "Choleric" },
  { id: 26, text: "Enjoys making choices.", temperament: "Choleric" },
  { id: 27, text: "Tries to solve problems independently.", temperament: "Choleric" },
  { id: 28, text: "Is determined to get what he or she wants.", temperament: "Choleric" },
  { id: 29, text: "Shows confidence in unfamiliar situations.", temperament: "Choleric" },
  { id: 30, text: "Notices small changes that others miss.", temperament: "Melancholic" },
  { id: 31, text: "Likes toys arranged neatly.", temperament: "Melancholic" },
  { id: 32, text: "Prefers routines and familiar schedules.", temperament: "Melancholic" },
  { id: 33, text: "Gets upset when plans suddenly change.", temperament: "Melancholic" },
  { id: 34, text: "Pays attention to details while colouring or drawing.", temperament: "Melancholic" },
  { id: 35, text: "Likes completing activities carefully.", temperament: "Melancholic" },
  { id: 36, text: "Notices when something is missing.", temperament: "Melancholic" },
  { id: 37, text: "Thinks before trying something new.", temperament: "Melancholic" },
  { id: 38, text: "Is sensitive to loud voices or criticism.", temperament: "Melancholic" },
  { id: 39, text: "Likes things done properly.", temperament: "Melancholic" },
  { id: 40, text: "Enjoys quiet activities like puzzles or books.", temperament: "Melancholic" },
  { id: 41, text: "Asks many thoughtful questions.", temperament: "Melancholic" },
  { id: 42, text: "Prefers familiar people before strangers.", temperament: "Melancholic" },
  { id: 43, text: "Takes time before joining new activities.", temperament: "Melancholic" },
  { id: 44, text: "Remembers past events very well.", temperament: "Melancholic" },
  { id: 45, text: "Remains calm in most situations.", temperament: "Phlegmatic" },
  { id: 46, text: "Waits patiently during activities.", temperament: "Phlegmatic" },
  { id: 47, text: "Shares toys willingly.", temperament: "Phlegmatic" },
  { id: 48, text: "Avoids arguments with other children.", temperament: "Phlegmatic" },
  { id: 49, text: "Is gentle with younger children.", temperament: "Phlegmatic" },
  { id: 50, text: "Enjoys helping adults with simple tasks.", temperament: "Phlegmatic" },
  { id: 51, text: "Adapts peacefully to group activities.", temperament: "Phlegmatic" },
  { id: 52, text: "Is easy to comfort when upset.", temperament: "Phlegmatic" },
  { id: 53, text: "Prefers peaceful play to rough games.", temperament: "Phlegmatic" },
  { id: 54, text: "Is happy playing quietly alone.", temperament: "Phlegmatic" },
  { id: 55, text: "Listens carefully before responding.", temperament: "Phlegmatic" },
  { id: 56, text: "Rarely throws tantrums.", temperament: "Phlegmatic" },
  { id: 57, text: "Cooperates well with instructions.", temperament: "Phlegmatic" },
  { id: 58, text: "Accepts losing a game without becoming angry.", temperament: "Phlegmatic" },
  { id: 59, text: "Shows kindness toward people and animals.", temperament: "Phlegmatic" },
];

export const CHILD_6_9_QUESTIONS: Question[] = [
  { id: 0,  text: "Enjoys meeting new people.", temperament: "Sanguine" },
  { id: 1,  text: "Makes friends easily.", temperament: "Sanguine" },
  { id: 2,  text: "Likes telling stories or talking about experiences.", temperament: "Sanguine" },
  { id: 3,  text: "Volunteers to answer questions in class.", temperament: "Sanguine" },
  { id: 4,  text: "Enjoys being part of group activities.", temperament: "Sanguine" },
  { id: 5,  text: "Smiles and laughs frequently.", temperament: "Sanguine" },
  { id: 6,  text: "Easily starts conversations with others.", temperament: "Sanguine" },
  { id: 7,  text: "Likes entertaining family or friends.", temperament: "Sanguine" },
  { id: 8,  text: "Shares ideas confidently.", temperament: "Sanguine" },
  { id: 9,  text: "Quickly forgives others after disagreements.", temperament: "Sanguine" },
  { id: 10, text: "Enjoys participating in school events.", temperament: "Sanguine" },
  { id: 11, text: "Is enthusiastic when trying new activities.", temperament: "Sanguine" },
  { id: 12, text: "Encourages others to join games.", temperament: "Sanguine" },
  { id: 13, text: "Is cheerful even after small disappointments.", temperament: "Sanguine" },
  { id: 14, text: "Expresses feelings openly and confidently.", temperament: "Sanguine" },
  { id: 15, text: "Likes taking the lead during group work.", temperament: "Choleric" },
  { id: 16, text: "Enjoys making decisions.", temperament: "Choleric" },
  { id: 17, text: "Persists until a difficult task is completed.", temperament: "Choleric" },
  { id: 18, text: "Becomes determined when faced with challenges.", temperament: "Choleric" },
  { id: 19, text: "Prefers solving problems independently.", temperament: "Choleric" },
  { id: 20, text: "Likes setting personal goals.", temperament: "Choleric" },
  { id: 21, text: "Takes initiative without waiting to be told.", temperament: "Choleric" },
  { id: 22, text: "Speaks confidently about personal opinions.", temperament: "Choleric" },
  { id: 23, text: "Wants things done quickly.", temperament: "Choleric" },
  { id: 24, text: "Dislikes unnecessary delays.", temperament: "Choleric" },
  { id: 25, text: "Enjoys healthy competition.", temperament: "Choleric" },
  { id: 26, text: "Tries to influence others positively.", temperament: "Choleric" },
  { id: 27, text: "Accepts responsibility for assigned tasks.", temperament: "Choleric" },
  { id: 28, text: "Is confident in unfamiliar situations.", temperament: "Choleric" },
  { id: 29, text: "Enjoys organising activities or games.", temperament: "Choleric" },
  { id: 30, text: "Pays close attention to details.", temperament: "Melancholic" },
  { id: 31, text: "Likes work to be neat and organised.", temperament: "Melancholic" },
  { id: 32, text: "Notices mistakes that others miss.", temperament: "Melancholic" },
  { id: 33, text: "Prefers following routines.", temperament: "Melancholic" },
  { id: 34, text: "Thinks carefully before making decisions.", temperament: "Melancholic" },
  { id: 35, text: "Enjoys reading quietly.", temperament: "Melancholic" },
  { id: 36, text: "Prefers completing work carefully rather than quickly.", temperament: "Melancholic" },
  { id: 37, text: "Remembers instructions well.", temperament: "Melancholic" },
  { id: 38, text: "Becomes upset when rules are ignored.", temperament: "Melancholic" },
  { id: 39, text: "Likes planning before starting projects.", temperament: "Melancholic" },
  { id: 40, text: "Is sensitive to criticism.", temperament: "Melancholic" },
  { id: 41, text: "Takes responsibilities seriously.", temperament: "Melancholic" },
  { id: 42, text: "Likes things arranged properly.", temperament: "Melancholic" },
  { id: 43, text: "Prefers quality over speed.", temperament: "Melancholic" },
  { id: 44, text: "Reflects on mistakes and tries to improve.", temperament: "Melancholic" },
  { id: 45, text: "Remains calm during difficult situations.", temperament: "Phlegmatic" },
  { id: 46, text: "Gets along well with most classmates.", temperament: "Phlegmatic" },
  { id: 47, text: "Is patient while waiting for a turn.", temperament: "Phlegmatic" },
  { id: 48, text: "Listens carefully when others are speaking.", temperament: "Phlegmatic" },
  { id: 49, text: "Helps classmates willingly.", temperament: "Phlegmatic" },
  { id: 50, text: "Avoids unnecessary arguments.", temperament: "Phlegmatic" },
  { id: 51, text: "Cooperates well with teachers and parents.", temperament: "Phlegmatic" },
  { id: 52, text: "Is gentle toward younger children.", temperament: "Phlegmatic" },
  { id: 53, text: "Comforts friends who are upset.", temperament: "Phlegmatic" },
  { id: 54, text: "Accepts corrections without becoming defensive.", temperament: "Phlegmatic" },
  { id: 55, text: "Enjoys working peacefully with others.", temperament: "Phlegmatic" },
  { id: 56, text: "Stays calm even when others become upset.", temperament: "Phlegmatic" },
  { id: 57, text: "Is dependable when given responsibilities.", temperament: "Phlegmatic" },
  { id: 58, text: "Forgives others easily.", temperament: "Phlegmatic" },
  { id: 59, text: "Shows kindness and consideration every day.", temperament: "Phlegmatic" },
];

export const PRETEEN_10_12_QUESTIONS: Question[] = [
  { id: 0,  text: "I enjoy meeting new people.", temperament: "Sanguine" },
  { id: 1,  text: "I make friends easily.", temperament: "Sanguine" },
  { id: 2,  text: "I enjoy telling stories or sharing my experiences.", temperament: "Sanguine" },
  { id: 3,  text: "I like participating in group activities.", temperament: "Sanguine" },
  { id: 4,  text: "I smile and laugh often.", temperament: "Sanguine" },
  { id: 5,  text: "I enjoy encouraging others.", temperament: "Sanguine" },
  { id: 6,  text: "I am comfortable speaking in front of my class.", temperament: "Sanguine" },
  { id: 7,  text: "I enjoy school programmes and competitions.", temperament: "Sanguine" },
  { id: 8,  text: "I like making people happy.", temperament: "Sanguine" },
  { id: 9,  text: "I avoid talking to people I do not know.", temperament: "Sanguine", reverseScored: true },
  { id: 10, text: "I forgive others easily.", temperament: "Sanguine" },
  { id: 11, text: "I usually keep my feelings to myself.", temperament: "Sanguine", reverseScored: true },
  { id: 12, text: "I enjoy working with different classmates.", temperament: "Sanguine" },
  { id: 13, text: "I prefer staying alone during break time.", temperament: "Sanguine", reverseScored: true },
  { id: 14, text: "I become excited when learning something new.", temperament: "Sanguine" },
  { id: 15, text: "I enjoy leading group activities.", temperament: "Choleric" },
  { id: 16, text: "I like making decisions.", temperament: "Choleric" },
  { id: 17, text: "I finish tasks even when they are difficult.", temperament: "Choleric" },
  { id: 18, text: "I enjoy solving challenging problems.", temperament: "Choleric" },
  { id: 19, text: "I like setting goals for myself.", temperament: "Choleric" },
  { id: 20, text: "I take responsibility for my mistakes.", temperament: "Choleric" },
  { id: 21, text: "I enjoy healthy competition.", temperament: "Choleric" },
  { id: 22, text: "I speak confidently when sharing my ideas.", temperament: "Choleric" },
  { id: 23, text: "I easily give up when work becomes difficult.", temperament: "Choleric", reverseScored: true },
  { id: 24, text: "I like organising activities.", temperament: "Choleric" },
  { id: 25, text: "I prefer finding solutions instead of complaining.", temperament: "Choleric" },
  { id: 26, text: "I wait for others to make decisions for me.", temperament: "Choleric", reverseScored: true },
  { id: 27, text: "I like taking initiative.", temperament: "Choleric" },
  { id: 28, text: "I avoid responsibilities whenever possible.", temperament: "Choleric", reverseScored: true },
  { id: 29, text: "I enjoy learning new skills that challenge me.", temperament: "Choleric" },
  { id: 30, text: "I like my work to be neat and organised.", temperament: "Melancholic" },
  { id: 31, text: "I notice mistakes easily.", temperament: "Melancholic" },
  { id: 32, text: "I think carefully before making decisions.", temperament: "Melancholic" },
  { id: 33, text: "I enjoy reading and learning quietly.", temperament: "Melancholic" },
  { id: 34, text: "I like following instructions correctly.", temperament: "Melancholic" },
  { id: 35, text: "I pay attention to small details.", temperament: "Melancholic" },
  { id: 36, text: "I enjoy planning before starting a project.", temperament: "Melancholic" },
  { id: 37, text: "I rush through my work without checking it.", temperament: "Melancholic", reverseScored: true },
  { id: 38, text: "I feel uncomfortable when rules are ignored.", temperament: "Melancholic" },
  { id: 39, text: "I like keeping my belongings organised.", temperament: "Melancholic" },
  { id: 40, text: "I enjoy completing assignments carefully.", temperament: "Melancholic" },
  { id: 41, text: "I do not care whether my work is neat or untidy.", temperament: "Melancholic", reverseScored: true },
  { id: 42, text: "I learn from my mistakes.", temperament: "Melancholic" },
  { id: 43, text: "I dislike planning ahead.", temperament: "Melancholic", reverseScored: true },
  { id: 44, text: "I enjoy improving my work until it is my best.", temperament: "Melancholic" },
  { id: 45, text: "I remain calm in difficult situations.", temperament: "Phlegmatic" },
  { id: 46, text: "I enjoy helping others.", temperament: "Phlegmatic" },
  { id: 47, text: "I listen carefully when people are talking.", temperament: "Phlegmatic" },
  { id: 48, text: "I wait patiently for my turn.", temperament: "Phlegmatic" },
  { id: 49, text: "I avoid unnecessary arguments.", temperament: "Phlegmatic" },
  { id: 50, text: "I forgive people who offend me.", temperament: "Phlegmatic" },
  { id: 51, text: "I become angry over small things.", temperament: "Phlegmatic", reverseScored: true },
  { id: 52, text: "I enjoy working peacefully with others.", temperament: "Phlegmatic" },
  { id: 53, text: "I comfort friends when they are sad.", temperament: "Phlegmatic" },
  { id: 54, text: "I find it difficult to forgive people.", temperament: "Phlegmatic", reverseScored: true },
  { id: 55, text: "I cooperate well with teachers and classmates.", temperament: "Phlegmatic" },
  { id: 56, text: "I stay calm when others disagree with me.", temperament: "Phlegmatic" },
  { id: 57, text: "I enjoy serving others without expecting rewards.", temperament: "Phlegmatic" },
  { id: 58, text: "I become impatient when I have to wait.", temperament: "Phlegmatic", reverseScored: true },
  { id: 59, text: "I try to settle disagreements peacefully.", temperament: "Phlegmatic" },
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
  if (testType === "corporate_team") return [...CORE_QUESTIONS, ...CORPORATE_BONUS_QUESTIONS, ...CORPORATE_RESPONSE_QUESTIONS];
  if (testType === "child_3_5") return CHILD_3_5_QUESTIONS;
  if (testType === "child_6_9") return CHILD_6_9_QUESTIONS;
  if (testType === "preteen_10_12") return PRETEEN_10_12_QUESTIONS;
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

export const CHILD_OPTIONS = [
  { value: 1, label: "Never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Almost Always" },
];

const TEMPERAMENT_INDICES = {
  sanguine:   [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13, 14],
  choleric:   [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
  melancholic: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
  phlegmatic:  [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
};

export function computeChildTemperament(answers: Record<string, number>, questions: Question[]) {
  const getScore = (indices: number[]) =>
    indices.reduce((acc, i) => {
      const q = questions[i];
      const raw = answers[i.toString()] ?? 0;
      const adjusted = q.reverseScored ? 6 - raw : raw;
      return acc + adjusted;
    }, 0);

  const scores = {
    Sanguine:   getScore(TEMPERAMENT_INDICES.sanguine),
    Choleric:   getScore(TEMPERAMENT_INDICES.choleric),
    Melancholic: getScore(TEMPERAMENT_INDICES.melancholic),
    Phlegmatic: getScore(TEMPERAMENT_INDICES.phlegmatic),
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
