import { Link } from 'react-router-dom';
import './QuestionsArena.css';

interface QuestionSet {
  id: string;
  name: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  completed: number;
  description: string;
}

const QuestionsArena = () => {
  // Mock data - will be replaced with actual data fetching
  const questionSets: QuestionSet[] = [
    {
      id: '1',
      name: 'Algebra Basics',
      topic: 'Quantitative Reasoning',
      difficulty: 'Easy',
      questionCount: 50,
      completed: 25,
      description: 'Fundamental algebra concepts and equations',
    },
    {
      id: '2',
      name: 'Geometry Fundamentals',
      topic: 'Quantitative Reasoning',
      difficulty: 'Medium',
      questionCount: 40,
      completed: 15,
      description: 'Basic geometry principles and problem solving',
    },
    {
      id: '3',
      name: 'Reading Comprehension',
      topic: 'Verbal Reasoning',
      difficulty: 'Medium',
      questionCount: 60,
      completed: 30,
      description: 'Practice reading and understanding passages',
    },
    {
      id: '4',
      name: 'Text Completion',
      topic: 'Verbal Reasoning',
      difficulty: 'Hard',
      questionCount: 45,
      completed: 10,
      description: 'Master text completion and sentence equivalence',
    },
    {
      id: '5',
      name: 'Issue Essay Writing',
      topic: 'Analytical Writing',
      difficulty: 'Medium',
      questionCount: 30,
      completed: 8,
      description: 'Practice writing issue essays',
    },
    {
      id: '6',
      name: 'Argument Essay Writing',
      topic: 'Analytical Writing',
      difficulty: 'Hard',
      questionCount: 30,
      completed: 5,
      description: 'Practice analyzing and critiquing arguments',
    },
  ];

  const topics = ['All Topics', 'Quantitative Reasoning', 'Verbal Reasoning', 'Analytical Writing'];
  const difficulties = ['All Difficulties', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="questions-arena">
      <div className="container">
        <h1 className="page-title">Questions Arena</h1>
        <p className="page-subtitle">
          Select a question set to practice and improve your GRE skills
        </p>

        <div className="filters">
          <div className="filter-group">
            <label>Filter by Topic:</label>
            <select className="filter-select">
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Filter by Difficulty:</label>
            <select className="filter-select">
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="question-sets-grid">
          {questionSets.map((set) => {
            const progress = Math.round((set.completed / set.questionCount) * 100);
            
            return (
              <div key={set.id} className="question-set-card">
                <div className="question-set-header">
                  <div>
                    <h3>{set.name}</h3>
                    <p className="question-set-topic">{set.topic}</p>
                  </div>
                  <span className={`difficulty-badge difficulty-${set.difficulty.toLowerCase()}`}>
                    {set.difficulty}
                  </span>
                </div>
                <p className="question-set-description">{set.description}</p>
                <div className="question-set-progress">
                  <div className="progress-info">
                    <span>{set.completed} / {set.questionCount} completed</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <Link
                  to={`/quiz/${set.id}`}
                  className="btn btn-primary btn-block"
                >
                  {set.completed > 0 ? 'Continue Practice' : 'Start Practice'}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionsArena;

