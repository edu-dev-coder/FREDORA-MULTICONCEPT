export interface CouplesPairing {
  score: number;
  label: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  communication: {
    dos: string[];
    donts: string[];
    scripts: {
      situation: string;
      partnerA: string;
      partnerB: string;
    }[];
  };
  loveLanguages: {
    partnerA: { gives: string[]; receives: string[] };
    partnerB: { gives: string[]; receives: string[] };
    match: string;
  };
  lifeAreas: {
    intimacy: { tips: string[]; risk: string };
    finances: { tips: string[]; risk: string };
    parenting: { tips: string[]; risk: string };
    household: { tips: string[]; risk: string };
    decisions: { tips: string[]; risk: string };
    social: { tips: string[]; risk: string };
  };
  conflictPlaybook: {
    triggerA: string;
    triggerB: string;
    escalation: string;
    deescalation: string[];
    repair: string[];
  };
}

export interface LoveStyle {
  expresses: string;
  receives: string;
  bestLanguage: string;
  needsFromPartner: string;
  dealbreakers: string[];
}

export const COUPLES_PAIRINGS: Record<string, CouplesPairing> = {
  "Sanguine-Sanguine": {
    score: 3,
    label: "Electric but Exhausting",
    summary:
      "Two Sanguines together create an irresistible whirlwind of laughter, spontaneity, and social energy. The house is never quiet, the calendar is always full, and the chemistry is undeniable. But without someone to pump the brakes, this pairing can burn through savings, avoid serious conversations, and accidentally neglect the quieter needs of their relationship.",
    strengths: [
      "Infectious combined energy that draws people in and makes every gathering memorable",
      "Natural spontaneity means life never feels stale or predictable",
      "Both partners genuinely enjoy people, hosting, and shared social adventures",
      "Quick forgiveness — neither holds grudges, so minor fights dissolve fast",
      "Playful physical affection and verbal warmth come effortlessly to both",
    ],
    challenges: [
      "Neither partner naturally handles budgets, filing, or long-term financial planning",
      "Serious or heavy conversations keep getting postponed with humor or distraction",
      "Both need constant external stimulation, so quiet nights at home feel suffocating",
      "Commitment to follow-through is weak — projects, plans, and promises get abandoned",
      "When conflict surfaces, both may flee into socializing instead of resolving it",
    ],
    communication: {
      dos: [
        "Schedule a weekly 20-minute 'real talk' where phones are off and honesty is the only rule",
        "Use humor to lighten heavy topics, but actually reach the topic — don't skip it",
        "Text each other quick appreciations throughout the day to sustain warmth between adventures",
        "Acknowledge when one of you is drifting into avoidance and gently name it",
      ],
      donts: [
        "Don't use parties and social events as an escape hatch when things feel tense at home",
        "Don't assume silence means everything is fine — Sanguines can suppress quietly",
        "Don't make major financial decisions impulsively, no matter how exciting the opportunity feels",
        "Don't compete for attention or outshine each other in social settings",
      ],
      scripts: [
        {
          situation: "When discussing finances after an impulsive purchase",
          partnerA: "I know I went overboard at the store. I got caught up in the moment. Can we look at the budget together so I can see where we stand?",
          partnerB: "I appreciate you bringing it up. I've made similar impulses, so I'm not here to judge. Let's figure out a fun spending plan that works for both of us.",
        },
        {
          situation: "When one partner avoids a serious conversation",
          partnerA: "I notice we keep joking about the in-laws thing but it's actually weighing on me. Can we talk about it for real, even if it's uncomfortable?",
          partnerB: "You're right, I've been deflecting. I'm nervous about it, but I don't want you carrying it alone. Let's sit down and actually work through it.",
        },
        {
          situation: "When feeling disconnected after a busy social week",
          partnerA: "I love our social life, but I realized we haven't had real one-on-one time in over a week. Can we carve out tonight just for us?",
          partnerB: "Honestly, I've been feeling it too but didn't want to sound needy. A quiet night in sounds perfect — just us, no plans, no people.",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Words of affirmation", "Quality time", "Physical touch"],
        receives: ["Words of affirmation", "Physical touch", "Acts of service"],
      },
      partnerB: {
        gives: ["Words of affirmation", "Quality time", "Receiving gifts"],
        receives: ["Quality time", "Words of affirmation", "Physical touch"],
      },
      match:
        "Both Sanguines naturally speak in words of affirmation and quality time, creating a warm and expressive love bubble. The gap is in consistency — both are great at the grand gesture but forget the small daily rituals. Intentionally building acts-of-service habits (making coffee, handling a chore without being asked) adds depth beneath the sparkle.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "Keep things playful and experimental — you both thrive on novelty",
          "Don't let social exhaustion become an excuse for physical distance",
          "Verbal affirmation before and after strengthens emotional safety",
        ],
        risk:
          "Intimacy can become performative or routine in its novelty-seeking, losing emotional depth if neither partner slows down to be vulnerable.",
      },
      finances: {
        tips: [
          "Automate savings and bill payments so neither of you has to remember",
          "Set a 'fun fund' you can both spend guilt-free, with the rest protected",
          "Make budgeting a game with shared goals rather than a restrictive lecture",
        ],
        risk:
          "Spontaneous spending compounds quickly when both partners enable each other's impulses. Without structure, debt can spiral silently.",
      },
      parenting: {
        tips: [
          "Create a shared parenting calendar so responsibilities don't fall through cracks",
          "Balance fun parenting with structured routines — kids need both",
          "Designate one partner as the 'detail parent' for school deadlines and forms",
        ],
        risk:
          "Both may prioritize being the fun parent over being the disciplinarian, leading to inconsistent boundaries and kids who exploit the gap.",
      },
      household: {
        tips: [
          "Use a shared task app — neither of you naturally notices mess until it's overwhelming",
          "Turn chores into social events: cook together, clean together with music",
          "Accept that neither will be meticulous and hire help if budget allows",
        ],
        risk:
          "The home gradually becomes chaotic as both prioritize fun over maintenance. Resentment builds when one finally notices and feels like the only adult.",
      },
      decisions: {
        tips: [
          "Set a rule: any decision over $200 gets a 24-hour cooling-off period",
          "Use a 'pros and cons' list for big life decisions — force structure onto your spontaneity",
          "Check in with a grounded friend or advisor before major commitments",
        ],
        risk:
          "Major life decisions (moving, career changes, large purchases) get made on impulse and enthusiasm alone, without stress-testing the plan.",
      },
      social: {
        tips: [
          "Agree on a maximum number of social events per week to prevent burnout",
          "Alternate who chooses the social activity to keep balance",
          "Protect at least one weekend night per month as a no-plans night",
        ],
        risk:
          "Social overcommitment leaves zero time for the relationship itself. You become best party friends who slowly become roommates.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling ignored or overshadowed in social settings by the other's charisma",
      triggerB: "Being told to calm down or rein in their energy and enthusiasm",
      escalation:
        "Both partners withdraw into separate social circles, using other people as emotional buffers. Arguments stay surface-level but the emotional distance grows.",
      deescalation: [
        "Name the dynamic out loud: 'I think we're both avoiding this by staying busy'",
        "Agree on a 48-hour truce where social plans are paused and you reconnect at home",
        "Write down what you actually feel instead of performing cheerfulness",
      ],
      repair: [
        "Plan a low-key date night with no audience — just the two of you being real",
        "Each partner shares one thing they appreciate and one thing they need, alternating",
        "Revisit the original issue within a week so it doesn't calcify into a pattern",
      ],
    },
  },

  "Sanguine-Choleric": {
    score: 4,
    label: "Dynamic Power Duo",
    summary:
      "The Sanguine brings warmth, charm, and social magic while the Choleric brings drive, decisiveness, and vision. Together they can build empires and light up every room they enter. The friction comes when the Sanguine's need for fun collides with the Choleric's need for control, and when the Choleric mistakes the Sanguine's easygoing nature for laziness.",
    strengths: [
      "Complementary social skills — Sanguine connects, Choleric directs, making them formidable together",
      "The Choleric's decisiveness balances the Sanguine's tendency to keep options open indefinitely",
      "Sanguine warmth softens the Choleric's bluntness, making the team more approachable",
      "Both are action-oriented and rarely get stuck in analysis paralysis",
      "The Choleric's long-term vision combined with the Sanguine's network creates real opportunities",
    ],
    challenges: [
      "Choleric frustration with Sanguine's lack of follow-through on commitments",
      "Sanguine feels controlled and micromanaged by the Choleric's directive style",
      "Different energy rhythms — Choleric is task-focused, Sanguine is people-focused",
      "The Choleric bulldozes past the Sanguine's feelings, who then suppresses instead of pushing back",
      "Power struggles escalate because neither naturally backs down from their position",
    ],
    communication: {
      dos: [
        "The Sanguine should lead with warmth before raising concerns — it disarms the Choleric's defensiveness",
        "The Choleric should frame requests as collaboration, not instruction: 'Let's figure out...' not 'You need to...'",
        "Schedule check-ins so the Sanguine feels heard and the Choleric feels organized",
        "Celebrate wins together — the Choleric forgets to, and the Sanguine needs it",
      ],
      donts: [
        "Don't let the Choleric set all the rules while the Sanguine smiles and agrees to keep the peace",
        "Don't let the Sanguine's charm hide genuine frustration until it explodes",
        "Don't compare work ethics — your contributions look different but both matter",
        "Don't have serious conversations when the Choleric is stressed or the Sanguine is distracted",
      ],
      scripts: [
        {
          situation: "When the Choleric is frustrated about an unmet deadline",
          partnerA: "I hear that you're under pressure and I want to help. I got sidetracked with some things, but I can prioritize this tonight. What's the most critical piece?",
          partnerB: "Thank you. The report for the client is the urgent part. I shouldn't have snapped — I know you'll come through. I just need clarity on the timeline.",
        },
        {
          situation: "When the Sanguine feels controlled",
          partnerA: "I feel like I'm getting a lot of instructions lately and it's making me want to pull away. I do better when I feel like we're figuring things out together.",
          partnerB: "I didn't realize it was coming across that way. I get tunnel vision when I'm stressed. Can you tell me in the moment when I start sounding like a boss instead of a partner?",
        },
        {
          situation: "When celebrating a shared achievement",
          partnerA: "We did it! I'm so proud of us — let's get everyone together to celebrate this weekend!",
          partnerB: "I am too. Before we plan the party, I just want to take a minute to say — I couldn't have done this without your energy. You kept us going when it got hard.",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Words of affirmation", "Physical touch", "Quality time"],
        receives: ["Quality time", "Acts of service", "Words of affirmation"],
      },
      partnerB: {
        gives: ["Acts of service", "Quality time", "Receiving gifts"],
        receives: ["Words of affirmation", "Physical touch", "Quality time"],
      },
      match:
        "The Choleric expresses love through doing — handling tasks, solving problems, building a future. The Sanguine expresses love through being — warmth, presence, and verbal affection. The growth edge is the Choleric learning to say 'I love you' out loud more, and the Sanguine learning to show love through reliable action.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "The Sanguine needs emotional connection before physical intimacy — don't skip the warmup",
          "The Choleric should soften their directness in the bedroom and check in more",
          "Balance adventure with tenderness — both are important to this pairing",
        ],
        risk:
          "The Choleric treats intimacy as another area to perform or control, while the Sanguine needs playfulness and emotional safety. If neither adapts, one feels used and the other feels rejected.",
      },
      finances: {
        tips: [
          "Let the Choleric manage the long-term strategy and the Sanguine manage the social budget",
          "Review finances monthly together so the Sanguine stays informed and the Choleric stays fair",
          "Agree on a threshold for individual spending decisions to avoid power struggles",
        ],
        risk:
          "The Choleric controls finances tightly, creating a parent-child dynamic that breeds resentment in the Sanguine.",
      },
      parenting: {
        tips: [
          "The Choleric provides structure and discipline; the Sanguine provides warmth and emotional attunement",
          "Present a united front — kids will exploit the gap between your styles",
          "The Choleric should resist overriding the Sanguine's parenting decisions in front of the kids",
        ],
        risk:
          "The Choleric becomes the 'strict parent' and the Sanguine becomes the 'fun parent,' creating an unhealthy alliance pattern where kids play you against each other.",
      },
      household: {
        tips: [
          "Assign roles based on natural strengths: Choleric handles logistics, Sanguine handles hospitality",
          "The Choleric should delegate rather than dictate when it comes to household tasks",
          "Make the home feel warm, not just efficient — the Sanguine's input matters here",
        ],
        risk:
          "The Choleric treats the home like a project manager treats a deadline, and the Sanguine feels like an employee rather than a partner.",
      },
      decisions: {
        tips: [
          "The Sanguine brings creative options; the Choleric brings evaluative criteria — use both",
          "For major decisions, write the decision down and revisit it after 48 hours",
          "The Choleric must genuinely listen to the Sanguine's concerns, not just wait for their turn to decide",
        ],
        risk:
          "The Choleric dominates decisions because they're more decisive, and the Sanguine defers to avoid conflict — but the resentment builds silently.",
      },
      social: {
        tips: [
          "The Sanguine expands your social circle; the Choleric curates it — both approaches have value",
          "Agree on when to attend events together versus separately",
          "The Choleric should let the Sanguine lead socially — it's their superpower",
        ],
        risk:
          "The Choleric dislikes the Sanguine's wide social circle as scattered, while the Sanguine sees the Choleric's smaller circle as closed-off. Social life becomes a point of judgment.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling dismissed or steamrolled when expressing an idea or emotion",
      triggerB: "Feeling like their partner isn't taking something seriously or committing fully",
      escalation:
        "The Choleric escalates into criticism and directives; the Sanguine escalates into defensiveness and withdrawal into social activity. The Choleric interprets the withdrawal as proof of unreliability, and the Sanguine interprets the criticism as proof of not being enough.",
      deescalation: [
        "The Choleric explicitly says: 'I'm not attacking you, I'm overwhelmed and I need your help'",
        "The Sanguine stays present instead of fleeing — even 10 minutes of honest conversation changes the trajectory",
        "Pause the content argument and address the dynamic: 'We're in a cycle right now — can we reset?'",
      ],
      repair: [
        "The Choleric initiates a specific apology for tone, not just intent",
        "The Sanguine shares what they actually need instead of minimizing it",
        "Do something together that reminds you why you chose each other — an activity, not just a conversation",
      ],
    },
  },

  "Sanguine-Melancholic": {
    score: 3,
    label: "The Optimist and the Poet",
    summary:
      "This is the classic 'opposites attract' pairing. The Sanguine's lightness and spontaneity draws the Melancholic out of their inner world, while the Melancholic's depth and sensitivity gives the Sanguine something they desperately need but won't admit — emotional substance. The challenge is that each partner's greatest strength is also their greatest source of frustration for the other.",
    strengths: [
      "The Sanguine brings joy, laughter, and lightness that the Melancholic deeply craves",
      "The Melancholic brings emotional depth, thoughtfulness, and meaning that grounds the Sanguine",
      "Natural complement — Sanguine initiates, Melancholic reflects, creating a balanced decision-making rhythm",
      "The Melancholic's attention to detail catches what the Sanguine overlooks",
      "The Sanguine's social ease helps the Melancholic feel less isolated in the world",
    ],
    challenges: [
      "The Sanguine's casualness about plans and commitments wounds the Melancholic's need for reliability",
      "The Melancholic's sensitivity feels suffocating to the free-spirited Sanguine",
      "Different conflict styles: Sanguine deflects with humor, Melancholic withdraws into silence",
      "The Melancholic's critical nature hits the Sanguine harder than it appears",
      "Social energy mismatch — the Sanguine wants to go out, the Melancholic wants depth at home",
    ],
    communication: {
      dos: [
        "The Sanguine should take the Melancholic's concerns seriously even when they seem minor",
        "The Melancholic should express needs directly rather than expecting the Sanguine to read hints",
        "Use written communication (texts, letters) for heavy topics — the Melancholic processes better in writing",
        "The Sanguine should check in after social events: 'How are you feeling about tonight?'",
      ],
      donts: [
        "Don't dismiss the Melancholic's feelings as 'overthinking' — to them, it's their entire inner experience",
        "Don't let the Sanguine's cheerfulness become a way to bypass genuine emotional work",
        "Don't schedule every moment — the Melancholic needs unstructured time to recharge",
        "Don't use the Melancholic's past mistakes as ammunition in current arguments",
      ],
      scripts: [
        {
          situation: "When the Melancholic is upset about a canceled plan",
          partnerA: "I know I canceled last minute and that's not okay. You were counting on it and I got caught up. What would help you right now?",
          partnerB: "It's not just the plan. It's that I organized my whole afternoon around it. I need to know I can count on what we agree to.",
        },
        {
          situation: "When the Sanguine feels emotionally drained by the Melancholic's intensity",
          partnerA: "I love how deeply you feel things, but tonight I'm running low. Can I have an hour to recharge and then I'm all yours?",
          partnerB: "That's fair. I don't want to drain you. Just come back to me when you're ready — knowing you'll return makes the wait okay.",
        },
        {
          situation: "When discussing a life decision with different perspectives",
          partnerA: "I've been thinking about what you said regarding the job offer. You see risks I missed. Can you walk me through your concerns one more time?",
          partnerB: "I think it could be a good move for us. I just need to feel like we're choosing it together and not rushing. Can we make a pros and cons list this weekend?",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Words of affirmation", "Physical touch", "Quality time"],
        receives: ["Quality time", "Words of affirmation", "Acts of service"],
      },
      partnerB: {
        gives: ["Acts of service", "Quality time", "Words of affirmation"],
        receives: ["Words of affirmation", "Quality time", "Receiving gifts"],
      },
      match:
        "The Sanguine loves lavishly through words and touch, flooding the Melancholic with warmth. The Melancholic loves through quiet acts of service and devoted attention. The friction is in receiving — the Sanguine needs to slow down enough to notice the Melancholic's subtle expressions of love, and the Melancholic needs to accept the Sanguine's effusiveness as genuine rather than superficial.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "The Sanguine should slow down and prioritize emotional connection before physical",
          "The Melancholic should communicate desires openly rather than expecting the Sanguine to intuit",
          "Create rituals — a weekly date, a nightly check-in — that honor the Melancholic's need for consistency",
        ],
        risk:
          "The Sanguine treats intimacy lightly while the Melancholic invests deep emotional weight, creating a painful mismatch in expectations.",
      },
      finances: {
        tips: [
          "The Melancholic's natural budgeting skills can complement the Sanguine's earning energy",
          "The Sanguine should respect the Melancholic's financial anxiety rather than dismissing it",
          "Build an emergency fund together — it soothes the Melancholic's worst-case thinking",
        ],
        risk:
          "The Sanguine's spending feels reckless to the Melancholic, and the Melancholic's caution feels restrictive to the Sanguine. Every purchase becomes a silent referendum on values.",
      },
      parenting: {
        tips: [
          "The Melancholic ensures structure, education, and emotional safety",
          "The Sanguine ensures fun, adventure, and social confidence in the children",
          "Both must learn to support each other's parenting style in front of the kids",
        ],
        risk:
          "The Melancholic becomes the anxious, overprotective parent while the Sanguine is the permissive one, leaving kids confused about boundaries.",
      },
      household: {
        tips: [
          "The Melancholic's standards for order meet the Sanguine's energy for hospitality",
          "Divide spaces: the Melancholic curates the home's aesthetic, the Sanguine keeps it welcoming",
          "Accept that neither will be perfect and find a livable middle ground",
        ],
        risk:
          "The Melancholic's need for order clashes with the Sanguine's chaos, creating a persistent low-grade tension about how the home should feel.",
      },
      decisions: {
        tips: [
          "The Sanguine's gut instincts complement the Melancholic's analytical approach",
          "Give the Melancholic time to process — don't demand immediate answers",
          "The Sanguine should present options, not conclusions, when seeking the Melancholic's input",
        ],
        risk:
          "The Sanguine decides quickly and the Melancholic agonizes, leading the Sanguine to stop consulting altogether — which devastates the Melancholic.",
      },
      social: {
        tips: [
          "The Sanguine goes to the party; the Melancholic hosts the dinner — honor both styles",
          "The Sanguine should check in during large gatherings to make sure the Melancholic isn't overwhelmed",
          "Build a small circle of deep friendships that satisfies both partners",
        ],
        risk:
          "The Sanguine drags the Melancholic to every event, or the Melancholic's withdrawal isolates the Sanguine. Both feel misunderstood.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling like their emotional experience is being minimized or laughed off",
      triggerB: "Feeling like their energy and enthusiasm is being criticized or dampened",
      escalation:
        "The Melancholic withdraws into cold silence and begins composing mental indictments. The Sanguine panics at the silence and either tries too hard to fix it with humor or gives up and socializes elsewhere. Both feel abandoned.",
      deescalation: [
        "The Sanguine stops trying to 'fix' the mood and simply sits with the Melancholic in the discomfort",
        "The Melancholic breaks the silence with a soft opening: 'I'm not okay, but I'm not gone'",
        "Write a letter or text to each other if face-to-face feels too raw",
      ],
      repair: [
        "The Sanguine acknowledges the specific harm without qualifying it with 'but I didn't mean to'",
        "The Melancholic articulates what they actually needed in the moment",
        "Return to a small shared ritual that reconnects you — cooking, a walk, a song you both love",
      ],
    },
  },

  "Sanguine-Phlegmatic": {
    score: 4,
    label: "Warm and Steady",
    summary:
      "This pairing works because the Phlegmatic's calm, accepting nature gives the Sanguine the one thing they rarely get — unconditional patience. The Sanguine brings energy, excitement, and emotional expressiveness that gently pulls the Phlegmatic out of their comfort zone. The risk is that the Phlegmatic's passivity combined with the Sanguine's avoidance creates a relationship that feels pleasant on the surface but lacks depth and honest confrontation.",
    strengths: [
      "The Phlegmatic's patience absorbs the Sanguine's emotional swings without drama",
      "The Sanguine brings adventure and social warmth to the Phlegmatic's quieter life",
      "Low-conflict dynamic — both prefer harmony over battle",
      "The Phlegmatic's steadiness provides a safe landing pad for the Sanguine's ups and downs",
      "Both are naturally forgiving and hold no grudges, creating emotional safety",
    ],
    challenges: [
      "Neither partner pushes for necessary change — problems get quietly buried",
      "The Phlegmatic's passivity frustrates the Sanguine who wants more engagement",
      "Important conversations die before reaching substance because both avoid discomfort",
      "The Sanguine may unconsciously dominate the relationship's social and emotional agenda",
      "The Phlegmatic's emotional flatness can leave the Sanguine feeling unreciprocated",
    ],
    communication: {
      dos: [
        "The Sanguine should ask open-ended questions and wait — the Phlegmatic needs time to find words",
        "The Phlegmatic should practice volunteering feelings before being asked",
        "Use a structured format for check-ins: 'What went well? What was hard? What do you need?'",
        "The Sanguine should lower the emotional volume so the Phlegmatic can actually absorb what's being said",
      ],
      donts: [
        "Don't interpret the Phlegmatic's calm as agreement — they may be suppressing disagreement",
        "Don't let the Sanguine's energy fill every silence — some space is healthy",
        "Don't assume the relationship is fine just because no one is fighting",
        "Don't let the Phlegmatic's easygoing nature become an excuse to never take a stand",
      ],
      scripts: [
        {
          situation: "When the Sanguine wants to discuss relationship concerns",
          partnerA: "I've noticed we tend to smooth things over instead of really talking. I want to hear what's actually on your mind, even if it's uncomfortable.",
          partnerB: "You're right. I do hold back because I don't want to ruin the mood. But some things have been sitting with me. Can I take some time to put them into words?",
        },
        {
          situation: "When the Phlegmatic feels overwhelmed by the Sanguine's social plans",
          partnerA: "I love that you want to go to the barbecue. I just need to know we'll have some downtime beforehand so I can recharge.",
          partnerB: "Of course. Let's keep the morning free. And if I tap out early, don't take it personally — I just need a quieter space.",
        },
        {
          situation: "When discussing finances",
          partnerA: "I know money stuff isn't exciting, but I want us to be on the same page. Can we sit down this weekend and look at everything together?",
          partnerB: "That sounds reasonable. I'll gather the statements. I'd actually feel better knowing we have a plan — I just never bring it up.",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Words of affirmation", "Quality time", "Physical touch"],
        receives: ["Acts of service", "Quality time", "Words of affirmation"],
      },
      partnerB: {
        gives: ["Acts of service", "Quality time", "Physical touch"],
        receives: ["Quality time", "Acts of service", "Words of affirmation"],
      },
      match:
        "This pairing shares an appreciation for quality time, making shared presence a natural love language. The gap is in expression — the Phlegmatic shows love through consistent, quiet actions (the Sanguine may not notice), while the Sanguine shows love through enthusiastic words and touch (the Phlegmatic may find overwhelming). Learning to translate between these styles is the key.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "The Sanguine should initiate gently rather than dramatically — the Phlegmatic prefers subtlety",
          "The Phlegmatic should express desire verbally since their body language is harder to read",
          "Emotional intimacy through quiet moments together feeds both partners",
        ],
        risk:
          "Physical intimacy becomes routine because neither partner pushes for more vulnerability or novelty. The relationship stays comfortable but shallow.",
      },
      finances: {
        tips: [
          "The Phlegmatic's frugality balances the Sanguine's spending naturally",
          "Automate everything possible — neither is great with financial admin",
          "The Phlegmatic should share financial concerns rather than silently worrying",
        ],
        risk:
          "Financial stagnation. Neither partner pushes for career growth or investment, and the Phlegmatic's contentment with 'enough' meets the Sanguine's unwillingness to focus on money.",
      },
      parenting: {
        tips: [
          "The Phlegmatic provides calm, consistent presence that children deeply need",
          "The Sanguine provides fun, adventure, and emotional validation for kids",
          "Coordinate on discipline — the Phlegmatic's permissiveness needs the Sanguine to step in, and vice versa",
        ],
        risk:
          "Both are too permissive. Neither pushes children toward achievement or accountability, and the kids lack structure.",
      },
      household: {
        tips: [
          "Create simple, automated routines for household management",
          "The Phlegmatic handles daily maintenance; the Sanguine handles social hosting logistics",
          "Accept a lived-in home over a perfect one — both of you are more relaxed that way",
        ],
        risk:
          "The home runs on autopilot with no one actively improving or maintaining it. Slow entropy that neither notices until it's overwhelming.",
      },
      decisions: {
        tips: [
          "The Sanguine brainstorms; the Phlegmatic evaluates — this is a natural partnership",
          "Set decision deadlines — the Phlegmatic's indecision can stall everything",
          "For major decisions, agree to a 'devil's advocate' exercise where you actively seek downsides",
        ],
        risk:
          "The Sanguine decides unilaterally because the Phlegmatic won't push back, then the Phlegmatic quietly resents the direction chosen.",
      },
      social: {
        tips: [
          "The Sanguine maintains the social calendar; the Phlegmatic provides the comfortable home base",
          "The Phlegmatic should have a signal for when they need to leave or need space",
          "Both benefit from a small, reliable social circle rather than a large, draining one",
        ],
        risk:
          "The Sanguine outgrows the Phlegmatic's quieter social world and seeks stimulation elsewhere, creating distance.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling like the Phlegmatic is checked out or emotionally unavailable",
      triggerB: "Feeling pressured to match the Sanguine's emotional intensity or social energy",
      escalation:
        "The Sanguine raises their voice and volume to get a reaction; the Phlegmatic goes silent and shuts down. The Sanguine interprets the silence as indifference and pushes harder, the Phlegmatic retreats further. Eventually the Sanguine gives up and the issue remains unresolved.",
      deescalation: [
        "The Sanguine lowers their volume and says: 'I'm not angry, I'm scared that we're drifting'",
        "The Phlegmatic offers even a small response: 'I hear you. I need a minute, but I'm not going anywhere'",
        "Switch to text or a walk side-by-side if face-to-face feels too intense",
      ],
      repair: [
        "The Sanguine acknowledges that volume and intensity aren't the same as being heard",
        "The Phlegmatic follows up within 24 hours with their thoughts on the issue",
        "Return to a low-key shared activity that reminds you both of the easy comfort you share",
      ],
    },
  },

  "Choleric-Sanguine": {
    score: 4,
    label: "Dynamic Power Duo",
    summary:
      "The Choleric leads with vision and drive; the Sanguine amplifies with warmth and social energy. This is a power couple when aligned — the Choleric sets the direction and the Sanguine makes everyone want to follow. The tension arises when the Choleric's intensity meets the Sanguine's lightness, and neither understands why the other doesn't just see things their way.",
    strengths: [
      "The Choleric provides strategic vision and the Sanguine provides the social capital to execute it",
      "Both are action-oriented and forward-moving — this couple accomplishes things",
      "The Sanguine softens the Choleric's edges, making them more relatable and approachable",
      "The Choleric's decisiveness saves the Sanguine from endless option-paralysis",
      "Natural leadership couple — others look to them as a unit",
    ],
    challenges: [
      "The Choleric's workaholic tendencies clash with the Sanguine's social calendar",
      "The Sanguine's emotional expressiveness overwhelms the Choleric, who sees it as inefficient",
      "Neither naturally delegates or shares emotional labor at home",
      "The Choleric's criticism wounds the Sanguine more deeply than either realizes",
      "Power struggles emerge when both feel their approach is the 'right' one",
    ],
    communication: {
      dos: [
        "The Choleric should lead with appreciation before feedback — the Sanguine needs to feel valued",
        "The Sanguine should get to the point quickly when discussing serious matters with the Choleric",
        "Schedule both business meetings (financial planning, goals) and pleasure (date nights, adventures)",
        "The Choleric should ask 'How do you feel about this?' as a genuine question, not a procedural one",
      ],
      donts: [
        "Don't let the Choleric turn every conversation into a performance review",
        "Don't let the Sanguine avoid serious topics with charm or deflection",
        "Don't compete for dominance in social settings — divide and conquer instead",
        "Don't assume the other's silence means agreement",
      ],
      scripts: [
        {
          situation: "When the Choleric needs the Sanguine to follow through on a commitment",
          partnerA: "I need to talk about the event planning. It's important to me that this gets handled well, and I'm worried it's slipping. Can we make a plan together?",
          partnerB: "You're right, I've been juggling too much. I got excited about the ideas but didn't lock in the details. Let me outline what I'll handle and by when.",
        },
        {
          situation: "When the Sanguine feels emotionally neglected",
          partnerA: "I know you're focused on work right now, but I'm feeling like I'm competing with your laptop for your attention. I miss us.",
          partnerB: "I hear you. The deadline has me in tunnel vision. Let me block off tonight — no screens, just you. I need you to know you're the priority.",
        },
        {
          situation: "When making a major decision together",
          partnerA: "I've done the research on the house move. Here's what I see as the key factors. What's your gut reaction?",
          partnerB: "My gut says it's exciting but scary. I love the idea of a fresh start. Can you walk me through the financial side so I feel grounded in this?",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Quality time", "Receiving gifts"],
        receives: ["Words of affirmation", "Physical touch", "Quality time"],
      },
      partnerB: {
        gives: ["Words of affirmation", "Physical touch", "Quality time"],
        receives: ["Quality time", "Acts of service", "Receiving gifts"],
      },
      match:
        "The Choleric shows love through building and protecting — they handle problems, fix things, and create stability. The Sanguine shows love through words, touch, and presence. The mismatch: the Sanguine may not recognize the Choleric's labor as love, and the Choleric may not recognize the Sanguine's warmth as substance. Both are right.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "The Choleric needs to slow down and create emotional space before physical intimacy",
          "The Sanguine should be direct about needs rather than hinting — the Choleric isn't subtle",
          "Balance the Choleric's intensity with the Sanguine's playfulness in the bedroom",
        ],
        risk:
          "Intimacy becomes another arena for the Choleric to perform and the Sanguine to accommodate, rather than a space of mutual vulnerability.",
      },
      finances: {
        tips: [
          "The Choleric drives income and investment; the Sanguine manages the social and lifestyle budget",
          "Review finances quarterly with specific goals — the Choleric needs targets, the Sanguine needs context",
          "Don't let the Choleric control all financial decisions — the Sanguine has a voice in lifestyle spending",
        ],
        risk:
          "The Choleric treats finances as a one-person job and the Sanguine disengages, creating an unhealthy dependency.",
      },
      parenting: {
        tips: [
          "The Choleric provides discipline and ambition; the Sanguine provides emotional warmth and social skills",
          "The Choleric should resist the urge to parent through the Sanguine",
          "Both must agree on core values and present a unified front",
        ],
        risk:
          "The Choleric pushes children too hard while the Sanguine overcompensates with leniency. Children receive mixed messages about expectations.",
      },
      household: {
        tips: [
          "The Choleric handles systems and logistics; the Sanguine handles atmosphere and hospitality",
          "The Choleric should treat household management as worthy of the same respect as work projects",
          "Create shared standards rather than one partner imposing theirs on the other",
        ],
        risk:
          "The Choleric treats home as a place to recharge for the next work battle, while the Sanguine wants it to be a vibrant social hub. Fundamental tension about what 'home' means.",
      },
      decisions: {
        tips: [
          "The Choleric provides analysis and the Sanguine provides intuition — combine both",
          "For major decisions, the Choleric should present options, not conclusions",
          "The Sanguine should do their homework before pushing back — the Choleric respects informed opinions",
        ],
        risk:
          "The Choleric dominates decisions through sheer force of personality, and the Sanguine eventually stops contributing, leading to a hollow partnership.",
      },
      social: {
        tips: [
          "The Choleric should let the Sanguine lead social planning — it's their natural domain",
          "The Sanguine should respect the Choleric's need for downtime after intense work periods",
          "Build a social circle that includes both the Choleric's professional contacts and the Sanguine's diverse friends",
        ],
        risk:
          "The Choleric sees the Sanguine's social life as frivolous, while the Sanguine sees the Choleric's professional networking as cold. Neither validates the other's social needs.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling like their drive and competence is being questioned or undermined",
      triggerB: "Feeling like their emotions and social needs are being dismissed as unimportant",
      escalation:
        "The Choleric goes cold and analytical, listing every failure. The Sanguine escalates with emotion and volume, then retaliates by being charmingly dismissive. The Choleric sees this as proof of immaturity; the Sanguine sees it as proof of coldness.",
      deescalation: [
        "The Choleric explicitly names their emotion: 'I'm not just angry, I'm scared this won't work'",
        "The Sanguine drops the performance and speaks honestly: 'I don't have the words yet, but I'm hurting'",
        "Agree on a time limit for the argument and a specific time to reconvene",
      ],
      repair: [
        "The Choleric initiates physical reconnection — a hand on the shoulder, a hug — before words",
        "The Sanguine articulates what they need moving forward, not just what they felt",
        "Do something that plays to both your strengths — remind yourselves why you're powerful together",
      ],
    },
  },

  "Choleric-Choleric": {
    score: 2,
    label: "Battle of the Titans",
    summary:
      "Two Cholerics together is a high-octane relationship with enormous potential and enormous risk. When they're aligned, they're unstoppable — a power couple that builds, achieves, and dominates. When they're misaligned, every interaction becomes a power struggle. Neither backs down, neither yields, and both are convinced they're right. The relationship either forges diamonds or breaks both partners.",
    strengths: [
      "Unmatched combined drive and ambition — this couple can build anything together",
      "Mutual respect for competence and determination creates deep admiration",
      "No confusion about what either partner wants — both are direct and clear",
      "Both are natural leaders who understand the pressure of responsibility",
      "When aligned on a goal, their efficiency and determination is awe-inspiring",
    ],
    challenges: [
      "Every disagreement becomes a battle for dominance — neither yields easily",
      "Neither partner naturally provides emotional nurturing or gentle care",
      "Workaholic tendencies compound — the relationship becomes another project to optimize",
      "Both criticize freely but receive criticism poorly, creating a toxic double standard",
      "Vulnerability is seen as weakness by both, so emotional intimacy struggles to develop",
    ],
    communication: {
      dos: [
        "Establish clear domains of authority — divide responsibilities so you're not competing over the same territory",
        "Practice saying 'You're right' as a complete sentence, without qualifiers",
        "Schedule regular state-of-the-union meetings so small issues don't become full-blown wars",
        "Learn to distinguish between a discussion and a debate — not everything needs a winner",
      ],
      donts: [
        "Don't raise your voice to dominate — it escalates the other Choleric, not quiets them",
        "Don't bring up past victories or failures as leverage in current arguments",
        "Don't compete in front of others — it embarrasses both of you and damages the relationship",
        "Don't issue ultimatums unless you're prepared to follow through",
      ],
      scripts: [
        {
          situation: "When disagreeing about a major purchase",
          partnerA: "I understand why you want this, and I respect your reasoning. My concern is the timing. Can we find a compromise on when to move forward?",
          partnerB: "That's fair. I'm not married to the timeline. Let's set a specific criteria for when we're both comfortable pulling the trigger.",
        },
        {
          situation: "When one partner feels criticized",
          partnerA: "I feel like you're questioning my judgment on this and that's hard for me. Can you tell me what specifically concerns you?",
          partnerB: "I'm not questioning your judgment — I'm adding my perspective. I think we're both smart enough to see different angles. Let me explain where I'm coming from.",
        },
        {
          situation: "When planning the future together",
          partnerA: "We're both ambitious, which I love. But I want to make sure we're building something together, not two separate things in parallel. What does 'us' look like in five years?",
          partnerB: "I want that too. I've been so focused on my goals that I haven't asked about yours lately. Let's map out both our visions and find the overlap.",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Receiving gifts", "Quality time"],
        receives: ["Words of affirmation", "Acts of service", "Quality time"],
      },
      partnerB: {
        gives: ["Acts of service", "Words of affirmation", "Receiving gifts"],
        receives: ["Acts of service", "Quality time", "Physical touch"],
      },
      match:
        "Both Cholerics show love through doing — handling problems, providing materially, and being dependable. The gap is in receiving — both want to be appreciated for their competence but rarely ask for it. The relationship deepens when both learn to say 'I need you' without it feeling like an admission of defeat.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "Intimacy requires vulnerability — both partners must practice letting their guard down",
          "Set aside time that is explicitly not about productivity or achievement",
          "The Choleric who initiates should check in rather than assume readiness",
        ],
        risk:
          "Intimacy becomes transactional or competitive. Neither wants to be the one who 'needs' it more, so both suppress desire until it becomes resentment.",
      },
      finances: {
        tips: [
          "Two high earners can build incredible wealth — but only with a shared strategy",
          "Decide early whether finances are joint, separate, or hybrid — ambiguity causes wars",
          "Set shared financial goals that require collaboration, not competition",
        ],
        risk:
          "Financial power struggles. Both want control, and neither trusts the other's judgment fully. Money becomes a proxy for respect.",
      },
      parenting: {
        tips: [
          "Agree on core values and parenting philosophy before disagreements arise in front of the kids",
          "One partner leads on discipline, the other on emotional support — and both respect the other's domain",
          "Model healthy disagreement for your children — they need to see two strong people navigate conflict with respect",
        ],
        risk:
          "Both parents push children to achieve relentlessly, creating high-achieving but anxious kids. Neither provides the gentle emotional safe harbor children need.",
      },
      household: {
        tips: [
          "Define clear ownership of household domains to prevent turf wars",
          "Accept that home management won't be done 'your way' — and that's okay",
          "Hire help where possible — two Cholerics should invest in reducing domestic friction",
        ],
        risk:
          "The home becomes a secondary battlefield where work habits and standards clash. Neither partner wants to 'lose' by doing more household labor.",
      },
      decisions: {
        tips: [
          "For joint decisions, take turns being the final voice — one issue you lead, the next they lead",
          "Seek external counsel for truly major decisions — two strong opinions need a tiebreaker",
          "Practice genuine curiosity about the other's reasoning, not just waiting for your turn to speak",
        ],
        risk:
          "Decision-making becomes a war of attrition. Both dig in, neither yields, and the relationship becomes a hostage negotiation.",
      },
      social: {
        tips: [
          "Two Cholerics can dominate social scenes — use that power to lift others, not outshine each other",
          "Alternate who chooses social events to avoid always defaulting to one partner's preferences",
          "Protect couple time from being consumed by either partner's professional social obligations",
        ],
        risk:
          "Social settings become performance arenas. Both want to be the most impressive person in the room, and the relationship takes a backseat to individual image.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling their authority or competence is being challenged by their partner",
      triggerB: "Being told what to do or having their judgment questioned",
      escalation:
        "Both Cholerics dig in and escalate simultaneously. Voices rise, arguments become personal, and the fight shifts from the issue to who's the better person. Both say things designed to wound because they know exactly where the other is vulnerable.",
      deescalation: [
        "One partner must break first — frame it as strength: 'I'm choosing us over being right'",
        "Leave the room for 20 minutes, not hours — long separations become power plays",
        "Write down the core of what you're fighting about — often it's not what you think",
      ],
      repair: [
        "The partner who escalated first initiates repair — regardless of who was 'right'",
        "Acknowledge the damage your words caused without minimizing: 'I said something designed to hurt you and that's not okay'",
        "Rebuild through a shared challenge or project that reminds you you're allies, not adversaries",
      ],
    },
  },

  "Choleric-Melancholic": {
    score: 4,
    label: "Visionary and Architect",
    summary:
      "The Choleric dreams big and moves fast; the Melancholic ensures every detail is sound before the first step is taken. Together they can build things that last — the Choleric provides the ambition and the Melancholic provides the blueprint. The friction is in pace and communication: the Choleric sees the Melancholic as too slow and negative, while the Melancholic sees the Choleric as reckless and insensitive.",
    strengths: [
      "Complementary strengths — Choleric provides vision, Melancholic provides quality control",
      "Both value competence and take their commitments seriously",
      "The Melancholic's analytical mind catches problems the Choleric's enthusiasm would miss",
      "The Choleric's decisiveness helps the Melancholic overcome analysis paralysis",
      "Mutual respect for each other's intellectual capabilities creates deep admiration",
    ],
    challenges: [
      "The Choleric's impatience with the Melancholic's deliberation creates constant tension",
      "The Melancholic's criticism hits the Choleric's ego harder than either expects",
      "Different processing speeds — Choleric decides in minutes, Melancholic needs days",
      "The Choleric's directness can be genuinely hurtful to the sensitive Melancholic",
      "Both can become rigid in their positions, creating stubborn standoffs",
    ],
    communication: {
      dos: [
        "The Choleric should explicitly say 'I want your analysis, not just your agreement'",
        "The Melancholic should preface concerns with 'Here's what I've thought through' rather than jumping to problems",
        "Use written communication for complex decisions — the Melancholic processes better in text",
        "The Choleric should schedule time to listen without solving — sometimes the Melancholic just needs to be heard",
      ],
      donts: [
        "Don't rush the Melancholic with deadlines for emotional processing — it backfires",
        "Don't dismiss the Melancholic's concerns as negativity — they're protecting you both",
        "Don't let the Choleric's volume or intensity silence the Melancholic's quieter wisdom",
        "Don't bottle up the Melancholic's feelings until they erupt in a way the Choleric can't manage",
      ],
      scripts: [
        {
          situation: "When the Choleric wants to move fast on a decision",
          partnerA: "I know I'm pushing the timeline. I believe in this opportunity. But I need your honest assessment before we commit. What are you seeing that I'm missing?",
          partnerB: "I've made a list of the risks and requirements. I'm not saying no — I'm saying here's what we need to handle first. Can you read through it tonight?",
        },
        {
          situation: "When the Melancholic is spiraling on analysis",
          partnerA: "I can see you're deep in thought about this. I trust your analysis. Can you give me a summary of where you've landed so far?",
          partnerB: "I keep finding more variables. I want to get this right for us. I think I need two more days to feel confident. Can that work with your timeline?",
        },
        {
          situation: "When discussing emotional needs",
          partnerA: "I know I'm not naturally expressive, but I want you to know that your thoroughness is one of the things I admire most about you. I wouldn't be where I am without it.",
          partnerB: "That means more than you know. I sometimes feel like my carefulness frustrates you. Hearing that you value it — I needed that today.",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Receiving gifts", "Quality time"],
        receives: ["Words of affirmation", "Acts of service", "Physical touch"],
      },
      partnerB: {
        gives: ["Acts of service", "Words of affirmation", "Quality time"],
        receives: ["Quality time", "Words of affirmation", "Acts of service"],
      },
      match:
        "Both Choleric and Melancholic express love through acts of service — handling problems, solving issues, and being reliable. The Choleric's acts are grander and more visible; the Melancholic's are quieter and more consistent. Both need words of affirmation but rarely ask for them. The growth edge is learning to verbalize appreciation instead of assuming it's obvious.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "The Choleric should create emotional safety before initiating — the Melancholic needs to feel valued, not desired",
          "The Melancholic should communicate desires directly — the Choleric doesn't pick up hints",
          "Slow, intentional intimacy serves both partners better than passionate spontaneity",
        ],
        risk:
          "The Choleric's intensity overwhelms the Melancholic's sensitivity, and the Melancholic's need for emotional connection before physical leaves the Choleric feeling rejected.",
      },
      finances: {
        tips: [
          "This is potentially the strongest financial pairing — both are disciplined and goal-oriented",
          "The Melancholic's risk analysis combined with the Choleric's boldness creates smart investing",
          "Share financial planning duties: Choleric on income strategy, Melancholic on budget management",
        ],
        risk:
          "The Choleric's ambitious financial moves trigger the Melancholic's anxiety, and the Melancholic's caution frustrates the Choleric's drive. Financial discussions become stress-filled.",
      },
      parenting: {
        tips: [
          "The Choleric provides ambition and confidence modeling; the Melancholic provides emotional attunement and structure",
          "Agree on expectations for children's academic and personal development early",
          "The Choleric should soften with the Melancholic's emotional parenting style — it's serving the kids",
        ],
        risk:
          "The Choleric pushes children too hard while the Melancholic overprotects. Children receive mixed messages about risk, achievement, and emotional expression.",
      },
      household: {
        tips: [
          "The Melancholic sets the standard; the Choleric provides the energy to execute",
          "The Choleric should respect the Melancholic's attention to detail in the home — it creates beauty and order",
          "Balance the Melancholic's perfectionism with the Choleric's pragmatism: 'good enough' sometimes wins",
        ],
        risk:
          "The Choleric sees the Melancholic's standards as unreasonably high, and the Melancholic sees the Choleric's approach as cutting corners. Neither feels the home is truly theirs.",
      },
      decisions: {
        tips: [
          "This is a powerhouse decision-making pair when the process is structured",
          "The Choleric brings bold vision; the Melancholic stress-tests it — this is a feature, not a bug",
          "Set explicit timelines for decisions so the Melancholic's thoroughness doesn't become paralysis",
        ],
        risk:
          "The Choleric forces decisions before the Melancholic is ready, or the Melancholic delays so long the opportunity passes. Both feel their needs are being ignored.",
      },
      social: {
        tips: [
          "The Choleric networks strategically; the Melancholic cultivates deep friendships — both are valuable",
          "The Melancholic should let the Choleric take the lead at larger events where their energy shines",
          "Build a social circle that includes both high-energy gatherings and intimate dinners",
        ],
        risk:
          "The Choleric's professional social life overwhelms the Melancholic, or the Melancholic's need for quiet evenings limits the Choleric's networking. Social life becomes another source of friction.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling like their partner is too slow, negative, or indecisive",
      triggerB: "Feeling like their partner is insensitive, reckless, or dismissive of their concerns",
      escalation:
        "The Choleric becomes increasingly sharp and impatient; the Melancholic retreats into cold, detailed analysis of every past failure. The Choleric interprets the analysis as an attack; the Melancholic interprets the impatience as contempt.",
      deescalation: [
        "The Choleric explicitly acknowledges the Melancholic's perspective: 'Your concerns are valid and I need to hear them'",
        "The Melancholic softens from analysis to feeling: 'I'm scared, not critical'",
        "Agree on a specific time to revisit the discussion rather than forcing a resolution in the heat",
      ],
      repair: [
        "The Choleric apologizes for tone and impatience — the Melancholic needs to hear it specifically",
        "The Melancholic shares one thing they appreciate about the Choleric's approach",
        "Engage in a shared activity that leverages both your strengths — rebuild the sense of partnership",
      ],
    },
  },

  "Choleric-Phlegmatic": {
    score: 3,
    label: "The Driver and the Anchor",
    summary:
      "The Choleric charges ahead while the Phlegmatic provides a steady, calming counterweight. This can be deeply complementary — the Choleric's fire is tempered by the Phlegmatic's water, creating a relationship that's both ambitious and grounded. But the Choleric may come to see the Phlegmatic as lazy or unmotivated, while the Phlegmatic sees the Choleric as perpetually restless and demanding.",
    strengths: [
      "The Phlegmatic's calm balances the Choleric's intensity, preventing burnout and conflict",
      "The Choleric's drive pushes the Phlegmatic toward growth without feeling attacked",
      "Low emotional volatility — the Phlegmatic absorbs storms without retaliating",
      "The Choleric handles external challenges; the Phlegmatic maintains internal peace",
      "Both are loyal and committed — once they're in, they're in",
    ],
    challenges: [
      "The Choleric's pace overwhelms the Phlegmatic, who needs time to process and adjust",
      "The Phlegmatic's passivity and indecision frustrate the action-oriented Choleric",
      "Emotional depth is limited — both can be surface-level about feelings",
      "The Choleric may unconsciously dominate because the Phlegmatic won't push back",
      "The Phlegmatic's resistance to change manifests as quiet, immovable stubbornness",
    ],
    communication: {
      dos: [
        "The Choleric should state needs clearly and directly — hints are lost on the Phlegmatic",
        "The Phlegmatic should practice proactive communication — share feelings before being asked",
        "Use calm, structured conversations rather than spontaneous emotional check-ins",
        "The Choleric should celebrate the Phlegmatic's steady presence, not just their outputs",
      ],
      donts: [
        "Don't mistake the Phlegmatic's silence for agreement — ask explicitly",
        "Don't escalate volume to get a reaction — the Phlegmatic will withdraw further",
        "Don't interpret the Phlegmatic's contentment as lack of ambition",
        "Don't let the Choleric's dominance turn the Phlegmatic into a passenger rather than a partner",
      ],
      scripts: [
        {
          situation: "When the Choleric is frustrated by the Phlegmatic's pace",
          partnerA: "I know I'm pushing hard on this. I get impatient because I can see the finish line. What do you need from me to feel comfortable moving forward?",
          partnerB: "I need to feel like my input matters, not just your timeline. Give me until Wednesday and I'll have a clear answer with my full support.",
        },
        {
          situation: "When the Phlegmatic feels steamrolled",
          partnerA: "I've been going along with your plans because I trust you, but I realized I haven't shared what I actually want. Can I have space to say it?",
          partnerB: "I want to hear it. I've been so caught up in executing that I forgot to ask. Your vision matters to me too.",
        },
        {
          situation: "When discussing a life change",
          partnerA: "I want to talk about the job offer in the new city. I know it's a lot to process. I don't need an answer today — I need to know what you're feeling about it.",
          partnerB: "Honestly, I'm scared. I like our life here. But I also don't want to hold you back. Can we list out what we'd gain and lose?",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Receiving gifts", "Quality time"],
        receives: ["Acts of service", "Quality time", "Words of affirmation"],
      },
      partnerB: {
        gives: ["Acts of service", "Quality time", "Physical touch"],
        receives: ["Quality time", "Acts of service", "Physical touch"],
      },
      match:
        "Both partners express love through acts of service, making this a quietly devoted pairing. The Choleric handles the big, visible problems while the Phlegmatic handles the daily, invisible ones. The growth edge is verbal expression — neither naturally says 'I love you' in words, so the relationship can feel appreciated but not adored.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "The Choleric should initiate gently — the Phlegmatic needs to feel chosen, not summoned",
          "The Phlegmatic should communicate desire before being asked — the Choleric interprets silence as disinterest",
          "Create a warm, low-pressure environment for physical intimacy",
        ],
        risk:
          "The Choleric's intensity feels demanding to the Phlegmatic, while the Phlegmatic's passivity feels like rejection to the Choleric. Physical intimacy becomes another source of tension rather than connection.",
      },
      finances: {
        tips: [
          "The Choleric's earning ambition paired with the Phlegmatic's frugality creates financial security",
          "The Choleric should share financial vision with the Phlegmatic before making large decisions",
          "The Phlegmatic's steady financial habits can ground the Choleric's riskier instincts",
        ],
        risk:
          "The Choleric makes unilateral financial decisions while the Phlegmatic silently objects. Financial trust erodes without open dialogue.",
      },
      parenting: {
        tips: [
          "The Choleric provides drive and structure; the Phlegmatic provides calm and emotional safety",
          "The Phlegmatic's patience with children is a gift — the Choleric should honor it",
          "Both must resist being permissive — neither is naturally strict, so discipline needs intentionality",
        ],
        risk:
          "The Choleric pushes children too hard while the Phlegmatic provides no counterbalance, creating anxious, people-pleasing kids. Or the Phlegmatic's permissiveness combined with the Choleric's absences creates a parenting vacuum.",
      },
      household: {
        tips: [
          "The Phlegmatic maintains daily routines; the Choleric handles major projects and decisions",
          "The Choleric should acknowledge that the Phlegmatic's consistency is what keeps the home running",
          "Don't let the Choleric's standards override the Phlegmatic's comfortable, livable approach",
        ],
        risk:
          "The Choleric treats the Phlegmatic as household staff rather than a partner. The Phlegmatic complies but loses respect and connection.",
      },
      decisions: {
        tips: [
          "The Choleric leads on time-sensitive decisions; the Phlegmatic leads on lifestyle and values-based ones",
          "The Choleric should explicitly invite the Phlegmatic's opinion — they won't offer it unsolicited",
          "Set a maximum deliberation time so the Phlegmatic's processing doesn't become indefinite delay",
        ],
        risk:
          "The Choleric decides everything and the Phlegmatic goes along, creating an imbalanced dynamic where one partner's preferences always win.",
      },
      social: {
        tips: [
          "The Choleric should attend some social events alone, letting the Phlegmatic stay home guilt-free",
          "The Phlegmatic should make an effort at events the Choleric considers important",
          "Build a small circle of close friends rather than maintaining a large network",
        ],
        risk:
          "The Choleric's social ambitions overwhelm the Phlegmatic, or the Phlegmatic's homebody tendencies isolate the Choleric. Social life becomes a recurring negotiation.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling like the Phlegmatic doesn't care enough or isn't trying hard enough",
      triggerB: "Feeling pressured, criticized, or told they're not enough as they are",
      escalation:
        "The Choleric escalates with directness and volume; the Phlegmatic shuts down completely. The Choleric interprets the shutdown as proof of not caring, which escalates further. The Phlegmatic becomes immovable in their silence, creating a wall the Choleric cannot breach.",
      deescalation: [
        "The Choleric must lower volume and soften approach: 'I'm frustrated, but I'm not leaving and I'm not giving up on us'",
        "The Phlegmatic must offer even minimal engagement: 'I'm still here. I just need you to be less loud about this'",
        "Take a physical break — walk separately, reconvene in 30 minutes",
      ],
      repair: [
        "The Choleric acknowledges the pattern: 'I see that I push you away by pushing too hard'",
        "The Phlegmatic shares one specific thing they need: 'When you speak softly, I can actually hear you'",
        "Return to a shared activity that neither of you finds stressful — rebuild the sense of 'us'",
      ],
    },
  },

  "Melancholic-Sanguine": {
    score: 3,
    label: "The Depth and the Spark",
    summary:
      "The Melancholic's rich inner world meets the Sanguine's vibrant outer world. This pairing offers each partner something they cannot generate alone — the Melancholic learns to laugh more freely, and the Sanguine learns to feel more deeply. The danger is that each partner's natural mode becomes a source of irritation: the Melancholic sees the Sanguine as shallow, and the Sanguine sees the Melancholic as a downer.",
    strengths: [
      "The Melancholic brings emotional depth, loyalty, and thoughtful analysis to the relationship",
      "The Sanguine brings joy, social ease, and spontaneous adventure that enriches the Melancholic's life",
      "Natural complement: Melancholic plans, Sanguine executes with energy and enthusiasm",
      "The Sanguine's warmth can draw the Melancholic out of depressive or isolated episodes",
      "The Melancholic's attention to detail catches problems the Sanguine's optimism overlooks",
    ],
    challenges: [
      "Social energy mismatch — Sanguine wants to go out constantly, Melancholic needs recovery time",
      "The Melancholic's criticism can be devastating to the Sanguine's self-image",
      "The Sanguine's forgetfulness and disorganization wound the Melancholic's need for reliability",
      "Conflict styles clash: Sanguine uses humor to deflect, Melancholic withdraws into brooding silence",
      "The Melancholic's emotional needs can feel like a bottomless well to the Sanguine",
    ],
    communication: {
      dos: [
        "The Melancholic should express criticism as requests, not judgments: 'I need...' not 'You never...'",
        "The Sanguine should sit with the Melancholic's heavy emotions without trying to fix or lighten them",
        "Write things down — the Melancholic remembers details, the Sanguine needs reminders",
        "The Sanguine should check in proactively: 'How are you really doing?' and wait for the real answer",
      ],
      donts: [
        "Don't use humor to dismiss the Melancholic's genuine pain — it feels invalidating",
        "Don't let the Melancholic's perfectionism become emotional punishment for the Sanguine's natural style",
        "Don't avoid serious conversations because they're uncomfortable for the Sanguine",
        "Don't let the Sanguine's cheerfulness hide real issues that need addressing",
      ],
      scripts: [
        {
          situation: "When the Melancholic is upset about the Sanguine forgetting an important date",
          partnerA: "I forgot our anniversary, and I know that hurts you. I'm sorry. It's not that it doesn't matter to me — I genuinely got overwhelmed with work. Can we celebrate it this weekend the way you deserve?",
          partnerB: "It's not just the date. It's that I spent weeks planning something special and it felt like it wasn't important to you. I need to feel like I'm a priority, not an afterthought.",
        },
        {
          situation: "When the Sanguine feels drained by the Melancholic's mood",
          partnerA: "I love you and I want to be here for you. Tonight I'm running on empty. Can I take an hour to recharge and then sit with you? I don't want you to feel abandoned.",
          partnerB: "That's okay. I don't want to drain you. Just knowing you'll come back makes the wait easier. Take your time.",
        },
        {
          situation: "When planning a weekend together",
          partnerA: "I've mapped out a few things I'd love to do this weekend — some quiet, some adventurous. What sounds good to you?",
          partnerB: "I love that you planned. Can we keep Saturday morning open? I like having slow mornings. Everything else sounds great.",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Quality time", "Words of affirmation"],
        receives: ["Words of affirmation", "Quality time", "Physical touch"],
      },
      partnerB: {
        gives: ["Words of affirmation", "Physical touch", "Quality time"],
        receives: ["Acts of service", "Quality time", "Words of affirmation"],
      },
      match:
        "The Sanguine fills the Melancholic's emotional tank with words and warmth; the Melancholic provides the Sanguine with reliable acts of service and devotion. The gap is in recognizing what the other is offering — the Sanguine may not notice the Melancholic's quiet acts of love, and the Melancholic may not trust the Sanguine's effusiveness as genuine.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "The Melancholic needs emotional reassurance before physical intimacy — don't skip the conversation",
          "The Sanguine should slow down and create the atmosphere the Melancholic craves",
          "Both benefit from predictable intimacy rituals that honor the Melancholic's need for consistency",
        ],
        risk:
          "The Sanguine's casual approach to intimacy wounds the Melancholic's deep need for emotional meaning in physical connection.",
      },
      finances: {
        tips: [
          "The Melancholic's budgeting skills compensate for the Sanguine's impulsive spending",
          "Set clear financial boundaries that protect the Melancholic's security needs",
          "The Sanguine should check in before making unplanned purchases over an agreed amount",
        ],
        risk:
          "The Sanguine's spending patterns trigger the Melancholic's financial anxiety, leading to controlling behavior from the Melancholic and resentment from the Sanguine.",
      },
      parenting: {
        tips: [
          "The Melancholic provides emotional attunement and structure; the Sanguine provides fun and social confidence",
          "The Melancholic should resist being the 'worried parent' — kids need to see calm confidence too",
          "The Sanguine should respect the Melancholic's attention to the children's emotional needs",
        ],
        risk:
          "The Melancholic projects anxiety onto the children while the Sanguine is too permissive. Kids need both emotional safety and reasonable boundaries.",
      },
      household: {
        tips: [
          "The Melancholic creates beauty and order; the Sanguine creates warmth and welcome",
          "The Sanguine should put in effort to maintain the Melancholic's standards — it's an act of love",
          "Balance the Melancholic's perfectionism with the Sanguine's lived-in comfort",
        ],
        risk:
          "The Melancholic's standards feel oppressive to the Sanguine, while the Sanguine's messiness feels disrespectful to the Melancholic. The home becomes another arena for conflict.",
      },
      decisions: {
        tips: [
          "The Melancholic provides analysis; the Sanguine provides intuition — combine both for wise decisions",
          "The Melancholic should present concerns as data, not dire predictions",
          "The Sanguine should take the Melancholic's research seriously before deciding",
        ],
        risk:
          "The Melancholic's worst-case thinking paralyzes decision-making, and the Sanguine's optimism dismisses legitimate concerns. Neither feels heard.",
      },
      social: {
        tips: [
          "The Sanguine maintains the social calendar; the Melancholic curates the guest list for deeper gatherings",
          "The Sanguine should attend some events alone to relieve pressure on the Melancholic",
          "Build a small circle of friends who appreciate both your styles",
        ],
        risk:
          "The Sanguine's social life overwhelms the Melancholic, creating resentment. Or the Melancholic's withdrawal isolates the Sanguine from their support network.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling that their emotional pain is being minimized or rushed past",
      triggerB: "Feeling that their enthusiasm and joy is being treated as immature or inappropriate",
      escalation:
        "The Melancholic withdraws into detailed analysis of everything the Sanguine has done wrong, composing mental cases. The Sanguine panics at the silence and either over-apologizes without understanding the issue or retreats into social activity. Both feel abandoned.",
      deescalation: [
        "The Sanguine stops performing cheer and simply says: 'I can see you're hurting. I'm here.'",
        "The Melancholic breaks the silence with something honest: 'I'm not okay, and I need you to sit with me in it'",
        "Switch to text if face-to-face feels too intense — the Melancholic often writes better than they speak",
      ],
      repair: [
        "The Sanguine validates the Melancholic's experience without defending their own behavior",
        "The Melancholic shares what they actually need moving forward, not just what went wrong",
        "Do something small and meaningful together — a meal, a walk, a shared memory — to reconnect",
      ],
    },
  },

  "Melancholic-Choleric": {
    score: 4,
    label: "Visionary and Architect",
    summary:
      "When the Melancholic's analytical depth meets the Choleric's decisive drive, the result is a partnership capable of extraordinary achievement. The Melancholic sees every detail; the Choleric sees the big picture. Together they build things that are both ambitious and sound. The tension lives in pace and emotional bandwidth — the Choleric wants to move now, the Melancholic needs time, and neither naturally accommodates the other's rhythm.",
    strengths: [
      "Melancholic precision combined with Choleric boldness creates thoroughly planned, confidently executed ventures",
      "Both value excellence and competence, creating a high standard for the relationship",
      "The Choleric's decisiveness cuts through the Melancholic's analysis paralysis",
      "The Melancholic's quality control prevents the Choleric's speed from creating costly mistakes",
      "Mutual intellectual respect — this couple genuinely admires each other's minds",
    ],
    challenges: [
      "The Choleric's impatience with the Melancholic's deliberation creates persistent friction",
      "The Melancholic's criticism wounds the Choleric's ego more than either expects",
      "Different emotional processing speeds — Choleric wants resolution now, Melancholic needs days",
      "Both can be rigid and critical, creating harsh exchanges that leave lasting marks",
      "The Choleric's directness can feel like an attack to the sensitive Melancholic",
    ],
    communication: {
      dos: [
        "The Choleric should explicitly ask for the Melancholic's analysis: 'I need your eye on this before I decide'",
        "The Melancholic should present concerns with solutions, not just problems",
        "Use structured formats for complex discussions — both respect logic and order",
        "The Choleric should schedule time to listen without interrupting or problem-solving",
      ],
      donts: [
        "Don't rush the Melancholic with artificial deadlines for emotional processing",
        "Don't dismiss the Melancholic's concerns as pessimism — they're protecting the partnership",
        "Don't let the Choleric's volume silence the Melancholic's legitimate concerns",
        "Don't bottle up feelings until they erupt in cold, detailed indictments",
      ],
      scripts: [
        {
          situation: "When the Choleric wants to make a quick decision",
          partnerA: "I'm ready to commit to the move. Before I do, I need your honest assessment. I know you've been thinking about this. What am I not seeing?",
          partnerB: "I've been running the numbers and the logistics. I have three concerns I'd like to walk through. None of them are dealbreakers, but I need you to hear them before we decide.",
        },
        {
          situation: "When the Melancholic is spiraling in analysis",
          partnerA: "I can see you're working through a lot of variables. I trust your analysis. Can you give me the headline version while you work through the details?",
          partnerB: "The headline is: I'm cautiously optimistic. The details will take me another day. Can we set a specific time to finalize this together?",
        },
        {
          situation: "When the Choleric receives criticism from the Melancholic",
          partnerA: "I hear your concerns about how I handled that meeting. I know I can be too direct. I don't want you to feel unsupported. What would you have done differently?",
          partnerB: "I would have consulted you first. Not because you're wrong, but because your perspective makes us stronger. I want us to be a real team, not just two strong individuals.",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Quality time", "Words of affirmation"],
        receives: ["Words of affirmation", "Acts of service", "Quality time"],
      },
      partnerB: {
        gives: ["Acts of service", "Receiving gifts", "Quality time"],
        receives: ["Words of affirmation", "Physical touch", "Quality time"],
      },
      match:
        "Both partners show love through acts of service — handling problems, being dependable, and contributing tangibly. The Melancholic's service is quieter and more consistent; the Choleric's is more visible and decisive. Both need to hear 'I appreciate you' more than they ask for it. Learning to verbalize admiration is the relationship's growth edge.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "The Choleric should create emotional space before physical intimacy — the Melancholic needs to feel valued",
          "The Melancholic should be direct about desires — the Choleric won't guess",
          "Balance the Choleric's intensity with the Melancholic's need for emotional connection",
        ],
        risk:
          "The Choleric treats intimacy as performance while the Melancholic needs emotional depth, creating a painful mismatch. The Choleric feels rejected; the Melancholic feels used.",
      },
      finances: {
        tips: [
          "This is a powerhouse financial pairing — both are disciplined and goal-oriented",
          "The Melancholic manages budget details; the Choleric drives income and investment strategy",
          "Review finances monthly with clear metrics — both partners appreciate data",
        ],
        risk:
          "The Choleric's ambitious financial moves trigger the Melancholic's anxiety, and financial discussions become battlegrounds rather than strategy sessions.",
      },
      parenting: {
        tips: [
          "The Choleric provides drive and confidence; the Melancholic provides emotional attunement and structure",
          "Agree on expectations and standards for children early, before disagreements arise",
          "The Choleric should respect the Melancholic's emotional parenting — it serves the children's needs",
        ],
        risk:
          "The Choleric pushes children too hard while the Melancholic overprotects. Children receive conflicting messages about risk, achievement, and emotional expression.",
      },
      household: {
        tips: [
          "The Melancholic sets quality standards; the Choleric provides energy and project management",
          "The Choleric should respect the Melancholic's attention to detail as an expression of love, not perfectionism",
          "Balance the Melancholic's standards with the Choleric's pragmatism",
        ],
        risk:
          "The Choleric sees the Melancholic's standards as unreasonably high, and the Melancholic sees the Choleric's approach as cutting corners. The home becomes a source of tension.",
      },
      decisions: {
        tips: [
          "This is a formidable decision-making pair when the process is structured",
          "The Choleric brings vision; the Melancholic stress-tests it — this is partnership, not opposition",
          "Set explicit timelines so the Melancholic's thoroughness doesn't become paralysis",
        ],
        risk:
          "The Choleric forces decisions before the Melancholic is ready, or the Melancholic delays so long the opportunity passes. Both feel their expertise is being dismissed.",
      },
      social: {
        tips: [
          "The Choleric networks strategically; the Melancholic cultivates deep, meaningful friendships",
          "The Melancholic should attend key events even when they'd rather stay home — it matters to the Choleric",
          "Build a social circle that includes both high-energy gatherings and intimate dinners",
        ],
        risk:
          "The Choleric's professional social life overwhelms the Melancholic, or the Melancholic's need for quiet limits the Choleric's career networking.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling that their partner is too slow, indecisive, or negative",
      triggerB: "Feeling that their partner is insensitive, reckless, or dismissive of their concerns",
      escalation:
        "The Choleric becomes sharp and dismissive; the Melancholic retreats into cold, detailed analysis of every past failure. The Choleric interprets this as an attack; the Melancholic interprets the sharpness as contempt. Both become rigid and unwilling to yield.",
      deescalation: [
        "The Choleric explicitly names the dynamic: 'I'm pushing too hard and I can see it's shutting you down'",
        "The Melancholic shifts from analysis to feeling: 'I'm scared, not critical. I need you to hear the fear underneath'",
        "Agree on a specific time to revisit — don't force resolution in the heat of conflict",
      ],
      repair: [
        "The Choleric apologizes for tone and impatience — specific and genuine",
        "The Melancholic shares one thing they appreciate about the Choleric's approach",
        "Engage in a shared project that leverages both strengths — rebuild the sense of being allies",
      ],
    },
  },

  "Melancholic-Melancholic": {
    score: 3,
    label: "Deep Understanding, Deep Water",
    summary:
      "Two Melancholics create a relationship of extraordinary depth, loyalty, and mutual understanding. No one understands a Melancholic's inner world better than another Melancholic. But this same depth becomes the relationship's greatest risk — two sensitive, critical, perfectionist tendencies can amplify each other into a spiral of shared pessimism, mutual criticism, and emotional isolation within the same house.",
    strengths: [
      "Profound emotional understanding — both partners truly 'get' each other's inner world",
      "Loyalty and devotion run deep — neither takes commitment lightly",
      "Shared standards for quality, order, and excellence create a beautiful, well-managed life",
      "Intellectual companionship is rich — deep conversations, shared interests, mutual growth",
      "Both value fidelity and faithfulness, creating strong trust foundations",
    ],
    challenges: [
      "Shared pessimism creates a feedback loop where both partners reinforce each other's worst fears",
      "Neither naturally provides the lightness and fun the relationship needs to breathe",
      "Mutual criticism can become devastating — both know exactly where the other is vulnerable",
      "Decision-making paralysis — both want more information before committing",
      "Emotional withdrawal duels — both retreat into silence and expect the other to initiate repair",
    ],
    communication: {
      dos: [
        "Schedule regular emotional check-ins so neither partner suppresses too long",
        "Practice expressing appreciation daily — it doesn't come naturally to either of you",
        "Bring in external perspectives (friends, therapist, books) to break the echo chamber",
        "Learn to distinguish between constructive feedback and critical habit",
      ],
      donts: [
        "Don't create a 'misery loves company' dynamic where you bond over shared complaints",
        "Don't use your knowledge of each other's vulnerabilities as weapons",
        "Don't let silence become the default mode — it feels safe but builds walls",
        "Don't both retreat after conflict expecting the other to break first",
      ],
      scripts: [
        {
          situation: "When both partners are feeling down",
          partnerA: "I've noticed we've both been heavy lately. I don't want us to drown together. Can we talk about what's actually weighing on each of us?",
          partnerB: "I've been carrying the work stress silently because I didn't want to add to your load. But sharing it might help. Can I tell you what's going on?",
        },
        {
          situation: "When one Melancholic criticizes the other",
          partnerA: "I know I've been critical about the way you handle things. The truth is, I'm anxious and I'm projecting. I'm sorry. You don't deserve that.",
          partnerB: "Thank you for saying that. I've noticed I do the same thing. Can we make a deal — when either of us starts criticizing, we name what we're actually feeling instead?",
        },
        {
          situation: "When deciding on a major life change",
          partnerA: "We've been going back and forth for weeks. I think we're both afraid of making the wrong choice. What if we set a decision date and commit to deciding by then?",
          partnerB: "That scares me, but you're right. Endless analysis isn't helping. Let's gather the remaining information and decide together on Friday.",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Quality time", "Words of affirmation"],
        receives: ["Words of affirmation", "Quality time", "Acts of service"],
      },
      partnerB: {
        gives: ["Acts of service", "Words of affirmation", "Quality time"],
        receives: ["Acts of service", "Quality time", "Words of affirmation"],
      },
      match:
        "Both Melancholics show love through devoted acts of service and quality time. They understand each other's need for deep conversation and meaningful connection. The gap is in verbal affirmation — both want to hear they're valued but neither naturally offers it. The relationship deepens enormously when both practice daily expressions of appreciation.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "Both partners need emotional safety before physical intimacy — ensure this is established",
          "Create predictable intimacy rituals that honor both partners' need for consistency",
          "Verbalize desire explicitly — neither partner's body language is easy to read",
        ],
        risk:
          "Physical intimacy becomes infrequent because both partners retreat into their inner worlds. Neither initiates because both fear rejection, and the silence becomes self-reinforcing.",
      },
      finances: {
        tips: [
          "Financially disciplined pairing — both are careful and goal-oriented",
          "Avoid over-saving at the expense of enjoying life — set a 'joy budget' for experiences",
          "One partner should take the lead on financial administration to prevent double-analysis",
        ],
        risk:
          "Both partners' financial anxiety creates a joyless, scarcity-minded approach to money. The relationship becomes about survival rather than thriving.",
      },
      parenting: {
        tips: [
          "Both provide excellent structure, emotional attunement, and intellectual stimulation for children",
          "Consciously introduce fun, adventure, and spontaneity into family life — it won't happen naturally",
          "Ensure children see healthy conflict resolution, not just cold silence after disagreements",
        ],
        risk:
          "Both parents' anxiety and perfectionism create high-pressure, emotionally heavy household. Children learn that the world is dangerous and mistakes are catastrophic.",
      },
      household: {
        tips: [
          "Your home will be beautiful and well-ordered — that's a genuine strength",
          "Balance perfectionism with joy — the home should feel lived-in, not like a museum",
          "Accept that some mess is a sign of life, not failure",
        ],
        risk:
          "The home becomes an expression of shared perfectionism that neither partner can relax in. Standards become a prison rather than a comfort.",
      },
      decisions: {
        tips: [
          "Set explicit decision deadlines — both partners will default to more analysis",
          "Seek external input from a trusted advisor to break the echo chamber",
          "Make small decisions quickly to build decision-making confidence for bigger ones",
        ],
        risk:
          "Decision paralysis. Both partners wait for more information, more analysis, more certainty. Opportunities pass while both wait for perfect clarity that never comes.",
      },
      social: {
        tips: [
          "Build a small circle of deep friendships rather than a wide social network",
          "Take turns being the one to initiate social plans — neither will do it naturally",
          "Both benefit from one friend who is more outgoing and drags you out of the house",
        ],
        risk:
          "Social isolation. Both partners' preference for solitude compounds into a reclusive lifestyle that neither truly wants but neither breaks.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling their partner's criticism confirms their own worst self-image",
      triggerB: "Feeling their partner is not meeting the standards they've silently agreed to",
      escalation:
        "Both Melancholic partners retreat into separate rooms of cold silence. Each composes a mental case for why they're right and the other is wrong. Hours or days pass without communication. Both wait for the other to break first. The silence becomes the conflict itself.",
      deescalation: [
        "One partner must break the silence — even a text: 'I miss you and I'm sorry'",
        "Write a letter if speaking feels too vulnerable — Melancholics often express themselves better in writing",
        "Acknowledge the pattern out loud: 'We're doing the withdrawal thing again. I don't want this to define us.'",
      ],
      repair: [
        "Each partner shares one thing they appreciate and one thing they need — alternating turns",
        "Return to a small, shared ritual that reconnects you — tea, a walk, a familiar routine",
        "Discuss what triggered the withdrawal and agree on a different response next time",
      ],
    },
  },

  "Melancholic-Phlegmatic": {
    score: 4,
    label: "Quiet Depths",
    summary:
      "This is one of the calmest, most peaceful pairings in the temperament matrix. The Melancholic's sensitivity is met by the Phlegmatic's steady acceptance, and the Phlegmatic's emotional flatness is balanced by the Melancholic's depth. Together they create a gentle, understanding home. The risk is that this pairing becomes too comfortable, too quiet, and too avoidant of anything that might disrupt the peace.",
    strengths: [
      "Deep mutual understanding without the need for loud expression — both communicate quietly",
      "The Phlegmatic's patience is exactly what the sensitive Melancholic needs to feel safe",
      "Both value peace, routine, and domestic comfort, creating a harmonious home life",
      "The Melancholic's depth enriches the Phlegmatic's inner world without overwhelming it",
      "Low-conflict dynamic — disagreements are handled gently and resolved quietly",
    ],
    challenges: [
      "Neither partner pushes for growth, change, or adventure — the relationship can stagnate",
      "Important issues get buried under layers of polite avoidance",
      "The Melancholic's emotional needs may exceed the Phlegmatic's capacity to engage",
      "Social life dwindles as both prefer quiet evenings at home over external stimulation",
      "The Melancholic's critical nature may erode the Phlegmatic's quiet contentment over time",
    ],
    communication: {
      dos: [
        "Create a regular check-in ritual — this pairing needs structure to discuss feelings",
        "The Melancholic should express needs gently but directly — the Phlegmatic won't pick up hints",
        "The Phlegmatic should practice volunteering feelings before being asked",
        "Use written communication for deeper topics — both process better without pressure",
      ],
      donts: [
        "Don't let polite avoidance become the default — important things will go unsaid for years",
        "Don't interpret the Phlegmatic's calm as deep agreement — they may be suppressing concerns",
        "Don't let the Melancholic's emotional depth become a one-sided monologue the Phlegmatic endures",
        "Don't use silence as a weapon — both are too comfortable with it, and it becomes destructive",
      ],
      scripts: [
        {
          situation: "When the Melancholic feels emotionally neglected",
          partnerA: "I've been feeling a distance between us, and I know we both tend to let things settle. But this one I don't want to let settle. Can we talk about it?",
          partnerB: "I've felt it too, honestly. I just didn't know how to bring it up without making things worse. I'm glad you did. What's been weighing on you?",
        },
        {
          situation: "When the Phlegmatic wants to introduce change",
          partnerA: "I've been thinking about us taking a trip somewhere new. I know we're comfortable in our routine, but I think a change of scenery could be good for both of us.",
          partnerB: "That actually sounds lovely. I've been in a rut too and didn't realize it. Where are you thinking? I want to be part of planning this.",
        },
        {
          situation: "When discussing the future",
          partnerA: "I want to make sure we're growing together, not just existing side by side. What do you want our life to look like in a few years?",
          partnerB: "I want more of what we have, but with more intention. Maybe we add things that bring us joy — travel, hobbies, time with friends. What do you envision?",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Quality time", "Words of affirmation"],
        receives: ["Quality time", "Words of affirmation", "Physical touch"],
      },
      partnerB: {
        gives: ["Acts of service", "Quality time", "Physical touch"],
        receives: ["Acts of service", "Quality time", "Words of affirmation"],
      },
      match:
        "This pairing shares a love of quality time and acts of service, creating a quietly devoted relationship. Both show love through consistent, daily actions rather than grand gestures. The gap is in verbal and physical expression — both need affirmation but neither naturally initiates it. Consciously building a habit of saying 'I love you' and showing physical affection transforms this pairing.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "Both need emotional safety and predictability — create intimate rituals",
          "The Melancholic should communicate desires openly; the Phlegmatic should reciprocate verbally",
          "Physical intimacy benefits from gentle initiation rather than dramatic overtures",
        ],
        risk:
          "Physical intimacy becomes routine and infrequent because both partners are comfortable with silence and neither pushes for more connection.",
      },
      finances: {
        tips: [
          "Financially stable pairing — both are careful and deliberate with money",
          "One partner takes the lead on financial admin to prevent double-analysis",
          "Set a 'joy budget' for experiences — both may default to saving over spending on happiness",
        ],
        risk:
          "Financial stagnation. Neither pushes for growth or investment, and the relationship settles into a comfortable but limited financial life.",
      },
      parenting: {
        tips: [
          "Both provide gentle, consistent, emotionally safe parenting",
          "Consciously introduce adventure and fun into family life — it won't happen naturally",
          "Ensure children have structure and boundaries — gentle parenting still needs limits",
        ],
        risk:
          "Both parents are too gentle, creating a household with too few boundaries. Children need more structure than this pairing naturally provides.",
      },
      household: {
        tips: [
          "Your home will be comfortable, orderly, and peaceful — a genuine sanctuary",
          "Add warmth and personality through shared projects and creative touches",
          "Accept that neither will be a deep cleaner — establish simple, sustainable routines",
        ],
        risk:
          "The home becomes stale and uninspired. Both partners' comfort with the status quo means the space slowly becomes lifeless.",
      },
      decisions: {
        tips: [
          "The Melancholic's analysis combined with the Phlegmatic's calm creates wise, measured decisions",
          "Set decision deadlines — neither partner will rush naturally",
          "Seek outside perspectives when you're stuck — a trusted friend or advisor helps break the echo chamber",
        ],
        risk:
          "Decision paralysis. Both partners default to 'let's think about it' indefinitely, and opportunities pass while both wait for certainty.",
      },
      social: {
        tips: [
          "Build a small, reliable social circle — both prefer depth over breadth",
          "Schedule regular social engagements so you don't default to isolation",
          "One partner should take turns being the social initiator — it won't happen spontaneously",
        ],
        risk:
          "Social isolation. Both partners' preference for quiet evenings compounds into a reclusive lifestyle that slowly becomes lonely.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling that their emotional needs are being ignored or that the relationship lacks depth",
      triggerB: "Feeling pressured to be more emotional or more expressive than is natural",
      escalation:
        "The Melancholic retreats into detailed, internal analysis of every slight while the Phlegmatic retreats into comfortable silence. Neither addresses the issue. Days pass in polite coexistence while emotional distance grows. The Melancholic feels abandoned; the Phlegmatic feels confused about what went wrong.",
      deescalation: [
        "The Melancholic writes a letter or text expressing their feelings — it breaks the paralysis",
        "The Phlegmatic makes a genuine effort to engage: 'I can tell something's wrong. I want to understand'",
        "Do something physical together — a walk, cooking, a drive — side-by-side contact lowers defenses",
      ],
      repair: [
        "Both partners share one feeling and one need, alternating — keep it structured and safe",
        "Return to a shared comfort ritual — tea, a favorite show, a familiar walk",
        "Discuss the avoidance pattern itself: 'We both shut down. How do we catch it earlier next time?'",
      ],
    },
  },

  "Phlegmatic-Sanguine": {
    score: 4,
    label: "Warm and Steady",
    summary:
      "The Phlegmatic's calm, accepting nature pairs beautifully with the Sanguine's warmth and energy. The Phlegmatic provides a stable, non-judgmental home base that the Sanguine desperately needs but would never admit. The Sanguine brings color, laughter, and social connection to the Phlegmatic's quieter world. The risk is a pleasant-but-shallow dynamic where neither partner pushes for deeper emotional work.",
    strengths: [
      "The Phlegmatic's patience and acceptance creates emotional safety for the Sanguine's ups and downs",
      "The Sanguine brings adventure and social warmth that enriches the Phlegmatic's comfortable life",
      "Naturally harmonious — both prefer peace over conflict and kindness over truth",
      "The Phlegmatic's steadiness grounds the Sanguine's emotional swings",
      "Both are naturally forgiving, creating a relationship free from grudge-holding",
    ],
    challenges: [
      "Neither partner pushes for necessary change — comfort becomes a trap",
      "Important conversations die before reaching substance because both avoid discomfort",
      "The Sanguine may unconsciously dominate the relationship's agenda and social life",
      "The Phlegmatic's emotional flatness can leave the Sanguine feeling unreciprocated",
      "Problems get quietly buried and never addressed, building invisible resentment",
    ],
    communication: {
      dos: [
        "The Sanguine should ask open-ended questions and wait — the Phlegmatic needs processing time",
        "The Phlegmatic should practice volunteering feelings before being asked",
        "Use structured check-ins: 'What went well? What was hard? What do you need?'",
        "The Sanguine should lower emotional volume so the Phlegmatic can actually absorb what's being said",
      ],
      donts: [
        "Don't interpret the Phlegmatic's calm as agreement — they may be suppressing disagreement",
        "Don't let the Sanguine's energy fill every silence — some space is healthy",
        "Don't assume the relationship is fine just because no one is fighting",
        "Don't let the Phlegmatic's passivity become an excuse to never take a stand",
      ],
      scripts: [
        {
          situation: "When the Sanguine wants to address a concern",
          partnerA: "I've noticed we tend to smooth things over instead of really talking. I want to hear what's actually on your mind, even if it's uncomfortable.",
          partnerB: "You're right, I do hold back because I don't want to ruin the mood. But some things have been sitting with me. Can I take some time to put them into words?",
        },
        {
          situation: "When the Phlegmatic needs alone time",
          partnerA: "I love being with you, but I need a quiet evening tonight to recharge. It's not about you — it's just how I refuel.",
          partnerB: "Of course. I'll make other plans for tonight. Just know I'm not going far — I'll be here when you're ready.",
        },
        {
          situation: "When planning something fun together",
          partnerA: "I've been thinking about us taking a cooking class together. Something fun but not overwhelming. What do you think?",
          partnerB: "That sounds nice. I like that it's low-key but we'd be doing something together. Can we pick a date that works for both of us?",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Quality time", "Physical touch"],
        receives: ["Quality time", "Acts of service", "Words of affirmation"],
      },
      partnerB: {
        gives: ["Words of affirmation", "Physical touch", "Quality time"],
        receives: ["Acts of service", "Quality time", "Words of affirmation"],
      },
      match:
        "The Phlegmatic shows love through consistent, quiet presence and reliability. The Sanguine shows love through words, touch, and enthusiastic inclusion. Both value quality time, making shared presence a natural meeting ground. The gap: the Phlegmatic's love is harder to see, and the Sanguine's can feel superficial. Learning to translate between these styles deepens the bond enormously.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "The Sanguine should initiate gently rather than dramatically — the Phlegmatic prefers subtlety",
          "The Phlegmatic should express desire verbally since their body language is harder to read",
          "Emotional intimacy through quiet, consistent moments feeds both partners",
        ],
        risk:
          "Physical intimacy becomes routine because neither partner pushes for more vulnerability or novelty. The relationship stays comfortable but never deepens.",
      },
      finances: {
        tips: [
          "The Phlegmatic's frugality balances the Sanguine's spending naturally",
          "Automate everything possible — neither is great with financial admin",
          "The Phlegmatic should share financial concerns rather than silently worrying",
        ],
        risk:
          "Financial stagnation. Neither pushes for growth, and the relationship settles into a comfortable but limited financial life.",
      },
      parenting: {
        tips: [
          "The Phlegmatic provides calm, consistent presence; the Sanguine provides fun and emotional warmth",
          "Coordinate on discipline — the Phlegmatic's permissiveness needs the Sanguine to step in, and vice versa",
          "Both must resist being too permissive — children need boundaries even from gentle parents",
        ],
        risk:
          "Both are too permissive. Neither pushes children toward achievement or accountability, and the kids lack structure and direction.",
      },
      household: {
        tips: [
          "Create simple, automated routines for household management",
          "The Phlegmatic handles daily maintenance; the Sanguine handles social hosting logistics",
          "Accept a lived-in home over a perfect one — both of you are more relaxed that way",
        ],
        risk:
          "The home runs on autopilot with no one actively improving it. Slow entropy that neither notices until it's overwhelming.",
      },
      decisions: {
        tips: [
          "The Sanguine brainstorms; the Phlegmatic evaluates — this is a natural partnership",
          "Set decision deadlines — the Phlegmatic's indecision can stall everything",
          "For major decisions, agree to a 'devil's advocate' exercise to actively seek downsides",
        ],
        risk:
          "The Sanguine decides unilaterally because the Phlegmatic won't push back, then the Phlegmatic quietly resents the direction chosen.",
      },
      social: {
        tips: [
          "The Sanguine maintains the social calendar; the Phlegmatic provides the comfortable home base",
          "The Phlegmatic should have a signal for when they need to leave or need space",
          "Build a small, reliable social circle rather than a large, draining one",
        ],
        risk:
          "The Sanguine outgrows the Phlegmatic's quieter social world and seeks stimulation elsewhere, creating distance and disconnection.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling like the Phlegmatic is checked out or emotionally unavailable",
      triggerB: "Feeling pressured to match the Sanguine's emotional intensity or social energy",
      escalation:
        "The Sanguine raises their volume to get a reaction; the Phlegmatic goes silent and shuts down. The Sanguine interprets the silence as indifference and pushes harder; the Phlegmatic retreats further. Eventually the Sanguine gives up and the issue remains unresolved.",
      deescalation: [
        "The Sanguine lowers their volume and says: 'I'm not angry, I'm scared that we're drifting'",
        "The Phlegmatic offers even a small response: 'I hear you. I need a minute, but I'm not going anywhere'",
        "Switch to text or a walk side-by-side if face-to-face feels too intense",
      ],
      repair: [
        "The Sanguine acknowledges that volume and intensity aren't the same as being heard",
        "The Phlegmatic follows up within 24 hours with their thoughts on the issue",
        "Return to a low-key shared activity that reminds you both of the easy comfort you share",
      ],
    },
  },

  "Phlegmatic-Choleric": {
    score: 3,
    label: "The Driver and the Anchor",
    summary:
      "The Choleric charges forward with vision and drive while the Phlegmatic provides a steady, calming anchor. This pairing works when both partners respect what the other brings — the Choleric's ambition is tempered by the Phlegmatic's wisdom, and the Phlegmatic's contentment is energized by the Choleric's drive. The danger is the Choleric seeing the Phlegmatic as lazy and the Phlegmatic seeing the Choleric as exhausting.",
    strengths: [
      "The Phlegmatic's calm absorbs the Choleric's storms, creating emotional stability",
      "The Choleric's drive pushes the Phlegmatic toward growth without feeling attacked",
      "Low emotional volatility — the Phlegmatic doesn't escalate, creating natural de-escalation",
      "The Choleric handles external challenges; the Phlegmatic maintains internal peace",
      "Both are loyal and committed — once they choose each other, they don't waver",
    ],
    challenges: [
      "The Choleric's pace overwhelms the Phlegmatic, who needs time to process and adjust",
      "The Phlegmatic's passivity and indecision frustrate the action-oriented Choleric",
      "Emotional depth is limited — both can be surface-level about feelings",
      "The Choleric may unconsciously dominate because the Phlegmatic won't push back",
      "The Phlegmatic's resistance to change manifests as quiet, immovable stubbornness",
    ],
    communication: {
      dos: [
        "The Choleric should state needs clearly and directly — hints are lost on the Phlegmatic",
        "The Phlegmatic should practice proactive communication — share feelings before being asked",
        "Use calm, structured conversations rather than spontaneous emotional check-ins",
        "The Choleric should celebrate the Phlegmatic's steady presence, not just their outputs",
      ],
      donts: [
        "Don't mistake the Phlegmatic's silence for agreement — ask explicitly",
        "Don't escalate volume to get a reaction — the Phlegmatic will withdraw further",
        "Don't interpret the Phlegmatic's contentment as lack of ambition",
        "Don't let the Choleric's dominance turn the Phlegmatic into a passenger rather than a partner",
      ],
      scripts: [
        {
          situation: "When the Choleric is frustrated by the Phlegmatic's pace",
          partnerA: "I know I'm pushing hard on this. I get impatient because I can see the finish line. What do you need from me to feel comfortable moving forward?",
          partnerB: "I need to feel like my input matters, not just your timeline. Give me until Wednesday and I'll have a clear answer with my full support.",
        },
        {
          situation: "When the Phlegmatic feels steamrolled",
          partnerA: "I've been going along with your plans because I trust you, but I realized I haven't shared what I actually want. Can I have space to say it?",
          partnerB: "I want to hear it. I've been so caught up in executing that I forgot to ask. Your vision matters to me too.",
        },
        {
          situation: "When the Phlegmatic resists a change the Choleric wants",
          partnerA: "I can see you're not ready for this move. I don't want to force it. Can you tell me what's holding you back?",
          partnerB: "I need to understand why this matters so much to you. If you can help me see the bigger picture, I'm more likely to get on board.",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Quality time", "Physical touch"],
        receives: ["Quality time", "Acts of service", "Words of affirmation"],
      },
      partnerB: {
        gives: ["Acts of service", "Receiving gifts", "Quality time"],
        receives: ["Acts of service", "Quality time", "Words of affirmation"],
      },
      match:
        "Both partners express love through acts of service — handling problems and being dependable. The Choleric's acts are grander and more visible; the Phlegmatic's are quieter and more consistent. Both need to hear 'I appreciate you' but neither naturally asks. Learning to verbalize admiration transforms this pairing from quietly devoted to genuinely connected.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "The Choleric should initiate gently — the Phlegmatic needs to feel chosen, not summoned",
          "The Phlegmatic should communicate desire before being asked — the Choleric interprets silence as disinterest",
          "Create a warm, low-pressure environment for physical intimacy",
        ],
        risk:
          "The Choleric's intensity feels demanding to the Phlegmatic, while the Phlegmatic's passivity feels like rejection to the Choleric. Physical intimacy becomes another source of tension.",
      },
      finances: {
        tips: [
          "The Choleric's earning ambition paired with the Phlegmatic's frugality creates financial security",
          "The Choleric should share financial vision with the Phlegmatic before making large decisions",
          "The Phlegmatic's steady financial habits can ground the Choleric's riskier instincts",
        ],
        risk:
          "The Choleric makes unilateral financial decisions while the Phlegmatic silently objects. Financial trust erodes without open dialogue.",
      },
      parenting: {
        tips: [
          "The Choleric provides drive and structure; the Phlegmatic provides calm and emotional safety",
          "The Phlegmatic's patience with children is a gift — the Choleric should honor it",
          "Both must resist being permissive — neither is naturally strict, so discipline needs intentionality",
        ],
        risk:
          "The Choleric pushes children too hard while the Phlegmatic provides no counterbalance. Or the Phlegmatic's permissiveness combined with the Choleric's absences creates a parenting vacuum.",
      },
      household: {
        tips: [
          "The Phlegmatic maintains daily routines; the Choleric handles major projects and decisions",
          "The Choleric should acknowledge that the Phlegmatic's consistency is what keeps the home running",
          "Don't let the Choleric's standards override the Phlegmatic's comfortable, livable approach",
        ],
        risk:
          "The Choleric treats the Phlegmatic as household staff rather than a partner. The Phlegmatic complies but loses respect and connection.",
      },
      decisions: {
        tips: [
          "The Choleric leads on time-sensitive decisions; the Phlegmatic leads on lifestyle and values-based ones",
          "The Choleric should explicitly invite the Phlegmatic's opinion — they won't offer it unsolicited",
          "Set a maximum deliberation time so the Phlegmatic's processing doesn't become indefinite delay",
        ],
        risk:
          "The Choleric decides everything and the Phlegmatic goes along, creating an imbalanced dynamic where one partner's preferences always win.",
      },
      social: {
        tips: [
          "The Choleric should attend some social events alone, letting the Phlegmatic stay home guilt-free",
          "The Phlegmatic should make an effort at events the Choleric considers important",
          "Build a small circle of close friends rather than maintaining a large network",
        ],
        risk:
          "The Choleric's social ambitions overwhelm the Phlegmatic, or the Phlegmatic's homebody tendencies isolate the Choleric.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling like the Phlegmatic doesn't care enough or isn't trying hard enough",
      triggerB: "Feeling pressured, criticized, or told they're not enough as they are",
      escalation:
        "The Choleric escalates with directness and volume; the Phlegmatic shuts down completely. The Choleric interprets the shutdown as proof of not caring, which escalates further. The Phlegmatic becomes immovable in their silence.",
      deescalation: [
        "The Choleric must lower volume and soften approach: 'I'm frustrated, but I'm not leaving and I'm not giving up on us'",
        "The Phlegmatic must offer even minimal engagement: 'I'm still here. I just need you to be less loud about this'",
        "Take a physical break — walk separately, reconvene in 30 minutes",
      ],
      repair: [
        "The Choleric acknowledges the pattern: 'I see that I push you away by pushing too hard'",
        "The Phlegmatic shares one specific thing they need: 'When you speak softly, I can actually hear you'",
        "Return to a shared activity that neither of you finds stressful — rebuild the sense of 'us'",
      ],
    },
  },

  "Phlegmatic-Melancholic": {
    score: 4,
    label: "Quiet Depths",
    summary:
      "This is one of the gentlest pairings in the temperament matrix. The Phlegmatic's accepting, steady nature meets the Melancholic's sensitive, analytical depth, creating a relationship of quiet understanding and emotional safety. The Melancholic feels truly seen; the Phlegmatic feels genuinely appreciated. The risk is that this gentle pairing becomes too insulated, too avoidant of conflict, and too comfortable in its quietness.",
    strengths: [
      "Profound emotional understanding — the Phlegmatic accepts the Melancholic without judgment",
      "The Melancholic's depth enriches the Phlegmatic's inner world gently, not overwhelmingly",
      "Both value peace, routine, and domestic comfort, creating a harmonious home",
      "The Phlegmatic's patience is exactly what the sensitive Melancholic needs",
      "Low-conflict dynamic — disagreements are handled with care and respect",
    ],
    challenges: [
      "Neither partner pushes for growth, adventure, or necessary change",
      "Important issues get buried under layers of polite avoidance",
      "The Melancholic's emotional needs may exceed the Phlegmatic's capacity to engage deeply",
      "Social life dwindles as both prefer quiet evenings at home",
      "The Melancholic's critical nature may slowly erode the Phlegmatic's contentment",
    ],
    communication: {
      dos: [
        "Create a regular check-in ritual — this pairing needs structure to discuss feelings",
        "The Melancholic should express needs gently but directly — the Phlegmatic won't pick up hints",
        "The Phlegmatic should practice volunteering feelings before being asked",
        "Use written communication for deeper topics — both process better without pressure",
      ],
      donts: [
        "Don't let polite avoidance become the default — important things will go unsaid for years",
        "Don't interpret the Phlegmatic's calm as deep agreement — they may be suppressing concerns",
        "Don't let the Melancholic's emotional depth become a one-sided monologue the Phlegmatic endures",
        "Don't use silence as a weapon — both are too comfortable with it, and it becomes destructive",
      ],
      scripts: [
        {
          situation: "When the Melancholic feels emotionally disconnected",
          partnerA: "I've been feeling a distance between us. I know we both tend to let things settle, but this one I don't want to let settle. Can we talk about it?",
          partnerB: "I've felt it too. I just didn't know how to bring it up without making things worse. I'm glad you did. What's been weighing on you?",
        },
        {
          situation: "When the Phlegmatic resists a change",
          partnerA: "I understand you're comfortable with how things are. I am too, mostly. But I think this change could be good for us. Can you help me understand what's holding you back?",
          partnerB: "I'm scared of things getting worse. I like what we have. But I also don't want to hold us back. Can we talk through the risks together?",
        },
        {
          situation: "When discussing the future",
          partnerA: "I want to make sure we're growing together, not just existing side by side. What do you want our life to look like in a few years?",
          partnerB: "I want more of what we have, but with more intention. Maybe we add things that bring us joy. What would make you happiest?",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Quality time", "Physical touch"],
        receives: ["Quality time", "Words of affirmation", "Acts of service"],
      },
      partnerB: {
        gives: ["Acts of service", "Quality time", "Words of affirmation"],
        receives: ["Acts of service", "Quality time", "Physical touch"],
      },
      match:
        "Both partners show love through consistent acts of service and quality time, creating a quietly devoted relationship. The Phlegmatic's love is steady and predictable; the Melancholic's is thoughtful and detailed. The gap is in verbal expression — both need affirmation but neither naturally offers it. Consciously building daily appreciation habits transforms this pairing.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "Both need emotional safety and predictability — create intimate rituals",
          "The Melancholic should communicate desires openly; the Phlegmatic should reciprocate verbally",
          "Physical intimacy benefits from gentle initiation rather than dramatic overtures",
        ],
        risk:
          "Physical intimacy becomes routine and infrequent because both partners are comfortable with silence and neither pushes for more connection.",
      },
      finances: {
        tips: [
          "Financially stable pairing — both are careful and deliberate with money",
          "One partner takes the lead on financial admin to prevent double-analysis",
          "Set a 'joy budget' for experiences — both may default to saving over spending on happiness",
        ],
        risk:
          "Financial stagnation. Neither pushes for growth or investment, and the relationship settles into a comfortable but limited financial life.",
      },
      parenting: {
        tips: [
          "Both provide gentle, consistent, emotionally safe parenting",
          "Consciously introduce adventure and fun into family life — it won't happen naturally",
          "Ensure children have structure and boundaries — gentle parenting still needs limits",
        ],
        risk:
          "Both parents are too gentle, creating a household with too few boundaries. Children need more structure than this pairing naturally provides.",
      },
      household: {
        tips: [
          "Your home will be comfortable, orderly, and peaceful — a genuine sanctuary",
          "Add warmth and personality through shared projects and creative touches",
          "Accept that neither will be a deep cleaner — establish simple, sustainable routines",
        ],
        risk:
          "The home becomes stale and uninspired. Both partners' comfort with the status quo means the space slowly becomes lifeless.",
      },
      decisions: {
        tips: [
          "The Melancholic's analysis combined with the Phlegmatic's calm creates wise, measured decisions",
          "Set decision deadlines — neither partner will rush naturally",
          "Seek outside perspectives when you're stuck — a trusted friend or advisor helps break the echo chamber",
        ],
        risk:
          "Decision paralysis. Both partners default to 'let's think about it' indefinitely, and opportunities pass while both wait for certainty.",
      },
      social: {
        tips: [
          "Build a small, reliable social circle — both prefer depth over breadth",
          "Schedule regular social engagements so you don't default to isolation",
          "One partner should take turns being the social initiator — it won't happen spontaneously",
        ],
        risk:
          "Social isolation. Both partners' preference for quiet evenings compounds into a reclusive lifestyle that slowly becomes lonely.",
      },
    },
    conflictPlaybook: {
      triggerA: "Feeling that their emotional needs are being ignored or that the relationship lacks depth",
      triggerB: "Feeling pressured to be more emotional or more expressive than is natural",
      escalation:
        "The Melancholic retreats into detailed, internal analysis of every slight while the Phlegmatic retreats into comfortable silence. Neither addresses the issue. Days pass in polite coexistence while emotional distance grows.",
      deescalation: [
        "The Melancholic writes a letter or text expressing their feelings — it breaks the paralysis",
        "The Phlegmatic makes a genuine effort to engage: 'I can tell something's wrong. I want to understand'",
        "Do something physical together — a walk, cooking, a drive — side-by-side contact lowers defenses",
      ],
      repair: [
        "Both partners share one feeling and one need, alternating — keep it structured and safe",
        "Return to a shared comfort ritual — tea, a favorite show, a familiar walk",
        "Discuss the avoidance pattern itself: 'We both shut down. How do we catch it earlier next time?'",
      ],
    },
  },

  "Phlegmatic-Phlegmatic": {
    score: 3,
    label: "Comfortable but Static",
    summary:
      "Two Phlegmatics create one of the most peaceful, comfortable relationships possible. Both value harmony, routine, and emotional safety above all else. They understand each other's need for space and never push too hard. But this same comfort can become a trap — neither partner challenges the other, important issues go unaddressed for years, and the relationship slowly loses vitality while both partners insist everything is 'fine.'",
    strengths: [
      "Profound mutual understanding of the need for peace, space, and routine",
      "Extremely low conflict — both prefer gentle accommodation over battle",
      "Emotionally safe — neither partner judges or criticizes the other harshly",
      "Consistent, reliable partnership that provides stability for both partners",
      "Both value loyalty, commitment, and the long game of relationship building",
    ],
    challenges: [
      "Neither partner pushes for growth, change, or necessary evolution",
      "Important conversations never happen because both avoid discomfort",
      "The relationship can become stale and devoid of passion or excitement",
      "Decision-making is painfully slow — both wait for the other to take initiative",
      "Emotional intimacy stays at a comfortable but shallow level",
    ],
    communication: {
      dos: [
        "Schedule regular, structured check-ins — without them, nothing important gets discussed",
        "Practice initiating difficult conversations — it won't happen naturally for either of you",
        "Use written communication for heavy topics — it feels safer and more thoughtful",
        "Take turns being the one to bring up something new or different",
      ],
      donts: [
        "Don't let 'fine' become the default answer to 'How are we?' — dig deeper",
        "Don't use silence as a substitute for genuine communication",
        "Don't let the peacekeeping become people-pleasing that hides real feelings",
        "Don't wait for a crisis to discuss important things — address them before they fester",
      ],
      scripts: [
        {
          situation: "When one partner senses something is off but both avoid addressing it",
          partnerA: "I've been telling myself everything is fine, but something feels different between us. I don't want to ignore it. Can we figure out what's changed?",
          partnerB: "I've felt it too. I kept thinking it would pass. I think we've been going through the motions instead of being present with each other.",
        },
        {
          situation: "When discussing a needed change",
          partnerA: "I know we're comfortable, but I think we've been too comfortable. I want us to try something new together. Something that gets us out of this rut.",
          partnerB: "You're right. I've been telling myself I like the routine, but I miss feeling alive. What do you have in mind?",
        },
        {
          situation: "When one Phlegmatic wants to address a concern",
          partnerA: "I've been holding something in because I didn't want to rock the boat. But I think not saying it is rocking the boat more. Can I be honest about something?",
          partnerB: "Yes. I'd rather hear it than feel the distance. I promise I won't shut down. Tell me what's on your mind.",
        },
      ],
    },
    loveLanguages: {
      partnerA: {
        gives: ["Acts of service", "Quality time", "Physical touch"],
        receives: ["Quality time", "Acts of service", "Physical touch"],
      },
      partnerB: {
        gives: ["Acts of service", "Quality time", "Physical touch"],
        receives: ["Acts of service", "Quality time", "Words of affirmation"],
      },
      match:
        "This is the most linguistically aligned pairing — both show and receive love through acts of service and quality time. The relationship feels effortless and comfortable. The gap is in verbal affirmation — both need to hear 'I love you' and 'I appreciate you' more than either naturally says. Consciously adding words of affirmation transforms this pairing from quietly functional to genuinely romantic.",
    },
    lifeAreas: {
      intimacy: {
        tips: [
          "Both need emotional safety and predictability — create intimate rituals",
          "Initiate physical connection even when you're not feeling it — momentum matters",
          "Communicate desires openly — neither partner's body language is easy to read",
        ],
        risk:
          "Physical intimacy becomes routine and infrequent. Both partners are comfortable without it, so neither pushes for more connection. The relationship becomes a comfortable friendship.",
      },
      finances: {
        tips: [
          "Financially stable — both are careful and avoid unnecessary risk",
          "One partner should take the lead on financial administration",
          "Set a 'joy budget' for experiences and treats — default saving can become joyless",
        ],
        risk:
          "Financial stagnation. Neither pushes for growth, career advancement, or investment. The relationship settles into a comfortable but limited financial life.",
      },
      parenting: {
        tips: [
          "Both provide gentle, consistent, emotionally safe parenting",
          "Consciously introduce adventure and fun into family life — it won't happen naturally",
          "Ensure children have structure and boundaries — gentle parenting still needs limits",
        ],
        risk:
          "Both parents are too permissive and too gentle. Children lack the structure, challenge, and boundaries they need for healthy development.",
      },
      household: {
        tips: [
          "Your home will be comfortable and peaceful — a genuine sanctuary",
          "Add warmth and personality through shared projects and creative touches",
          "Establish simple, sustainable routines for household management",
        ],
        risk:
          "The home becomes stale and uninspired. Both partners' comfort with the status quo means the space slowly becomes lifeless and neglected.",
      },
      decisions: {
        tips: [
          "Set explicit decision deadlines — both partners will default to 'let's think about it'",
          "Seek outside perspectives when stuck — a trusted friend helps break the echo chamber",
          "Make small decisions quickly to build decision-making confidence for bigger ones",
        ],
        risk:
          "Decision paralysis. Both partners wait indefinitely for certainty that never comes. Opportunities pass while both prefer inaction to the risk of being wrong.",
      },
      social: {
        tips: [
          "Build a small, reliable social circle — both prefer depth over breadth",
          "Schedule regular social engagements so you don't default to isolation",
          "Take turns being the social initiator — it won't happen spontaneously for either of you",
        ],
        risk:
          "Social isolation. Both partners' preference for quiet evenings compounds into a reclusive lifestyle that slowly becomes lonely and limiting.",
      },
    },
    conflictPlaybook: {
      triggerA: "Realizing that the relationship has become stale or that important needs are going unmet",
      triggerB: "Being asked to change the comfortable routine or address something uncomfortable",
      escalation:
        "Neither partner escalates in the traditional sense — instead, both retreat into parallel routines. The conflict manifests as growing emotional distance and increasing politeness that masks disconnection. Both wait for the other to address it, and neither does.",
      deescalation: [
        "One partner must break the comfortable silence — even a small opening: 'Can we talk about us?'",
        "Write a letter if speaking feels too vulnerable — both process better in writing",
        "Do something physical together — a walk, a drive, cooking — side-by-side contact lowers defenses",
      ],
      repair: [
        "Both partners share one feeling and one need, alternating — keep it structured and safe",
        "Return to a shared comfort ritual — tea, a favorite show, a familiar walk",
        "Discuss the avoidance pattern itself: 'We both shut down. How do we catch it earlier next time?'",
      ],
    },
  },
};

export const LOVE_STYLES: Record<string, LoveStyle> = {
  Sanguine: {
    expresses:
      "Through words of affirmation, physical touch, and enthusiastic presence. A Sanguine in love tells you constantly, touches you frequently, and includes you in every adventure. Their love is warm, visible, and impossible to miss.",
    receives:
      "Through quality time, verbal appreciation, and reciprocated enthusiasm. A Sanguine feels loved when their partner is genuinely present, verbally affectionate, and visibly excited to be with them.",
    bestLanguage: "Words of Affirmation — hearing 'I love you,' 'I'm proud of you,' and 'You make me happy' fills the Sanguine's emotional tank like nothing else.",
    needsFromPartner:
      "Genuine enthusiasm for shared experiences, verbal reassurance during insecure moments, physical affection that feels spontaneous rather than obligatory, and a partner who doesn't dim their light.",
    dealbreakers: [
      "Consistent emotional coldness or withholding of affection",
      "Being mocked or dismissed for their expressiveness and warmth",
      "A partner who controls their social life or isolates them from friends",
      "Chronic negativity that drains their natural optimism",
    ],
  },
  Choleric: {
    expresses:
      "Through acts of service, problem-solving, and protective action. A Choleric in love handles your problems, fights for your interests, and builds a future for you. Their love is expressed through doing, not saying.",
    receives:
      "Through words of affirmation about their competence, respect for their leadership, and genuine appreciation for their efforts. A Choleric feels loved when their partner acknowledges their strength and trusts their judgment.",
    bestLanguage: "Acts of Service — seeing their partner handle a problem, take care of a responsibility, or remove an obstacle speaks louder than any words of love.",
    needsFromPartner:
      "Respect for their autonomy and competence, verbal acknowledgment of their efforts, a partner who trusts their judgment, and space to lead without being controlled.",
    dealbreakers: [
      "Being undermined or contradicted in front of others",
      "A partner who questions their competence or decision-making repeatedly",
      "Emotional manipulation or passive aggression instead of direct communication",
      "Laziness or lack of ambition that they perceive as holding the relationship back",
    ],
  },
  Melancholic: {
    expresses:
      "Through deep attention to detail, thoughtful acts of service, and carefully chosen words of affirmation. A Melancholic in love remembers every important date, notices every change, and crafts meaningful gestures that show they've been paying attention.",
    receives:
      "Through words of affirmation that acknowledge their depth, quality time that feels intentional and undistracted, and patience with their processing speed. A Melancholic feels loved when their partner truly listens and takes their feelings seriously.",
    bestLanguage: "Quality Time — undivided attention, deep conversations, and shared experiences that feel meaningful and intentional fill the Melancholic's emotional world.",
    needsFromPartner:
      "Patience with their emotional processing, genuine interest in their inner world, reliability and follow-through on commitments, and verbal reassurance that their sensitivity is valued, not a burden.",
    dealbreakers: [
      "Being told they're 'too sensitive' or 'overthinking' when expressing genuine feelings",
      "Broken promises or unreliable behavior that confirms their worst fears about people",
      "Emotional superficiality that dismisses their need for depth and meaning",
      "Being criticized for their standards rather than respected for their attention to quality",
    ],
  },
  Phlegmatic: {
    expresses:
      "Through consistent, quiet acts of service and unwavering presence. A Phlegmatic in love shows up every day, handles the small things without being asked, and provides a calm, steady foundation. Their love is the most reliable and the least visible.",
    receives:
      "Through quality time that feels relaxed and pressure-free, gentle physical affection, and words of appreciation that acknowledge their steady presence. A Phlegmatic feels loved when their partner values their calm rather than seeing it as indifference.",
    bestLanguage: "Acts of Service — having daily tasks handled, problems solved quietly, and life made smoother without fanfare is the Phlegmatic's deepest experience of being loved.",
    needsFromPartner:
      "Patience with their processing speed, acceptance of their need for space and quiet, freedom from pressure to be more expressive than natural, and genuine appreciation for their consistency.",
    dealbreakers: [
      "Being pressured to change their fundamental nature or emotional style",
      "A partner who creates constant drama or emotional volatility",
      "Being taken for granted or having their quiet contributions ignored",
      "Controlling behavior that removes their sense of peace and autonomy",
    ],
  },
};

export function getCouplesPairing(temp1: string, temp2: string): CouplesPairing {
  const key = `${temp1}-${temp2}`;
  if (COUPLES_PAIRINGS[key]) return COUPLES_PAIRINGS[key];

  const reverseKey = `${temp2}-${temp1}`;
  if (COUPLES_PAIRINGS[reverseKey]) return COUPLES_PAIRINGS[reverseKey];

  return COUPLES_PAIRINGS["Sanguine-Phlegmatic"];
}
