// Age-specific temperament guidance for children and teens
// Each entry covers: learning style, discipline, love expression, what hurts, leadership, school, encouragement

export const CHILD_GUIDANCE: Record<string, Record<string, {
  learning: { style: string; tips: string[]; bestSubjects: string[]; avoid: string[] };
  discipline: { works: string[]; avoid: string[]; why: string };
  love: { expresses: string; receives: string; bestLanguage: string };
  hurts: string;
  leadership: { potential: string; howToDevelop: string[] };
  school: { performance: string; teacherTips: string[] };
  encouragement: { phrases: string[]; actions: string[] };
  career?: { suggestions: string[]; description: string; strengths: string[] };
}>> = {
  child_3_5: {
    Sanguine: {
      learning: {
        style: "Play-based, interactive, and highly social. Short bursts of activity with frequent variety.",
        tips: ["Use games, songs, and movement to teach concepts", "Keep lessons under 10–15 minutes", "Praise publicly and enthusiastically", "Change activities often to prevent boredom", "Let them 'perform' or show off what they learned"],
        bestSubjects: ["Art and creative expression", "Music and rhythm", "Drama and storytelling", "Social play"],
        avoid: ["Long, quiet sit-down tasks", "Repetition without novelty", "Isolation from other children", "Strict, silent routines"],
      },
      discipline: {
        works: ["Use humor and gentle redirection", "Praise good behavior loudly and immediately", "Give short, clear instructions", "Let them choose between two approved options", "Follow up with a physical hug or high-five after correction"],
        avoid: ["Long lectures or reasoning", "Shouting or harsh tone", "Silent treatment or withdrawal", "Overly strict rules without warmth"],
        why: "This child thrives on warmth, attention, and fun. Harshness crushes their spirit. Redirection works far better than confrontation.",
      },
      love: {
        expresses: "Through hugs, laughter, wanting to be near you, and playful teasing. They will climb on you, tell jokes, and demand attention constantly.",
        receives: "Words of praise, enthusiastic celebration, physical affection, and playtime with you.",
        bestLanguage: "Words of Affirmation + Quality Time",
      },
      hurts: "Being ignored, scolded in front of others, or told they are 'too much'. They feel rejected deeply when they are silenced or shut out.",
      leadership: {
        potential: "A natural entertainer and group energizer. They will be the one who gets everyone playing together.",
        howToDevelop: ["Give them 'helper' roles with status", "Let them lead group activities", "Channel their energy into organized sports or dance", "Teach them that others also need a turn to talk"],
      },
      school: {
        performance: "Bright and sociable, but may struggle with quiet seatwork. They excel in group activities and creative subjects.",
        teacherTips: ["Seat near engaged, not disruptive, peers", "Allow frequent movement breaks", "Use visual aids and hands-on materials", "Reward with praise and small privileges"],
      },
      encouragement: {
        phrases: ["You are so much fun to be around!", "I love how you make everyone smile!", "You are such a wonderful helper!", "Your joy lights up the room!"],
        actions: ["Dance or sing together", "Give bear hugs freely", "Celebrate small wins with a parade or song", "Read stories with dramatic voices"],
      },
    },
    Choleric: {
      learning: {
        style: "Active, goal-oriented, and competitive. Likes to 'win' and be first. Needs clear targets.",
        tips: ["Turn learning into a race or challenge", "Set clear, achievable goals each session", "Reward decisively — they need to feel accomplished", "Let them lead games or be the teacher", "Give them control over small decisions"],
        bestSubjects: ["Physical education and sports", "Structured games with rules", "Building and construction", "Leadership activities"],
        avoid: ["Vague or slow-paced instruction", "Being forced to wait passively", "Unstructured play with no goal", "Too many rules imposed without explanation"],
      },
      discipline: {
        works: ["Give clear consequences immediately — no delayed punishment", "Appeal to their sense of fairness", "Let them negotiate within boundaries", "Offer choices that still maintain your authority", "Acknowledge their leadership potential while correcting behavior"],
        avoid: ["Emotional manipulation or guilt", "Arbitrary rules with no logic", "Public humiliation", "Being overpowered or dominated"],
        why: "This child respects strength and logic. They need to see rules as fair, not imposed. Treat them as someone who can understand reason.",
      },
      love: {
        expresses: "Through action — fixing things for you, declaring 'I love you' boldly, and defending you fiercely.",
        receives: "Respect, being listened to seriously, and receiving responsibility.",
        bestLanguage: "Acts of Service + Words of Affirmation",
      },
      hurts: "Being disrespected, treated like a baby, or having their decisions overridden without explanation. Loss of control is devastating.",
      leadership: {
        potential: "A born leader even at age 3. They naturally organize games and tell others what to do.",
        howToDevelop: ["Give them real small responsibilities", "Teach that leadership means serving others", "Model respectful authority", "Redirect bossiness into constructive leadership"],
      },
      school: {
        performance: "Strong-willed and driven. They compete well but may clash with peers and teachers who try to control them.",
        teacherTips: ["Give them classroom responsibilities", "Challenge them with harder tasks", "Avoid power struggles", "Be direct and brief in correction"],
      },
      encouragement: {
        phrases: ["You are a strong leader!", "I trust you to make good choices!", "You did that so well — you are capable!", "You make things happen!"],
        actions: ["Let them help you 'fix' something around the house", "Give them a mission or task to complete", "Cheer their determination", "Let them plan a family activity"],
      },
    },
    Melancholic: {
      learning: {
        style: "Quiet, observant, and detail-oriented. Learns through watching, then doing carefully. Needs time.",
        tips: ["Demonstrate first, then let them try alone", "Give plenty of processing time", "Praise their precision and effort privately", "Use predictable routines", "Avoid rushing or hurrying them"],
        bestSubjects: ["Puzzles and pattern games", "Art with detailed instruction", "Reading and storytelling", "Nature observation"],
        avoid: ["Loud, chaotic environments", "Being put on the spot without preparation", "Criticism in front of others", "Sudden schedule changes"],
      },
      discipline: {
        works: ["Explain the 'why' behind rules gently", "Be consistent and predictable", "Correct privately, never publicly", "Use calm, low-tone conversation", "Acknowledge their sensitivity as a gift"],
        avoid: ["Yelling, harsh tones, or angry faces", "Humiliation or teasing", "Unpredictable or mood-based discipline", "Rushing through corrections"],
        why: "This child is deeply sensitive. Their inner world is intense. Harshness does not toughen them — it wounds them. Gentle consistency builds trust.",
      },
      love: {
        expresses: "Through quiet presence, thoughtful drawings, remembering your preferences, and gentle physical touch.",
        receives: "Quiet quality time, thoughtful words, and being truly listened to without interruption.",
        bestLanguage: "Quality Time + Words of Affirmation",
      },
      hurts: "Being laughed at, criticized, or having their feelings dismissed. They absorb emotions deeply and may not show hurt until bedtime.",
      leadership: {
        potential: "A quiet observer who leads by example. Other children eventually notice their consistency and thoughtfulness.",
        howToDevelop: ["Encourage them to share their ideas", "Value their observations in front of others", "Give them one-on-one mentor roles with younger children", "Praise their depth without making them feel different"],
      },
      school: {
        performance: "Observant and careful, but may seem slower than peers. They excel in subjects that reward precision and attention to detail.",
        teacherTips: ["Seat in a quiet corner away from distractions", "Give extra time to complete tasks", "Praise effort over speed", "Avoid calling on them unexpectedly in large groups"],
      },
      encouragement: {
        phrases: ["I notice how carefully you did that — it is beautiful.", "You think so deeply. That is a special gift.", "Thank you for being so thoughtful.", "You make everything better with your care."],
        actions: ["Write them a short handwritten note", "Sit quietly and color together", "Ask them about their drawings and truly listen", "Give them predictable, one-on-one routines"],
      },
    },
    Phlegmatic: {
      learning: {
        style: "Steady, calm, and routine-loving. Learns best through repetition, gentle guidance, and a peaceful environment.",
        tips: ["Use repetition and familiar routines", "Praise gently and consistently", "Let them learn at their own comfortable pace", "Create a calm, unhurried environment", "Avoid surprises or pressure"],
        bestSubjects: ["Gentle music and rhythm", "Cooperative group play", "Nature and animals", "Simple, predictable games"],
        avoid: ["Loud or chaotic classrooms", "Competitive pressure", "Sudden changes or surprises", "Being pushed to perform"],
      },
      discipline: {
        works: ["Calm, quiet explanation of what is expected", "Consistent routines they can rely on", "Patient redirection without anger", "Affectionate physical presence", "Gentle reminders instead of commands"],
        avoid: ["Sudden loud correction", "Harsh or angry reactions", "Unpredictable punishment", "Overwhelming them with too many instructions at once"],
        why: "This child needs peace and predictability. They respond to love and calmness. They shut down under pressure or harshness.",
      },
      love: {
        expresses: "Through quiet loyalty, wanting to be near you, gentle touches, and consistent affection without drama.",
        receives: "Gentle physical affection, consistent routines, and quiet, undistracted time together.",
        bestLanguage: "Physical Touch + Quality Time",
      },
      hurts: "Conflict, shouting, or being ignored. They may not show hurt outwardly but will withdraw quietly inside.",
      leadership: {
        potential: "A calming presence who makes everyone feel safe. They are the glue of a group.",
        howToDevelop: ["Encourage them to help a friend in need", "Praise their patience and kindness publicly", "Give them cooperative (not competitive) roles", "Teach them that their steadiness is a strength"],
      },
      school: {
        performance: "Steady and reliable. Not the fastest, but consistent. They are well-liked by peers and teachers.",
        teacherTips: ["Maintain a calm, organized classroom", "Avoid singling them out unexpectedly", "Pair with kind, cooperative peers", "Reward consistency and helpfulness"],
      },
      encouragement: {
        phrases: ["You are such a kind and helpful friend.", "I love how calm and steady you are.", "You make everyone feel safe and happy.", "Thank you for being so patient."],
        actions: ["Hold hands while walking", "Cuddle during story time", "Do quiet activities side by side", "Maintain warm, predictable routines"],
      },
    },
  },
  child_6_9: {
    Sanguine: {
      learning: {
        style: "Group-oriented, verbal, and highly social. Needs interaction, movement, and fun.",
        tips: ["Use group projects and discussions", "Incorporate games, songs, and drama", "Praise publicly and enthusiastically", "Give opportunities to present and perform", "Keep variety high — change topics and methods often"],
        bestSubjects: ["Creative writing and storytelling", "Music and performing arts", "Social studies and group work", "Physical education"],
        avoid: ["Silent, individual desk work for long stretches", "Lectures without interaction", "Strict, rigid classroom rules", "Isolation or exclusion"],
      },
      discipline: {
        works: ["Redirect energy into positive channels", "Use humor and creativity in correction", "Praise loudly, correct quietly", "Let them be the leader of a positive activity", "Follow correction with affection"],
        avoid: ["Harsh criticism in front of peers", "Boring, repetitive punishment", "Ignoring or withdrawing warmth", "Excessive rules that suppress their energy"],
        why: "This child is a bundle of positive energy that needs direction, not suppression. Their enthusiasm is a gift when channeled.",
      },
      love: {
        expresses: "Through words, hugs, wanting to tell you everything, and making people laugh.",
        receives: "Words of praise, being noticed, fun shared experiences, and physical affection.",
        bestLanguage: "Words of Affirmation + Quality Time",
      },
      hurts: "Being ignored, told they talk too much, or having their fun-loving spirit criticized. They feel rejected when enthusiasm is punished.",
      leadership: {
        potential: "The class energizer and natural cheerleader. They rally others and make activities fun.",
        howToDevelop: ["Give them roles that use their people skills", "Channel talkative energy into presentations", "Teach them that listening is part of leadership", "Model how to include quieter classmates"],
      },
      school: {
        performance: "Popular, creative, and energetic. May struggle with quiet subjects. Shines in group work and creative tasks.",
        teacherTips: ["Use cooperative seating arrangements", "Incorporate movement into lessons", "Reward participation and creativity", "Help them develop organizational systems"],
      },
      encouragement: {
        phrases: ["You light up every room you enter!", "Your ideas are so creative!", "You make learning fun for everyone!", "I love your enthusiasm!"],
        actions: ["Celebrate achievements with a mini-party", "Write a fun, encouraging note", "Give them a creative project to lead", "Dance or play a game together"],
      },
    },
    Choleric: {
      learning: {
        style: "Goal-driven, competitive, and active. Needs clear targets, challenges, and opportunities to lead.",
        tips: ["Set specific, measurable learning goals", "Use competitive games and quizzes", "Give leadership roles within group work", "Reward achievement decisively", "Provide faster-paced, challenging material"],
        bestSubjects: ["Mathematics and problem-solving", "Science experiments", "Debates and structured argument", "Sports and physical challenges"],
        avoid: ["Slow, unstructured learning", "Being forced to wait or sit passively", "Vague instructions without outcomes", "Tasks that feel beneath their ability"],
      },
      discipline: {
        works: ["Use logical consequences, not emotional punishment", "Appeal to their sense of justice", "Give them control within boundaries", "Challenge them to solve the problem they created", "Acknowledge their capability even while correcting"],
        avoid: ["Emotional lectures or guilt trips", "Inconsistent or unfair rules", "Public humiliation", "Being overpowered by an adult's will"],
        why: "This child respects strength and logic. Fair, firm boundaries with respect earn their cooperation. They fight arbitrary control.",
      },
      love: {
        expresses: "Through doing things for you, making bold declarations, and defending the family fiercely.",
        receives: "Respect, being taken seriously, and receiving meaningful responsibility.",
        bestLanguage: "Acts of Service + Words of Affirmation",
      },
      hurts: "Being disrespected, having their ideas dismissed, or being told they are 'bossy' without guidance. Loss of autonomy feels like betrayal.",
      leadership: {
        potential: "Already organizing classmates and taking charge. They are the playground general.",
        howToDevelop: ["Teach that leadership is service, not domination", "Give real responsibilities with real consequences", "Channel competitiveness into team sports", "Model respectful authority"],
      },
      school: {
        performance: "High-achieving and driven. Can be impatient with slower peers. Excels when challenged.",
        teacherTips: ["Provide advanced or extension tasks", "Use them as peer tutors or group leaders", "Be direct and brief in instruction", "Avoid power struggles by offering choices"],
      },
      encouragement: {
        phrases: ["You are a natural leader!", "Your determination is impressive!", "You make things happen!", "I admire your strength!"],
        actions: ["Give them a special project or role", "Cheer their victories loudly", "Let them teach a younger child a skill", "Acknowledge their effort, not just results"],
      },
    },
    Melancholic: {
      learning: {
        style: "Deep, thorough, and independent. Needs quiet, structure, and time to process.",
        tips: ["Provide detailed written instructions", "Allow independent study time", "Praise their depth and accuracy", "Use structured, logical teaching sequences", "Give advance notice of any changes"],
        bestSubjects: ["Reading and literature", "Mathematics and logic", "Science research projects", "Art with precision and detail"],
        avoid: ["Loud, chaotic group work", "Being called on unexpectedly", "Vague or open-ended assignments", "Sudden schedule disruptions"],
      },
      discipline: {
        works: ["Explain why privately and gently", "Be absolutely consistent", "Correct in a calm, low tone", "Validate their feelings before correction", "Give them space to process after correction"],
        avoid: ["Yelling, sarcasm, or teasing", "Public correction", "Unpredictable mood-based discipline", "Rushing through explanations"],
        why: "This child processes the world deeply. Harshness creates lasting wounds. Patient, logical, private correction preserves their trust and self-worth.",
      },
      love: {
        expresses: "Through thoughtful acts — remembering your preferences, making something for you, and quiet, devoted loyalty.",
        receives: "Quiet quality time, being truly listened to, and thoughtful, specific words of affirmation.",
        bestLanguage: "Quality Time + Words of Affirmation",
      },
      hurts: "Criticism, being laughed at, having their feelings minimized, or being told they are 'too sensitive'. They carry hurt silently and deeply.",
      leadership: {
        potential: "A quiet influencer who leads by example. Their thoughtfulness earns deep respect over time.",
        howToDevelop: ["Encourage them to share their observations", "Value their ideas in group settings", "Give them research or planning roles", "Praise their depth without isolating them"],
      },
      school: {
        performance: "Excellent in structured, academic subjects. May struggle with group presentations. Shines in research and written work.",
        teacherTips: ["Provide quiet workspace", "Allow extra time for assignments", "Give advance notice of presentations", "Praise thoroughness and originality"],
      },
      encouragement: {
        phrases: ["Your attention to detail is extraordinary.", "You think so deeply — that is a rare gift.", "I really value your thoughtful ideas.", "You make everything better with your care."],
        actions: ["Write a specific, thoughtful note", "Create a quiet ritual together", "Ask their opinion on something important", "Celebrate their completed projects carefully"],
      },
    },
    Phlegmatic: {
      learning: {
        style: "Steady, cooperative, and routine-loving. Learns best through repetition, calm instruction, and group harmony.",
        tips: ["Use repetition and familiar patterns", "Praise gently and consistently", "Keep the environment calm and organized", "Allow them to work at a comfortable pace", "Cooperative (not competitive) activities work best"],
        bestSubjects: ["Art and cooperative projects", "Nature studies", "Music and gentle rhythm", "Group reading and discussion"],
        avoid: ["Loud, chaotic classrooms", "High-pressure tests", "Sudden changes", "Being forced to compete or perform"],
      },
      discipline: {
        works: ["Calm, quiet redirection", "Consistent routines and expectations", "Patient, loving explanations", "Cooperative problem-solving", "Gentle reminders with warmth"],
        avoid: ["Sudden, loud corrections", "Harsh punishments", "Unpredictable consequences", "Overwhelming them with demands"],
        why: "This child needs peace and predictability. They respond to gentle consistency. Conflict and pressure make them shut down.",
      },
      love: {
        expresses: "Through quiet loyalty, gentle hugs, and steady, reliable presence. They are always there.",
        receives: "Gentle physical touch, consistent routines, and quiet, focused attention without pressure.",
        bestLanguage: "Physical Touch + Quality Time",
      },
      hurts: "Shouting, conflict, being ignored, or feeling that their calmness is taken for granted.",
      leadership: {
        potential: "The class peacemaker. They naturally include others and create a safe environment.",
        howToDevelop: ["Praise their kindness and patience", "Give them mediating roles in small conflicts", "Teach that steadiness is a leadership trait", "Encourage them to invite a lonely peer to play"],
      },
      school: {
        performance: "Steady and reliable. Well-liked by teachers and peers. May not stand out academically but is essential to class harmony.",
        teacherTips: ["Maintain a calm, organized classroom", "Pair with kind, cooperative peers", "Avoid singling them out unexpectedly", "Reward consistency and helpfulness"],
      },
      encouragement: {
        phrases: ["You are such a kind and steady friend.", "Everyone feels safe because of you.", "Thank you for being so patient and helpful.", "Your calmness is a gift to everyone around you."],
        actions: ["Quiet cuddle time", "Do a calm activity together", "Write a gentle thank-you note", "Maintain warm, predictable routines"],
      },
    },
  },
  preteen_10_12: {
    Sanguine: {
      learning: {
        style: "Social, interactive, and project-based. Needs peers, variety, and opportunities to shine.",
        tips: ["Group projects with rotating roles", "Incorporate technology and multimedia", "Give them a platform to present", "Use games, quizzes, and team competitions", "Connect learning to social impact and people"],
        bestSubjects: ["Drama and performing arts", "Social studies and debates", "Media and communication", "Team sports"],
        avoid: ["Isolation and individual worksheets", "Monotonous lectures", "Strict, rigid classroom management", "Too much quiet study time"],
      },
      discipline: {
        works: ["Redirect into positive leadership", "Use humor and relationship in correction", "Give them a way to regain status", "Praise publicly, correct privately", "Involve them in creating classroom norms"],
        avoid: ["Harsh public criticism", "Excessive punishment", "Ignoring or withdrawing affection", "Suppressing their social energy"],
        why: "At this age, peer approval is everything. Public correction destroys trust. Channel their social energy into constructive leadership.",
      },
      love: {
        expresses: "Through words, social plans, wanting to include you in their world, and making you laugh.",
        receives: "Verbal affirmation, fun shared experiences, and being included in social plans.",
        bestLanguage: "Words of Affirmation + Quality Time",
      },
      hurts: "Being embarrassed, told they are 'too much', or having their friends criticized. Social rejection is devastating at this age.",
      leadership: {
        potential: "The social connector and morale builder. They can rally a class around a cause or activity.",
        howToDevelop: ["Give them event-planning or social roles", "Teach inclusive leadership", "Channel their energy into team projects", "Model how to listen and include quieter voices"],
      },
      school: {
        performance: "Popular and creative. May struggle with quiet subjects but thrives in group work and presentations.",
        teacherTips: ["Use cooperative learning strategies", "Allow creative presentation formats", "Provide social outlets within structure", "Help them build organizational systems"],
      },
      encouragement: {
        phrases: ["You bring so much life to every group!", "Your creativity makes everything better!", "You are such an inspiring friend!", "The world needs your energy and joy!"],
        actions: ["Celebrate with a fun outing", "Write an enthusiastic note", "Let them plan a family or class activity", "Record a video celebrating them"],
      },
      career: {
        description: "Your people skills, creativity, and enthusiasm make you a natural for careers that involve communication, performance, and connecting with others.",
        suggestions: ["Actor or Performer", "TV or Radio Host", "Event Planner", "Teacher or Coach", "Marketing or Sales", "Tour Guide", "Public Speaker", "Journalist"],
        strengths: ["Communication", "Enthusiasm", "Creativity", "People skills", "Energy and charisma"],
      },
    },
    Choleric: {
      learning: {
        style: "Challenge-based, competitive, and goal-oriented. Needs to lead, compete, and achieve visible results.",
        tips: ["Set ambitious, measurable goals", "Use competitive quizzes and debates", "Assign them leadership in group projects", "Provide advanced or extension work", "Connect learning to real-world impact"],
        bestSubjects: ["Advanced mathematics", "Science and engineering", "Debate and public speaking", "Entrepreneurship and business"],
        avoid: ["Slow-paced, undemanding material", "Passive learning without action", "Excessive instruction before doing", "Being treated like an average student"],
      },
      discipline: {
        works: ["Appeal to logic and justice", "Give them ownership of consequences", "Challenge them to solve their own problem", "Respect their autonomy while maintaining boundaries", "Acknowledge their capability"],
        avoid: ["Emotional manipulation", "Arbitrary or inconsistent rules", "Public power struggles", "Being talked down to"],
        why: "This child is becoming an independent thinker. They need respect, logic, and autonomy. Treat them as capable while maintaining firm boundaries.",
      },
      love: {
        expresses: "Through action, achievement, and protection. They show love by accomplishing things and defending the people they care about.",
        receives: "Respect, being taken seriously, and receiving responsibility that matters.",
        bestLanguage: "Acts of Service + Words of Affirmation",
      },
      hurts: "Being disrespected, having their competence questioned, or being controlled without explanation.",
      leadership: {
        potential: "Already a commanding presence. They will be class president, team captain, or club founder.",
        howToDevelop: ["Teach servant leadership", "Give real organizational responsibility", "Model collaborative decision-making", "Channel competitiveness into team success"],
      },
      school: {
        performance: "High-achieving and driven. Needs challenge. Can be impatient with slower peers. Natural in competitive academics.",
        teacherTips: ["Provide advanced coursework", "Use them as peer mentors", "Be direct and brief", "Avoid power struggles by offering structured choices"],
      },
      encouragement: {
        phrases: ["You are capable of extraordinary things!", "Your drive is impressive!", "You have the power to change things!", "I believe in your leadership!"],
        actions: ["Give them a challenging project", "Acknowledge their hard work specifically", "Let them lead a presentation", "Celebrate their determination"],
      },
      career: {
        description: "Your confidence, determination, and leadership skills point toward careers where you can take charge, solve problems, and make things happen.",
        suggestions: ["Entrepreneur or Business Owner", "Lawyer or Judge", "Manager or Executive", "Military Officer", "Sports Captain or Coach", "Politician or Community Leader", "Engineer", "Surgeon"],
        strengths: ["Leadership", "Decision-making", "Determination", "Confidence", "Problem-solving"],
      },
    },
    Melancholic: {
      learning: {
        style: "Deep, analytical, and independent. Needs structure, quiet, and time for thorough processing.",
        tips: ["Provide detailed syllabi and clear criteria", "Allow independent research projects", "Use structured, logical teaching", "Praise originality and depth", "Give advance notice of all changes"],
        bestSubjects: ["Literature and writing", "Mathematics and logic", "Science research", "Art and design with precision"],
        avoid: ["Group work without clear individual roles", "Being put on the spot", "Vague or open-ended assignments", "Sudden schedule changes"],
      },
      discipline: {
        works: ["Private, calm, logical conversation", "Explain the 'why' thoroughly", "Be absolutely consistent", "Validate their perspective before correcting", "Give them time and space to process"],
        avoid: ["Public correction or sarcasm", "Unpredictable discipline", "Rushed conversations", "Dismissal of their feelings"],
        why: "This child thinks deeply and feels deeply. They need to be understood and respected. Private, logical correction preserves their dignity and trust.",
      },
      love: {
        expresses: "Through loyalty, thoughtful acts, deep conversations, and remembering everything that matters to you.",
        receives: "Deep, undistracted listening, thoughtful words, and quality time without interruption.",
        bestLanguage: "Quality Time + Words of Affirmation",
      },
      hurts: "Criticism, being told they are 'too serious', having their feelings dismissed, or being treated as socially awkward.",
      leadership: {
        potential: "A thoughtful influencer who leads through ideas and integrity. People respect their depth.",
        howToDevelop: ["Give them research or analytical leadership roles", "Encourage them to present their findings", "Praise their insight in group settings", "Teach that depth is a superpower"],
      },
      school: {
        performance: "Excellent in academic subjects requiring depth and analysis. May struggle with group presentations but excels in written and research work.",
        teacherTips: ["Provide quiet study space", "Allow extra time for thorough work", "Give clear, detailed assignment briefs", "Praise originality and critical thinking"],
      },
      encouragement: {
        phrases: ["Your insight is extraordinary.", "I learn something new every time I talk to you.", "Your depth of thought is a rare gift.", "The world needs people who think like you."],
        actions: ["Have a meaningful one-on-one conversation", "Write a thoughtful letter", "Celebrate their completed projects", "Ask their opinion on something important"],
      },
      career: {
        description: "Your attention to detail, deep thinking, and love for precision make you well-suited for careers that require analysis, creativity, and careful work.",
        suggestions: ["Scientist or Researcher", "Doctor or Medical Professional", "Engineer or Architect", "Writer or Author", "Artist or Designer", "Musician or Composer", "Data Analyst", "Software Developer"],
        strengths: ["Attention to detail", "Deep thinking", "Creativity", "Precision", "Analytical skills"],
      },
    },
    Phlegmatic: {
      learning: {
        style: "Steady, cooperative, and calm. Learns best through routine, gentle instruction, and supportive group work.",
        tips: ["Maintain consistent routines and expectations", "Use cooperative learning groups", "Praise kindness and reliability", "Provide calm, organized instruction", "Allow comfortable pacing"],
        bestSubjects: ["Art and group creative projects", "Nature and environmental studies", "Music and rhythm", "Cooperative sports"],
        avoid: ["Chaotic or disorganized classrooms", "High-pressure competitive environments", "Sudden changes", "Being forced to lead or perform"],
      },
      discipline: {
        works: ["Gentle, calm, and private correction", "Consistent, predictable consequences", "Cooperative problem-solving", "Affectionate reassurance after correction", "Patient, loving explanations"],
        avoid: ["Loud or angry reactions", "Harsh punishments", "Unpredictable consequences", "Public embarrassment"],
        why: "This child values peace and predictability. They respond to gentle consistency. Conflict and pressure cause them to withdraw.",
      },
      love: {
        expresses: "Through quiet loyalty, gentle presence, and steady, reliable friendship.",
        receives: "Gentle physical touch, consistent attention, and calm, undistracted time together.",
        bestLanguage: "Physical Touch + Quality Time",
      },
      hurts: "Conflict, being overlooked, feeling that their steadiness is taken for granted, or loud criticism.",
      leadership: {
        potential: "The quiet peacemaker who creates a safe environment for everyone. Other children trust them.",
        howToDevelop: ["Praise their reliability and kindness", "Give them mediating or supportive roles", "Teach that steadiness is leadership", "Encourage them to include others"],
      },
      school: {
        performance: "Steady and reliable. Well-liked by teachers and peers. An essential part of class harmony.",
        teacherTips: ["Maintain calm, organized structure", "Avoid singling them out unexpectedly", "Pair with kind, cooperative peers", "Reward consistency and helpfulness"],
      },
      encouragement: {
        phrases: ["You make everyone feel safe and accepted.", "Your kindness is noticed and valued.", "Thank you for being so steady and reliable.", "You are the friend everyone needs."],
        actions: ["Quiet quality time together", "Write a gentle thank-you note", "Celebrate their reliability", "Maintain warm, predictable routines"],
      },
      career: {
        description: "Your calm nature, patience, and desire to help others make you a great fit for careers focused on care, support, and creating harmony.",
        suggestions: ["Teacher or Educator", "Counselor or Therapist", "Nurse or Healthcare Worker", "Social Worker", "Librarian", "Chef or Baker", "Human Resources", "Mediator or Conflict Resolution Specialist"],
        strengths: ["Patience", "Kindness", "Reliability", "Calmness", "Listening skills"],
      },
    },
  },
  teen_13_17: {
    Sanguine: {
      learning: {
        style: "Interactive, people-centered, and project-based. Needs peers, presentation opportunities, and social relevance.",
        tips: ["Group projects with rotating leadership", "Use multimedia and creative presentations", "Connect subjects to people and social impact", "Allow them to present and teach others", "Use technology and social platforms in learning"],
        bestSubjects: ["Media studies and communication", "Theatre and performing arts", "Social sciences and psychology", "Entrepreneurship and marketing"],
        avoid: ["Isolation and solo worksheets", "Monotonous lectures", "Rigid, inflexible rules", "Subjects disconnected from people"],
      },
      discipline: {
        works: ["Redirect into positive social leadership", "Correct privately, never publicly", "Appeal to their desire for social standing", "Give them a way to 'save face'", "Use humor and relationship, not force"],
        avoid: ["Public embarrassment", "Excessive punishment", "Withdrawing affection", "Suppressing their social nature"],
        why: "Teen Sanguines live for social connection. Public correction destroys trust forever. Private, relationship-based guidance works.",
      },
      love: {
        expresses: "Through words, wanting to include you in their world, making you laugh, and social plans.",
        receives: "Verbal affirmation, fun shared experiences, and being genuinely interested in their social world.",
        bestLanguage: "Words of Affirmation + Quality Time",
      },
      hurts: "Social rejection, being told they are shallow, or having their friends criticized. Their identity is wrapped in their social circle.",
      leadership: {
        potential: "The social influencer and morale builder. They can rally a group around any cause.",
        howToDevelop: ["Give them event planning or social leadership roles", "Teach them to use influence for good", "Model inclusive, empathetic leadership", "Encourage them to mentor younger students"],
      },
      school: {
        performance: "Creative and socially engaged. May struggle with quiet, individual subjects. Thrives in collaborative, creative coursework.",
        teacherTips: ["Use group projects and discussions", "Allow creative presentation formats", "Connect subjects to real-world social issues", "Help them build organizational systems"],
      },
      encouragement: {
        phrases: ["Your energy and creativity inspire everyone around you!", "You have the gift of making people feel included!", "The world needs your joy and enthusiasm!", "You are a natural connector!"],
        actions: ["Celebrate with a fun outing", "Attend their events or performances", "Introduce them to inspiring people", "Write an enthusiastic, specific note"],
      },
      career: {
        description: "Your charisma, communication skills, and ability to connect with people make you a strong candidate for careers that involve influence, media, and human connection.",
        suggestions: ["Media and Communications", "Public Relations", "Entertainment Industry", "Teaching and Education", "Sales and Marketing", "Event Management", "Counseling or Therapy", "Politics or Public Service"],
        strengths: ["Charisma", "Communication", "Creativity", "Empathy", "Social intelligence"],
      },
    },
    Choleric: {
      learning: {
        style: "Competitive, results-oriented, and challenge-driven. Needs autonomy, clear goals, and real-world stakes.",
        tips: ["Set ambitious, self-directed goals", "Use competitive frameworks and measurable outcomes", "Provide leadership roles in group work", "Connect learning to real-world impact", "Give them autonomy over how they achieve outcomes"],
        bestSubjects: ["Advanced STEM", "Debate and public policy", "Business and entrepreneurship", "Politics and leadership"],
        avoid: ["Slow, undemanding material", "Excessive instruction without action", "Being micromanaged", "Tasks that feel beneath their ambition"],
      },
      discipline: {
        works: ["Appeal to logic, justice, and consequences", "Give them ownership of outcomes", "Challenge them to solve their own mistakes", "Respect their autonomy", "Be firm but never condescending"],
        avoid: ["Emotional manipulation or guilt", "Arbitrary rules", "Power struggles", "Talking down to them"],
        why: "Teen Cholerics are developing their identity as leaders. They need respect, logic, and autonomy. Treat them as emerging adults.",
      },
      love: {
        expresses: "Through action and achievement. They show love by protecting the family, succeeding, and doing things for you.",
        receives: "Respect, being taken seriously as an emerging adult, and receiving meaningful responsibility.",
        bestLanguage: "Acts of Service + Words of Affirmation",
      },
      hurts: "Being disrespected, having their ambitions dismissed, or being controlled without explanation. They need to feel capable.",
      leadership: {
        potential: "Already a commanding presence. They will be student council president, team captain, or startup founder.",
        howToDevelop: ["Teach ethical leadership", "Give real organizational responsibility", "Model servant leadership", "Channel ambition into positive impact"],
      },
      school: {
        performance: "High-achieving and driven. Needs challenge. Can be impatient with slower peers. Excels in competitive academics.",
        teacherTips: ["Provide advanced or honors coursework", "Give them real leadership roles", "Be direct and brief", "Respect their autonomy within boundaries"],
      },
      encouragement: {
        phrases: ["You are capable of extraordinary impact!", "Your drive and determination are rare gifts!", "The world needs leaders like you!", "I am proud of your ambition!"],
        actions: ["Give them a challenging project with real stakes", "Acknowledge their hard work specifically", "Let them lead a meaningful initiative", "Celebrate their determination"],
      },
      career: {
        description: "Your leadership drive, decisiveness, and determination equip you for high-impact careers where you can lead teams, drive change, and achieve ambitious goals.",
        suggestions: ["Executive Leadership or CEO", "Law and Advocacy", "Entrepreneurship and Startups", "Management Consulting", "Military Officer", "Politics and Governance", "Sports Management", "Investment and Finance"],
        strengths: ["Leadership", "Strategic thinking", "Decisiveness", "Resilience", "Ambition"],
      },
    },
    Melancholic: {
      learning: {
        style: "Deep, analytical, and independent. Needs structure, quiet, and time for thorough understanding.",
        tips: ["Provide detailed syllabi and clear criteria", "Allow independent research and deep dives", "Use structured, logical teaching", "Praise originality and critical thinking", "Give advance notice of all changes"],
        bestSubjects: ["Literature and philosophy", "Advanced mathematics and logic", "Science research", "Art, music, and design with depth"],
        avoid: ["Group work without clear individual contribution", "Being put on the spot", "Vague or open-ended assignments", "Sudden schedule disruptions"],
      },
      discipline: {
        works: ["Private, calm, logical conversation", "Explain the 'why' thoroughly", "Be consistent", "Validate their perspective before correcting", "Give them space to process"],
        avoid: ["Public correction or sarcasm", "Unpredictable discipline", "Rushed conversations", "Dismissal of their feelings"],
        why: "Teen Melancholics think and feel deeply. They need to be respected as thinkers. Private, logical, patient correction preserves trust.",
      },
      love: {
        expresses: "Through loyalty, deep conversations, thoughtful acts, and remembering everything that matters.",
        receives: "Deep, undistracted listening, thoughtful words, and quality time without interruption.",
        bestLanguage: "Quality Time + Words of Affirmation",
      },
      hurts: "Being called 'too sensitive', having their depth dismissed, criticism, or feeling misunderstood.",
      leadership: {
        potential: "A thought leader who influences through ideas, integrity, and depth. People respect their insight.",
        howToDevelop: ["Give them research or analytical leadership roles", "Encourage them to publish or present", "Praise their insight in public settings", "Teach that depth is a superpower"],
      },
      school: {
        performance: "Excellent in academic subjects requiring analysis and depth. May struggle with group presentations but excels in research, writing, and critical thinking.",
        teacherTips: ["Provide quiet study space", "Allow extra time for thorough work", "Give clear, detailed assignment briefs", "Praise originality and critical thinking"],
      },
      encouragement: {
        phrases: ["Your insight and depth are extraordinary.", "I learn something profound every time we talk.", "The world needs people who think as deeply as you do.", "Your originality is your superpower."],
        actions: ["Have a meaningful one-on-one conversation", "Write a thoughtful letter", "Celebrate their completed projects", "Ask their opinion on something important"],
      },
      career: {
        description: "Your analytical mind, creativity, and pursuit of excellence make you exceptionally suited for careers that demand deep thinking, precision, and innovation.",
        suggestions: ["Research Science and Academia", "Medicine and Healthcare", "Engineering and Architecture", "Writing and Journalism", "Art and Design", "Music Composition", "Data Science and Analytics", "Software Engineering"],
        strengths: ["Analytical thinking", "Creativity", "Precision", "Depth of knowledge", "Innovation"],
      },
    },
    Phlegmatic: {
      learning: {
        style: "Steady, cooperative, and calm. Needs routine, gentle instruction, and supportive environments.",
        tips: ["Maintain consistent routines", "Use cooperative learning groups", "Praise kindness and reliability", "Provide calm, organized instruction", "Allow comfortable pacing"],
        bestSubjects: ["Art and group creative projects", "Environmental studies", "Music and rhythm", "Cooperative sports and wellness"],
        avoid: ["Chaotic or disorganized environments", "High-pressure competitive environments", "Sudden changes", "Being forced to lead or perform"],
      },
      discipline: {
        works: ["Gentle, calm, private correction", "Consistent, predictable consequences", "Cooperative problem-solving", "Affectionate reassurance after correction", "Patient, loving explanations"],
        avoid: ["Loud or angry reactions", "Harsh punishments", "Unpredictable consequences", "Public embarrassment"],
        why: "Teen Phlegmatics value peace and stability. Conflict and pressure make them withdraw. Gentle consistency builds trust.",
      },
      love: {
        expresses: "Through quiet loyalty, gentle presence, and steady, reliable friendship.",
        receives: "Gentle physical touch, consistent attention, and calm, undistracted time together.",
        bestLanguage: "Physical Touch + Quality Time",
      },
      hurts: "Conflict, being overlooked, feeling that their steadiness is taken for granted, or loud criticism.",
      leadership: {
        potential: "The quiet peacemaker who creates safety. Other teens trust them deeply.",
        howToDevelop: ["Praise their reliability and kindness", "Give them mediating or supportive roles", "Teach that steadiness is leadership", "Encourage them to include others"],
      },
      school: {
        performance: "Steady and reliable. Well-liked by teachers and peers. Essential to class harmony and group dynamics.",
        teacherTips: ["Maintain calm, organized structure", "Avoid singling them out unexpectedly", "Pair with kind, cooperative peers", "Reward consistency and helpfulness"],
      },
      encouragement: {
        phrases: ["You make everyone feel safe and accepted.", "Your kindness is noticed and deeply valued.", "Thank you for being so steady and reliable.", "You are the friend everyone needs."],
        actions: ["Quiet quality time together", "Write a gentle thank-you note", "Celebrate their reliability", "Maintain warm, predictable routines"],
      },
      career: {
        description: "Your patience, empathy, and steadiness make you a natural for careers focused on helping others, creating harmony, and providing reliable support.",
        suggestions: ["Counseling and Psychology", "Social Work", "Teaching and Education", "Nursing and Healthcare", "Mediation and Conflict Resolution", "Human Resources", "Nonprofit Leadership", "Fine Arts"],
        strengths: ["Empathy", "Patience", "Reliability", "Active listening", "Conflict resolution"],
      },
    },
  },
};

// Couples compatibility matrix: score 1-5, with detailed guidance per pair
export const COUPLES_COMPATIBILITY: Record<string, Record<string, {
  score: number; // 1-5, 5 = excellent, 1 = challenging
  label: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  communication: string[];
  advice: string[];
}>> = {
  Sanguine: {
    Phlegmatic: { score: 5, label: "Excellent Match", summary: "Sanguine brings energy and joy; Phlegmatic brings peace and steadiness. Together they create a warm, balanced, and fun home.", strengths: ["Sanguine pulls Phlegmatic into social life and adventure", "Phlegmatic calms Sanguine's emotional swings", "Both are people-loving and non-confrontational", "Sanguine's enthusiasm lifts Phlegmatic; Phlegmatic's steadiness anchors Sanguine"], challenges: ["Sanguine may find Phlegmatic too quiet or slow", "Phlegmatic may find Sanguine exhausting or chaotic", "Sanguine's spontaneity can unsettle Phlegmatic's routine"], communication: ["Sanguine: Slow down and listen — Phlegmatic has important things to say", "Phlegmatic: Share your needs and feelings more openly; Sanguine wants to know", "Schedule regular, calm check-ins where Phlegmatic leads the conversation"], advice: ["Plan social outings together but also protect quiet time for Phlegmatic", "Sanguine: Celebrate Phlegmatic's steadiness as a gift, not a limitation", "Phlegmatic: Join Sanguine in adventure sometimes — it deepens the bond"] },
    Melancholic: { score: 4, label: "Strong Match", summary: "Sanguine's warmth and expressiveness complement Melancholic's depth and thoughtfulness. Together they balance surface and depth.", strengths: ["Sanguine draws Melancholic out of isolation and into joy", "Melancholic adds depth and meaning to Sanguine's experiences", "Both are emotionally rich and people-oriented", "Melancholic's care grounds Sanguine; Sanguine's joy lifts Melancholic"], challenges: ["Sanguine may find Melancholic too serious or moody", "Melancholic may find Sanguine superficial or inconsistent", "Different emotional rhythms can create misunderstanding"], communication: ["Sanguine: Take time to go deep with Melancholic — they need more than surface conversation", "Melancholic: Let Sanguine bring lightness; not every conversation needs to be profound", "Both: Appreciate that your differences are complementary, not contradictory"], advice: ["Create rituals that blend Sanguine's fun with Melancholic's meaning", "Sanguine: Learn to sit in silence with Melancholic without fixing their mood", "Melancholic: Allow yourself to be swept up in Sanguine's joy sometimes"] },
    Choleric: { score: 3, label: "Moderate Match", summary: "Both are high-energy but in different directions. Sanguine seeks fun and connection; Choleric seeks achievement and control. Growth is required for harmony.", strengths: ["Both are dynamic, energetic, and action-oriented", "Sanguine softens Choleric's edges with humor and warmth", "Choleric gives Sanguine direction and follow-through", "Together they can be a powerhouse of energy and results"], challenges: ["Sanguine may feel dominated or controlled by Choleric", "Choleric may see Sanguine as unfocused or unreliable", "Both want to lead; power struggles are common", "Sanguine's emotional inconsistency frustrates Choleric"], communication: ["Sanguine: Be direct and concise with Choleric — they respect clarity", "Choleric: Soften your delivery; Sanguine is sensitive and needs warmth", "Set clear roles and boundaries to avoid power struggles", "Celebrate each other's strengths without comparison"], advice: ["Divide leadership by domain rather than competing for control", "Sanguine: Follow through on commitments to build Choleric's trust", "Choleric: Allow Sanguine to bring fun into the relationship without seeing it as frivolous"] },
    Sanguine: { score: 2, label: "Challenging Match", summary: "Two Sanguines create a home full of joy, fun, and chaos. The challenge is stability, follow-through, and handling the hard stuff.", strengths: ["Unlimited fun, laughter, and shared enthusiasm", "Both understand each other's need for social connection", "Neither will let the relationship become boring", "Massive shared energy for adventure and experiences"], challenges: ["Neither is naturally good at follow-through or discipline", "Both may avoid difficult conversations", "Financial and practical responsibilities may be neglected", "Emotional inconsistency can amplify when both are up and down"], communication: ["Agree on who handles practical responsibilities", "Schedule regular 'serious conversations' so neither avoids the hard topics", "Build systems for follow-through (calendars, accountability)"], advice: ["Hire help or build systems for the practical things neither enjoys", "Find a mentor or coach to help with accountability", "Celebrate your joy but commit to growing in discipline together"] },
  },
  Choleric: {
    Phlegmatic: { score: 5, label: "Excellent Match", summary: "Choleric provides direction and drive; Phlegmatic provides peace and patience. Together they are an unstoppable, balanced team.", strengths: ["Phlegmatic absorbs Choleric's intensity without fighting back", "Choleric gives Phlegmatic direction and motivation", "Phlegmatic's calm prevents Choleric from burning out", "Choleric's decisiveness combined with Phlegmatic's steadiness creates lasting results"], challenges: ["Choleric may overpower or ignore Phlegmatic's quieter needs", "Phlegmatic may become passive and resentful", "Choleric's speed may frustrate Phlegmatic's slower pace"], communication: ["Choleric: Pause and ask Phlegmatic for their opinion — they won't offer it unasked", "Phlegmatic: Practice asserting your needs directly; Choleric respects strength", "Schedule calm, private conversations where Phlegmatic feels safe to speak", "Choleric: Soften your tone; Phlegmatic shuts down under harshness"], advice: ["Choleric: Treat Phlegmatic's pace as wisdom, not weakness", "Phlegmatic: Let Choleric lead but insist on being consulted", "Build a home where Choleric's drive and Phlegmatic's peace both have space"] },
    Melancholic: { score: 4, label: "Strong Match", summary: "Choleric drives results; Melancholic ensures quality. Together they are a formidable team when they respect each other's pace.", strengths: ["Melancholic's analysis prevents Choleric's rash decisions", "Choleric's action prevents Melancholic's paralysis", "Both are deep, serious, and committed", "Together they achieve excellence with precision"], challenges: ["Choleric's speed and bluntness wound Melancholic", "Melancholic's caution frustrates Choleric's urgency", "Both can be stubborn in different ways", "Choleric may see Melancholic's depth as unnecessary delay"], communication: ["Choleric: Slow down and explain your reasoning; Melancholic needs the 'why'", "Melancholic: Express concerns early before Choleric has committed", "Both: Separate decision-making from emotional delivery", "Set deadlines that balance Choleric's speed with Melancholic's thoroughness"], advice: ["Divide decisions: Choleric decides fast; Melancholic refines the plan", "Choleric: Value Melancholic's precision as quality control, not obstruction", "Melancholic: Learn to trust Choleric's gut decisions when time is short"] },
    Sanguine: { score: 3, label: "Moderate Match", summary: "See Sanguine-Choleric pairing. Both are high-energy but differ in direction. Respect and adaptation are essential.", strengths: ["Both are dynamic, energetic, and action-oriented", "Sanguine softens Choleric with humor and warmth", "Choleric gives Sanguine direction and follow-through"], challenges: ["Sanguine may feel dominated by Choleric", "Choleric may see Sanguine as unreliable", "Both want to lead; power struggles are common"], communication: ["Sanguine: Be direct with Choleric", "Choleric: Soften delivery for Sanguine", "Set clear roles to avoid power struggles"], advice: ["Divide leadership by domain", "Sanguine: Follow through on commitments", "Choleric: Allow fun without seeing it as frivolous"] },
    Choleric: { score: 2, label: "Challenging Match", summary: "Two Cholerics create a relationship of power, passion, and potential collision. Only works with deep mutual respect and clear boundaries.", strengths: ["Shared drive, ambition, and commitment to excellence", "Both understand the need for results and achievement", "Powerful combined energy for building something significant", "Mutual respect for capability and strength"], challenges: ["Constant power struggles over who leads", "Both are blunt and can wound each other deeply", "Neither is naturally good at emotional softness or vulnerability", "Competition can replace cooperation"], communication: ["Agree explicitly on who leads what", "Practice softening tone and delivery deliberately", "Schedule 'vulnerability time' where both share feelings without judgment", "Never compete in front of children or others"], advice: ["Create separate domains of authority and respect those boundaries absolutely", "Both must develop emotional intelligence actively", "Seek couples coaching or a strong mentor relationship", "Celebrate each other's wins genuinely"] },
  },
  Melancholic: {
    Phlegmatic: { score: 5, label: "Excellent Match", summary: "Melancholic brings depth and meaning; Phlegmatic brings peace and acceptance. Together they create a safe, deeply connected home.", strengths: ["Both are quiet, loyal, and deeply committed", "Phlegmatic accepts Melancholic's moods without judgment", "Melancholic adds depth to Phlegmatic's calm", "Both value loyalty, consistency, and genuine connection"], challenges: ["Both may avoid necessary conflict and difficult conversations", "Melancholic's intensity may overwhelm Phlegmatic's simplicity", "Phlegmatic's passivity may frustrate Melancholic's need for depth", "Both may become stuck in comfortable routines without growth"], communication: ["Melancholic: Share your feelings gently; Phlegmatic wants to understand", "Phlegmatic: Ask Melancholic deeper questions — they appreciate the invitation", "Both: Schedule intentional conversations to avoid drift", "Practice expressing needs even when it feels uncomfortable"], advice: ["Create shared rituals of depth and meaning", "Melancholic: Allow Phlegmatic to bring lightness; not everything needs analysis", "Phlegmatic: Join Melancholic in their passions and interests sometimes", "Both: Step out of comfort zone together periodically"] },
    Choleric: { score: 4, label: "Strong Match", summary: "See Choleric-Melancholic. A powerful team when Choleric respects Melancholic's pace and Melancholic trusts Choleric's drive.", strengths: ["Melancholic's analysis prevents rash decisions", "Choleric's action prevents paralysis", "Both are deep and committed"], challenges: ["Choleric's speed wounds Melancholic", "Melancholic's caution frustrates Choleric"], communication: ["Choleric: Explain reasoning; Melancholic needs the 'why'", "Melancholic: Express concerns early"], advice: ["Divide decisions: Choleric decides; Melancholic refines", "Value each other's contributions"] },
    Sanguine: { score: 4, label: "Strong Match", summary: "See Sanguine-Melancholic. A beautiful balance of surface and depth when both appreciate their differences.", strengths: ["Sanguine draws Melancholic into joy", "Melancholic adds depth to Sanguine's experiences"], challenges: ["Sanguine may find Melancholic too serious", "Melancholic may find Sanguine superficial"], communication: ["Sanguine: Go deep sometimes", "Melancholic: Allow lightness sometimes"], advice: ["Blend fun with meaning", "Appreciate differences as complementary"] },
    Melancholic: { score: 2, label: "Challenging Match", summary: "Two Melancholics share extraordinary depth and understanding, but may spiral together into isolation and moodiness.", strengths: ["Extraordinary depth of understanding and connection", "Both value loyalty, meaning, and genuine intimacy", "Shared appreciation for beauty, art, and thought", "Neither will ever feel 'too deep' for the other"], challenges: ["Both may withdraw into their own moods", "Neither naturally brings lightness or energy", "Perfectionism can double and become paralyzing", "Both may avoid necessary conflict"], communication: ["One of you must deliberately bring lightness and structure", "Schedule fun and social activities even when neither feels like it", "Practice expressing needs before resentment builds", "Seek external energy and perspective regularly"], advice: ["Actively build a social circle outside the relationship", "One partner should develop more Sanguine or Choleric traits intentionally", "Create systems for practical tasks neither enjoys", "Celebrate small joys deliberately and regularly"] },
  },
  Phlegmatic: {
    Choleric: { score: 5, label: "Excellent Match", summary: "See Choleric-Phlegmatic. One of the most complementary pairings when Choleric respects Phlegmatic's pace.", strengths: ["Phlegmatic absorbs Choleric's intensity", "Choleric gives Phlegmatic direction"], challenges: ["Choleric may overpower Phlegmatic", "Phlegmatic may become passive"], communication: ["Choleric: Ask for Phlegmatic's opinion", "Phlegmatic: Practice asserting needs"], advice: ["Treat pace differences as complementary", "Build space for both drive and peace"] },
    Melancholic: { score: 5, label: "Excellent Match", summary: "See Melancholic-Phlegmatic. A deeply loyal, quiet, and meaningful partnership.", strengths: ["Both are quiet and loyal", "Phlegmatic accepts Melancholic's moods"], challenges: ["Both may avoid conflict", "May become stuck in routines"], communication: ["Schedule intentional conversations", "Practice expressing needs"], advice: ["Create shared rituals", "Step out of comfort zones together"] },
    Sanguine: { score: 5, label: "Excellent Match", summary: "See Sanguine-Phlegmatic. A joyful, warm, and balanced partnership.", strengths: ["Sanguine brings energy", "Phlegmatic brings peace"], challenges: ["Sanguine may find Phlegmatic too quiet", "Phlegmatic may find Sanguine exhausting"], communication: ["Sanguine: Slow down and listen", "Phlegmatic: Share feelings openly"], advice: ["Protect quiet time for Phlegmatic", "Join Sanguine in adventure sometimes"] },
    Phlegmatic: { score: 3, label: "Moderate Match", summary: "Two Phlegmatics create the most peaceful home imaginable — but may also create a home where nothing changes and growth stalls.", strengths: ["Unmatched peace, stability, and lack of conflict", "Both are patient, kind, and deeply loyal", "Neither will ever dominate or control the other", "A safe, warm, predictable home environment"], challenges: ["Neither naturally drives change or growth", "Both may avoid necessary difficult conversations", "Decisions can take forever", "The relationship may drift into comfortable complacency"], communication: ["One partner must deliberately bring initiative and structure", "Schedule regular check-ins even though neither naturally wants them", "Practice making decisions faster than either feels comfortable", "Bring external energy and new experiences into the relationship"], advice: ["Set shared goals and review them regularly", "One partner should develop more Choleric or Sanguine traits", "Build a social life outside the relationship", "Celebrate the peace but challenge the comfort zone"] },
  },
};
