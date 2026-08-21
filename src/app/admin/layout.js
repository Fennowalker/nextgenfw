export const metadata = {
  title: 'Admin Command Center | Next-Gen Eyewear',
  description: 'Admin dashboard for managing the Next-Gen Eyewear platform.',
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
      {children}
    </div>
  );
}
