import * as SliderPrimitive from '@radix-ui/react-slider'

interface SliderProps {
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  label?: string
  showValue?: boolean
  className?: string
}

export default function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  showValue = true,
  className = '',
}: SliderProps) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-label-lg font-medium text-on-surface-variant">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <SliderPrimitive.Root
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([v]) => onChange(v)}
          className="relative flex-1 flex items-center select-none touch-none"
        >
          <SliderPrimitive.Track className="bg-surface-container-high relative grow rounded-full h-2">
            <SliderPrimitive.Range className="absolute bg-primary rounded-full h-full" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border-2 border-primary rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary" />
        </SliderPrimitive.Root>
        {showValue && (
          <span className="text-label-lg font-medium text-primary min-w-[40px] text-right">
            {value}%
          </span>
        )}
      </div>
    </div>
  )
}