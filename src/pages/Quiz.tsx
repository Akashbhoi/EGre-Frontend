import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Quiz.css';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  topic: string;
  difficulty: string;
}

const Quiz = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [timeStarted] = useState<number>(Date.now());
  const [questionTimeStart, setQuestionTimeStart] = useState<number>(Date.now());
  const [scores, setScores] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  useEffect(() => {
    // Simulate fetching questions for the set
    // TODO: Replace with actual API call
    const fetchQuestions = async () => {
      // Mock questions
      const mockQuestions: Question[] = [
        {
          id: '1',
          question: 'If x + 5 = 12, what is the value of x?',
          options: ['5', '7', '12', '17'],
          correctAnswer: 1,
          explanation: 'To solve for x, subtract 5 from both sides: x = 12 - 5 = 7',
          topic: 'Algebra',
          difficulty: 'Easy',
        },
        {
          id: '2',
          question: 'What is the area of a circle with radius 5?',
          options: ['10π', '25π', '50π', '100π'],
          correctAnswer: 1,
          explanation: 'The area of a circle is πr². With radius 5, the area is π(5)² = 25π',
          topic: 'Geometry',
          difficulty: 'Medium',
        },
      ];
      setQuestions(mockQuestions);
      setQuestionTimeStart(Date.now());
    };

    fetchQuestions();
  }, [setId]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return; // Prevent changing answer after submission
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setScores((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Quiz completed
      handleFinishQuiz();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
      setQuestionTimeStart(Date.now());
    }
  };

  const handleFinishQuiz = () => {
    const totalTime = Math.round((Date.now() - timeStarted) / 1000);
    const totalHints = hintsUsed.size;
    // TODO: Save quiz results to backend
    alert(`Quiz completed! Score: ${scores.correct}/${scores.total + 1}\nTime: ${totalTime}s\nHints used: ${totalHints}`);
    navigate('/questions');
  };

  const handleUseHint = () => {
    if (!showHint) {
      setHintsUsed((prev) => new Set(prev).add(currentQuestionIndex));
      setShowHint(true);
    }
  };

  const getTimeForCurrentQuestion = () => {
    return Math.round((Date.now() - questionTimeStart) / 1000);
  };

  if (!currentQuestion) {
    return (
      <div className="quiz">
        <div className="container">
          <div className="loading">Loading questions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="container">
        <div className="quiz-header">
          <div className="quiz-info">
            <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
            <p className="quiz-topic">{currentQuestion.topic} • {currentQuestion.difficulty}</p>
          </div>
          <div className="quiz-stats">
            <div className="stat">
              <span className="stat-label">Score:</span>
              <span className="stat-value">{scores.correct}/{scores.total}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Time:</span>
              <span className="stat-value">{getTimeForCurrentQuestion()}s</span>
            </div>
          </div>
        </div>

        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="question-card">
          <div className="question-content">
            <h3 className="question-text">{currentQuestion.question}</h3>
            
            {showHint && (
              <div className="hint-box">
                <strong>Hint:</strong> Consider the key concepts related to this topic. 
                Review the fundamental principles before solving.
              </div>
            )}

            <div className="options">
              {currentQuestion.options.map((option, index) => {
                let optionClass = 'option';
                if (showExplanation) {
                  if (index === currentQuestion.correctAnswer) {
                    optionClass += ' correct';
                  } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                    optionClass += ' incorrect';
                  }
                } else if (selectedAnswer === index) {
                  optionClass += ' selected';
                }

                return (
                  <button
                    key={index}
                    className={optionClass}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                  >
                    <span className="option-label">{String.fromCharCode(65 + index)}.</span>
                    <span className="option-text">{option}</span>
                  </button>
                );
              })}
            </div>

            {showExplanation && currentQuestion.explanation && (
              <div className="explanation">
                <h4>Explanation:</h4>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          <div className="question-actions">
            {!showExplanation && (
              <button
                className="btn btn-secondary"
                onClick={handleUseHint}
                disabled={showHint}
              >
                {showHint ? 'Hint Used' : 'Use Hint'}
              </button>
            )}
            {!showExplanation ? (
              <button
                className="btn btn-primary"
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNextQuestion}>
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

