interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
export function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="search-bar">
      <i className="fas fa-search search-icon"></i>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="search-input" />
      {value && <button className="search-clear" onClick={() => onChange('')}><i className="fas fa-times"></i></button>}
    </div>
  );
}
