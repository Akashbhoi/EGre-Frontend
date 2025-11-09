import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="container">
          <h1 className="landing-title">
            Elevate Your GRE Score
          </h1>
          <p className="landing-subtitle">
            Master GRE questions with personalized practice, detailed metrics, and comprehensive analytics
          </p>
          <div className="landing-cta">
            <Link to="/dashboard" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/questions" className="btn btn-secondary btn-large">
              Start Practicing
            </Link>
          </div>
        </div>
      </div>
      <div className="landing-features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <h3>Practice Questions</h3>
              <p>Access thousands of GRE questions organized by topic and difficulty</p>
            </div>
            <div className="feature-card">
              <h3>Track Metrics</h3>
              <p>Monitor your accuracy, time per question, and performance across topics</p>
            </div>
            <div className="feature-card">
              <h3>Detailed Analytics</h3>
              <p>Get insights into your strengths and areas for improvement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
