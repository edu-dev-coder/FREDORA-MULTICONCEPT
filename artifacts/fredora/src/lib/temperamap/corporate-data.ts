export interface TeamRole {
  role: string;
  icon: string;
  description: string;
  strengths: string[];
  idealResponsibilities: string[];
  watchOutFor: string[];
  motivators: string[];
}

export interface CommStyle {
  bestApproach: string;
  meetingStyle: string;
  feedbackStyle: string;
  frictionPoint: string;
  tip: string;
}

export interface ConflictRisk {
  risk: "low" | "medium" | "high";
  description: string;
  triggers: string[];
  mitigation: string[];
}

export interface TeamComposition {
  composition: Record<string, number>;
  percentages: Record<string, number>;
  balanceScore: number;
  balanceGaps: string[];
  dominantStyle: string;
  recommendations: string[];
  executiveSummary: string;
}

export interface ConflictPair {
  pair: [string, string];
  risk: string;
  description: string;
  mitigation: string[];
}

export const TEAM_ROLES: Record<string, TeamRole> = {
  Sanguine: {
    role: "The Visionary Connector",
    icon: "🌟",
    description:
      "The team's social catalyst and idea generator. Sanguines thrive on interaction, bringing infectious enthusiasm that energizes the group and forges connections across silos. They see possibilities where others see obstacles and naturally rally people around a shared vision.",
    strengths: [
      "Builds instant rapport with new stakeholders and clients",
      "Generates creative ideas and reframes problems optimistically",
      "Champions morale and keeps energy high during challenging projects",
      "Facilitates cross-functional networking and collaboration",
      "Presents ideas with charisma that wins buy-in",
    ],
    idealResponsibilities: [
      "Client-facing roles, partnerships, and business development",
      "Kickoff meetings, workshops, and brainstorming sessions",
      "Internal culture initiatives and team-building activities",
      "Public presentations, pitches, and conference speaking",
      "Onboarding new hires and integrating them into the team",
    ],
    watchOutFor: [
      "Overcommitting to exciting projects while neglecting routine tasks",
      "Avoiding difficult conversations or performance feedback",
      "Starting strong but losing interest when work becomes detail-heavy",
      "Saying yes to everyone and spreading themselves too thin",
    ],
    motivators: [
      "Recognition and public praise for their contributions",
      "Variety and new challenges that prevent monotony",
      "Social interaction and collaborative energy",
      "Freedom to be creative without heavy process constraints",
      "Seeing the tangible human impact of their work",
    ],
  },
  Choleric: {
    role: "The Decisive Driver",
    icon: "🔥",
    description:
      "The team's results engine and action catalyst. Choleres cut through ambiguity with decisive leadership, setting a relentless pace toward objectives. They transform vague plans into concrete outcomes and hold everyone — including themselves — to high standards of accountability.",
    strengths: [
      "Makes decisions quickly under pressure without paralysis",
      "Sets clear priorities and drives accountability across the team",
      "Challenges the status quo and pushes through organizational inertia",
      "Takes ownership of outcomes and leads from the front",
      "Converts vision into executable plans with measurable milestones",
    ],
    idealResponsibilities: [
      "Project leadership, sprint planning, and delivery management",
      "Crisis response and turnaround situations requiring fast action",
      "Strategic planning and goal-setting for the organization",
      "Negotiations and high-stakes decision-making",
      "Removing blockers and escalating issues that stall progress",
    ],
    watchOutFor: [
      "Steamrolling quieter team members in discussions",
      "Prioritizing speed over quality and collaboration",
      "Becoming impatient with deliberation or consensus-building processes",
      "Micromanaging when deadlines are tight instead of delegating",
    ],
    motivators: [
      "Autonomy and authority to make real decisions",
      "Measurable results and clear performance metrics",
      "Efficiency — eliminating waste, friction, and bureaucracy",
      "Competition and challenges that test their capability",
      "Impact — seeing direct influence on business outcomes",
    ],
  },
  Melancholic: {
    role: "The Quality Analyst",
    icon: "🌊",
    description:
      "The team's conscience and guardian of excellence. Melancholic temperaments bring depth of thought, meticulous standards, and a commitment to getting things right the first time. They are the reason the team's work stands up to scrutiny long after deadlines have passed.",
    strengths: [
      "Catches errors and oversights that others miss under time pressure",
      "Creates detailed processes and documentation that scale",
      "Provides honest, thoughtful analysis rather than surface-level opinions",
      "Maintains long-term consistency and standards across projects",
      "Thinks deeply about consequences before committing to action",
    ],
    idealResponsibilities: [
      "Quality assurance, code review, and compliance oversight",
      "Data analysis, research, and evidence-based decision support",
      "Process design, documentation, and standardization",
      "Risk assessment and long-range planning",
      "Editing, proofreading, and refining deliverables before launch",
    ],
    watchOutFor: [
      "Perfectionism that delays delivery or creates bottlenecks",
      "Overthinking decisions that need simple, fast resolution",
      "Withholding ideas because they aren't fully formed yet",
      "Becoming critical or pessimistic when under sustained pressure",
    ],
    motivators: [
      "Time and space to produce thorough, high-quality work",
      "Clear expectations and well-defined processes",
      "Recognition for the quality and depth of their contributions",
      "Opportunities to learn deeply and develop genuine expertise",
      "Knowing their work meets an exacting standard they respect",
    ],
  },
  Phlegmatic: {
    role: "The Steady Mediator",
    icon: "🌿",
    description:
      "The team's anchor and emotional stabilizer. Phlegmatic temperaments bring calm reliability and a genuine gift for listening. They are the quiet force that keeps the team grounded, resolves tension, and ensures everyone feels heard — often without seeking credit.",
    strengths: [
      "Creates psychological safety where all voices feel welcome",
      "Remains calm and steady during high-stress periods and conflicts",
      "Listens deeply and synthesizes multiple viewpoints into consensus",
      "Follows through reliably on commitments without fanfare",
      "Maintains team cohesion when personalities clash",
    ],
    idealResponsibilities: [
      "Mediation, conflict resolution, and team dynamics facilitation",
      "Long-running operational roles requiring consistency and reliability",
      "Mentoring, coaching, and one-on-one support for colleagues",
      "Stakeholder management across competing interests",
      "Maintaining shared resources, wikis, and institutional knowledge",
    ],
    watchOutFor: [
      "Avoiding necessary confrontation even when issues demand it",
      "Being overlooked for leadership roles because they don't self-promote",
      "Becoming passive or disengaged when change is forced too quickly",
      "Taking on unspoken workloads to keep the peace",
    ],
    motivators: [
      "Harmony and a low-drama, respectful work environment",
      "Stability and predictability in their role and responsibilities",
      "Being valued and appreciated — especially for behind-the-scenes work",
      "Consensus-driven decision processes where they have a voice",
      "Seeing the team succeed together rather than individual glory",
    ],
  },
};

export const MEDIUM_PAIRS = [
  "Sanguine-Choleric",
  "Sanguine-Melancholic",
  "Choleric-Sanguine",
  "Choleric-Phlegmatic",
  "Melancholic-Sanguine",
  "Melancholic-Choleric",
  "Phlegmatic-Choleric",
];

export const COMMUNICATION_MATRIX: Record<string, Record<string, CommStyle>> =
  {
    Sanguine: {
      Sanguine: {
        bestApproach:
          "Lean into the energy. These conversations are naturally lively — give them room to brainstorm and riff off each other, but set a clear agenda to prevent tangents. Use a shared digital whiteboard to capture ideas in real time so nothing gets lost in the excitement.",
        meetingStyle:
          "Informal and participatory. Start with icebreakers or quick check-ins. Visual collaboration tools and open discussion formats work best. Time-box brainstorming rounds to keep momentum.",
        feedbackStyle:
          "Wrap feedback in enthusiasm. Lead with what's working, then offer constructive points. They respond well to peer recognition and public praise, but may dismiss critical feedback if it feels like personal attack.",
        frictionPoint:
          "Both want to lead the conversation and neither naturally follows up on details. Action items evaporate when the meeting ends unless someone else captures them.",
        tip: "Designate one Sanguine as the note-taker and send written summaries immediately after — they'll both appreciate the follow-through and actually read it.",
      },
      Choleric: {
        bestApproach:
          "Get to the point quickly. Choleres respect brevity and clear asks. Lead with the objective or decision needed, then let the Sanguine provide context or creative angles. Avoid long preambles.",
        meetingStyle:
          "Structured with a clear purpose. The Choleric drives the agenda while the Sanguine contributes ideas. Best when roles are explicit: one leads, one brainstorms.",
        feedbackStyle:
          "Direct and outcome-focused from the Choleric; the Sanguine should deliver tough messages with warmth. Both need to hear 'here's what success looks like' rather than abstract critiques.",
        frictionPoint:
          "The Sanguine's social energy can feel like wasted time to the Choleric, while the Choleric's blunt directness can feel dismissive to the Sanguine.",
        tip: "The Sanguine should front-load their creative input in writing before meetings so the Choleric can process ideas at their own pace.",
      },
      Melancholic: {
        bestApproach:
          "Bridge the energy gap deliberately. The Sanguine should slow down and provide written context in advance so the Melancholic can prepare. The Melancholic should name their concerns aloud rather than letting them fester silently.",
        meetingStyle:
          "Pre-read materials + focused discussion. The Melancholic needs time to think; the Sanguine needs to talk it through. Pair async preparation with structured conversation.",
        feedbackStyle:
          "The Sanguine must avoid superficial praise that the Melancholic sees through instantly. The Melancholic must frame detailed critiques as investments, not rejections.",
        frictionPoint:
          "The Sanguine moves on before the Melancholic is done thinking. The Melancholic's depth feels like resistance or negativity to the Sanguine.",
        tip: "Build in a 'think time' buffer — agree that major decisions will be revisited after 24 hours of reflection, giving both temperaments what they need.",
      },
      Phlegmatic: {
        bestApproach:
          "Respect the Phlegmatic's need for processing time. The Sanguine should ask genuine questions rather than presenting ideas as already-decided. The Phlegmatic should voice agreement or concerns explicitly instead of assuming silence equals consent.",
        meetingStyle:
          "One-on-one or small group discussions where the Phlegmatic feels safe. Avoid putting them on the spot with impromptu requests in large meetings.",
        feedbackStyle:
          "Soft, indirect, and appreciative. The Phlegmatic responds to sincerity, not volume. The Sanguine should check in privately rather than offering feedback publicly.",
        frictionPoint:
          "The Sanguine misreads the Phlegmatic's quietness as disengagement. The Phlegmatic feels overwhelmed by the Sanguine's pace and volume of communication.",
        tip: "Establish a regular check-in cadence — the Phlegmatic will open up consistently in structured one-on-ones, while the Sanguine gets the connection they want.",
      },
    },
    Choleric: {
      Sanguine: {
        bestApproach:
          "Present decisions as outcomes, not mandates. The Sanguine will buy in faster when they understand the 'why' behind the direction. Give the Choleric the direct answer first, then the Sanguine can add color and context.",
        meetingStyle:
          "Decision-oriented with room for input. The Choleric sets the pace; the Sanguine adds energy and creative alternatives. Best when the Choleric explicitly invites contributions.",
        feedbackStyle:
          "The Choleric should frame feedback around business impact, not personality. The Sanguine should deliver dissenting views with confidence and data, not just enthusiasm.",
        frictionPoint:
          "The Choleric sees the Sanguine as unreliable or undisciplined. The Sanguine sees the Choleric as cold or dictatorial.",
        tip: "Pair them on a project with shared KPIs — shared accountability turns friction into mutual respect when both see the same results.",
      },
      Choleric: {
        bestApproach:
          "Acknowledge the power dynamic openly. Two Choleres will compete for control unless someone explicitly claims a lane. Set clear decision rights upfront and revisit them when new conflicts emerge.",
        meetingStyle:
          "Agenda-driven with assigned facilitator roles that rotate. Prevent dominance by structuring speaking time and creating explicit decision protocols.",
        feedbackStyle:
          "Blunt, direct, and focused on the work — no sugarcoating needed. Both respect candor. But they must consciously pause before reacting to protect the relationship.",
        frictionPoint:
          "Escalating power struggles where neither will back down. Both interpret yielding as weakness, which poisons the dynamic.",
        tip: "Create a 'challenge protocol' — when they disagree, each gets 2 minutes of uninterrupted argument, then a neutral third party breaks the tie.",
      },
      Melancholic: {
        bestApproach:
          "Slow down for the Melancholic. The Choleric's urgency can feel like a personal attack to the Melancholic, who needs to analyze before deciding. Frame deadlines as shared constraints, not unilateral demands.",
        meetingStyle:
          "Structured with clear prep expectations. The Melancholic needs data and context in advance; the Choleric needs a decision by the end. Honor both by pre-circulating materials.",
        feedbackStyle:
          "The Choleric must soften delivery without diluting the message. The Melancholic responds to evidence-based feedback delivered privately, not in-the-moment corrections.",
        frictionPoint:
          "The Choleric perceives the Melancholic's caution as obstruction. The Melancholic perceives the Choleric's speed as recklessness.",
        tip: "Establish a 'go/no-go' framework where the Melancholic defines risk criteria and the Choleric decides within those guardrails — both feel respected.",
      },
      Phlegmatic: {
        bestApproach:
          "Be direct but patient. The Phlegmatic won't push back openly, so the Choleric must actively check for buy-in rather than assuming silence is agreement. Create space for honest dissent without consequences.",
        meetingStyle:
          "Structured with explicit invitation for input. The Choleric must slow the pace slightly and the Phlegmatic must be prompted — neither will do this naturally.",
        feedbackStyle:
          "The Choleric should deliver feedback privately and give the Phlegmatic time to process. The Phlegmatic must practice voicing concerns when they have them, even when it's uncomfortable.",
        frictionPoint:
          "The Choleric steamrolls because the Phlegmatic doesn't resist. The Phlegmatic quietly disengages or builds resentment instead of voicing disagreement.",
        tip: "Build in a mandatory 'devil's advocate' step where the Phlegmatic is explicitly asked to name risks — this gives them permission to disagree.",
      },
    },
    Melancholic: {
      Sanguine: {
        bestApproach:
          "The Melancholic should lead with data and let the Sanguine handle presentation. This creates mutual respect — the Melancholic feels their analysis is valued and the Sanguine gets to do what they do best.",
        meetingStyle:
          "Pre-read analytical materials followed by a discussion. Avoid putting the Melancholic on the spot to improvise — give them the agenda and talking points well in advance.",
        feedbackStyle:
          "Both need to translate for each other. The Melancholic should frame critiques as improvements to a shared standard, not personal shortcomings. The Sanguine should provide specific, concrete positive feedback rather than generic enthusiasm.",
        frictionPoint:
          "The Sanguine's optimism feels shallow to the Melancholic, who sees problems everywhere. The Melancholic's critical eye feels deflating to the Sanguine, who needs encouragement.",
        tip: "Create a shared document where the Melancholic logs concerns and the Sanguine logs bright spots — both feel heard, and the truth is usually somewhere in between.",
      },
      Choleric: {
        bestApproach:
          "Speak the Choleric's language — lead with the conclusion, then offer the analysis if they want it. The Melancholic earns influence by being concise and evidence-driven, not by drowning the Choleric in detail.",
        meetingStyle:
          "Short, structured, and decision-oriented. The Melancholic provides the evidence packet; the Choleric makes the call. Respect each other's lane.",
        feedbackStyle:
          "The Choleric should deliver tough feedback with respect for the Melancholic's sensitivity to criticism. The Melancholic should package concerns as risk assessments, not complaints.",
        frictionPoint:
          "The Choleric's urgency triggers the Melancholic's anxiety. The Melancholic's thoroughness triggers the Choleric's impatience.",
        tip: "Pre-agree on quality thresholds — when the Melancholic meets them, the Choleric commits to moving forward. This builds trust on both sides.",
      },
      Melancholic: {
        bestApproach:
          "Go deep together. Two Melancholics will produce exceptionally high-quality work when given time, but may spiral into perfectionism or group pessimism. Introduce explicit deadlines and 'good enough' criteria.",
        meetingStyle:
          "Thorough and analytical with extended discussion periods. Both will want to examine every angle — facilitation is needed to keep progress moving.",
        feedbackStyle:
          "Detailed, thoughtful, and evidence-based. Both give and receive feedback naturally, but may reinforce each other's tendency toward harsh self-criticism.",
        frictionPoint:
          "They can become an echo chamber of critical thinking, missing opportunities because neither pushes for action. Decisions stall under the weight of analysis.",
        tip: "Assign a rotating 'decider' role for each project to prevent analysis paralysis — the designated person must commit to a direction by a set time.",
      },
      Phlegmatic: {
        bestApproach:
          "Be direct and honest, because both tend toward indirect communication. The Melancholic should state their analysis clearly and explicitly, rather than hinting at concerns. The Phlegmatic should affirm their agreement or disagreement verbally, not just nod along.",
        meetingStyle:
          "Calm, focused, and unhurried. Both need processing time, so async written updates work well for initial discussions, followed by a focused conversation to decide.",
        feedbackStyle:
          "Gentle, private, and specific. Neither handles public critique well. Both appreciate feedback that arrives as a written message they can reflect on.",
        frictionPoint:
          "Neither advocates forcefully for their position, so decisions default to whoever happens to speak first or whoever feels less strongly. Important concerns go unvoiced.",
        tip: "Use a structured 'round robin' approach in meetings where each person must share their view — this prevents both from deferring to the other indefinitely.",
      },
    },
    Phlegmatic: {
      Sanguine: {
        bestApproach:
          "Honor the Phlegmatic's processing pace. The Sanguine should schedule regular one-on-ones rather than expecting spontaneous deep conversations. The Phlegmatic should communicate their availability boundaries clearly rather than just going quiet.",
        meetingStyle:
          "Small, comfortable settings with clear agendas. Avoid putting the Phlegmatic on the spot in group brainstorming sessions — give them advance notice of discussion topics.",
        feedbackStyle:
          "The Sanguine should deliver feedback warmly and privately. The Phlegmatic should express appreciation verbally — the Sanguine needs to hear it, and the Phlegmatic often assumes it's understood.",
        frictionPoint:
          "The Sanguine interprets the Phlegmatic's need for space as rejection. The Phlegmatic feels drained by the Sanguine's communication frequency and energy.",
        tip: "Establish communication norms — e.g., the Sanguine sends updates via shared channels, and the Phlegmatic responds within a predictable window. Both get what they need.",
      },
      Choleric: {
        bestApproach:
          "Create explicit space for the Phlegmatic's voice. The Choleric should directly ask 'What do you think?' and wait for the answer without filling the silence. The Phlegmatic must practice disagreeing out loud, even when it's uncomfortable.",
        meetingStyle:
          "Structured with clear roles. The Choleric leads and the Phlegmatic provides operational support and ground-truth feedback. Both need the relationship explicitly maintained.",
        feedbackStyle:
          "The Choleric should deliver feedback privately and allow processing time. The Phlegmatic should deliver feedback as concrete examples rather than general observations.",
        frictionPoint:
          "The Choleric dominates decisions because the Phlegmatic won't push back. Resentment builds silently until the Phlegmatic disengages entirely or the relationship fractures.",
        tip: "Implement a 'decision log' where the Phlegmatic can record concerns asynchronously — this gives them a voice without requiring confrontation.",
      },
      Melancholic: {
        bestApproach:
          "Both value depth and thoughtfulness, so invest in the relationship first. Build trust through consistent, reliable interactions. When discussing difficult topics, both should commit to a specific timeline rather than letting conversations drift.",
        meetingStyle:
          "Planned, purposeful, and unhurried. Both will do their best work when they know the agenda in advance and have time to prepare their thoughts. Avoid spontaneity.",
        feedbackStyle:
          "Written and private. Both are reflective communicators who process better when they can re-read and think. Phone calls and in-person critiques are the hardest format for both.",
        frictionPoint:
          "They may both avoid difficult decisions, creating a shared blind spot where issues simmer unaddressed. Neither pushes the other toward action.",
        tip: "Create a shared accountability check-in — a brief weekly ritual where both name one thing they're avoiding and commit to addressing it within the week.",
      },
      Phlegmatic: {
        bestApproach:
          "Two Phlegmatics need explicit structure to move from comfort to productivity. Without external triggers, they may maintain harmony at the expense of progress. Create shared commitments and follow up on them consistently.",
        meetingStyle:
          "Regular, scheduled, and brief. Both will default to 'everything is fine' unless there's an explicit framework for surfacing issues. Use standing agenda items with specific questions.",
        feedbackStyle:
          "Both give and receive feedback indirectly, which can create a dangerous feedback vacuum. Install explicit feedback mechanisms — written surveys, scheduled check-ins — rather than relying on organic conversation.",
        frictionPoint:
          "Conflict avoidance becomes a team problem. Neither will raise issues first, so problems escalate in silence until they become crises.",
        tip: "Appoint an external facilitator or rotating 'truth-teller' role to ensure both temperaments surface concerns before they become resentments.",
      },
    },
  };

export const CONFLICT_RISKS: Record<string, Record<string, ConflictRisk>> = {
  Sanguine: {
    Sanguine: {
      risk: "low",
      description:
        "Sanguine-Sanguine teams share energy and enthusiasm but may struggle with follow-through and accountability. They naturally understand each other's social needs and communication style, which prevents deep interpersonal conflict, but the lack of grounding can lead to chaotic execution.",
      triggers: [
        "Competing for the spotlight or social dominance in meetings",
        "Nobody tracking commitments because both assumed the other would",
        "Scope creep from unchecked enthusiasm and overpromising",
      ],
      mitigation: [
        "Assign explicit ownership for every action item with deadlines",
        "Rotate the 'facilitator' role to ensure both feel valued in meetings",
        "Bring in a Melancholic or Phlegmatic partner for detail tracking",
        "Build in structured check-ins to maintain momentum after initial excitement fades",
      ],
    },
    Choleric: {
      risk: "medium",
      description:
        "Sanguine-Choleric pairs are high-energy and productive when aligned, but friction arises from clashing styles — the Sanguine's spontaneity versus the Choleric's need for control. Both want to lead, but in different ways: one through charisma, the other through authority.",
      triggers: [
        "The Sanguine bypasses the Choleric's decision-making authority",
        "The Choleric dismisses the Sanguine's ideas without consideration",
        "Both compete to own the narrative in front of leadership",
      ],
      mitigation: [
        "Define decision rights clearly — who decides what and when",
        "Pair them on projects with shared objectives but distinct roles",
        "The Choleric should explicitly invite the Sanguine's input in meetings",
        "Establish a feedback protocol where both share credit publicly",
      ],
    },
    Melancholic: {
      risk: "medium",
      description:
        "Sanguine-Melancholic pairs have complementary strengths — creativity and quality — but fundamentally different communication speeds and emotional needs. The Sanguine's pace can overwhelm the Melancholic, while the Melancholic's caution can deflate the Sanguine's momentum.",
      triggers: [
        "The Sanguine moves forward before the Melancholic has finished analyzing",
        "The Melancholic's detailed critiques feel like personal attacks to the Sanguine",
        "Mismatched expectations about meeting pace and decision timelines",
      ],
      mitigation: [
        "Pre-circulate materials so the Melancholic can prepare before discussions",
        "Build explicit 'go slow' checkpoints for decisions requiring deep analysis",
        "The Sanguine should check in privately rather than pushing in group settings",
        "The Melancholic should communicate timelines rather than just saying 'not yet'",
      ],
    },
    Phlegmatic: {
      risk: "low",
      description:
        "Sanguine-Phlegmatic pairs are one of the most naturally compatible combinations. The Phlegmatic's calm balances the Sanguine's energy, and neither is inherently confrontational. The risk is that important issues go unaddressed because neither pushes for difficult conversations.",
      triggers: [
        "The Sanguine feels the Phlegmatic is disengaged or uninterested",
        "The Phlegmatic feels overwhelmed by the Sanguine's communication frequency",
        "Both avoid addressing performance issues or unmet expectations",
      ],
      mitigation: [
        "Establish regular one-on-ones with a consistent structure",
        "The Sanguine should respect the Phlegmatic's need for processing time",
        "The Phlegmatic should verbalize agreement or disagreement explicitly",
        "Create shared accountability mechanisms rather than relying on informal check-ins",
      ],
    },
  },
  Choleric: {
    Sanguine: {
      risk: "medium",
      description:
        "Choleric-Sanguine pairs are highly productive when their roles are clear — the Choleric drives decisions, the Sanguine builds support. Conflict emerges when the Sanguine's enthusiasm outpaces the Choleric's plan, or when the Choleric's directness feels dismissive to the Sanguine's ideas.",
      triggers: [
        "The Choleric vetoes an idea the Sanguine invested energy in presenting",
        "The Sanguine makes a commitment on behalf of the team without consulting the Choleric",
        "Competing priorities where the Choleric focuses on delivery and the Sanguine focuses on relationship-building",
      ],
      mitigation: [
        "Schedule structured brainstorming before decision-making to honor both styles",
        "The Choleric should acknowledge the Sanguine's contributions publicly",
        "The Sanguine should check with the Choleric before making external commitments",
        "Define shared success metrics that value both results and relationships",
      ],
    },
    Choleric: {
      risk: "high",
      description:
        "Choleric-Choleric pairs are the highest-friction combination in the temperament matrix. Both are decisive, competitive, and resistant to yielding. When they align on a vision, they're unstoppable — but disagreements can escalate into genuine power struggles that damage team trust.",
      triggers: [
        "Disagreements over strategy where neither will back down",
        "Competition for visible leadership roles or executive attention",
        "Both responding to the same crisis with contradictory approaches",
      ],
      mitigation: [
        "Assign explicit decision rights — one owns the final call, the other has advisory authority",
        "Create a structured debate format with time limits and neutral tie-breakers",
        "Pair them on projects with clearly delineated domains of responsibility",
        "Establish a mutual escalation protocol before conflicts arise",
      ],
    },
    Melancholic: {
      risk: "high",
      description:
        "Choleric-Melancholic pairs represent the highest-stakes dynamic in team temperament. The Choleric's urgency directly conflicts with the Melancholic's need for thoroughness. When this dynamic is managed well, it produces exceptional results; when it's not, it creates deep resentment on both sides.",
      triggers: [
        "The Choleric sets a deadline the Melancholic considers unrealistic for quality work",
        "The Melancholic raises concerns at the last minute that delay a decision the Choleric already committed to",
        "The Choleric publicly corrects the Melancholic's work, triggering a withdrawal response",
      ],
      mitigation: [
        "Define quality thresholds and deadlines jointly at project kickoff",
        "Build buffer time into the Melancholic's review process before the Choleric's deadline",
        "The Choleric should deliver feedback privately, focusing on the process not the person",
        "Create a 'quality gate' framework where the Melancholic owns quality standards the Choleric commits to respecting",
      ],
    },
    Phlegmatic: {
      risk: "high",
      description:
        "Choleric-Phlegmatic pairs carry a subtle but serious risk: the Phlegmatic's conflict avoidance allows the Choleric to dominate without resistance, creating an imbalance that builds resentment silently over time. The relationship appears functional until it suddenly isn't.",
      triggers: [
        "The Phlegmatic agrees to a plan they haven't fully bought into",
        "The Choleric assumes silence equals endorsement when the Phlegmatic has unresolved concerns",
        "Major decisions get made in the Choleric's favor simply because they pushed harder",
      ],
      mitigation: [
        "Install explicit dissent mechanisms — anonymous feedback channels or structured 'disagree and commit' protocols",
        "The Choleric must actively ask the Phlegmatic for their honest assessment",
        "The Phlegmatic should voice concerns in writing if speaking up in real time feels too confrontational",
        "Create a shared decision log where both must record their position before a choice is finalized",
      ],
    },
  },
  Melancholic: {
    Sanguine: {
      risk: "medium",
      description:
        "Melancholic-Sanguine pairs are complementary but require deliberate communication. The Melancholic's depth and the Sanguine's breadth create a natural tension — one goes deep, the other goes wide. Managed well, this produces well-rounded solutions; managed poorly, it breeds mutual frustration.",
      triggers: [
        "The Sanguine presents a polished idea the Melancholic hasn't had time to vet",
        "The Melancholic's critique arrives too late to inform the Sanguine's pitch",
        "The Sanguine seeks validation the Melancholic cannot honestly give at the time",
      ],
      mitigation: [
        "Create a pre-presentation review step where the Melancholic examines ideas before they go external",
        "The Melancholic should flag concerns in real time rather than waiting for the 'right moment'",
        "The Sanguine should ask for specific feedback rather than general approval",
        "Schedule regular alignment meetings to prevent the Sanguine from outpacing the Melancholic's analysis",
      ],
    },
    Choleric: {
      risk: "high",
      description:
        "Melancholic-Choleric pairs are the most volatile team dynamic. The Choleric's command-and-control style can be devastating to the Melancholic's confidence, while the Melancholic's caution can feel like sabotage to the Choleric. Without structural guardrails, this pairing often deteriorates.",
      triggers: [
        "The Choleric pressures the Melancholic to make a decision before they're ready",
        "The Melancholic raises concerns publicly that the Choleric interprets as undermining",
        "The Melancholic withdraws and stops contributing, which the Choleric reads as passivity",
      ],
      mitigation: [
        "Establish pre-agreed decision criteria so the Melancholic's analysis feels structured, not obstructive",
        "The Choleric should never pressure the Melancholic for an immediate response to complex questions",
        "Create a private channel for the Melancholic to raise concerns without feeling ambushed",
        "The Choleric should acknowledge the Melancholic's expertise explicitly in team settings",
      ],
    },
    Melancholic: {
      risk: "low",
      description:
        "Melancholic-Melancholic pairs naturally understand each other's need for depth, accuracy, and thoughtful analysis. They produce high-quality work together but risk becoming paralyzed by analysis or reinforcing each other's pessimistic tendencies. The relationship itself rarely has interpersonal conflict.",
      triggers: [
        "Disagreements over quality standards where both feel their approach is the correct one",
        "Shared perfectionism delaying a deliverable neither is willing to release",
        "Both avoiding a difficult conversation with a third party, leaving the problem unaddressed",
      ],
      mitigation: [
        "Set explicit 'done' criteria before starting work to prevent endless refinement",
        "Rotate the decision-maker role to prevent stalemates on quality calls",
        "Introduce external deadlines or a Choleric stakeholder to create forward pressure",
        "Schedule a 'good enough' check-in where both must commit to releasing the work",
      ],
    },
    Phlegmatic: {
      risk: "low",
      description:
        "Melancholic-Phlegmatic pairs share a calm, thoughtful approach and rarely experience overt conflict. The danger lies in their mutual aversion to confrontation — important issues may go unaddressed because neither wants to disrupt the peace. Their working relationship is comfortable but can become stagnant.",
      triggers: [
        "Both avoid raising performance concerns with a struggling colleague",
        "Decisions stall because neither wants to commit to a direction the other might not prefer",
        "The Phlegmatic takes on unspoken workloads that eventually create silent resentment",
      ],
      mitigation: [
        "Create a structured protocol for raising difficult topics — both need permission and process",
        "Set regular check-ins focused specifically on 'what are we not saying?'",
        "Rotate responsibility for driving decisions so neither becomes the permanent 'bad guy'",
        "The Melancholic should model raising concerns to give the Phlegmatic a template for doing the same",
      ],
    },
  },
  Phlegmatic: {
    Sanguine: {
      risk: "low",
      description:
        "Phlegmatic-Sanguine pairs are naturally warm and low-conflict. The Phlegmatic provides grounding while the Sanguine provides lift. The main risk is that neither will address issues directly, and the Phlegmatic may silently burn out from the Sanguine's energy demands.",
      triggers: [
        "The Sanguine's enthusiasm feels exhausting to the Phlegmatic over long periods",
        "The Phlegmatic's need for quiet space is misread as disinterest by the Sanguine",
        "Both avoid giving each other honest feedback about their working style",
      ],
      mitigation: [
        "Establish explicit communication boundaries and check in on them regularly",
        "The Sanguine should ask the Phlegmatic directly: 'Do you have bandwidth for this right now?'",
        "The Phlegmatic should communicate their processing needs proactively rather than withdrawing silently",
        "Schedule one-on-one meetings to maintain the relationship quality that both value",
      ],
    },
    Choleric: {
      risk: "high",
      description:
        "Phlegmatic-Choleric pairs are deceptive — they look functional because the Phlegmatic accommodates, but the power imbalance creates long-term risk. The Phlegmatic's reluctance to push back means the Choleric may never learn the true cost of their decisions, leading to a sudden and catastrophic breakdown.",
      triggers: [
        "The Choleric makes unilateral decisions the Phlegmatic disagrees with but won't voice",
        "The Phlegmatic's quiet compliance is misinterpreted as wholehearted agreement",
        "Unaddressed resentment from the Phlegmatic surfaces as disengagement or resignation",
      ],
      mitigation: [
        "Install a mandatory 'devil's advocate' step in all decision processes",
        "The Choleric must explicitly create psychological safety for dissent — and demonstrate it's welcome",
        "The Phlegmatic should use written channels to express concerns if speaking up feels too confrontational",
        "Conduct regular retrospectives focused on decision quality and both parties' experience",
      ],
    },
    Melancholic: {
      risk: "low",
      description:
        "Phlegmatic-Melancholic pairs share a thoughtful, low-key communication style and rarely experience interpersonal friction. Their risk is collective passivity — without external pressure, they may avoid difficult decisions and allow problems to accumulate in the name of maintaining calm.",
      triggers: [
        "Both defer to the other when a decision needs to be made",
        "Issues requiring confrontation go unaddressed until they become crises",
        "The Melancholic's critical analysis reinforces the Phlegmatic's desire to avoid conflict",
      ],
      mitigation: [
        "Assign clear decision ownership for each project or domain",
        "Use a structured framework for raising concerns — e.g., a weekly written status update",
        "Introduce an external facilitator or Choleric stakeholder for high-stakes decisions",
        "The Melancholic should model courageous communication to give the Phlegmatic a safe template",
      ],
    },
    Phlegmatic: {
      risk: "low",
      description:
        "Phlegmatic-Phlegmatic pairs are the most harmonious and the least likely to experience open conflict. This is simultaneously their greatest strength and their most dangerous blind spot. Important conversations simply never happen, and both partners assume the other is fine.",
      triggers: [
        "Neither raises concerns about a deteriorating project until it's too late",
        "Both defer on decisions, creating bottlenecks that nobody names",
        "The relationship feels comfortable but produces less than either temperament is capable of",
      ],
      mitigation: [
        "Install structured decision-making frameworks with explicit deadlines",
        "Create a shared 'concerns log' where both must contribute weekly",
        "Appoint an external accountability partner or advisor to surface blind spots",
        "Set 'discomfort quotas' — both must raise one difficult topic per week, no exceptions",
      ],
    },
  },
};

export interface CommPairDetail {
  row: string;
  col: string;
  data: CommStyle;
}

const COMM_TEMPERAMENTS = ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"];

export function commPairsForRow(row: string): CommPairDetail[] {
  const rowData = COMMUNICATION_MATRIX[row];
  if (!rowData) return [];
  return COMM_TEMPERAMENTS.filter((col) => rowData[col]).map((col) => ({
    row,
    col,
    data: rowData[col],
  }));
}

export function commPairsAll(): CommPairDetail[] {
  return COMM_TEMPERAMENTS.flatMap((row) => commPairsForRow(row));
}

export function analyzeTeamComposition(
  primaryTemps: string[]
): TeamComposition {
  const validTemps = ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"];
  const filtered = primaryTemps.filter((t) => validTemps.includes(t));
  const total = filtered.length || 1;

  const composition: Record<string, number> = {
    Sanguine: 0,
    Choleric: 0,
    Melancholic: 0,
    Phlegmatic: 0,
  };

  for (const temp of filtered) {
    composition[temp] = (composition[temp] || 0) + 1;
  }

  const percentages: Record<string, number> = {};
  for (const temp of validTemps) {
    percentages[temp] = Math.round((composition[temp] / total) * 100);
  }

  const idealShare = 100 / validTemps.length;
  let balanceScore = 100;
  for (const temp of validTemps) {
    const deviation = Math.abs(percentages[temp] - idealShare);
    balanceScore -= deviation * 0.5;
  }
  balanceScore = Math.max(0, Math.min(100, Math.round(balanceScore)));

  const balanceGaps: string[] = [];
  const gapMessages: Record<string, string> = {
    Sanguine:
      "No Sanguine — team may lack creative energy, stakeholder warmth, and morale-building initiatives",
    Choleric:
      "No Choleric — team may struggle with decisiveness, deadline enforcement, and driving results under pressure",
    Melancholic:
      "No Melancholic — team may lack attention to detail, quality control, and deep analytical thinking",
    Phlegmatic:
      "No Phlegmatic — team may lack emotional stability, conflict mediation, and reliable follow-through on routine work",
  };

  for (const temp of validTemps) {
    if (composition[temp] === 0) {
      balanceGaps.push(gapMessages[temp]);
    }
  }

  let dominantStyle = "Balanced";
  let maxCount = 0;
  for (const temp of validTemps) {
    if (composition[temp] > maxCount) {
      maxCount = composition[temp];
      dominantStyle = temp;
    }
  }
  if (maxCount <= 1 && total >= 4) dominantStyle = "Balanced";

  const recommendations: string[] = [];
  if (percentages.Sanguine < 20) {
    recommendations.push(
      "Bring in a Sanguine voice for brainstorming sessions and stakeholder-facing work — even informally"
    );
  }
  if (percentages.Choleric < 20) {
    recommendations.push(
      "Assign a Choleric-adjacent role (e.g., a project manager or executive sponsor) to provide decisiveness and accountability"
    );
  }
  if (percentages.Melancholic < 20) {
    recommendations.push(
      "Invest in quality assurance processes and documentation standards to compensate for the lack of Melancholic attention to detail"
    );
  }
  if (percentages.Phlegmatic < 20) {
    recommendations.push(
      "Create structured check-ins and psychological safety practices to replace the stabilizing influence a Phlegmatic would naturally provide"
    );
  }
  if (maxCount > total * 0.5) {
    recommendations.push(
      `Consider diversifying beyond ${dominantStyle}-heavy composition — monocultures create blind spots even when the dominant style is strong`
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Your team is well-balanced across temperament types. Focus on leveraging your diversity in structured collaboration practices."
    );
    recommendations.push(
      "Run periodic retrospectives to ensure all temperaments feel heard and valued in decision-making processes."
    );
  }

  const presentTemps = validTemps.filter((t) => composition[t] > 0);
  const dominantCount = composition[dominantStyle] || 0;

  let executiveSummary = "";
  if (total <= 1) {
    executiveSummary = `This team is dominated by a single temperament (${dominantStyle}), which creates clarity of style but significant blind spots. Without complementary temperaments, decisions and communication will consistently favor ${dominantStyle.toLowerCase()} instincts — building in deliberate checks from other perspectives is essential.`;
  } else if (balanceScore >= 85) {
    executiveSummary = `This is a well-balanced team with representation across ${presentTemps.length} temperament type${presentTemps.length > 1 ? "s" : ""} — ${presentTemps.join(", ")}. The ${dominantStyle.toLowerCase()} influence provides direction while diverse perspectives prevent groupthink. Focus on creating structured processes that ensure every temperament's strengths are activated.`;
  } else if (balanceScore >= 60) {
    executiveSummary = `This team skews toward ${dominantStyle.toLowerCase()} tendencies (${percentages[dominantStyle]}% of the team), which creates clear strengths in ${dominantStyle === "Sanguine" ? "relationship-building and creative energy" : dominantStyle === "Choleric" ? "decision-making and execution speed" : dominantStyle === "Melancholic" ? "quality control and analytical depth" : "stability and emotional intelligence"}. However, the gaps in ${balanceGaps.length > 0 ? "missing temperaments" : "underrepresented temperaments"} should be addressed through deliberate role design and external partnerships.`;
  } else {
    executiveSummary = `This team is heavily concentrated in ${dominantStyle.toLowerCase()} temperament (${percentages[dominantStyle]}%), creating a significant monoculture risk. While the team excels in ${dominantStyle === "Sanguine" ? "creative energy and social connection" : dominantStyle === "Choleric" ? "decisiveness and results orientation" : dominantStyle === "Melancholic" ? "analytical rigor and quality standards" : "stability and consensus-building"}, it faces critical blind spots. Immediate action is recommended to introduce complementary perspectives.`;
  }

  return {
    composition,
    percentages,
    balanceScore,
    balanceGaps,
    dominantStyle,
    recommendations,
    executiveSummary,
  };
}

export function generateConflictPairs(
  primaryTemps: string[]
): ConflictPair[] {
  const validTemps = ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"];
  const present = primaryTemps.filter((t) => validTemps.includes(t));
  const uniqueTemps = [...new Set(present)];

  const results: ConflictPair[] = [];

  for (let i = 0; i < uniqueTemps.length; i++) {
    for (let j = i + 1; j < uniqueTemps.length; j++) {
      const tempA = uniqueTemps[i];
      const tempB = uniqueTemps[j];
      const riskData = CONFLICT_RISKS[tempA]?.[tempB];

      if (riskData && riskData.risk === "high") {
        results.push({
          pair: [tempA, tempB],
          risk: riskData.risk,
          description: riskData.description,
          mitigation: riskData.mitigation,
        });
      }
    }
  }

  results.sort((a, b) => {
    const priority: Record<string, number> = { high: 3, medium: 2, low: 1 };
    return (priority[b.risk] || 0) - (priority[a.risk] || 0);
  });

  return results;
}
