'use client'

interface ProgressIndicatorProps {
  currentStep: number
  /** Umožní kliknutím přeskočit na krok. */
  onStepClick?: (step: number) => void
}

/**
 * Stepper kalkulačky majetku – sjednocený se Stepperem u vozidel:
 * aktivní krok má vínový gradient, kolečka spojuje průběžná čára středem.
 */
export default function ProgressIndicator({ currentStep, onStepClick }: ProgressIndicatorProps) {
  const steps = [
    'Základní údaje',
    'Parametry pojištění',
    'Kalkulace',
    'Záznam z jednání',
    'Smlouva a dokumenty',
  ]

  return (
    <div className="relative w-full px-1 sm:px-4">
      {/* Průběžná spojovací čára vedená středem koleček */}
      <div className="pointer-events-none absolute left-6 right-6 top-4 h-0.5 bg-border-strong sm:left-8 sm:right-8" />
      <ol className="relative flex w-full items-start justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep

          return (
            <li
              key={index}
              className={`flex flex-col items-center ${onStepClick ? 'cursor-pointer' : ''}`}
              onClick={() => onStepClick?.(stepNumber)}
            >
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-brand-500 text-white'
                    : 'bg-surface-muted text-muted'
                }`}
              >
                {stepNumber}
              </div>
              {/* Popisky jen od tabletu výš – na telefonu se nevejdou */}
              <span
                className={`mt-1.5 hidden whitespace-nowrap text-xs font-medium sm:block ${
                  isActive ? 'text-brand-600' : 'text-muted'
                }`}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
      {/* Mobilní popisek aktuálního kroku */}
      <div className="mt-3 text-center sm:hidden">
        <span className="text-xs font-medium text-muted">
          Krok {currentStep} z {steps.length} ·{' '}
        </span>
        <span className="text-xs font-semibold text-brand-600">{steps[currentStep - 1]}</span>
      </div>
    </div>
  )
}
