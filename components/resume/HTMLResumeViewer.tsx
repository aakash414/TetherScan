// HTMLResumeViewer.tsx
import React from 'react';

interface HTMLResumeViewerProps {
  html: string;
}

const HTMLResumeViewer: React.FC<HTMLResumeViewerProps> = ({ html }) => {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff' }}>
      <iframe
        title="Resume Preview"
        srcDoc={html}
        style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
        sandbox="allow-same-origin allow-scripts allow-popups"
      />
    </div>
  );
};

export default HTMLResumeViewer;
