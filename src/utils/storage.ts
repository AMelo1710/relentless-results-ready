
// Utility functions for localStorage management
export const StorageKeys = {
  TREINOS: 'fitness_treinos',
  ALIMENTACAO: 'fitness_alimentacao',
  SUPLEMENTOS: 'fitness_suplementos',
  REGRAS: 'fitness_regras',
  METAS: 'fitness_metas',
  CHECKIN: 'fitness_checkin',
  FOTOS: 'fitness_fotos',
  PROGRESSO: 'fitness_progresso'
} as const;

export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Progress calculation utilities
export const getProgressColor = (percentage: number): string => {
  if (percentage === 0) return 'gradient-progress-0';
  if (percentage <= 15) return 'gradient-progress-15';
  if (percentage <= 30) return 'gradient-progress-30';
  if (percentage <= 50) return 'gradient-progress-50';
  if (percentage <= 75) return 'gradient-progress-75';
  if (percentage <= 85) return 'gradient-progress-85';
  if (percentage <= 90) return 'gradient-progress-90';
  return 'gradient-progress-100';
};

export const calculateDayProgress = (checklist: Record<string, boolean>): number => {
  const totalItems = Object.keys(checklist).length;
  const completedItems = Object.values(checklist).filter(Boolean).length;
  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
};
