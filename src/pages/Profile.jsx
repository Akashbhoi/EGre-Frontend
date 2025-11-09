import { useEffect, useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching profile data
    const fetchProfile = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - replace with actual API call
      setProfile({
        name: 'John Doe',
        email: 'john.doe@example.com',
        joinDate: '2024-01-15',
        totalQuestions: 342,
        completedQuizzes: 28,
        averageScore: 78,
        level: 'Intermediate',
      });
      
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile">
        <div className="container">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile">
        <div className="container">
          <div className="error">Failed to load profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="container">
        <h1 className="page-title">Profile Information</h1>
        
        <div className="profile-content">
          <div className="profile-card">
            <h2>Personal Information</h2>
            <div className="profile-field">
              <label>Name</label>
              <p>{profile.name}</p>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <p>{profile.email}</p>
            </div>
            <div className="profile-field">
              <label>Member Since</label>
              <p>{new Date(profile.joinDate).toLocaleDateString()}</p>
            </div>
            <div className="profile-field">
              <label>Level</label>
              <p className="level-badge">{profile.level}</p>
            </div>
          </div>

          <div className="profile-card">
            <h2>Statistics</h2>
            <div className="stats-row">
              <div className="stat-item">
                <label>Total Questions</label>
                <p className="stat-value">{profile.totalQuestions}</p>
              </div>
              <div className="stat-item">
                <label>Completed Quizzes</label>
                <p className="stat-value">{profile.completedQuizzes}</p>
              </div>
              <div className="stat-item">
                <label>Average Score</label>
                <p className="stat-value">{profile.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-primary">Edit Profile</button>
            <button className="btn btn-secondary">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
