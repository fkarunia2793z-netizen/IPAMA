import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  textarea?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  icon, 
  textarea, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 text-slate-700";
  
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative group">
        <div className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
          {icon}
        </div>
        
        {textarea ? (
          <textarea
            className={`${baseClasses} min-h-[100px] resize-y`}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={baseClasses}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium ml-1">{error}</p>}
    </div>
  );
};