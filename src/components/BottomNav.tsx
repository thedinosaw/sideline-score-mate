import { Timer, List, Save, History, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
  onSave?: () => void;
  onNewMatch?: () => void;
  activeTab?: 'live' | 'details';
  onTabChange?: (tab: 'live' | 'details') => void;
}

export function BottomNav({ onSave, onNewMatch, activeTab, onTabChange }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHistory = location.pathname === '/history';

  return (
    <nav className="flex items-center justify-around bg-card border-t-2 border-border h-14 flex-shrink-0">
      <button
        onClick={() => {
          if (isHistory) navigate('/');
          onTabChange?.('live');
        }}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-semibold transition-colors ${
          !isHistory && activeTab === 'live' ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        <Timer size={20} />
        Live
      </button>
      <button
        onClick={() => {
          if (isHistory) navigate('/');
          onTabChange?.('details');
        }}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-semibold transition-colors ${
          !isHistory && activeTab === 'details' ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        <List size={20} />
        Details
      </button>
      <button
        onClick={() => {
          if (isHistory) navigate('/');
          onSave?.();
        }}
        className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-semibold text-muted-foreground active:text-foreground transition-colors"
      >
        <Save size={20} />
        Save
      </button>
      <button
        onClick={() => navigate('/history')}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-semibold transition-colors ${
          isHistory ? 'text-foreground' : 'text-muted-foreground'
        } active:text-foreground`}
      >
        <History size={20} />
        History
      </button>
      <button
        onClick={() => {
          if (isHistory) navigate('/');
          onNewMatch?.();
        }}
        className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-semibold text-muted-foreground active:text-foreground transition-colors"
      >
        <Plus size={20} />
        New
      </button>
    </nav>
  );
}
