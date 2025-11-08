// Question database with 10 questions per topic

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hint?: string;
  hasGraph?: boolean;
  graphData?: {
    equation: string;
    type: 'quadratic' | 'linear' | 'exponential';
    highlightPoints?: Array<{ x: number; y: number; label?: string }>;
    hideEquation?: boolean;
  };
}

// Quantitative Reasoning Questions
const quantitativeQuestions: Question[] = [
  {
    id: 'q1',
    question: 'If x + 5 = 12, what is the value of x?',
    options: ['5', '7', '12', '17'],
    correctAnswer: 1,
    explanation: 'To solve for x, subtract 5 from both sides: x = 12 - 5 = 7',
    topic: 'Algebra',
    difficulty: 'Easy',
    hint: 'Try isolating x by performing the inverse operation on both sides of the equation.',
  },
  {
    id: 'q2',
    question: 'What is the area of a circle with radius 5?',
    options: ['10π', '25π', '50π', '100π'],
    correctAnswer: 1,
    explanation: 'The area of a circle is πr². With radius 5, the area is π(5)² = 25π',
    topic: 'Geometry',
    difficulty: 'Easy',
    hint: 'Remember the formula for circle area: A = πr² where r is the radius.',
  },
  {
    id: 'q3',
    question: 'If 3x - 7 = 14, what is the value of x?',
    options: ['5', '7', '9', '21'],
    correctAnswer: 1,
    explanation: 'Add 7 to both sides: 3x = 21. Then divide by 3: x = 7',
    topic: 'Algebra',
    difficulty: 'Easy',
    hint: 'First isolate the term with x by adding 7, then divide by the coefficient.',
  },
  {
    id: 'q4',
    question: 'A triangle has sides of length 3, 4, and 5. What is its area?',
    options: ['6', '7.5', '10', '12'],
    correctAnswer: 0,
    explanation: 'This is a 3-4-5 right triangle. Area = (1/2) × base × height = (1/2) × 3 × 4 = 6',
    topic: 'Geometry',
    difficulty: 'Easy',
    hint: 'Check if this is a right triangle using the Pythagorean theorem.',
  },
  {
    id: 'q5',
    question: 'If 2^(x+1) = 16, what is the value of x?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    explanation: 'Since 16 = 2⁴, we have 2^(x+1) = 2⁴. Therefore, x + 1 = 4, so x = 3',
    topic: 'Algebra',
    difficulty: 'Medium',
    hint: 'Express 16 as a power of 2, then equate the exponents.',
  },
  {
    id: 'q6',
    question: 'What is the slope of the line passing through points (2, 3) and (5, 9)?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'Slope = (y₂ - y₁) / (x₂ - x₁) = (9 - 3) / (5 - 2) = 6 / 3 = 2',
    topic: 'Coordinate Geometry',
    difficulty: 'Medium',
    hint: 'Use the slope formula: m = (y₂ - y₁) / (x₂ - x₁)',
  },
  {
    id: 'q7',
    question: 'What is the equation of the parabola shown in the graph?',
    options: [
      'y = x² - 2x + 1',
      'y = x² + 2x + 1',
      'y = -x² + 2x + 1',
      'y = x² - 1',
    ],
    correctAnswer: 0,
    explanation: 'The graph shows a parabola with its vertex at (1, 0). The equation y = x² - 2x + 1 can be factored as y = (x - 1)², which is a standard parabola shifted 1 unit to the right, matching the vertex.',
    topic: 'Coordinate Geometry',
    difficulty: 'Medium',
    hint: 'Identify the vertex of the parabola from the graph. Then, see which of the given equations has that vertex.',
    hasGraph: true,
    graphData: {
      equation: 'x^2 - 2*x + 1',
      type: 'quadratic',
      highlightPoints: [{ x: 1, y: 0, label: 'Vertex' }],
      hideEquation: true,
    },
  },
  {
    id: 'q8',
    question: 'Solve for x: log₂(x) = 4',
    options: ['8', '12', '16', '32'],
    correctAnswer: 2,
    explanation: 'If log₂(x) = 4, then x = 2⁴ = 16',
    topic: 'Algebra',
    difficulty: 'Medium',
    hint: 'Remember that log_b(a) = c means b^c = a.',
  },
  {
    id: 'q9',
    question: 'If f(x) = x² + 3x - 2, what is f(-1)?',
    options: ['-4', '-2', '0', '2'],
    correctAnswer: 0,
    explanation: 'f(-1) = (-1)² + 3(-1) - 2 = 1 - 3 - 2 = -4',
    topic: 'Algebra',
    difficulty: 'Medium',
    hint: 'Substitute -1 for x in the function and simplify.',
  },
  {
    id: 'q10',
    question: `The graph above shows the function f(x) = x² - 4x + 3 for all real values of x.

Consider the following statements about the graph:
I. The function has a minimum value of -1 at x = 2
II. The function is decreasing on the interval (-∞, 2) and increasing on the interval (2, ∞)
III. The function f(x) = 0 has exactly two real solutions

Based on the graph and the properties of quadratic functions, which of the following statements must be true?`,
    options: [
      'I only',
      'II only',
      'I and II only',
      'I, II, and III',
    ],
    correctAnswer: 3,
    explanation: `All three statements are true for the quadratic function f(x) = x² - 4x + 3.

Statement I: Since the parabola opens upward (coefficient of x² is positive), the vertex represents the minimum point. The vertex is at (2, -1), so the minimum value is -1 at x = 2. ✓

Statement II: For a quadratic function that opens upward, the function decreases from -∞ to the x-coordinate of the vertex, and increases from the x-coordinate of the vertex to ∞. Since the vertex is at x = 2, the function is decreasing on (-∞, 2) and increasing on (2, ∞). ✓

Statement III: The function f(x) = 0 means we need to find where the graph intersects the x-axis. The graph shows intersections at x = 1 and x = 3. We can verify: f(1) = 1² - 4(1) + 3 = 0 and f(3) = 3² - 4(3) + 3 = 0. Since this is a quadratic function, it can have at most 2 real roots, and we have exactly 2. ✓

Therefore, all three statements are true.`,
    topic: 'Coordinate Geometry',
    difficulty: 'Hard',
    hint: 'For a quadratic function f(x) = ax² + bx + c where a > 0, the vertex is the minimum point. The function decreases before the vertex and increases after it. The number of x-intercepts equals the number of real solutions to f(x) = 0.',
    hasGraph: true,
    graphData: {
      equation: 'x² - 4x + 3',
      type: 'quadratic',
      highlightPoints: [
        { x: 1, y: 0, label: 'A' },
        { x: 2, y: -1, label: 'Vertex' },
        { x: 3, y: 0, label: 'B' },
        { x: 0, y: 3, label: 'C' },
      ],
    },
  },
];

// Verbal Reasoning Questions
const verbalQuestions: Question[] = [
  {
    id: 'v1',
    question: 'Choose the word that is most similar in meaning to "ABUNDANT":',
    options: ['Scarce', 'Plentiful', 'Rare', 'Limited'],
    correctAnswer: 1,
    explanation: '"Abundant" means existing in large quantities, which is synonymous with "plentiful".',
    topic: 'Vocabulary',
    difficulty: 'Easy',
    hint: 'Think of words that mean "a lot" or "many".',
  },
  {
    id: 'v2',
    question: 'The politician\'s speech was so _____ that many audience members fell asleep.',
    options: ['Eloquent', 'Tedious', 'Inspirational', 'Concise'],
    correctAnswer: 1,
    explanation: '"Tedious" means boring and monotonous, which explains why people fell asleep.',
    topic: 'Sentence Completion',
    difficulty: 'Easy',
    hint: 'Consider what quality of a speech would cause people to fall asleep.',
  },
  {
    id: 'v3',
    question: 'Choose the word that is most opposite in meaning to "EPHEMERAL":',
    options: ['Temporary', 'Transient', 'Permanent', 'Brief'],
    correctAnswer: 2,
    explanation: '"Ephemeral" means lasting for a very short time, so its opposite is "permanent".',
    topic: 'Vocabulary',
    difficulty: 'Easy',
    hint: 'Think of words that mean "lasting forever" or "never-ending".',
  },
  {
    id: 'v4',
    question: 'Despite his initial _____, the student eventually mastered the complex mathematical concept.',
    options: ['Confidence', 'Understanding', 'Confusion', 'Expertise'],
    correctAnswer: 2,
    explanation: 'The word "despite" indicates a contrast. The student eventually mastered it, so initially they were "confused".',
    topic: 'Sentence Completion',
    difficulty: 'Medium',
    hint: 'Look for a contrast word and think about what state would contrast with "mastered".',
  },
  {
    id: 'v5',
    question: 'The scientist\'s research was _____, providing groundbreaking insights into the field.',
    options: ['Superficial', 'Pioneering', 'Derivative', 'Obsolete'],
    correctAnswer: 1,
    explanation: '"Pioneering" means innovative and original, which aligns with "groundbreaking insights".',
    topic: 'Vocabulary',
    difficulty: 'Medium',
    hint: 'Think of words that mean "new" or "innovative".',
  },
  {
    id: 'v6',
    question: 'The author\'s writing style is characterized by its _____, making complex topics accessible to general readers.',
    options: ['Obscurity', 'Clarity', 'Ambiguity', 'Complexity'],
    correctAnswer: 1,
    explanation: 'If complex topics are made "accessible", the writing must have "clarity".',
    topic: 'Sentence Completion',
    difficulty: 'Medium',
    hint: 'Consider what quality would help make complex topics easier to understand.',
  },
  {
    id: 'v7',
    question: 'Choose the word that best completes: "Her argument was so _____ that it convinced even the most skeptical critics."',
    options: ['Weak', 'Compelling', 'Flawed', 'Unsubstantiated'],
    correctAnswer: 1,
    explanation: 'If it convinced skeptical critics, the argument must have been "compelling" (forceful and persuasive).',
    topic: 'Sentence Completion',
    difficulty: 'Medium',
    hint: 'Think of qualities that would convince skeptical people.',
  },
  {
    id: 'v8',
    question: 'The word "MALEVOLENT" most closely means:',
    options: ['Kind', 'Harmful', 'Neutral', 'Beneficial'],
    correctAnswer: 1,
    explanation: '"Malevolent" means having or showing a wish to do evil to others, which is synonymous with "harmful".',
    topic: 'Vocabulary',
    difficulty: 'Medium',
    hint: 'The prefix "mal-" often indicates something bad or evil.',
  },
  {
    id: 'v9',
    question: 'Despite numerous setbacks, the entrepreneur remained _____, always looking for new opportunities.',
    options: ['Defeated', 'Resilient', 'Pessimistic', 'Surrendered'],
    correctAnswer: 1,
    explanation: '"Resilient" means able to recover quickly from difficulties, which describes someone who doesn\'t give up despite setbacks.',
    topic: 'Sentence Completion',
    difficulty: 'Hard',
    hint: 'Think of personality traits that help people persist through difficulties.',
  },
  {
    id: 'v10',
    question: 'The professor\'s lecture was both _____ and _____, combining depth of knowledge with engaging presentation.',
    options: ['Superficial; boring', 'Rigorous; captivating', 'Shallow; monotonous', 'Incomplete; dull'],
    correctAnswer: 1,
    explanation: '"Rigorous" (thorough and accurate) and "captivating" (fascinating) best match "depth of knowledge" and "engaging presentation".',
    topic: 'Sentence Completion',
    difficulty: 'Hard',
    hint: 'Look for words that match both "depth of knowledge" and "engaging presentation".',
  },
];

// Analytical Writing Questions (these are essay prompts, formatted as questions)
const analyticalWritingQuestions: Question[] = [
  {
    id: 'a1',
    question: 'Issue Essay: "The primary goal of education should be to prepare students for the workforce rather than to develop their intellectual curiosity."',
    options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'],
    correctAnswer: 3,
    explanation: 'This is an essay prompt. You should analyze both sides, provide examples, and develop a well-reasoned argument. Consider the value of intellectual curiosity versus practical skills.',
    topic: 'Issue Essay',
    difficulty: 'Medium',
    hint: 'Consider the long-term benefits of intellectual curiosity versus immediate workforce preparation.',
  },
  {
    id: 'a2',
    question: 'Argument Essay: "The local library should extend its hours because a survey showed that 80% of residents want more access to library resources."',
    options: ['Valid Argument', 'Flawed - Sample Size', 'Flawed - Correlation vs Causation', 'Flawed - Missing Context'],
    correctAnswer: 3,
    explanation: 'The argument is flawed because it doesn\'t consider: cost implications, current usage rates, or whether extending hours would actually increase access meaningfully.',
    topic: 'Argument Analysis',
    difficulty: 'Medium',
    hint: 'Consider what information is missing from this argument.',
  },
  {
    id: 'a3',
    question: 'Issue Essay: "Governments should prioritize environmental protection over economic development."',
    options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'],
    correctAnswer: 2,
    explanation: 'This requires balanced analysis. Consider how environmental protection and economic development can coexist, and the consequences of prioritizing one over the other.',
    topic: 'Issue Essay',
    difficulty: 'Hard',
    hint: 'Think about the relationship between environmental protection and economic development.',
  },
  {
    id: 'a4',
    question: 'Argument Essay: "Our company should switch to remote work because other companies have increased productivity after making this change."',
    options: ['Valid', 'Flawed - Generalization', 'Flawed - Sample Bias', 'Flawed - Missing Evidence'],
    correctAnswer: 1,
    explanation: 'This is a hasty generalization. What works for other companies may not work for this one due to different circumstances, culture, or industry.',
    topic: 'Argument Analysis',
    difficulty: 'Medium',
    hint: 'Consider whether results from other companies can be directly applied.',
  },
  {
    id: 'a5',
    question: 'Issue Essay: "Technology has made people more isolated rather than more connected."',
    options: ['Agree', 'Disagree', 'Depends on Context', 'Neutral'],
    correctAnswer: 2,
    explanation: 'A nuanced response would consider both sides: technology enables connection across distances but may reduce face-to-face interaction. Provide specific examples.',
    topic: 'Issue Essay',
    difficulty: 'Medium',
    hint: 'Think of specific examples of how technology both connects and isolates people.',
  },
  {
    id: 'a6',
    question: 'Argument Essay: "The school should require all students to take physical education because exercise improves academic performance."',
    options: ['Valid', 'Flawed - Assumption', 'Flawed - Scope', 'Flawed - Evidence'],
    correctAnswer: 1,
    explanation: 'The argument assumes that requiring PE will lead to exercise that improves performance, but doesn\'t address implementation, student participation, or other factors.',
    topic: 'Argument Analysis',
    difficulty: 'Hard',
    hint: 'Consider the gap between requiring PE and actually improving academic performance.',
  },
  {
    id: 'a7',
    question: 'Issue Essay: "Society should value artists and musicians as much as scientists and engineers."',
    options: ['Agree', 'Disagree', 'Equal Value Different Ways', 'Neutral'],
    correctAnswer: 2,
    explanation: 'Develop an argument about how different fields contribute to society in different but equally important ways. Consider cultural, emotional, and practical contributions.',
    topic: 'Issue Essay',
    difficulty: 'Hard',
    hint: 'Think about the unique contributions of both artistic and scientific fields.',
  },
  {
    id: 'a8',
    question: 'Argument Essay: "We should ban social media for teenagers because studies show it increases anxiety and depression."',
    options: ['Valid', 'Flawed - Oversimplification', 'Flawed - Correlation', 'Flawed - Alternative Solutions'],
    correctAnswer: 1,
    explanation: 'The argument oversimplifies a complex issue. Correlation doesn\'t mean causation, and a ban ignores potential benefits and alternative solutions like education and moderation.',
    topic: 'Argument Analysis',
    difficulty: 'Hard',
    hint: 'Consider whether correlation implies causation and if there are better solutions than a ban.',
  },
  {
    id: 'a9',
    question: 'Issue Essay: "Standardized testing is an effective measure of student achievement and should be used to evaluate schools."',
    options: ['Agree', 'Disagree', 'Limited Effectiveness', 'Neutral'],
    correctAnswer: 2,
    explanation: 'A balanced response would acknowledge both the benefits (comparability, accountability) and limitations (narrow focus, teaching to the test, socio-economic factors) of standardized testing.',
    topic: 'Issue Essay',
    difficulty: 'Hard',
    hint: 'Consider both the advantages and limitations of standardized testing.',
  },
  {
    id: 'a10',
    question: 'Argument Essay: "The city should build more parks because parks improve quality of life and property values increase near parks."',
    options: ['Valid', 'Flawed - Cost-Benefit', 'Flawed - Evidence', 'Flawed - Scope'],
    correctAnswer: 1,
    explanation: 'While the benefits are mentioned, the argument doesn\'t address costs, feasibility, maintenance, or whether the benefits justify the investment. It also doesn\'t consider opportunity costs.',
    topic: 'Argument Analysis',
    difficulty: 'Hard',
    hint: 'Consider what factors are missing from this cost-benefit analysis.',
  },
];

// Question sets by topic
export const questionSets: Record<string, Question[]> = {
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
export const getQuestionsForSet = (setId: string): Question[] => {
  // Map set IDs to question sets
  const setIdMap: Record<string, string> = {
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
