import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsForSet } from '../data/questions';
import type { Question } from '../data/questions';
import { generateQuizQuestions } from '../services/aiService';
import QuizResults from '../components/QuizResults';
import Graph from '../components/Graph';
import ChatBot from '../components/ChatBot';
import Calculator from '../components/Calculator';
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
  
  // Quiz Mode: 'practice' shows correct/wrong immediately, 'exam' hides until end
  const [quizMode, setQuizMode] = useState<'practice' | 'exam'>('practice');

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
  const [showMobileChatbot, setShowMobileChatbot] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [questionNotes, setQuestionNotes] = useState<Map<number, string>>(new Map());
  const [showNotes, setShowNotes] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!setId) return;

      // For Quiz 1, generate AI questions using Groq
      if (setId === '1') {
        try {
          setIsGenerating(true);
          console.log('Generating AI questions for Quiz 1...');
          
          const aiQuestions = await generateQuizQuestions('Quantitative Reasoning', 10, 'groq');
          
          setQuestions(aiQuestions as Question[]);
          setQuestionTimeStart(Date.now());
          setQuestionTimes(new Array(aiQuestions.length).fill(0));
          setIsGenerating(false);
        } catch (error) {
          console.error('Failed to generate questions:', error);
          
          // Fallback to static questions
          const staticQuestions = getQuestionsForSet(setId);
          setQuestions(staticQuestions);
          setQuestionTimeStart(Date.now());
          setQuestionTimes(new Array(staticQuestions.length).fill(0));
          setIsGenerating(false);
        }
      } else {
        // For other quizzes, use static questions
        const fetchedQuestions = getQuestionsForSet(setId);
        setQuestions(fetchedQuestions);
        setQuestionTimeStart(Date.now());
        setQuestionTimes(new Array(fetchedQuestions.length).fill(0));
      }
    };

    loadQuestions();
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

    // Only show explanation in practice mode, not in exam mode
    if (quizMode === 'practice') {
      setShowExplanation(true);
    } else {
      // In exam mode, move to next question automatically
      if (!isLastQuestion) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }
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

  const handleSkip = () => {
    if (isLastQuestion) {
      handleFinishQuiz();
      return;
    }
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };


  const handleNoteChange = (note: string) => {
    setQuestionNotes((prev) => {
      const newMap = new Map(prev);
      if (note.trim() === '') {
        newMap.delete(currentQuestionIndex);
      } else {
        newMap.set(currentQuestionIndex, note);
      }
      return newMap;
    });
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
      // Only show explanation in practice mode, not in exam mode
      setShowExplanation(quizMode === 'practice');
    } else {
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
    setShowHint(hintsUsed.has(currentQuestionIndex));
    setShowNotes(false);
    setQuestionTimeStart(Date.now());
    setCurrentQuestionTime(0);
  }, [currentQuestionIndex, currentQuestion, questionResults, hintsUsed, quizMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (isGenerating || questions.length === 0) {
    return (
      <div className="quiz">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>{isGenerating ? '🤖 Generating fresh questions with AI...' : 'Loading questions...'}</p>
            {isGenerating && <p style={{ fontSize: '0.9rem', color: '#6b7fd7', marginTop: '10px' }}>This may take a few seconds</p>}
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const questionContext = `Question: "${currentQuestion.question}"\nOptions: ${currentQuestion.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join(', ')}`;

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

            {/* Quiz Mode Toggle */}
            <div className="quiz-mode-toggle">
              <button
                className={`mode-btn ${quizMode === 'practice' ? 'active' : ''}`}
                onClick={() => setQuizMode('practice')}
                title="Practice Mode - See answers immediately"
              >
                📚 Practice
              </button>
              <button
                className={`mode-btn ${quizMode === 'exam' ? 'active' : ''}`}
                onClick={() => setQuizMode('exam')}
                title="Exam Mode - No feedback until end"
              >
                📝 Exam
              </button>
            </div>
          </div>
          
          <div className="quiz-stats-compact">
            {quizMode === 'practice' && (
              <div className="stat-compact">
                <span className="stat-compact-icon">✓</span>
                <span className="stat-compact-value">{scores.correct}/{answeredQuestions.size || scores.total}</span>
              </div>
            )}
            {markedForReview.size > 0 && (
              <div className="stat-compact stat-marked">
                <span className="stat-compact-icon">🔖</span>
                <span className="stat-compact-value">{markedForReview.size}</span>
              </div>
            )}
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
                const isMarked = markedForReview.has(index);

                let navClass = 'question-nav-item-fixed';
                if (isCurrent) navClass += ' current';

                // Special case: if answered AND marked for review, show mixed color
                if (isAnswered && isMarked && !isCurrent) {
                  navClass += ' answered-marked';
                } else {
                  // Only show correct/incorrect in practice mode
                  if (quizMode === 'practice' && isAnswered && result?.isCorrect) navClass += ' correct';
                  if (quizMode === 'practice' && isAnswered && !result?.isCorrect) navClass += ' incorrect';
                  // In exam mode, just show if answered (not current)
                  if (quizMode === 'exam' && isAnswered && !isCurrent) navClass += ' answered';
                  if (isMarked) navClass += ' marked';
                }

                return (
                  <button
                    key={index}
                    className={navClass}
                    onClick={() => handleQuestionNavigation(index)}
                    title={`Question ${index + 1}${isMarked ? ' (Marked for Review)' : ''}`}
                  >
                    {index + 1}
                    {usedHint && <span className="hint-indicator-fixed">💡</span>}
                    {isMarked && <span className="review-indicator-fixed">🔖</span>}
                  </button>
                );
              })}
            </div>
            <div className="question-nav-legend-fixed">
              <div className="legend-item-fixed">
                <span className="legend-color-fixed current"></span>
                <span>Current</span>
              </div>
              {quizMode === 'practice' ? (
                <>
                  <div className="legend-item-fixed">
                    <span className="legend-color-fixed correct"></span>
                    <span>Correct</span>
                  </div>
                  <div className="legend-item-fixed">
                    <span className="legend-color-fixed incorrect"></span>
                    <span>Wrong</span>
                  </div>
                </>
              ) : (
                <div className="legend-item-fixed">
                  <span className="legend-color-fixed answered"></span>
                  <span>Answered</span>
                </div>
              )}
              <div className="legend-item-fixed">
                <span className="legend-color-fixed marked"></span>
                <span>Review</span>
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

              <div className="question-tools-header">
                <button
                  className={`btn-tool-compact ${markedForReview.has(currentQuestionIndex) ? 'active' : ''}`}
                  onClick={handleMarkForReview}
                  title={markedForReview.has(currentQuestionIndex) ? 'Unmark for Review' : 'Mark for Review'}
                >
                  <span className="tool-icon">🔖</span>
                  <span className="tool-text">
                    {markedForReview.has(currentQuestionIndex) ? 'Marked' : 'Review'}
                  </span>
                </button>
                <button
                  className="btn-tool-compact btn-notes"
                  onClick={() => setShowNotes(!showNotes)}
                  title="Add Notes"
                >
                  <span className="tool-icon">📝</span>
                  <span className="tool-text">Notes</span>
                  {questionNotes.has(currentQuestionIndex) && (
                    <span className="notes-indicator"></span>
                  )}
                </button>
                <button
                  className="btn-tool-compact btn-calculator"
                  onClick={() => setShowCalculator(true)}
                  title="Open Calculator"
                >
                  <span className="tool-icon">🔢</span>
                  <span className="tool-text">Calculator</span>
                </button>
                {!showExplanation && (
                  <button
                    className="btn-tool-compact btn-skip"
                    onClick={handleSkip}
                    title="Skip this question"
                  >
                    <span className="tool-icon">⏭</span>
                    <span className="tool-text">Skip</span>
                  </button>
                )}
              </div>
            </div>

            <div className="question-content-modern">
              {markedForReview.has(currentQuestionIndex) && (
                <div className="marked-for-review-banner">
                  <span className="review-banner-icon">🔖</span>
                  <span className="review-banner-text">Marked for Review</span>
                </div>
              )}

              {currentQuestion.hasGraph && currentQuestion.graphData && (
                <Graph
                  equation={currentQuestion.graphData.equation}
                  type={currentQuestion.graphData.type}
                  highlightPoints={currentQuestion.graphData.highlightPoints || []}
                  hideEquation={currentQuestion.graphData.hideEquation}
                />
              )}
              
              <div className="question-text-container">
                <div className="question-text-modern">
                  {currentQuestion.question}
                </div>
                {!showExplanation && quizMode === 'practice' && (
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

            {/* Notes Section */}
            {showNotes && (
              <div className="notes-section">
                <div className="notes-header">
                  <span className="notes-icon">📝</span>
                  <h4>Your Notes</h4>
                </div>
                <textarea
                  className="notes-textarea"
                  placeholder="Add your notes for this question..."
                  value={questionNotes.get(currentQuestionIndex) || ''}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  rows={4}
                />
                <div className="notes-info">
                  <small>Your notes are saved automatically and will be available during review.</small>
                </div>
              </div>
            )}

            <div className="question-actions-modern">
              <div className="question-nav-buttons">
                <button
                  className="btn-nav btn-prev"
                  onClick={handlePreviousQuestion}
                  disabled={isFirstQuestion}
                >
                  ← Previous
                </button>

                <button
                  className="btn-finish-quiz"
                  onClick={handleFinishQuiz}
                  title="Finish quiz and see results"
                >
                  🏁 Finish Quiz
                </button>

                {!showExplanation ? (
                  <button
                    className="btn-submit-modern"
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                  >
                    {quizMode === 'exam' ? 'Submit & Next' : 'Submit Answer'}
                  </button>
                ) : (
                  <button className="btn-next-modern" onClick={handleNextQuestion}>
                    {isLastQuestion ? 'Finish Quiz' : 'Next →'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI ChatBot - Right Side - Only in Practice Mode */}
          {quizMode === 'practice' && (
            <div className="chatbot-sidebar">
              <ChatBot questionContext={questionContext} />
            </div>
          )}
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

      {/* Mobile Chatbot Floating Button - Only in Practice Mode */}
      {quizMode === 'practice' && (
        <button
          className="chatbot-floating-btn"
          onClick={() => setShowMobileChatbot(true)}
          aria-label="Open AI Assistant"
        >
          🧑‍🏫
        </button>
      )}

      {/* Mobile Chatbot Modal - Only in Practice Mode */}
      {quizMode === 'practice' && showMobileChatbot && (
        <div className="chatbot-mobile-overlay">
          <div className="chatbot-mobile-container">
            <button
              className="chatbot-mobile-close"
              onClick={() => setShowMobileChatbot(false)}
              aria-label="Close AI Assistant"
            >
              ✕
            </button>
            <ChatBot questionContext={questionContext} />
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}
    </div>
  );
};

export default Quiz;
