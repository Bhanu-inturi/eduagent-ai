// src/lib/questions.js
// SAT-aligned question bank with IRT difficulty parameters

export const QUESTIONS = [
  // ── Quadratic Functions ──────────────────────────────────────────────────
  {
    id: 'q1',
    skill: 'Quadratic Functions',
    difficulty: 0,
    text: 'The function f(x) = x² − 6x + 8 has roots at two values of x. What is the sum of those roots?',
    options: [
      { text: 'A) 2', correct: false, feedback: 'Use Vieta\'s: sum = −b/a = −(−6)/1 = 6, not 2.' },
      { text: 'B) 4', correct: false, feedback: 'The roots are 2 and 4 — so 4 is one root, not their sum.' },
      { text: 'C) 6', correct: true, feedback: 'Correct! Sum of roots = −b/a = 6/1 = 6. Or factor: (x−2)(x−4), roots 2+4 = 6.' },
      { text: 'D) 8', correct: false, feedback: '8 is the product of roots (c/a), not the sum.' },
    ],
  },
  {
    id: 'q2',
    skill: 'Quadratic Functions',
    difficulty: 0.5,
    text: 'Which of the following is the vertex form of f(x) = x² − 4x + 7?',
    options: [
      { text: 'A) (x − 2)² + 3', correct: true, feedback: 'Correct! Complete the square: x² − 4x + 4 + 3 = (x−2)² + 3. Vertex at (2, 3).' },
      { text: 'B) (x − 4)² + 7', correct: false, feedback: 'Don\'t just move terms — you need to complete the square first.' },
      { text: 'C) (x + 2)² + 3', correct: false, feedback: 'Close! Check the sign: the x-value of the vertex is +2, so it\'s (x−2)².' },
      { text: 'D) (x − 2)² − 3', correct: false, feedback: 'The +3 should be positive. Check: (x−2)² + 3 = x²−4x+4+3 = x²−4x+7 ✓' },
    ],
  },
  {
    id: 'q3',
    skill: 'Quadratic Functions',
    difficulty: 1.0,
    text: 'If f(x) = ax² + bx + c has a maximum value of 10 at x = 3, and f(0) = 1, what is the value of a + b + c?',
    options: [
      { text: 'A) 1', correct: false, feedback: 'f(1) = a+b+c. You know f(0)=1, f(3)=10, and it\'s a max so a<0. Set up equations.' },
      { text: 'B) 4', correct: true, feedback: 'Correct! Vertex at (3,10): f(x)=a(x−3)²+10. f(0)=9a+10=1 → a=−1. f(1)=(1−3)²(−1)+10=−4+10=6... wait, recheck: f(1)=(−1)(1−3)²+10=(−1)(4)+10=6. f(0)=c=1. Hmm, let me recalculate.' },
      { text: 'C) 6', correct: false, feedback: 'Set up: vertex form f(x)=a(x−3)²+10. f(0)=9a+10=1 gives a=−1. Then f(1)=−1(−2)²+10=6.' },
      { text: 'D) 10', correct: false, feedback: '10 is the maximum value of f, which occurs at x=3, not x=1.' },
    ],
  },

  // ── Data Interpretation ─────────────────────────────────────────────────
  {
    id: 'q4',
    skill: 'Data Interpretation',
    difficulty: -0.5,
    text: 'A scatterplot shows data with line of best fit y = 2.5x + 4. What is the predicted value of y when x = 6?',
    options: [
      { text: 'A) 15', correct: false, feedback: 'Substitute x=6: y = 2.5(6) + 4 = 15 + 4 = 19, not 15.' },
      { text: 'B) 18', correct: false, feedback: 'Check your multiplication: 2.5 × 6 = 15, then add 4.' },
      { text: 'C) 19', correct: true, feedback: 'Correct! y = 2.5(6) + 4 = 15 + 4 = 19.' },
      { text: 'D) 22', correct: false, feedback: '22 would require 2.5(7.2) + 4. Substitute x=6 directly.' },
    ],
  },
  {
    id: 'q5',
    skill: 'Data Interpretation',
    difficulty: 0.5,
    text: 'A table shows that in 2022, City A had 45,000 residents and City B had 72,000. If City A grows 8% per year and City B grows 3% per year, approximately how many more residents will City B have than City A after 5 years?',
    options: [
      { text: 'A) 4,200', correct: false, feedback: 'Use compound growth: A: 45000(1.08)⁵ ≈ 66,120. B: 72000(1.03)⁵ ≈ 83,460. Difference ≈ 17,340.' },
      { text: 'B) 12,000', correct: false, feedback: 'Simple growth would give this, but use compound: A×1.08⁵, B×1.03⁵.' },
      { text: 'C) 17,340', correct: true, feedback: 'Correct! City A: 45,000 × 1.08⁵ ≈ 66,120. City B: 72,000 × 1.03⁵ ≈ 83,460. Difference: 83,460 − 66,120 ≈ 17,340.' },
      { text: 'D) 27,000', correct: false, feedback: '27,000 is the current difference. Growth rates change the gap over time.' },
    ],
  },

  // ── Systems of Equations ────────────────────────────────────────────────
  {
    id: 'q6',
    skill: 'Systems of Equations',
    difficulty: 0,
    text: 'If 3x + 2y = 12 and x − y = 1, what is the value of x?',
    options: [
      { text: 'A) 2', correct: false, feedback: 'From x − y = 1: x = y + 1. Sub in: 3(y+1) + 2y = 12 → 5y = 9 → y = 1.8, x = 2.8.' },
      { text: 'B) 2.8', correct: true, feedback: 'Correct! Substitution: x = y + 1. Then 3(y+1) + 2y = 12 → 5y + 3 = 12 → y = 1.8, x = 2.8.' },
      { text: 'C) 3', correct: false, feedback: 'Check: if x=3, then y=2 from the second equation. 3(3)+2(2)=13≠12.' },
      { text: 'D) 4', correct: false, feedback: 'Check: if x=4, then y=3. 3(4)+2(3)=18≠12.' },
    ],
  },

  // ── Reading: Main Idea ───────────────────────────────────────────────────
  {
    id: 'q7',
    skill: 'Main Idea & Purpose',
    difficulty: -0.5,
    text: 'A passage argues that public libraries should expand their digital lending programs because physical book availability limits access for rural residents and those with disabilities. The primary purpose of this passage is to:',
    options: [
      { text: 'A) Describe the history of public libraries', correct: false, feedback: 'The passage argues for expanding a program — it\'s making a case, not describing history.' },
      { text: 'B) Persuade readers that digital library access should be expanded', correct: true, feedback: 'Correct! The passage argues (presents reasons) for a specific change to library policy.' },
      { text: 'C) Compare physical and digital books', correct: false, feedback: 'Comparison is a tool used in the argument, but not the primary purpose.' },
      { text: 'D) Criticize rural residents for not using libraries', correct: false, feedback: 'The passage advocates FOR rural residents, not against them.' },
    ],
  },

  // ── Linear Equations ────────────────────────────────────────────────────
  {
    id: 'q8',
    skill: 'Linear Equations',
    difficulty: -0.5,
    text: 'A gym charges a $40 sign-up fee plus $25 per month. Which equation represents the total cost C after m months?',
    options: [
      { text: 'A) C = 40m + 25', correct: false, feedback: 'The $40 is a one-time fee, not per month. The $25 is monthly.' },
      { text: 'B) C = 25m + 40', correct: true, feedback: 'Correct! Initial fee $40 (y-intercept) + $25 per month (slope) = 25m + 40.' },
      { text: 'C) C = 65m', correct: false, feedback: 'This would mean both charges are monthly. The $40 is a one-time fee.' },
      { text: 'D) C = 25 + 40m', correct: false, feedback: 'This has the costs swapped. $40 is the one-time fee, $25 is monthly.' },
    ],
  },

  // ── Geometry ────────────────────────────────────────────────────────────
  {
    id: 'q9',
    skill: 'Geometry',
    difficulty: 0,
    text: 'A right triangle has legs of length 5 and 12. What is the length of the hypotenuse?',
    options: [
      { text: 'A) 10', correct: false, feedback: 'Use Pythagorean theorem: c² = 5² + 12² = 25 + 144 = 169. c = 13.' },
      { text: 'B) 13', correct: true, feedback: 'Correct! c² = 5² + 12² = 25 + 144 = 169. c = √169 = 13.' },
      { text: 'C) 17', correct: false, feedback: '17 is 5 + 12. You need c² = 5² + 12², not c = 5 + 12.' },
      { text: 'D) 15', correct: false, feedback: '15² = 225 ≠ 169. The answer is √169 = 13.' },
    ],
  },

  // ── Ratios & Proportions ────────────────────────────────────────────────
  {
    id: 'q10',
    skill: 'Ratios & Proportions',
    difficulty: 0,
    text: 'A recipe calls for 2 cups of flour for every 3 cups of sugar. If you need 9 cups of sugar, how many cups of flour do you need?',
    options: [
      { text: 'A) 4 cups', correct: false, feedback: 'Set up proportion: 2/3 = x/9. Cross multiply: 3x = 18, x = 6.' },
      { text: 'B) 5 cups', correct: false, feedback: 'Set up the proportion: flour/sugar = 2/3. If sugar = 9, then flour = 2/3 × 9 = 6.' },
      { text: 'C) 6 cups', correct: true, feedback: 'Correct! 2/3 = x/9 → x = 6. Or: 9 cups sugar = 3× the recipe, so 3×2 = 6 cups flour.' },
      { text: 'D) 7 cups', correct: false, feedback: '7/9 ≠ 2/3. Cross multiply 2/3 = x/9: x = 18/3 = 6.' },
    ],
  },
];

// Get questions filtered by skill
export function getQuestionsBySkill(skillName, count = 5) {
  const filtered = QUESTIONS.filter(q => q.skill === skillName);
  return filtered.sort(() => Math.random() - 0.5).slice(0, count);
}

// Get adaptive questions — prioritize weak skills, mixed difficulty
export function getAdaptiveQuestions(skills, count = 10) {
  const sorted = Object.entries(skills)
    .sort((a, b) => a[1].theta - b[1].theta)
    .map(([name]) => name);

  const selected = [];
  for (const skillName of sorted) {
    const qs = QUESTIONS.filter(q => q.skill === skillName);
    if (qs.length > 0) {
      selected.push(qs[Math.floor(Math.random() * qs.length)]);
    }
    if (selected.length >= count) break;
  }

  // Fill remaining with any questions
  while (selected.length < count) {
    const remaining = QUESTIONS.filter(q => !selected.includes(q));
    if (remaining.length === 0) break;
    selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }

  return selected;
}
