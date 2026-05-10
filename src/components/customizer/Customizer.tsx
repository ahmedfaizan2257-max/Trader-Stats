import { Check, Upload, RefreshCw, User, TrendingUp } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const THEMES = {
  'PURPLE TRIANGLE': {
    bgImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop',
    hexColor: '#7C3AED',
    angle: 135,
    opacity: 85,
  },
  'NEON BEAMS': {
    bgImage: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2000&auto=format&fit=crop',
    hexColor: '#ff007f',
    angle: 135,
    opacity: 70,
  },
  'MY DESIGN': {
    bgImage: '',
    hexColor: '#7C3AED',
    angle: 135,
    opacity: 85,
  }
};

export function Customizer() {
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState<'PURPLE TRIANGLE' | 'NEON BEAMS' | 'MY DESIGN'>('PURPLE TRIANGLE');
  
  const [customSettings, setCustomSettings] = useState({ ...THEMES['PURPLE TRIANGLE'] });

  const handleThemeChange = (theme: keyof typeof THEMES) => {
    setSelectedTheme(theme);
    setCustomSettings({ ...THEMES[theme] });
  };

  const handleSettingChange = (key: string, value: string | number) => {
    setCustomSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSettingChange('bgImage', reader.result as string);
        setSelectedTheme('MY DESIGN');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToDefault = () => {
    setCustomSettings({ ...THEMES[selectedTheme] });
    toast.success('Your active preset has been updated successfully.');
  };

  const handleSaveSettings = () => {
    // Optionally: Save to TradeContext or localStorage
    toast.success('Settings saved successfully!');
  };

  const { bgImage, hexColor, angle, opacity } = customSettings;

  // Derive display name and handle from user
  const displayName = user?.displayName || 'Trader';
  const handle = user?.email ? `@${user.email.split('@')[0]}` : '@trader';

  return (
    <div className="max-w-5xl space-y-8 pb-20 text-slate-900 dark:text-white">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Share Image Customizer</h2>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((theme) => (
          <button 
            key={theme}
            onClick={() => handleThemeChange(theme)}
            className={cn(
              "flex-shrink-0 w-64 h-24 rounded-2xl border-2 flex items-center justify-center font-bold tracking-widest text-sm transition-all relative overflow-hidden",
              selectedTheme === theme ? "border-[#5b32f6] shadow-[0_0_15px_rgba(91,50,246,0.2)]" : "border-transparent border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
            )}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
              style={{ backgroundImage: `url(${THEMES[theme].bgImage})` }}
            />
            {selectedTheme === theme && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#5b32f6] flex items-center justify-center z-10">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="relative z-10 text-white drop-shadow-md">{theme}</span>
          </button>
        ))}
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Preview</h3>
        <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0a0a0c]">
          {/* Background Layer */}
          {bgImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bgImage})` }}
            />
          )}
          {/* Opacity Overlay layer */}
          <div 
            className="absolute inset-0 bg-black" 
            style={{ opacity: opacity / 100 }}
          />

          {/* Content Layer */}
          <div className="relative z-10 w-full p-8 flex flex-col justify-between min-h-[450px]">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">January 1, 2048</h2>
                <div className="text-4xl font-bold text-emerald-400 font-mono tracking-tight">$2,500.75</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-white leading-none">{displayName}</div>
                  <div className="text-slate-400 font-mono text-sm mt-1">{handle}</div>
                </div>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={displayName} className="w-12 h-12 rounded-full border-2 border-slate-700 object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                    <User className="w-6 h-6 text-slate-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 my-10">
              {[
                { label: 'WIN RATE', value: '75.50%' },
                { label: 'INSTRUMENTS TRADED', value: 'NO TRADES', upper: true },
                { label: 'LARGEST WIN', value: '$1,200.50', currency: true },
                { label: 'AVG TIME PER TRADE', value: '12.50 min' },
                { label: 'TOTAL TRADES', value: '15' },
                { label: 'PROFIT FACTOR', value: '2.3' },
              ].map((stat, i) => (
                 <div 
                  key={i} 
                  className="flex flex-col items-center justify-center py-6 px-4 rounded-2xl relative shadow-lg"
                  style={{ 
                    background: `linear-gradient(${angle}deg, rgba(20,20,20,0.8), rgba(0,0,0,0.5)) padding-box, linear-gradient(${angle}deg, ${hexColor}, transparent) border-box`,
                    border: '2px solid transparent'
                  }}
                >
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-3 text-center">{stat.label}</div>
                  <div className={cn("text-[22px] font-bold font-mono text-center tracking-tight", stat.currency ? "text-emerald-400" : stat.upper ? "text-slate-400" : "text-white")}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-end mt-4">
               <div className="text-sm font-bold text-slate-400 tracking-wide">Take control of your trading.</div>
               <div className="flex items-center gap-2">
                 <TrendingUp className="w-6 h-6 text-[#5b32f6]" strokeWidth={2.5} />
                 <span className="text-2xl font-bold tracking-tight text-[#5b32f6]">TradeEdge</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
         <div>
            <h3 className="font-bold text-sm mb-4">Background Image</h3>
            <div className="w-full h-40 bg-slate-100 dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-2xl mb-4 overflow-hidden relative shadow-sm">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
               />
            </div>
            <div className="flex items-center gap-4 mb-8">
               <label className="flex items-center gap-2 px-4 py-2.5 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-[#5b32f6]/20 cursor-pointer">
                  <Upload className="w-4 h-4" /> Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
               </label>
               <button 
                 onClick={handleResetToDefault}
                 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
               >
                  <RefreshCw className="w-4 h-4" /> Reset to Default
               </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Overlay Opacity</span>
                <span className="font-mono">{opacity}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={opacity}
                onChange={(e) => handleSettingChange('opacity', parseInt(e.target.value))}
                className="w-full accent-[#5b32f6]" 
              />
            </div>
         </div>

         <div>
            <h3 className="font-bold text-sm mb-4">Stat Box Gradient Color</h3>
            <div 
              className="w-full h-40 rounded-2xl mb-4 border border-slate-200 dark:border-slate-800 shadow-sm"
              style={{
                background: `linear-gradient(${angle}deg, ${hexColor}, transparent)`
              }}
            />
            
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Hex Color</label>
                  <input 
                    type="text" 
                    value={hexColor}
                    onChange={(e) => handleSettingChange('hexColor', e.target.value)}
                    className="w-full bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#5b32f6] transition-colors" 
                  />
               </div>
               <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Angle</label>
                  <input 
                    type="number" 
                    value={angle}
                    onChange={(e) => handleSettingChange('angle', parseInt(e.target.value))}
                    className="w-full bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#5b32f6] transition-colors" 
                  />
               </div>
            </div>

            <div>
               <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Color Selections</h4>
               <div className="flex gap-3">
                 <button 
                  onClick={() => handleSettingChange('hexColor', '#7C3AED')}
                  className={cn(
                   "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                   hexColor === '#7C3AED' ? "border-2 border-[#7C3AED] p-[2px]" : ""
                 )}>
                   <div className="w-full h-full rounded-full bg-[#7C3AED]" />
                 </button>
                 <button 
                  onClick={() => handleSettingChange('hexColor', '#ff007f')}
                  className={cn(
                   "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                   hexColor === '#ff007f' ? "border-2 border-[#ff007f] p-[2px]" : ""
                 )}>
                   <div className="w-full h-full rounded-full bg-[#ff007f]" />
                 </button>
                 <button 
                  onClick={() => handleSettingChange('hexColor', '#10b981')}
                  className={cn(
                   "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                   hexColor === '#10b981' ? "border-2 border-[#10b981] p-[2px]" : ""
                 )}>
                   <div className="w-full h-full rounded-full bg-[#10b981]" />
                 </button>
                 <button 
                  onClick={() => handleSettingChange('hexColor', '#000000')}
                  className={cn(
                   "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                   hexColor === '#000000' ? "border-2 border-slate-500 p-[2px]" : ""
                 )}>
                   <div className="w-full h-full rounded-full bg-[#000000] border border-slate-800" />
                 </button>
               </div>
            </div>
         </div>
      </div>
      
      <div className="flex justify-end pt-8">
         <button className="px-6 py-3 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition-colors mr-3">
            Cancel
         </button>
         <button onClick={handleSaveSettings} className="px-6 py-3 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-xl font-bold transition-colors shadow-md shadow-[#5b32f6]/20">
            Save Settings
         </button>
      </div>
    </div>
  );
}
