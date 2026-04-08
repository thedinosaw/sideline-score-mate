import { useState } from 'react';
import { Match, getTeamScore, formatTime } from '@/types/match';
import { Trash2 } from 'lucide-react';
import { MatchSummary } from '@/components/MatchSummary';
import { BottomNav } from '@/components/BottomNav';

const SAVED_MATCHES_KEY = 'simple-scorer-saved';

function loadSavedMatches(): Match[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_MATCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

const History = () => {
  const [matches, setMatches] = useState<Match[]>(loadSavedMatches);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const handleUpdateSavedMatch = (updated: Match) => {
    const newMatches = matches.map(m => m.id === updated.id ? updated : m);
    setMatches(newMatches);
    setSelectedMatch(updated);
    localStorage.setItem(SAVED_MATCHES_KEY, JSON.stringify(newMatches));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = matches.filter(m => m.id !== id);
    setMatches(updated);
    localStorage.setItem(SAVED_MATCHES_KEY, JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-border bg-card">
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
              <div
                key={m.id}
                onClick={() => setSelectedMatch(m)}
                className="bg-card border-2 border-border rounded-xl p-4 cursor-pointer active:bg-secondary transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-2">
                      {date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}
                      {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Half: {formatTime(m.halfDurationSeconds)}
                      {m.goals.length > 0 && ` · ${m.goals.length} goal${m.goals.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(m.id, e)}
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

      <BottomNav />

      {selectedMatch && (
        <MatchSummary
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onUpdateMatch={handleUpdateSavedMatch}
        />
      )}
    </div>
  );
};

export default History;
