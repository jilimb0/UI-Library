import { cn } from '../../../utils/cn';

export interface StepperItem {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepperItem[];
  activeStep: number;
  onStepChange?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  linear?: boolean;
  className?: string;
}

export function Stepper({
  steps,
  activeStep,
  onStepChange,
  orientation = 'horizontal',
  linear = true,
  className,
}: StepperProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const disabled = linear && index > activeStep;

        return (
          <button
            key={step.id}
            type="button"
            disabled={disabled}
            onClick={() => onStepChange?.(index)}
            className={cn(
              'flex items-start gap-2 text-left disabled:cursor-not-allowed disabled:opacity-50',
              orientation === 'horizontal' ? 'min-w-[120px]' : 'w-full'
            )}
          >
            <span
              className={cn(
                'inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold',
                isCompleted && 'border-green-600 bg-green-600 text-white',
                isActive && 'border-blue-600 bg-blue-600 text-white',
                !isActive &&
                  !isCompleted &&
                  'border-slate-300 bg-white text-slate-700'
              )}
            >
              {index + 1}
            </span>
            <span>
              <span className="block text-sm font-medium text-slate-900">
                {step.label}
              </span>
              {step.description ? (
                <span className="block text-xs text-slate-500">
                  {step.description}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
