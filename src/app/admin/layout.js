export const metadata = {
  title: 'Admin Command Center | Fenno Walker',
  description: 'Admin dashboard for managing the Fenno Walker optical store.',
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
      {children}
    </div>
  );
}
