import { X, Volume2, VolumeX, Minus, Plus } from 'lucide-react';
import { useTimerStore } from '../stores/timerStore';
import { useLanguageStore } from '../stores/languageStore';

interface TimerInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  color: 'red' | 'emerald' | 'blue';
}

function TimerInput({ value, onChange, min, max, label, color }: TimerInputProps) {
  const colorClasses = {
    red: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      btn: 'hover:bg-red-500/20 active:bg-red-500/30'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      btn: 'hover:bg-emerald-500/20 active:bg-emerald-500/30'
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      btn: 'hover:bg-blue-500/20 active:bg-blue-500/30'
    }
  };

  const c = colorClasses[color];

  return (
    <div className={`${c.bg} rounded-xl p-2 text-center`}>
      <div className="text-[9px] text-white/50 mb-1 leading-tight">{label}</div>
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className={`w-5 h-5 rounded-md flex items-center justify-center text-white/40 transition-all ${c.btn}`}
        >
          <Minus size={10} />
        </button>
        <span className={`${c.text} text-lg font-bold w-8 text-center`}>{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className={`w-5 h-5 rounded-md flex items-center justify-center text-white/40 transition-all ${c.btn}`}
        >
          <Plus size={10} />
        </button>
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const { config, updateConfig, isSettingsOpen, setSettingsOpen, setCurrentFace } = useTimerStore();
  const { language, setLanguage, t } = useLanguageStore();

  if (!isSettingsOpen) return null;

  const handleClose = () => {
    setSettingsOpen(false);
    setCurrentFace(0);
  };

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-50 no-drag"
      onClick={handleClose}
    >
      <div 
        className="bg-[#111]/95 backdrop-blur-xl rounded-2xl w-[320px] shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
          <h2 className="text-white font-semibold">{t.settings}</h2>
          <button
            onClick={handleClose}
            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
          >
            <X size={12} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Timer row */}
          <div className="grid grid-cols-3 gap-2">
            <TimerInput
              value={config.focusMinutes}
              onChange={(v) => updateConfig({ focusMinutes: v })}
              min={1}
              max={90}
              label={t.focusSession}
              color="red"
            />
            <TimerInput
              value={config.shortBreakMinutes}
              onChange={(v) => updateConfig({ shortBreakMinutes: v })}
              min={1}
              max={30}
              label={t.shortBreakLabel}
              color="emerald"
            />
            <TimerInput
              value={config.longBreakMinutes}
              onChange={(v) => updateConfig({ longBreakMinutes: v })}
              min={1}
              max={60}
              label={t.longBreakLabel}
              color="blue"
            />
          </div>

          {/* Sessions until long break */}
          <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
            <span className="text-white/70 text-xs">{t.longBreakAfter}</span>
            <div className="flex gap-1">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => updateConfig({ sessionsUntilLongBreak: num })}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    config.sessionsUntilLongBreak === num
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Sound + Language row */}
          <div className="flex gap-2">
            {/* Sound */}
            <button
              onClick={() => updateConfig({ soundEnabled: !config.soundEnabled })}
              className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                config.soundEnabled 
                  ? 'bg-emerald-500/15 border border-emerald-500/30' 
                  : 'bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                {config.soundEnabled ? (
                  <Volume2 size={14} className="text-emerald-400" />
                ) : (
                  <VolumeX size={14} className="text-white/40" />
                )}
                <span className={`text-xs ${config.soundEnabled ? 'text-white' : 'text-white/50'}`}>
                  {t.sound}
                </span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${
                config.soundEnabled ? 'bg-emerald-500' : 'bg-white/20'
              }`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  config.soundEnabled ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </button>

            {/* Language */}
            <div className="flex gap-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  language === 'en'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('pt')}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  language === 'pt'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                PT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
