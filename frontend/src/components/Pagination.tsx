interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  styles?: Record<string, React.CSSProperties>;
}

const defaultStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
    marginTop: '24px',
  },
  btn: {
    width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #334155',
    background: 'transparent', color: '#e2e8f0', cursor: 'pointer', fontSize: '14px',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s',
  },
  btnActive: {
    background: '#22c55e', borderColor: '#22c55e', color: '#fff',
  },
  btnDisabled: {
    opacity: 0.4, cursor: 'not-allowed',
  },
  dots: {
    color: '#64748b', padding: '0 4px', fontSize: '14px',
  },
};

export function Pagination({ currentPage, totalPages, onPageChange, styles }: PaginationProps) {
  if (totalPages <= 1) return null;
  const s = styles || defaultStyles;
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== -1) {
      pages.push(-1);
    }
  }
  return (
    <div style={s.wrapper}>
      <button
        style={{ ...s.btn, ...(currentPage === 1 ? s.btnDisabled : {}) } as React.CSSProperties}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      {pages.map((p, i) =>
        p === -1 ? (
          <span key={`dots-${i}`} style={s.dots}>...</span>
        ) : (
          <button
            key={p}
            style={{ ...s.btn, ...(p === currentPage ? s.btnActive : {}) } as React.CSSProperties}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}
      <button
        style={{ ...s.btn, ...(currentPage === totalPages ? s.btnDisabled : {}) } as React.CSSProperties}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}
