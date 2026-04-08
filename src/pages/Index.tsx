import { useState, useCallback } from 'react';
import { useMatch } from '@/hooks/useMatch';
import { useTimer } from '@/hooks/useTimer';
import { useWakeLock } from '@/hooks/useWakeLock';
import { TeamSide, Goal, getPeriodTarget, getPeriodLabel } from '@/types/match';
import { LiveScoreboard } from '@/components/LiveScoreboard';
import { HorizontalScoreboard } from '@/components/HorizontalScoreboard';
import { MatchDetails } from '@/components/MatchDetails';
import { MatchSummary } from '@/components/MatchSummary';
import { SetupModal } from '@/components/SetupModal';
import { NewMatchDialog } from '@/components/NewMatchDialog';
import { BottomNav } from '@/components/BottomNav';
import { LockScreen } from '@/components/LockScreen';
import { BreakTimer } from '@/components/BreakTimer';
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
  const [viewMode, setViewMode] = useState<'classic' | 'horizontal'>(() => {
    try { return (localStorage.getItem('scorer-view-mode') as 'classic' | 'horizontal') || 'classic'; } catch { return 'classic'; }
  });
  const [halfTimeAlert, setHalfTimeAlert] = useState(false);
  const [showNewMatchDialog, setShowNewMatchDialog] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showBreakTimer, setShowBreakTimer] = useState(false);

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

  const halfTarget = getPeriodTarget(match.currentHalf, match.halfDurationSeconds);

  const displaySeconds = useTimer({
    initialSeconds: match.currentTimerSeconds,
    halfDurationSeconds: halfTarget,
    isRunning: match.timerRunning,
    timerStartedAt: match.timerStartedAt,
    onHalfTime: handleHalfTime,
    onTick: handleTick,
  });

  const handleStartNextPeriod = useCallback(() => {
    const nextPeriod = match.currentHalf + 1;
    const nextPeriodStart = getPeriodTarget(match.currentHalf, match.halfDurationSeconds);
    const startSeconds = Math.max(displaySeconds, nextPeriodStart);
    setHalfTimeAlert(false);
    setShowBreakTimer(true);
  }, [updateMatch, displaySeconds, match.halfDurationSeconds, match.currentHalf]);

  const startNextPeriodNow = useCallback(() => {
    const nextPeriod = match.currentHalf + 1;
    const nextPeriodStart = getPeriodTarget(match.currentHalf, match.halfDurationSeconds);
    const startSeconds = Math.max(displaySeconds, nextPeriodStart);
    updateMatch({
      firstHalfSeconds: displaySeconds,
      currentHalf: nextPeriod,
      currentTimerSeconds: startSeconds,
      timerRunning: true,
      timerStartedAt: new Date().toISOString(),
      status: 'live',
    });
    setShowBreakTimer(false);
    setHalfTimeAlert(false);
  }, [updateMatch, displaySeconds, match.halfDurationSeconds, match.currentHalf]);

  const handleEndMatch = useCallback(() => {
    saveResult({ currentTimerSeconds: displaySeconds });
    setHalfTimeAlert(false);
    setShowSummary(true);
  }, [displaySeconds, saveResult]);

  const handleStop = useCallback(() => {
    updateMatch({
      timerRunning: false,
      timerStartedAt: null,
      currentTimerSeconds: displaySeconds,
      status: 'paused',
    });
  }, [displaySeconds, updateMatch]);

  const handlePauseResume = useCallback(() => {
    if (match.timerRunning) {
      handleStop();
    } else {
      updateMatch({
        timerRunning: true,
        timerStartedAt: new Date().toISOString(),
        currentTimerSeconds: displaySeconds,
        status: 'live',
      });
    }
  }, [match.timerRunning, displaySeconds, updateMatch, handleStop]);

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

  const handleLock = useCallback(() => {
    updateMatch({ isLocked: true });
  }, [updateMatch]);

  const handleUnlock = useCallback(() => {
    updateMatch({ isLocked: false });
  }, [updateMatch]);

  if (match.isLocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  if (showSetup) {
    return <SetupModal onStart={setupMatch} />;
  }

  if (showBreakTimer) {
    return (
      <BreakTimer
        initialSeconds={match.breakDurationSeconds}
        periodLabel={getPeriodLabel(match.currentHalf, match.periodType)}
        onComplete={startNextPeriodNow}
        onSkip={startNextPeriodNow}
      />
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background overflow-hidden">
      <div className="flex-1 min-h-0">
        {tab === 'live' ? (
          viewMode === 'horizontal' ? (
          <HorizontalScoreboard
            match={match}
            displaySeconds={displaySeconds}
            onPauseResume={handlePauseResume}
            onStop={handleStop}
            onResetTimer={handleResetTimer}
            onEditTime={handleEditTime}
            onEditDuration={handleEditDuration}
            onAddGoal={handleAddGoal}
            onUpdateGoal={(id, updates) => updateGoal(id, updates)}
            onUndoGoal={undoLastGoal}
            onEditTeamName={handleEditTeamName}
            halfTimeAlert={halfTimeAlert}
            onDismissHalfTime={() => setHalfTimeAlert(false)}
            onStartNextPeriod={handleStartNextPeriod}
            onEndMatch={handleEndMatch}
            onLock={handleLock}
          />
        ) : (
          <LiveScoreboard
            match={match}
            displaySeconds={displaySeconds}
            onPauseResume={handlePauseResume}
            onStop={handleStop}
            onResetTimer={handleResetTimer}
            onEditTime={handleEditTime}
            onEditDuration={handleEditDuration}
            onAddGoal={handleAddGoal}
            onUpdateGoal={(id, updates) => updateGoal(id, updates)}
            onUndoGoal={undoLastGoal}
            onEditTeamName={handleEditTeamName}
            halfTimeAlert={halfTimeAlert}
            onDismissHalfTime={() => setHalfTimeAlert(false)}
            onStartNextPeriod={handleStartNextPeriod}
            onEndMatch={handleEndMatch}
            onLock={handleLock}
          />
        )) : (
          <MatchDetails
            match={match}
            onUpdateGoal={(id, updates) => updateGoal(id, updates)}
            onDeleteGoal={deleteGoal}
          />
        )}
      </div>

      <BottomNav
        activeTab={tab}
        onTabChange={setTab}
        viewMode={viewMode}
        onToggleViewMode={() => {
          const next = viewMode === 'classic' ? 'horizontal' : 'classic';
          setViewMode(next);
          try { localStorage.setItem('scorer-view-mode', next); } catch {}
        }}
        onSave={() => {
          saveResult();
          setShowSummary(true);
        }}
        onNewMatch={() => setShowNewMatchDialog(true)}
      />

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
