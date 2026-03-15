import { useState, useEffect } from 'react';
import { Match, getTeamScore, formatTime } from '@/types/match';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';

const SAVED_MATCHES_KEY = 'simple-scorer-saved';

function loadSavedMatches(): Match[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_MATCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

const History = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>(loadSavedMatches);

  const handleDelete = (id: string) => {
    const updated = matches.filter(m => m.id !== id);
    setMatches(updated);
    localStorage.setItem(SAVED_MATCHES_KEY, JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-border bg-card">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 active:bg-secondary rounded-lg">
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Saved Matches</h1>
      </div>

      {/* Match list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-lg font-semibold">No saved matches yet</p>
            <p className="text-sm mt-1">Save a match from the live screen to see it here.</p>
          </div>
        ) : (
          [...matches].reverse().map(m => {
            const topScore = getTeamScore(m.goals, 'top');
            const bottomScore = getTeamScore(m.goals, 'bottom');
            const date = m.savedAt ? new Date(m.savedAt) : new Date(m.createdAt);
            return (
              <div key={m.id} className="bg-card border-2 border-border rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Date */}
                    <p className="text-xs text-muted-foreground mb-2">
                      {date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}
                      {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {/* Score line */}
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-foreground truncate max-w-[35%]">
                        {m.topTeamName || 'Home'}
                      </span>
                      <span className="text-2xl font-black text-foreground">
                        {topScore} – {bottomScore}
                      </span>
                      <span className="text-base font-semibold text-foreground truncate max-w-[35%]">
                        {m.bottomTeamName || 'Away'}
                      </span>
                    </div>
                    {/* Duration */}
                    <p className="text-xs text-muted-foreground mt-1">
                      Half: {formatTime(m.halfDurationSeconds)}
                      {m.goals.length > 0 && ` · ${m.goals.length} goal${m.goals.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-2 text-muted-foreground active:text-destructive rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
