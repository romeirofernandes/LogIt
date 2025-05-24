import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`
        flex w-20 h-10 p-1 rounded-full cursor-pointer transition-all duration-300
        ${isDark 
          ? 'bg-zinc-900 border border-zinc-700' 
          : 'bg-white border border-zinc-300'
        }
        ${className}
      `}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && toggleTheme()}
    >
      <div className="flex justify-between items-center w-full relative">
        <div
          className={`
            flex justify-center items-center w-8 h-8 rounded-full transition-transform duration-300 absolute z-10
            ${isDark 
              ? 'transform translate-x-0 bg-zinc-800' 
              : 'transform translate-x-10 bg-gray-200'
            }
          `}
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-text-dark" strokeWidth={1.5} />
          ) : (
            <Sun className="w-5 h-5 text-text-light" strokeWidth={1.5} />
          )}
        </div>
        <div className={`
          flex justify-center items-center w-8 h-8 absolute
          ${isDark ? 'right-1' : 'left-1'}
        `}>
          {isDark ? (
            <Sun className="w-5 h-5 text-zinc-500" strokeWidth={1.5} />
          ) : (
            <Moon className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
}