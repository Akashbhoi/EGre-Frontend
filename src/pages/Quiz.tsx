import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsForSet } from '../data/questions';
import type { Question } from '../data/questions';
import QuizResults from '../components/QuizResults';
import Graph from '../components/Graph';
import ChatBot from '../components/ChatBot';
import './Quiz.css';

interface QuestionResult {
  questionId: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
  hintUsed: boolean;
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
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
  const [totalQuizTime, setTotalQuizTime] = useState(0);
  const [scores, setScores] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });
  const [showResults, setShowResults] = useState(false);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (setId) {
      const fetchedQuestions = getQuestionsForSet(setId);
      setQuestions(fetchedQuestions);
      setQuestionTimeStart(Date.now());
      setQuestionTimes(new Array(fetchedQuestions.length).fill(0));
    }
  }, [setId]);

  // Timer for current question
  useEffect(() => {
    if (questions.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentQuestionTime(Math.round((Date.now() - questionTimeStart) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [questionTimeStart, questions.length]);

  // Timer for total quiz time
  useEffect(() => {
    if (questions.length === 0) return;
    
    const interval = setInterval(() => {
      setTotalQuizTime(Math.round((Date.now() - timeStarted) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeStarted, questions.length]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const timeTaken = currentQuestionTime;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const newQuestionTimes = [...questionTimes];
    newQuestionTimes[currentQuestionIndex] = timeTaken;
    setQuestionTimes(newQuestionTimes);

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeTaken,
      hintUsed: hintsUsed.has(currentQuestionIndex),
    };

    setQuestionResults((prev) => {
      const filtered = prev.filter(r => r.questionId !== currentQuestion.id);
      const newResults = [...filtered, result];
      
      // Update scores based on all results
      const totalCorrect = newResults.filter(r => r.isCorrect).length;
      const totalAnswered = new Set(newResults.map(r => r.questionId)).size;
      
      setScores({
        correct: totalCorrect,
        total: totalAnswered,
      });
      
      return newResults;
    });
    
    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestionIndex));
    setShowExplanation(true);
  };

  const saveCurrentAnswer = () => {
    if (selectedAnswer === null || !currentQuestion || showExplanation) return;
    
    const timeTaken = currentQuestionTime;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const result: QuestionResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeTaken,
      hintUsed: hintsUsed.has(currentQuestionIndex),
    };
    
    setQuestionResults((prev) => {
      const filtered = prev.filter(r => r.questionId !== currentQuestion.id);
      const newResults = [...filtered, result];
      
      // Update scores
      const totalCorrect = newResults.filter(r => r.isCorrect).length;
      const totalAnswered = new Set(newResults.map(r => r.questionId)).size;
      
      setScores({
        correct: totalCorrect,
        total: totalAnswered,
      });
      
      return newResults;
    });
    
    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestionIndex));
  };

  const handlePreviousQuestion = () => {
    if (isFirstQuestion) return;
    
    saveCurrentAnswer();
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      saveCurrentAnswer();
      handleFinishQuiz();
      return;
    }

    saveCurrentAnswer();
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleFinishQuiz = () => {
    saveCurrentAnswer();
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    navigate('/questions');
  };

  const handleReview = () => {
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setShowExplanation(true);
  };

  const handleUseHint = () => {
    if (!showHint) {
      setHintsUsed((prev) => new Set(prev).add(currentQuestionIndex));
    }
    setShowHint(!showHint);
  };

  const handleQuestionNavigation = (index: number) => {
    if (index === currentQuestionIndex) return;
    
    // Save current answer if navigating away
    saveCurrentAnswer();
    
    setCurrentQuestionIndex(index);
  };

  // Reset state when question changes
  useEffect(() => {
    if (!currentQuestion) return;
    
    const result = questionResults.find(r => currentQuestion.id === r.questionId);
    if (result) {
      setSelectedAnswer(result.selectedAnswer);
      setShowExplanation(true);
    } else {
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
    setShowHint(hintsUsed.has(currentQuestionIndex));
    setQuestionTimeStart(Date.now());
    setCurrentQuestionTime(0);
  }, [currentQuestionIndex, currentQuestion, questionResults, hintsUsed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (questions.length === 0) {
    return (
      <div className="quiz">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="quiz">
      <div className="container quiz-container">
        {/* Top Bar */}
        <div className="quiz-top-bar">
          <div className="quiz-header-left">
            <div className="quiz-progress-info">
              <span className="progress-number">{currentQuestionIndex + 1}</span>
              <span className="progress-divider">/</span>
              <span className="progress-total">{questions.length}</span>
            </div>
          </div>
          
          <div className="quiz-stats-compact">
            <div className="stat-compact">
              <span className="stat-compact-icon">✓</span>
              <span className="stat-compact-value">{scores.correct}/{answeredQuestions.size || scores.total}</span>
            </div>
            <div className="stat-compact">
              <span className="stat-compact-icon">⏱</span>
              <span className="stat-compact-value">{formatTime(currentQuestionTime)}</span>
            </div>
            <div className="stat-compact">
              <span className="stat-compact-icon">🕐</span>
              <span className="stat-compact-value">{formatTime(totalQuizTime)}</span>
            </div>
            {hintsUsed.size > 0 && (
              <div className="stat-compact">
                <span className="stat-compact-icon">💡</span>
                <span className="stat-compact-value">{hintsUsed.size}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="quiz-progress-wrapper">
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="quiz-progress-percentage">{Math.round(progress)}%</div>
        </div>

        <div className="quiz-main-layout">
          {/* Question Navigation Sidebar - Left Side */}
          <div className="question-nav-sidebar-fixed">
            <div className="question-nav-header-fixed">
              <h3>Questions</h3>
            </div>
            <div className="question-nav-grid-fixed">
              {questions.map((_, index) => {
                const isAnswered = answeredQuestions.has(index);
                const isCurrent = index === currentQuestionIndex;
                const result = questionResults.find(r => questions[index]?.id === r.questionId);
                const usedHint = hintsUsed.has(index);

                let navClass = 'question-nav-item-fixed';
                if (isCurrent) navClass += ' current';
                if (isAnswered && result?.isCorrect) navClass += ' correct';
                if (isAnswered && !result?.isCorrect) navClass += ' incorrect';

                return (
                  <button
                    key={index}
                    className={navClass}
                    onClick={() => handleQuestionNavigation(index)}
                    title={`Question ${index + 1}`}
                  >
                    {index + 1}
                    {usedHint && <span className="hint-indicator-fixed">💡</span>}
                  </button>
                );
              })}
            </div>
            <div className="question-nav-legend-fixed">
              <div className="legend-item-fixed">
                <span className="legend-color-fixed current"></span>
                <span>Current</span>
              </div>
              <div className="legend-item-fixed">
                <span className="legend-color-fixed correct"></span>
                <span>Correct</span>
              </div>
              <div className="legend-item-fixed">
                <span className="legend-color-fixed incorrect"></span>
                <span>Wrong</span>
              </div>
            </div>
          </div>

          {/* Main Question Card - Right Side */}
          <div className="question-card-modern">
            <div className="question-header-modern">
              <div className="question-meta">
                <span className="question-topic">{currentQuestion.topic}</span>
                <span className={`question-difficulty difficulty-${currentQuestion.difficulty.toLowerCase()}`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>

            <div className="question-content-modern">
              {currentQuestion.hasGraph && currentQuestion.graphData && (
                <Graph
                  equation={currentQuestion.graphData.equation}
                  type={currentQuestion.graphData.type}
                  highlightPoints={currentQuestion.graphData.highlightPoints || []}
                />
              )}
              
              <div className="question-text-container">
                <div className="question-text-modern">
                  {currentQuestion.question}
                </div>
                {!showExplanation && (
                  <button
                    className="btn-hint-inline"
                    onClick={handleUseHint}
                  >
                    <span>💡</span>
                    {showHint ? 'Close Hint' : 'Use Hint'}
                  </button>
                )}
              </div>
              
              {showHint && currentQuestion.hint && (
                <div className="hint-box-modern">
                  <div className="hint-header-modern">
                    <span className="hint-icon-modern">💡</span>
                    <strong>Hint</strong>
                  </div>
                  <p>{currentQuestion.hint}</p>
                </div>
              )}

              <div className="options-modern">
                {currentQuestion.options.map((option, index) => {
                  let optionClass = 'option-modern';
                  if (showExplanation) {
                    if (index === currentQuestion.correctAnswer) {
                      optionClass += ' correct';
                      if (selectedAnswer === index) {
                        optionClass += ' selected';
                      }
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
                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                      <span className="option-text-modern">{option}</span>
                      {showExplanation && index === currentQuestion.correctAnswer && (
                        <span className="option-icon-check">✓</span>
                      )}
                      {showExplanation && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                        <span className="option-icon-cross">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {showExplanation && currentQuestion.explanation && (
                <div className="explanation-modern">
                  <div className="explanation-header-modern">
                    <span className="explanation-icon-modern">📚</span>
                    <h4>Explanation</h4>
                  </div>
                  <div className="explanation-content">
                    <p>{currentQuestion.explanation}</p>
                    <div className={`explanation-badge ${questionResults.find(r => r.questionId === currentQuestion.id)?.isCorrect ? 'success' : 'error'}`}>
                      {questionResults.find(r => r.questionId === currentQuestion.id)?.isCorrect ? (
                        <>✓ Correct! Well done.</>
                      ) : (
                        <>✗ Incorrect. Keep practicing!</>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="question-actions-modern">
              <div className="question-nav-buttons">
                <button
                  className="btn-nav btn-prev"
                  onClick={handlePreviousQuestion}
                  disabled={isFirstQuestion}
                >
                  ← Previous
                </button>
                {!showExplanation ? (
                  <button
                    className="btn-submit-modern"
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button className="btn-next-modern" onClick={handleNextQuestion}>
                    {isLastQuestion ? 'Finish Quiz' : 'Next →'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI ChatBot - Right Side */}
          <div className="chatbot-sidebar">
            <ChatBot />
          </div>
        </div>
      </div>

      {showResults && (
        <QuizResults
          score={scores.correct}
          totalQuestions={questions.length}
          timeTaken={totalQuizTime}
          hintsUsed={hintsUsed.size}
          onClose={handleCloseResults}
          onReview={handleReview}
        />
      )}
    </div>
  );
};

export default Quiz;
