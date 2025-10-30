import React, { useState, useEffect } from 'react';
import './githubStats.css';
import LeetCodeStats from '../leetcode/LeetCodeStats';

const GitHubStats = () => {
  const username = 'KaiDove1';
  const [stats, setStats] = useState({
    publicRepos: 0,
    followers: 0,
    following: 0,
    totalStars: 0,
    loading: true,
    error: null
  });
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState({});

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();

        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!reposResponse.ok) throw new Error('Failed to fetch repos');
        const reposData = await reposResponse.json();

        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        const topRepos = reposData
          .filter(repo => !repo.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);

        const langCount = {};
        reposData.forEach(repo => {
          if (repo.language && !repo.fork) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
          }
        });

        const topLanguages = Object.entries(langCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .reduce((acc, [lang, count]) => {
            acc[lang] = count;
            return acc;
          }, {});

        setStats({
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          totalStars: totalStars,
          loading: false,
          error: null
        });
        setRepos(topRepos);
        setLanguages(topLanguages);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setStats(prev => ({ ...prev, loading: false, error: error.message }));
      }
    };

    fetchGitHubData();
  }, []);

  if (stats.loading) {
    return (
      <section className="github section" id="github">
        <h2 className="section__title">Coding Activity</h2>
        <span className="section__subtitle">Real-time Development Stats</span>
        <div className="github__container container">
          <div className="github__loading">Loading stats...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="github section" id="github">
      <h2 className="section__title">Coding Activity</h2>
      <span className="section__subtitle">Real-time Development Stats</span>

      <div className="github__container container">
        <div className="github__dual-layout">
          {/* GitHub Stats */}
          <div className="github__wrapper">
            <h3 className="github__section-title-main">
              <i className="uil uil-github-alt"></i>
              GitHub Activity
            </h3>

            <div className="github__stats">
              <div className="github__stat-card">
                <i className="uil uil-code-branch github__stat-icon"></i>
                <div>
                  <h3 className="github__stat-number">{stats.publicRepos}</h3>
                  <span className="github__stat-label">Public Repos</span>
                </div>
              </div>

              <div className="github__stat-card">
                <i className="uil uil-star github__stat-icon"></i>
                <div>
                  <h3 className="github__stat-number">{stats.totalStars}</h3>
                  <span className="github__stat-label">Total Stars</span>
                </div>
              </div>

              <div className="github__stat-card">
                <i className="uil uil-users-alt github__stat-icon"></i>
                <div>
                  <h3 className="github__stat-number">{stats.followers}</h3>
                  <span className="github__stat-label">Followers</span>
                </div>
              </div>

              <div className="github__stat-card">
                <i className="uil uil-user-check github__stat-icon"></i>
                <div>
                  <h3 className="github__stat-number">{stats.following}</h3>
                  <span className="github__stat-label">Following</span>
                </div>
              </div>
            </div>

            <div className="github__languages">
              <h4 className="github__subsection-title">Top Languages</h4>
              <div className="github__languages-list">
                {Object.entries(languages).map(([lang, count]) => (
                  <div key={lang} className="github__language-item">
                    <div className="github__language-header">
                      <span className="github__language-name">{lang}</span>
                      <span className="github__language-count">{count} repos</span>
                    </div>
                    <div className="github__language-bar">
                      <div
                        className="github__language-progress"
                        style={{ width: `${(count / Object.values(languages)[0]) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="github__profile-link">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button button--flex button--small"
              >
                View GitHub Profile
                <i className="uil uil-external-link-alt button__icon"></i>
              </a>
            </div>
          </div>

          {/* LeetCode Stats */}
          <LeetCodeStats />
        </div>

        {/* GitHub Repos - Full Width */}
        <div className="github__repos-section">
          <h3 className="github__section-title-main">
            <i className="uil uil-folder"></i>
            Top Repositories
          </h3>
          <div className="github__repos-grid">
            {repos.map(repo => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="github__repo-card"
              >
                <div className="github__repo-header">
                  <i className="uil uil-folder github__repo-icon"></i>
                  <h4 className="github__repo-name">{repo.name}</h4>
                </div>
                <p className="github__repo-description">
                  {repo.description || 'No description available'}
                </p>
                <div className="github__repo-footer">
                  {repo.language && (
                    <span className="github__repo-language">
                      <span className="github__language-dot"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="github__repo-stars">
                    <i className="uil uil-star"></i>
                    {repo.stargazers_count}
                  </span>
                  <span className="github__repo-forks">
                    <i className="uil uil-code-branch"></i>
                    {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubStats;
