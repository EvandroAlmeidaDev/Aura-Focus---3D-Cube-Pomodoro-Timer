import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'pt';

interface Translations {
  focus: string;
  shortBreak: string;
  longBreak: string;
  start: string;
  pause: string;
  resume: string;
  settings: string;
  duration: string;
  notifications: string;
  focusSession: string;
  shortBreakLabel: string;
  longBreakLabel: string;
  longBreakAfter: string;
  sessions: string;
  min: string;
  soundNotifications: string;
  sound: string;
  volume: string;
  language: string;
  close: string;
  reset: string;
  ghostMode: string;
  sessionComplete: string;
  timeForBreak: string;
  backToWork: string;
}

const translations: Record<Language, Translations> = {
  en: {
    focus: 'FOCUS',
    shortBreak: 'SHORT BREAK',
    longBreak: 'LONG BREAK',
    start: 'START',
    pause: 'PAUSE',
    resume: 'RESUME',
    settings: 'Settings',
    duration: 'DURATION',
    notifications: 'NOTIFICATIONS',
    focusSession: 'Focus Session',
    shortBreakLabel: 'Short break',
    longBreakLabel: 'Long break',
    longBreakAfter: 'Long break after',
    sessions: 'Sess.',
    min: 'min',
    soundNotifications: 'Sound notifications',
    sound: 'Sound',
    volume: 'Volume',
    language: 'Language',
    close: 'Close',
    reset: 'Reset',
    ghostMode: 'Ghost Mode',
    sessionComplete: 'Session Complete!',
    timeForBreak: 'Time for a break!',
    backToWork: 'Back to work!',
  },
  pt: {
    focus: 'FOCO',
    shortBreak: 'PAUSA CURTA',
    longBreak: 'PAUSA LONGA',
    start: 'INICIAR',
    pause: 'PAUSAR',
    resume: 'CONTINUAR',
    settings: 'Configurações',
    duration: 'DURAÇÃO',
    notifications: 'NOTIFICAÇÕES',
    focusSession: 'Sessão de Foco',
    shortBreakLabel: 'Pausa curta',
    longBreakLabel: 'Pausa longa',
    longBreakAfter: 'Pausa longa após',
    sessions: 'Sess.',
    min: 'min',
    soundNotifications: 'Notificações sonoras',
    sound: 'Som',
    volume: 'Volume',
    language: 'Idioma',
    close: 'Fechar',
    reset: 'Reiniciar',
    ghostMode: 'Modo Fantasma',
    sessionComplete: 'Sessão Completa!',
    timeForBreak: 'Hora de descansar!',
    backToWork: 'Voltar ao trabalho!',
  },
};

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en',
      t: translations.en,
      setLanguage: (lang: Language) => {
        set({ language: lang, t: translations[lang] });
      },
    }),
    {
      name: 'aura-focus-language',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = translations[state.language];
        }
      },
    }
  )
);

export const useTranslations = () => useLanguageStore((s) => s.t);
export const useLanguage = () => useLanguageStore((s) => s.language);
