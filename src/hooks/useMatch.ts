import { useState, useCallback, useEffect } from 'react';
import { Match, Goal, TeamSide, PeriodType, createNewMatch } from '@/types/match';

const STORAGE_KEY = 'simple-scorer-match';
const SAVED_MATCHES_KEY = 'simple-scorer-saved';

function loadMatch(): Match | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const m = JSON.parse(raw);
      // Migration for old matches without new fields
      if (!m.periodType) m.periodType = 'halves';
      if (!m.totalPeriods) m.totalPeriods = 2;
      if (m.breakDurationSeconds === undefined) m.breakDurationSeconds = 5 * 60;
      if (m.isLocked === undefined) m.isLocked = false;
      return m;
    }
  } catch {}
  return null;
}

function saveMatch(match: Match) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
  } catch {}
}

export function useMatch() {
  const [match, setMatch] = useState<Match>(() => loadMatch() || createNewMatch());
  const [showSetup, setShowSetup] = useState(() => {
    const m = loadMatch();
    return !m || m.status === 'not_started';
  });

  useEffect(() => {
    saveMatch(match);
  }, [match]);

  const updateMatch = useCallback((updates: Partial<Match>) => {
    setMatch(prev => ({ ...prev, ...updates }));
  }, []);

  const addGoal = useCallback((team: TeamSide, currentTimerSeconds: number, currentHalf: number): Goal => {
    const goal: Goal = {
      id: crypto.randomUUID(),
      team,
      scorerName: '',
      assistName: '',
      goalTimeSeconds: currentTimerSeconds,
      half: currentHalf,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMatch(prev => ({ ...prev, goals: [...prev.goals, goal] }));
    return goal;
  }, []);

  const updateGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    setMatch(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === goalId ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
      ),
    }));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setMatch(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId),
    }));
  }, []);

  const undoLastGoal = useCallback((team: TeamSide) => {
    setMatch(prev => {
      const teamGoals = prev.goals.filter(g => g.team === team);
      if (teamGoals.length === 0) return prev;
      const lastGoal = teamGoals[teamGoals.length - 1];
      return { ...prev, goals: prev.goals.filter(g => g.id !== lastGoal.id) };
    });
  }, []);

  const saveResult = useCallback((overrides: Partial<Match> = {}) => {
    const savedAt = new Date().toISOString();

    setMatch(prev => {
      const saved: Match = {
        ...prev,
        ...overrides,
        savedAt,
        status: 'finished',
        timerRunning: false,
        timerStartedAt: null,
      };

      try {
        const existing = JSON.parse(localStorage.getItem(SAVED_MATCHES_KEY) || '[]');
        existing.push(saved);
        localStorage.setItem(SAVED_MATCHES_KEY, JSON.stringify(existing));
      } catch {}

      return saved;
    });
  }, []);

  const startNewMatch = useCallback((discard: boolean) => {
    if (!discard) saveResult();
    const newMatch = createNewMatch();
    setMatch(newMatch);
    setShowSetup(true);
  }, [saveResult]);

  const setupMatch = useCallback((topName: string, bottomName: string, halfDuration: number, periodType: PeriodType = 'halves', breakDuration: number = 5 * 60) => {
    setMatch(prev => ({
      ...prev,
      topTeamName: topName,
      bottomTeamName: bottomName,
      halfDurationSeconds: halfDuration,
      periodType,
      totalPeriods: periodType === 'halves' ? 2 : 4,
      breakDurationSeconds: breakDuration,
      status: 'not_started',
    }));
    setShowSetup(false);
  }, []);

  return {
    match,
    updateMatch,
    addGoal,
    updateGoal,
    deleteGoal,
    undoLastGoal,
    saveResult,
    startNewMatch,
    setupMatch,
    showSetup,
    setShowSetup,
  };
}
