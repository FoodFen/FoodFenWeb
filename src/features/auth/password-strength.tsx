import { passwordScore, strengthLabels } from './password-score'

const colors = ['', 'bg-destructive', 'bg-chart-3', 'bg-primary/70', 'bg-primary']

export function PasswordStrength({ password }: { password: string }) {
  const score = passwordScore(password)
  if (!score) return null

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5" aria-hidden>
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              step <= score ? colors[score] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <p aria-live="polite" className="text-muted-foreground text-xs">
        Độ mạnh mật khẩu: {strengthLabels[score]}
      </p>
    </div>
  )
}
