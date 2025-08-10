import React from 'react'
import { UseFormRegister, FieldError, Path } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

interface FormFieldProps<T extends Record<string, any>> {
  name: Path<T>
  label: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'time' | 'number' | 'textarea' | 'select'
  placeholder?: string
  register: UseFormRegister<T>
  error?: FieldError
  required?: boolean
  options?: { value: string; label: string }[]
  rows?: number
  min?: string | number
  max?: string | number
  step?: string | number
  disabled?: boolean
  className?: string
}

export function FormField<T extends Record<string, any>>({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  error,
  required = false,
  options = [],
  rows = 4, // Padrão de 4 linhas para textareas
  min,
  max,
  step,
  disabled = false,
  className = ''
}: FormFieldProps<T>) {
  const { theme } = useTheme();
  
  const baseInputClasses = `
    w-full px-3 py-2 border rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    transition-all duration-300 ease-in-out 
    ${error ? 'border-red-500 ring-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} 
    ${disabled ? 'cursor-not-allowed' : ''} 
    ${theme === 'dark' 
      ? 'bg-gray-700 text-gray-100 placeholder-gray-400' + (disabled ? ' bg-gray-800' : '')
      : 'bg-white text-gray-900 placeholder-gray-400' + (disabled ? ' bg-gray-100' : '')
    }
    ${className}
  `.trim();

  const renderInput = () => {
    const commonProps = {
      ...register(name),
      className: baseInputClasses,
      placeholder,
      disabled,
      min,
      max,
      step
    };

    switch (type) {
      case 'textarea':
        return <textarea {...commonProps} rows={rows} />;
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Selecione...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return <input {...commonProps} type={type} />;
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={name} className={`block text-sm font-medium mb-1 ${
        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
      }`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {renderInput()}
        {error && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle size={14} />
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default FormField