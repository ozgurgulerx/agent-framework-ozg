import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../../stores/appStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { setModelDiffOpen } = useAppStore();

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      // Only trigger if not in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'g':
          navigate('/');
          break;
        case 'd':
          setModelDiffOpen(true);
          break;
      }
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, setModelDiffOpen]);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
