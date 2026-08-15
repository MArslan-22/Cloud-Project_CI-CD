import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Loader2, 
  Terminal, 
  Settings, 
  Cloud, 
  GitPullRequest, 
  Github, 
  RefreshCw 
} from 'lucide-react';

interface ConsoleLine {
  text: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'command';
  timestamp: string;
}

interface PipelineStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  icon: string;
}

export default function App() {
  // App states
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [env, setEnv] = useState<'Staging' | 'Production'>('Staging');
  const [commitMsg, setCommitMsg] = useState('feat: integrate analytics dashboard');
  const [commitHash, setCommitHash] = useState('a9c8f3b');
  const [duration, setDuration] = useState(0);
  const [activeBranch, setActiveBranch] = useState('main');

  // Stages status
  const [stages, setStages] = useState<PipelineStage[]>([
    { id: 'lint', name: 'Lint & Format', status: 'pending', icon: '📝' },
    { id: 'test', name: 'Unit Testing', status: 'pending', icon: '🧪' },
    { id: 'build', name: 'Build Project', status: 'pending', icon: '⚙️' },
    { id: 'deploy', name: 'Cloud Deploy', status: 'pending', icon: '🚀' },
  ]);

  // Terminal log console
  const [logs, setLogs] = useState<ConsoleLine[]>([
    { text: 'System initialized. Ready to trigger GitHub Action workflows.', type: 'info', timestamp: '22:20:00' },
    { text: 'Hook configured: push/pull_request event watcher online.', type: 'info', timestamp: '22:20:01' }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Timer for execution duration
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (pipelineStatus === 'running') {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pipelineStatus]);

  // Add line to terminal helper
  const addLog = (text: string, type: 'info' | 'success' | 'error' | 'warning' | 'command' = 'info') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs((prev) => [...prev, { text, type, timestamp: timeStr }]);
  };

  // Generate random hash helper
  const generateHash = () => {
    const chars = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Run the pipeline simulator
  const runPipeline = async () => {
    if (pipelineStatus === 'running') return;

    // Reset pipeline state
    setPipelineStatus('running');
    setDuration(0);
    const newHash = generateHash();
    setCommitHash(newHash);

    // Set stages to pending
    setStages(prev => prev.map(s => ({ ...s, status: 'pending' })));
    setLogs([]);

    addLog(`$ git push origin ${activeBranch}`, 'command');
    addLog(`GitHub Actions received push event for commit [${newHash}]: "${commitMsg}"`, 'info');
    addLog(`Setting up job runner on ubuntu-latest environment...`, 'info');
    
    // Simulate Stage 1: Lint & Format
    await simulateStage('lint', [
      { t: 'Setting up Node.js environment v20.11.0...', y: 'info' },
      { t: '$ npm ci', y: 'command' },
      { t: 'added 342 packages in 4.2s', y: 'success' },
      { t: '$ npm run lint', y: 'command' },
      { t: 'Checking code style with ESLint flat configuration...', y: 'info' },
      { t: 'Checking project formatting using Prettier rules...', y: 'info' },
      { t: 'All checks passed. 0 warnings, 0 errors.', y: 'success' }
    ]);

    // Simulate Stage 2: Unit Testing
    await simulateStage('test', [
      { t: '$ npm run test', y: 'command' },
      { t: 'Vitest v2.0.5 started in environment [jsdom]', y: 'info' },
      { t: '✓ src/App.test.tsx (1 test, passed in 23ms)', y: 'success' },
      { t: 'Test Files: 1 passed, 1 total', y: 'success' },
      { t: 'Tests: 1 passed, 1 total', y: 'success' },
      { t: 'Snapshots: 0 total', y: 'info' },
      { t: 'Execution time: 0.85s', y: 'info' }
    ]);

    // Simulate Stage 3: Build Project
    await simulateStage('build', [
      { t: '$ npm run build', y: 'command' },
      { t: 'vite v5.4.1 building for production...', y: 'info' },
      { t: 'transforming...', y: 'info' },
      { t: '✓ 142 modules transformed.', y: 'success' },
      { t: 'dist/index.html                  0.48 kB │ gzip: 0.32 kB', y: 'info' },
      { t: 'dist/assets/index-BtYnL79a.css   4.12 kB │ gzip: 1.55 kB', y: 'info' },
      { t: 'dist/assets/index-Cd9Vb3eX.js  143.20 kB │ gzip: 46.12 kB', y: 'info' },
      { t: '✓ built in 2.15s', y: 'success' }
    ]);

    // Simulate Stage 4: Cloud Deploy
    await simulateStage('deploy', [
      { t: 'Deploying static assets to GitHub Pages branch [gh-pages]...', y: 'info' },
      { t: '$ npx gh-pages -d dist --dotfiles --message "Deploying commit ' + newHash + '"', y: 'command' },
      { t: 'Successfully published assets. Remote state updated.', y: 'success' },
      { t: `App is live on: https://your-username.github.io/cloud-projects-cicd/`, y: 'success' }
    ]);

    setPipelineStatus('success');
    addLog(`Pipeline workflow execution completed successfully in ${duration + 8}s. 🎉`, 'success');
  };

  // Helper for simulating sequential stage logs
  const simulateStage = async (stageId: string, steps: { t: string; y: 'info' | 'success' | 'error' | 'warning' | 'command' }[]) => {
    setStages(prev => prev.map(s => s.id === stageId ? { ...s, status: 'running' } : s));
    addLog(`[Pipeline Stage] Starting: ${stageId.toUpperCase()}`, 'info');
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 500));
      addLog(step.t, step.y);
    }
    
    setStages(prev => prev.map(s => s.id === stageId ? { ...s, status: 'success' } : s));
    addLog(`[Pipeline Stage] Finished successfully: ${stageId.toUpperCase()}\n`, 'success');
  };

  return (
    <div className="app-container">
      {/* Header Area */}
      <header className="header">
        <div className="header-title-area">
          <h1>
            <Cloud className="text-primary" size={32} />
            CloudOps Pipeline Console
          </h1>
          <p>Complete GitHub Actions CI/CD Pipeline Simulator & Deployment Panel</p>
        </div>
        <div>
          <span className="badge-live">Live Simulator</span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="dashboard-grid">
        {/* Left Column: Visual Flow & Console logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Stats Bar */}
          <div className="stats-row">
            <div className="glass-card stat-item">
              <span className="stat-label">Pipeline Status</span>
              <span className={`stat-value ${pipelineStatus === 'running' ? 'primary' : pipelineStatus === 'success' ? 'success' : ''}`}>
                {pipelineStatus.toUpperCase()}
              </span>
            </div>
            <div className="glass-card stat-item">
              <span className="stat-label">Target Env</span>
              <span className="stat-value purple">{env}</span>
            </div>
            <div className="glass-card stat-item">
              <span className="stat-label">Elapsed Time</span>
              <span className="stat-value">{duration}s</span>
            </div>
            <div className="glass-card stat-item">
              <span className="stat-label">Target Branch</span>
              <span className="stat-value" style={{ color: '#ec4899', fontFamily: 'monospace' }}>
                {activeBranch}
              </span>
            </div>
          </div>

          {/* Pipeline visual canvas */}
          <div className="glass-card pipeline-section">
            <div className="pipeline-header">
              <h2>
                <GitPullRequest size={20} className="text-secondary" />
                Actions Workflow Graph
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Commit ID: <span style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>{commitHash}</span>
              </div>
            </div>

            <div className="pipeline-canvas">
              {stages.map((stage, idx) => (
                <React.Fragment key={stage.id}>
                  {/* Pipeline Node */}
                  <div className={`pipeline-node ${stage.status === 'running' ? 'active' : stage.status === 'success' ? 'success' : 'pending'}`}>
                    <div className="node-icon-wrapper">
                      {stage.status === 'running' ? (
                        <Loader2 className="animate-spin text-primary" size={24} style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto' }} />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>{stage.icon}</span>
                      )}
                    </div>
                    <div className="node-title">{stage.name}</div>
                    <div className="node-status">{stage.status}</div>
                  </div>

                  {/* Connector */}
                  {idx < stages.length - 1 && (
                    <div className={`pipeline-connector ${
                      stages[idx].status === 'success' && (stages[idx + 1].status === 'running' || stages[idx + 1].status === 'success') 
                        ? 'active' 
                        : ''
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Terminal Console log area */}
          <div className="glass-card console-section">
            <div className="console-header">
              <div className="console-title">
                <Terminal size={18} className="text-primary" />
                GitHub Actions Logs (Runner: ubuntu-latest)
              </div>
              <button 
                onClick={() => setLogs([])}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                Clear Log
              </button>
            </div>
            <div className="console-terminal">
              {logs.map((line, idx) => (
                <div key={idx} className={`console-line ${line.type}`}>
                  <span className="console-timestamp">[{line.timestamp}]</span>
                  <span>{line.text}</span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

        {/* Right Column: Configuration & GitHub Workflow Docs */}
        <div className="sidebar">
          {/* Controls Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ display: 'flex', alignContent: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
              <Settings size={18} />
              Pipeline Configuration
            </h3>

            {/* Commit Message */}
            <div className="config-item">
              <label className="config-label">Commit Message</label>
              <input 
                type="text" 
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-main)',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Target Branch selection */}
            <div className="config-item">
              <label className="config-label">Target Branch</label>
              <select 
                value={activeBranch}
                onChange={(e) => setActiveBranch(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-main)',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="main" style={{ background: '#0d1426' }}>main</option>
                <option value="develop" style={{ background: '#0d1426' }}>develop</option>
                <option value="feature/pipeline" style={{ background: '#0d1426' }}>feature/pipeline</option>
              </select>
            </div>

            {/* Deploy environment */}
            <div className="config-item">
              <label className="config-label">Target Environment</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button 
                  onClick={() => setEnv('Staging')}
                  style={{
                    flex: 1,
                    background: env === 'Staging' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: env === 'Staging' ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                    color: env === 'Staging' ? 'var(--color-primary)' : 'var(--text-muted)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  Staging
                </button>
                <button 
                  onClick={() => setEnv('Production')}
                  style={{
                    flex: 1,
                    background: env === 'Production' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: env === 'Production' ? '1px solid var(--color-secondary)' : '1px solid var(--border-color)',
                    color: env === 'Production' ? '#c084fc' : 'var(--text-muted)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  Production
                </button>
              </div>
            </div>

            {/* Trigger Button */}
            <button 
              className="control-btn"
              onClick={runPipeline}
              disabled={pipelineStatus === 'running'}
            >
              {pipelineStatus === 'running' ? (
                <>
                  <RefreshCw className="animate-spin" size={18} style={{ animation: 'spin 1.5s linear infinite' }} />
                  Running Pipeline...
                </>
              ) : (
                <>
                  <Play size={18} fill="currentColor" />
                  Push Commit & Run CI/CD
                </>
              )}
            </button>
          </div>

          {/* GitHub Action Reference Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ display: 'flex', alignContent: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
              <Github size={18} />
              GitHub Action Workflow Quick-Tip
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              The pipelines triggered on the left are governed by configurations in your Github Repository directories. We've scaffolded a clean workflow configuration for your deployment target.
            </p>
            <div style={{ marginTop: '0.5rem' }}>
              <span className="workflow-pill">.github/workflows/cd.yml</span>
            </div>
            <pre style={{
              background: '#030712',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              fontSize: '0.7rem',
              fontFamily: 'Courier New, monospace',
              color: '#34d399',
              overflowX: 'auto'
            }}>
{`name: Deploy to Github Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - uses: JamesIves/github-pages-deploy-action@v4`}
            </pre>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Built with ❤️ for Cloud Projects CI/CD showcase. Designed for visual feedback and continuous delivery validation.</p>
      </footer>
    </div>
  );
}
