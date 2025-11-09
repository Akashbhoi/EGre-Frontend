import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Mock data - will be replaced with actual data fetching
  const stats = {
    totalQuestions: 1250,
    completedQuestions: 342,
    averageAccuracy: 78,
    averageTime: 120,
    currentStreak: 7,
  };

  const recentTopics = [
    { name: 'Quantitative Reasoning', progress: 65, questions: 450 },
    { name: 'Verbal Reasoning', progress: 45, questions: 320 },
    { name: 'Analytical Writing', progress: 30, questions: 180 },
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Questions</h3>
            <p className="stat-value">{stats.totalQuestions}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completedQuestions}</p>
          </div>
          <div className="stat-card">
            <h3>Average Accuracy</h3>
            <p className="stat-value">{stats.averageAccuracy}%</p>
          </div>
          <div className="stat-card">
            <h3>Avg Time/Question</h3>
            <p className="stat-value">{stats.averageTime}s</p>
          </div>
          <div className="stat-card">
            <h3>Current Streak</h3>
            <p className="stat-value">{stats.currentStreak} days</p>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/questions" className="btn btn-primary btn-large">
            Start Practicing
          </Link>
          <Link to="/metrics" className="btn btn-secondary btn-large">
            View Metrics
          </Link>
        </div>

        <div className="topics-section">
          <h2 className="section-title">Your Progress</h2>
          <div className="topics-grid">
            {recentTopics.map((topic, index) => (
              <div key={index} className="topic-card">
                <h3>{topic.name}</h3>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${topic.progress}%` }}
                  ></div>
                </div>
                <div className="topic-stats">
                  <span>{topic.progress}% Complete</span>
                  <span>{topic.questions} Questions</span>
                </div>
                <Link to="/questions" className="btn btn-primary btn-small">
                  Continue
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
