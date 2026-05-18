import { IconRenderer } from '@/Components/Icons/IconRenderer';
import { iconOptions } from '@/lib/icons';

type Props = {
    value: string;
    onChange: (value: string) => void;
    allowEmpty?: boolean;
};

export function IconSelector({ value, onChange, allowEmpty = true }: Props) {
    return (
        <div className="mt-2 grid gap-3">
            <div className="border-main-blue/35 bg-panel-deep flex items-center gap-3 rounded-sm border px-4 py-3">
                <span className="border-main-blue/35 bg-panel text-seafoam-green flex h-12 w-12 items-center justify-center rounded-sm border">
                    {value ? (
                        <IconRenderer name={value} className="h-7 w-7" />
                    ) : (
                        <span className="text-xs text-white/35">None</span>
                    )}
                </span>
                <select
                    className="w-full bg-transparent text-white outline-none"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                >
                    {allowEmpty ? <option value="">No icon</option> : null}
                    {iconOptions.map((icon) => (
                        <option key={icon.value} value={icon.value}>
                            {icon.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
