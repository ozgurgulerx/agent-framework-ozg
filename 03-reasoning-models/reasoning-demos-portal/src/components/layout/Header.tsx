import { HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: string[];
}

export function Header({ title, description, breadcrumbs }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-bg-elev">
      <div className="px-8 py-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted mb-3">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <span className={index === breadcrumbs.length - 1 ? 'text-text' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">{title}</h1>
            {description && (
              <p className="mt-2 text-muted max-w-3xl">{description}</p>
            )}
          </div>
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
