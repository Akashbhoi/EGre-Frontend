
const Metrics = () => {
  // Mock data - will be replaced with actual data fetching
  const overallMetrics = {
    accuracy: 78,
    averageTimePerQuestion: 120,
    totalQuestions: 342,
    hintsTaken: 45,
  };

  const topicMetrics = [
    {
      topic: 'Quantitative Reasoning',
      accuracy: 82,
      averageTime: 110,
      questionsAttempted: 150,
      hintsTaken: 12,
    },
    {
      topic: 'Verbal Reasoning',
      accuracy: 75,
      averageTime: 135,
      questionsAttempted: 120,
      hintsTaken: 20,
    },
    {
      topic: 'Analytical Writing',
      accuracy: 70,
      averageTime: 180,
      questionsAttempted: 72,
      hintsTaken: 13,
    },
  ];

  const sessionMetrics = [
    { date: '2024-01-20', questions: 25, accuracy: 80, avgTime: 115, hints: 3 },
    { date: '2024-01-19', questions: 30, accuracy: 75, avgTime: 125, hints: 5 },
    { date: '2024-01-18', questions: 20, accuracy: 85, avgTime: 110, hints: 2 },
  ];

  const hintBreakdown = [
    { type: 'Quantitative Reasoning', hints: 12 },
    { type: 'Verbal Reasoning', hints: 20 },
    { type: 'Analytical Writing', hints: 13 },
  ];

  return (
    <div className="metrics">
      <div className="container">
        <h1 className="page-title">Metrics & Analytics</h1>

        <div className="overall-metrics">
          <h2 className="section-title">Overall Performance</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Accuracy</h3>
              <p className="metric-value">{overallMetrics.accuracy}%</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${overallMetrics.accuracy}%` }}
                ></div>
              </div>
            </div>
            <div className="metric-card">
              <h3>Avg Time/Question</h3>
              <p className="metric-value">{overallMetrics.averageTimePerQuestion}s</p>
            </div>
            <div className="metric-card">
              <h3>Total Questions</h3>
              <p className="metric-value">{overallMetrics.totalQuestions}</p>
            </div>
            <div className="metric-card">
              <h3>Hints Taken</h3>
              <p className="metric-value">{overallMetrics.hintsTaken}</p>
            </div>
          </div>
        </div>

        <div className="topic-metrics">
          <h2 className="section-title">Performance by Topic</h2>
          <div className="topic-metrics-grid">
            {topicMetrics.map((topic, index) => (
              <div key={index} className="topic-metric-card">
                <h3>{topic.topic}</h3>
                <div className="topic-metric-stats">
                  <div className="topic-stat">
                    <label>Accuracy</label>
                    <p>{topic.accuracy}%</p>
                  </div>
                  <div className="topic-stat">
                    <label>Avg Time</label>
                    <p>{topic.averageTime}s</p>
                  </div>
                  <div className="topic-stat">
                    <label>Questions</label>
                    <p>{topic.questionsAttempted}</p>
                  </div>
                  <div className="topic-stat">
                    <label>Hints</label>
                    <p>{topic.hintsTaken}</p>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${topic.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="session-metrics">
          <h2 className="section-title">Recent Sessions</h2>
          <div className="session-table-container">
            <table className="session-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Questions</th>
                  <th>Accuracy</th>
                  <th>Avg Time</th>
                  <th>Hints</th>
                </tr>
              </thead>
              <tbody>
                {sessionMetrics.map((session, index) => (
                  <tr key={index}>
                    <td>{new Date(session.date).toLocaleDateString()}</td>
                    <td>{session.questions}</td>
                    <td>{session.accuracy}%</td>
                    <td>{session.avgTime}s</td>
                    <td>{session.hints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="hint-breakdown">
          <h2 className="section-title">Hints Breakdown by Question Type</h2>
          <div className="hint-grid">
            {hintBreakdown.map((item, index) => (
              <div key={index} className="hint-card">
                <h3>{item.type}</h3>
                <p className="hint-count">{item.hints} hints taken</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
