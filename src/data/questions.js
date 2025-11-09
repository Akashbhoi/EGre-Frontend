// Question database with 10 GRE-standard questions per topic

// Quantitative Reasoning Questions (GRE Standard)
const quantitativeQuestions = [
  {
    id: 'q1',
    question: 'If 3x + 7 = 22, what is the value of 6x + 14?',
    options: ['30', '44', '50', '66'],
    correctAnswer: 1,
    explanation: 'First solve for x: 3x = 15, so x = 5. Notice that 6x + 14 = 2(3x + 7) = 2(22) = 44. Alternatively, substitute x = 5 to get 6(5) + 14 = 44.',
    topic: 'Algebra',
    difficulty: 'Easy',
    hint: 'Try to find a relationship between the two expressions before solving for x.',
  },
  {
    id: 'q2',
    question: 'A circular garden has a diameter of 20 feet. If the garden is surrounded by a path that is 3 feet wide, what is the area of the path in square feet?',
    options: ['69π', '78π', '87π', '96π'],
    correctAnswer: 0,
    explanation: 'The outer circle has radius 10 + 3 = 13 feet. Area of path = π(13)² - π(10)² = 169π - 100π = 69π square feet.',
    topic: 'Geometry',
    difficulty: 'Medium',
    hint: 'Calculate the area of the outer circle and subtract the area of the inner circle.',
  },
  {
    id: 'q3',
    question: 'In a sequence, each term after the first is 3 more than twice the preceding term. If the first term is 2, what is the fourth term?',
    options: ['26', '35', '37', '41'],
    correctAnswer: 2,
    explanation: 'First term = 2, Second term = 2(2) + 3 = 7, Third term = 2(7) + 3 = 17, Fourth term = 2(17) + 3 = 37.',
    topic: 'Sequences',
    difficulty: 'Medium',
    hint: 'Apply the rule successively: next term = 2 × (current term) + 3.',
  },
  {
    id: 'q4',
    question: 'If x² - y² = 48 and x + y = 8, what is the value of x - y?',
    options: ['4', '6', '8', '12'],
    correctAnswer: 1,
    explanation: 'Using the difference of squares: x² - y² = (x + y)(x - y) = 48. Since x + y = 8, we have 8(x - y) = 48, therefore x - y = 6.',
    topic: 'Algebra',
    difficulty: 'Medium',
    hint: 'Use the factorization formula for the difference of squares.',
  },
  {
    id: 'q5',
    question: 'The average (arithmetic mean) of 5 numbers is 24. If one of the numbers is removed, the average of the remaining 4 numbers is 21. What is the value of the number that was removed?',
    options: ['27', '30', '33', '36'],
    correctAnswer: 3,
    explanation: 'Sum of 5 numbers = 5 × 24 = 120. Sum of 4 numbers = 4 × 21 = 84. The removed number = 120 - 84 = 36.',
    topic: 'Statistics',
    difficulty: 'Easy',
    hint: 'Find the sum of all numbers, then subtract the sum of the remaining numbers.',
  },
  {
    id: 'q6',
    question: 'A line in the xy-plane passes through the origin and has a slope of 3/4. Which of the following points lies on this line?',
    options: ['(3, 4)', '(4, 3)', '(8, 6)', '(12, 9)'],
    correctAnswer: 2,
    explanation: 'The equation of the line is y = (3/4)x. Checking option C: (8, 6), we have 6 = (3/4)(8) = 6. This is correct.',
    topic: 'Coordinate Geometry',
    difficulty: 'Easy',
    hint: 'The equation of a line through the origin with slope m is y = mx.',
  },
  {
    id: 'q7',
    question: 'What is the vertex of the parabola y = 2x² - 8x + 5?',
    options: [
      '(2, -3)',
      '(2, 5)',
      '(-2, 13)',
      '(4, 5)',
    ],
    correctAnswer: 0,
    explanation: 'For y = ax² + bx + c, the x-coordinate of the vertex is -b/(2a) = -(-8)/(2×2) = 2. Substituting x = 2: y = 2(4) - 8(2) + 5 = 8 - 16 + 5 = -3. Vertex is (2, -3).',
    topic: 'Coordinate Geometry',
    difficulty: 'Medium',
    hint: 'Use the vertex formula x = -b/(2a) and then substitute to find y.',
    hasGraph: true,
    graphData: {
      equation: '2*x^2 - 8*x + 5',
      type: 'quadratic',
      highlightPoints: [{ x: 2, y: -3, label: 'Vertex' }],
      hideEquation: true,
      hideLabels: true,
      hideAxisLabels: true,
    },
  },
  {
    id: 'q8',
    question: 'If 2^n = 64, what is the value of 2^(n-2)?',
    options: ['8', '12', '16', '32'],
    correctAnswer: 2,
    explanation: 'Since 2^n = 64 = 2^6, we have n = 6. Therefore, 2^(n-2) = 2^(6-2) = 2^4 = 16.',
    topic: 'Algebra',
    difficulty: 'Easy',
    hint: 'First find the value of n, then calculate 2^(n-2).',
  },
  {
    id: 'q9',
    question: 'In a certain store, the price of a product was reduced by 20% and then the reduced price was increased by 20%. The final price is what percent of the original price?',
    options: ['96%', '98%', '100%', '104%'],
    correctAnswer: 0,
    explanation: 'Let original price = 100. After 20% reduction: 80. After 20% increase: 80 × 1.20 = 96. The final price is 96% of the original.',
    topic: 'Percentages',
    difficulty: 'Medium',
    hint: 'Use 100 as the original price to make calculations easier.',
  },
  {
    id: 'q10',
    question: 'A rectangle has length L and width W. If the length is increased by 50% and the width is decreased by 20%, by what percent does the area change?',
    options: ['Increases by 20%', 'Increases by 30%', 'Decreases by 10%', 'Remains the same'],
    correctAnswer: 0,
    explanation: 'Original area = LW. New length = 1.5L, new width = 0.8W. New area = (1.5L)(0.8W) = 1.2LW. The area increases by 20%.',
    topic: 'Geometry',
    difficulty: 'Medium',
    hint: 'Calculate the new area as a product of the changed dimensions.',
  },
];

// Verbal Reasoning Questions (GRE Standard)
const verbalQuestions = [
  {
    id: 'v1',
    question: 'Although the new policy was designed to be (i)______, critics argued that its implementation would be (ii)______ to achieve without significant resources.',
    options: [
      '(i) beneficial (ii) straightforward',
      '(i) beneficial (ii) difficult',
      '(i) controversial (ii) simple',
      '(i) ineffective (ii) impossible'
    ],
    correctAnswer: 1,
    explanation: 'The word "although" signals a contrast. If the policy was designed to be beneficial, critics would point out difficulties. "Beneficial" and "difficult" create the appropriate contrast.',
    topic: 'Text Completion',
    difficulty: 'Medium',
    hint: 'Look for contrasting ideas signaled by "although" and "critics argued".',
  },
  {
    id: 'v2',
    question: 'The scientist\'s findings were met with ______, as her peers questioned both her methodology and her conclusions.',
    options: ['acclaim', 'skepticism', 'indifference', 'enthusiasm'],
    correctAnswer: 1,
    explanation: 'Skepticism means doubt or questioning, which matches the description of peers questioning her work.',
    topic: 'Text Completion',
    difficulty: 'Easy',
    hint: 'The sentence describes peers questioning the work - what attitude does this reflect?',
  },
  {
    id: 'v3',
    question: 'Despite the ______ nature of the evidence, the committee decided to proceed with the investigation.',
    options: ['conclusive', 'fragmentary', 'overwhelming', 'definitive'],
    correctAnswer: 1,
    explanation: 'The word "despite" indicates contrast. If they proceeded despite the evidence\'s nature, it must be fragmentary (incomplete), not strong.',
    topic: 'Text Completion',
    difficulty: 'Medium',
    hint: 'The word "despite" signals a contrast - weak evidence vs. proceeding anyway.',
  },
  {
    id: 'v4',
    question: 'Select the answer that, when used to complete the sentence, fits the meaning of the sentence as a whole.\n\nThe professor\'s lecture was so ______ that even students who typically struggled with the subject found it easy to understand.',
    options: [
      'lucid',
      'obscure',
      'convoluted',
      'pellucid',
      'ambiguous',
      'verbose'
    ],
    correctAnswer: 0,
    explanation: 'Both "lucid" and "pellucid" mean clear and easy to understand, which fits the context that students found the lecture easy to understand. "Lucid" is the best answer here.',
    topic: 'Text Completion',
    difficulty: 'Medium',
    hint: 'Find a word that means "clear" or "easy to understand".',
  },
  {
    id: 'v5',
    question: 'The politician\'s speech was characterized by ______ rather than substance; she offered compelling rhetoric but few concrete proposals.',
    options: [
      'profundity',
      'bombast',
      'candor',
      'pragmatism'
    ],
    correctAnswer: 1,
    explanation: 'Bombast means high-sounding language with little meaning, which contrasts with substance and matches "compelling rhetoric but few concrete proposals".',
    topic: 'Text Completion',
    difficulty: 'Hard',
    hint: 'Look for a word meaning impressive-sounding but empty language.',
  },
  {
    id: 'v6',
    question: 'The ancient manuscript was so ______ that scholars could barely decipher its contents.',
    options: [
      'legible',
      'deteriorated',
      'pristine',
      'effaced',
      'immaculate',
      'preserved'
    ],
    correctAnswer: 1,
    explanation: 'Both "deteriorated" and "effaced" indicate the manuscript was damaged or faded, making it hard to read. "Deteriorated" is the primary answer.',
    topic: 'Text Completion',
    difficulty: 'Medium',
    hint: 'Find a word that describes something difficult to read due to damage or fading.',
  },
  {
    id: 'v7',
    question: 'While the artist\'s early works were characterized by ______, her later pieces demonstrated a mastery of technique and precision.',
    options: [
      'sophistication',
      'crudeness',
      'refinement',
      'meticulousness'
    ],
    correctAnswer: 1,
    explanation: 'The contrast word "while" indicates her early works were opposite to "mastery" and "precision". Crudeness is the opposite of refinement and precision.',
    topic: 'Text Completion',
    difficulty: 'Easy',
    hint: 'Look for a word that contrasts with "mastery" and "precision".',
  },
  {
    id: 'v8',
    question: 'The historian\'s interpretation of the event was (i)______ by contemporary scholars, who found her analysis both (ii)______ and well-supported.',
    options: [
      '(i) dismissed (ii) superficial',
      '(i) lauded (ii) insightful',
      '(i) ignored (ii) flawed',
      '(i) criticized (ii) questionable'
    ],
    correctAnswer: 1,
    explanation: 'If scholars found the analysis "well-supported," they would praise (laud) it and find it insightful. This creates a consistent positive evaluation.',
    topic: 'Text Completion',
    difficulty: 'Medium',
    hint: 'The phrase "well-supported" is positive, so both blanks should have positive words.',
  },
  {
    id: 'v9',
    question: 'The CEO\'s decision to restructure the company was ______, given the declining market conditions.',
    options: [
      'imprudent',
      'judicious',
      'reckless',
      'sagacious',
      'foolhardy',
      'arbitrary'
    ],
    correctAnswer: 1,
    explanation: 'Both "judicious" and "sagacious" mean wise or showing good judgment. Given declining market conditions, restructuring would be a wise decision. "Judicious" is the primary answer.',
    topic: 'Text Completion',
    difficulty: 'Hard',
    hint: 'Given declining conditions, restructuring would be a wise move. Find a word meaning "wise".',
  },
  {
    id: 'v10',
    question: 'The author\'s prose style is notable for its ______, using simple, direct language rather than ornate expressions.',
    options: [
      'verbosity',
      'austerity',
      'flamboyance',
      'opacity'
    ],
    correctAnswer: 1,
    explanation: 'Austerity means simplicity and plainness, which matches "simple, direct language rather than ornate expressions".',
    topic: 'Text Completion',
    difficulty: 'Medium',
    hint: 'Look for a word meaning simplicity or plainness in style.',
  },
];

// Analytical Writing Questions (GRE Standard - converted to MCQ format)
const analyticalWritingQuestions = [
  {
    id: 'a1',
    question: 'Which of the following is the best approach to analyze the argument: "Increasing funding for public transportation will reduce traffic congestion"?',
    options: [
      'Accept the claim as true without evaluating assumptions',
      'Identify assumptions, evaluate evidence, and consider alternative explanations',
      'Focus only on economic implications',
      'Discuss the environmental benefits only',
    ],
    correctAnswer: 1,
    explanation: 'A strong GRE Argument Analysis identifies hidden assumptions (e.g., people will use public transit), evaluates the evidence provided, and considers alternative explanations for reducing congestion.',
    topic: 'Argument Analysis',
    difficulty: 'Medium',
    hint: 'Think about what assumptions the argument makes and how to test them.',
  },
  {
    id: 'a2',
    question: 'Argument: "The local library should extend its hours because a survey showed that 80% of residents want more access to library resources." Which flaw is most apparent?',
    options: [
      'The argument is completely valid',
      'Missing information about costs and feasibility',
      'Correlation implies causation',
      'False dilemma fallacy'
    ],
    correctAnswer: 1,
    explanation: 'The argument is flawed because it doesn\'t consider: cost implications, staffing requirements, current usage rates, or whether extending hours would actually increase meaningful access.',
    topic: 'Argument Analysis',
    difficulty: 'Medium',
    hint: 'Consider what practical information is missing from this argument.',
  },
  {
    id: 'a3',
    question: 'Issue: "Governments should prioritize environmental protection over economic development." What is the best approach for a GRE Issue Essay?',
    options: [
      'Strongly agree without considering counterarguments',
      'Strongly disagree without nuance',
      'Present a balanced analysis considering both perspectives and context',
      'Remain completely neutral without taking a position'
    ],
    correctAnswer: 2,
    explanation: 'GRE Issue Essays require nuanced analysis. Consider how environmental protection and economic development can coexist, provide specific examples, and acknowledge trade-offs.',
    topic: 'Issue Essay',
    difficulty: 'Hard',
    hint: 'The GRE values balanced, thoughtful analysis over extreme positions.',
  },
  {
    id: 'a4',
    question: 'Argument: "Our company should switch to remote work because other companies have increased productivity after making this change." What is the primary flaw?',
    options: [
      'The argument is valid and well-supported',
      'Hasty generalization - assumes all companies are alike',
      'Ad hominem attack',
      'Circular reasoning'
    ],
    correctAnswer: 1,
    explanation: 'This is a hasty generalization. What works for other companies may not work for this one due to different industries, company culture, job types, or management structures.',
    topic: 'Argument Analysis',
    difficulty: 'Medium',
    hint: 'Consider whether results from other companies can be directly applied.',
  },
  {
    id: 'a5',
    question: 'Issue: "Technology has made people more isolated rather than more connected." How should a strong GRE essay approach this?',
    options: [
      'Agree completely with examples',
      'Disagree completely with examples',
      'Acknowledge both isolation and connection, with specific examples and context',
      'Refuse to take any position'
    ],
    correctAnswer: 2,
    explanation: 'A strong response acknowledges both sides: technology enables connection across distances (social media, video calls) but may reduce face-to-face interaction. Context matters - age groups, usage patterns, etc.',
    topic: 'Issue Essay',
    difficulty: 'Medium',
    hint: 'Think of specific examples of how technology both connects and isolates people.',
  },
  {
    id: 'a6',
    question: 'Argument: "The school should require all students to take physical education because exercise improves academic performance." What assumption does this make?',
    options: [
      'No assumptions - the argument is complete',
      'Assumes that requiring PE automatically leads to exercise that improves performance',
      'Assumes students don\'t currently exercise',
      'Assumes all exercise is beneficial'
    ],
    correctAnswer: 1,
    explanation: 'The argument assumes that: (1) required PE leads to meaningful exercise, (2) this exercise will improve academic performance, (3) students will participate actively, and (4) there are no better alternatives.',
    topic: 'Argument Analysis',
    difficulty: 'Hard',
    hint: 'Consider the gap between requiring a class and achieving the stated outcome.',
  },
  {
    id: 'a7',
    question: 'Issue: "Society should value artists and musicians as much as scientists and engineers." What makes a strong GRE response?',
    options: [
      'Argue that science is objectively more important',
      'Argue that art is objectively more important',
      'Discuss how different fields contribute uniquely to society with specific examples',
      'Avoid discussing specific contributions'
    ],
    correctAnswer: 2,
    explanation: 'A strong essay acknowledges that different fields contribute in different but equally important ways - science advances technology and medicine, while arts enrich culture, provide emotional expression, and foster creativity.',
    topic: 'Issue Essay',
    difficulty: 'Hard',
    hint: 'Think about the unique and complementary contributions of both fields.',
  },
  {
    id: 'a8',
    question: 'Argument: "We should ban social media for teenagers because studies show it increases anxiety and depression." What is the primary weakness?',
    options: [
      'The argument is sound and well-reasoned',
      'Oversimplifies a complex issue and ignores alternative solutions',
      'Uses too much statistical evidence',
      'Focuses too much on teenagers'
    ],
    correctAnswer: 1,
    explanation: 'The argument oversimplifies: correlation ≠ causation, ignores benefits of social media (connection, education), and overlooks better solutions (education, moderation, parental guidance) than an outright ban.',
    topic: 'Argument Analysis',
    difficulty: 'Hard',
    hint: 'Consider whether the proposed solution is the only or best option.',
  },
  {
    id: 'a9',
    question: 'Issue: "Standardized testing is an effective measure of student achievement and should be used to evaluate schools." What analysis does the GRE expect?',
    options: [
      'Fully support standardized testing',
      'Completely oppose standardized testing',
      'Acknowledge both benefits (comparability) and limitations (narrow focus, socioeconomic factors)',
      'Discuss only the history of testing'
    ],
    correctAnswer: 2,
    explanation: 'A balanced response acknowledges benefits (comparability across schools, accountability) AND limitations (teaching to test, narrow focus on certain skills, socioeconomic bias, doesn\'t measure creativity).',
    topic: 'Issue Essay',
    difficulty: 'Hard',
    hint: 'Consider both advantages and significant limitations of standardized testing.',
  },
  {
    id: 'a10',
    question: 'Argument: "The city should build more parks because parks improve quality of life and property values increase near parks." What information is needed to evaluate this?',
    options: [
      'No additional information needed',
      'Cost analysis, maintenance requirements, opportunity costs, and demographic data',
      'Only environmental impact data',
      'Only park usage statistics'
    ],
    correctAnswer: 1,
    explanation: 'To evaluate this argument, we need: construction/maintenance costs, whether benefits justify costs, available land/resources, current park usage, demographic needs, and what else the funds could accomplish (opportunity cost).',
    topic: 'Argument Analysis',
    difficulty: 'Hard',
    hint: 'Consider what factors a complete cost-benefit analysis would require.',
  },
];

// Question sets by topic
export const questionSets = {
  'quantitative-reasoning': quantitativeQuestions,
  'verbal-reasoning': verbalQuestions,
  'analytical-writing': analyticalWritingQuestions,
  // Default sets for backward compatibility
  '1': quantitativeQuestions.slice(0, 10),
  '2': verbalQuestions.slice(0, 10),
  '3': analyticalWritingQuestions.slice(0, 10),
  '4': quantitativeQuestions.slice(0, 10),
  '5': verbalQuestions.slice(0, 10),
  '6': analyticalWritingQuestions.slice(0, 10),
};

// Get questions for a specific set
export const getQuestionsForSet = (setId) => {
  // Map set IDs to question sets
  const setIdMap = {
    '1': 'quantitative-reasoning',
    '2': 'quantitative-reasoning',
    '3': 'verbal-reasoning',
    '4': 'verbal-reasoning',
    '5': 'analytical-writing',
    '6': 'analytical-writing',
  };

  const topic = setIdMap[setId] || setId;
  return questionSets[topic] || questionSets['quantitative-reasoning'];
};

