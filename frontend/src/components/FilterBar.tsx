interface FilterOption { label: string; value: string; }
interface FilterBarProps { options: FilterOption[]; selected: string; onChange: (value: string) => void; }
export function FilterBar({ options, selected, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      {options.map((opt) => (
        <button key={opt.value} className={`filter-chip ${selected === opt.value ? 'active' : ''}`} onClick={() => onChange(opt.value)}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
