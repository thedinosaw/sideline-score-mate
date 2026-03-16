import { useState, useCallback } from 'react';
import { useMatch } from '@/hooks/useMatch';
import { useTimer } from '@/hooks/useTimer';
import { useWakeLock } from '@/hooks/useWakeLock';
import { TeamSide, Goal } from '@/types/match';
import { LiveScoreboard } from '@/components/LiveScoreboard';
import { MatchDetails } from '@/components/MatchDetails';
import { MatchSummary } from '@/components/MatchSummary';
import { SetupModal } from '@/components/SetupModal';
import { NewMatchDialog } from '@/components/NewMatchDialog';
import { Timer, List, Save, Plus, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Tab = 'live' | 'details';

const Index = () => {
  const navigate = useNavigate();
  const {
    match, updateMatch, addGoal, updateGoal, deleteGoal,
    undoLastGoal, saveResult, startNewMatch, setupMatch,
    showSetup, setShowSetup,
  } = useMatch();

  const [tab, setTab] = useState<Tab>('live');
  const [halfTimeAlert, setHalfTimeAlert] = useState(false);
  const [showNewMatchDialog, setShowNewMatchDialog] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useWakeLock(match.timerRunning);

  const handleHalfTime = useCallback(() => {
    updateMatch({ status: 'half_time' });
    setHalfTimeAlert(true);
    if ('vibrate' in navigator) navigator.vibrate([300, 100, 300, 100, 300]);
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {}
  }, [updateMatch]);

  const handleTick = useCallback((seconds: number) => {
    updateMatch({ currentTimerSeconds: seconds });
  }, [updateMatch]);

  const halfTarget = match.currentHalf === 2
    ? match.halfDurationSeconds * 2
    : match.halfDurationSeconds;

  const displaySeconds = useTimer({
    initialSeconds: match.currentTimerSeconds,
    halfDurationSeconds: halfTarget,
    isRunning: match.timerRunning,
    timerStartedAt: match.timerStartedAt,
    onHalfTime: handleHalfTime,
    onTick: handleTick,
  });

  const handleStartSecondHalf = useCallback(() => {
    const secondHalfStart = Math.max(displaySeconds, match.halfDurationSeconds);
    updateMatch({
      firstHalfSeconds: displaySeconds,
      currentHalf: 2,
      currentTimerSeconds: secondHalfStart,
      timerRunning: true,
      timerStartedAt: new Date().toISOString(),
      status: 'live',
    });
    setHalfTimeAlert(false);
  }, [updateMatch, displaySeconds, match.halfDurationSeconds]);

  const handleEndMatch = useCallback(() => {
    updateMatch({
      timerRunning: false,
      timerStartedAt: null,
      status: 'finished',
    });
    setHalfTimeAlert(false);
    saveResult();
    setShowSummary(true);
  }, [updateMatch, saveResult]);

  const handlePauseResume = useCallback(() => {
    if (match.timerRunning) {
      updateMatch({
        timerRunning: false,
        timerStartedAt: null,
        currentTimerSeconds: displaySeconds,
        status: 'paused',
      });
    } else {
      updateMatch({
        timerRunning: true,
        timerStartedAt: new Date().toISOString(),
        currentTimerSeconds: displaySeconds,
        status: 'live',
      });
    }
  }, [match.timerRunning, displaySeconds, updateMatch]);

  const handleResetTimer = useCallback(() => {
    updateMatch({
      timerRunning: false,
      timerStartedAt: null,
      currentTimerSeconds: 0,
      status: 'not_started',
    });
  }, [updateMatch]);

  const handleEditTime = useCallback((seconds: number) => {
    updateMatch({ currentTimerSeconds: seconds, timerStartedAt: match.timerRunning ? new Date().toISOString() : null });
  }, [match.timerRunning, updateMatch]);

  const handleEditDuration = useCallback((seconds: number) => {
    updateMatch({ halfDurationSeconds: seconds });
  }, [updateMatch]);

  const handleAddGoal = useCallback((team: TeamSide): Goal => {
    return addGoal(team, displaySeconds, match.currentHalf);
  }, [addGoal, displaySeconds, match.currentHalf]);

  const handleEditTeamName = useCallback((team: TeamSide, name: string) => {
    if (team === 'top') updateMatch({ topTeamName: name });
    else updateMatch({ bottomTeamName: name });
  }, [updateMatch]);

  if (showSetup) {
    return <SetupModal onStart={setupMatch} />;
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background overflow-hidden">
      <div className="flex-1 min-h-0">
        {tab === 'live' ? (
          <LiveScoreboard
            match={match}
            displaySeconds={displaySeconds}
            onPauseResume={handlePauseResume}
            onResetTimer={handleResetTimer}
            onEditTime={handleEditTime}
            onEditDuration={handleEditDuration}
            onAddGoal={handleAddGoal}
            onUpdateGoal={(id, updates) => updateGoal(id, updates)}
            onUndoGoal={undoLastGoal}
            onEditTeamName={handleEditTeamName}
            halfTimeAlert={halfTimeAlert}
            onDismissHalfTime={() => setHalfTimeAlert(false)}
            onStartSecondHalf={handleStartSecondHalf}
            onEndMatch={handleEndMatch}
          />
        ) : (
          <MatchDetails
            match={match}
            onUpdateGoal={(id, updates) => updateGoal(id, updates)}
            onDeleteGoal={deleteGoal}
          />
        )}
      </div>

      <nav className="flex items-center justify-around bg-card border-t-2 border-border h-14 flex-shrink-0">
        <button
          onClick={() => setTab('live')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-semibold transition-colors ${
            tab === 'live' ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          <Timer size={20} />
          Live
        </button>
        <button
          onClick={() => setTab('details')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-semibold transition-colors ${
            tab === 'details' ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          <List size={20} />
          Details
        </button>
        <button
          onClick={() => {
            saveResult();
            setShowSummary(true);
          }}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-semibold text-muted-foreground active:text-foreground transition-colors"
        >
          <Save size={20} />
          Save
        </button>
        <button
          onClick={() => navigate('/history')}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-semibold text-muted-foreground active:text-foreground transition-colors"
        >
          <History size={20} />
          History
        </button>
        <button
          onClick={() => setShowNewMatchDialog(true)}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-semibold text-muted-foreground active:text-foreground transition-colors"
        >
          <Plus size={20} />
          New
        </button>
      </nav>

      {showNewMatchDialog && (
        <NewMatchDialog
          onSaveAndNew={() => { startNewMatch(false); setShowNewMatchDialog(false); }}
          onDiscardAndNew={() => { startNewMatch(true); setShowNewMatchDialog(false); }}
          onCancel={() => setShowNewMatchDialog(false)}
        />
      )}

      {showSummary && (
        <MatchSummary match={match} onClose={() => setShowSummary(false)} />
      )}
    </div>
  );
};

export default Index;
