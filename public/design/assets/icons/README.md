# Ticker-Tactix Custom Icon Library

Lucide-style custom SVG icons for the Ticker-Tactix UI direction.

## React + Tailwind usage

Copy `react/` into `resources/js/components/icons/ticker-tactix/`.

```tsx
import { tickerTactixIcons, type TickerTactixIconName } from "@/components/icons/ticker-tactix";

export function TTIcon({ name, className }: { name: TickerTactixIconName; className?: string }) {
  const Icon = tickerTactixIcons[name];
  return <Icon className={className ?? "h-5 w-5"} />;
}
```

The SVGs use `currentColor`, so Tailwind text color classes control icon color.
