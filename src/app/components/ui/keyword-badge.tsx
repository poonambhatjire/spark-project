interface KeywordBadgeProps {
  label: string;
}

const KeywordBadge = ({ label }: KeywordBadgeProps) => {
  return (
    <span className="inline-block px-3 py-1 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-full hover:bg-slate-200 transition-colors">
      {label}
    </span>
  );
};

export default KeywordBadge;
