export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#1C1C1E" }}>
      {children}
    </div>
  );
}
