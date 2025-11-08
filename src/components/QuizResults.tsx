import './QuizResults.css';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  hintsUsed: number;
  onClose: () => void;
  onReview: () => void;
}

const QuizResults = ({ score, totalQuestions, timeTaken, hintsUsed, onClose, onReview }: QuizResultsProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const accuracy = percentage;
  const averageTime = Math.round(timeTaken / totalQuestions);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: 'Excellent!', color: 'excellent' };
    if (percentage >= 75) return { message: 'Great Job!', color: 'great' };
    if (percentage >= 60) return { message: 'Good Work!', color: 'good' };
    return { message: 'Keep Practicing!', color: 'needs-improvement' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="quiz-results-overlay" onClick={onClose}>
      <div className="quiz-results-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quiz-results-header">
          <h2>Quiz Completed!</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="quiz-results-content">
          <div className={`performance-badge ${performance.color}`}>
            <div className="performance-percentage">{percentage}%</div>
            <div className="performance-message">{performance.message}</div>
          </div>

          <div className="results-stats">
            <div className="result-stat">
              <div className="result-stat-icon">✓</div>
              <div className="result-stat-info">
                <div className="result-stat-label">Score</div>
                <div className="result-stat-value">{score} / {totalQuestions}</div>
              </div>
            </div>

            <div className="result-stat">
              <div className="result-stat-icon">⏱</div>
              <div className="result-stat-info">
                <div className="result-stat-label">Total Time</div>
                <div className="result-stat-value">{Math.floor(timeTaken / 60)}m {timeTaken % 60}s</div>
              </div>
            </div>

            <div className="result-stat">
              <div className="result-stat-icon">🎯</div>
              <div className="result-stat-info">
                <div className="result-stat-label">Accuracy</div>
                <div className="result-stat-value">{accuracy}%</div>
              </div>
            </div>

            <div className="result-stat">
              <div className="result-stat-icon">⚡</div>
              <div className="result-stat-info">
                <div className="result-stat-label">Avg Time/Question</div>
                <div className="result-stat-value">{averageTime}s</div>
              </div>
            </div>

            <div className="result-stat">
              <div className="result-stat-icon">💡</div>
              <div className="result-stat-info">
                <div className="result-stat-label">Hints Used</div>
                <div className="result-stat-value">{hintsUsed}</div>
              </div>
            </div>
          </div>

          <div className="results-actions">
            <button className="btn btn-secondary" onClick={onReview}>
              Review Answers
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              Continue Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;

