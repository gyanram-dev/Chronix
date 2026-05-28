export default function GridLayout({ columns = 2, gap = 5, children }) {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  return (
    <div className={`grid ${cols[columns] || cols[2]} gap-${gap}`}>
      {children}
    </div>
  );
}
