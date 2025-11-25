import { Link, useLocation } from 'react-router-dom';
import { Brain, Home } from 'lucide-react';
import { demos } from '../../data/mockData';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-bg-elev border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text group-hover:text-accent transition-colors">
              Reasoning
            </h1>
            <p className="text-xs text-muted">Demos Portal</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
            location.pathname === '/'
              ? 'bg-accent text-white'
              : 'text-muted hover:text-text hover:bg-card'
          )}
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">All Demos</span>
        </Link>

        <div className="pt-4 pb-2 px-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">
            Demos
          </p>
        </div>

        {demos.map((demo) => (
          <Link
            key={demo.id}
            to={demo.route}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
              location.pathname === demo.route
                ? 'bg-accent text-white'
                : 'text-muted hover:text-text hover:bg-card'
            )}
          >
            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
            <span className="text-sm font-medium flex-1 leading-tight">
              {demo.title.split('–')[0].trim()}
            </span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="px-3 py-2 rounded-lg bg-card">
          <p className="text-xs text-muted">
            Keyboard shortcuts
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Go home</span>
              <kbd className="px-1.5 py-0.5 bg-bg-elev rounded text-text font-mono">g</kbd>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Run simulation</span>
              <kbd className="px-1.5 py-0.5 bg-bg-elev rounded text-text font-mono">r</kbd>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Model diff</span>
              <kbd className="px-1.5 py-0.5 bg-bg-elev rounded text-text font-mono">d</kbd>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
