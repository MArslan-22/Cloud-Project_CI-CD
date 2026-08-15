import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('CloudOps Pipeline Simulator App', () => {
  it('renders without crashing and displays main elements', () => {
    render(<App />);
    
    // Check if header is rendered
    expect(screen.getByText('CloudOps Pipeline Console')).toBeInTheDocument();
    
    // Check if configuration panel is rendered
    expect(screen.getByText('Pipeline Configuration')).toBeInTheDocument();
    
    // Check if Actions workflow section is rendered
    expect(screen.getByText('Actions Workflow Graph')).toBeInTheDocument();
    
    // Check if initial log text is in the console logs
    expect(screen.getByText(/Ready to trigger GitHub Action workflows/i)).toBeInTheDocument();
  });
});
