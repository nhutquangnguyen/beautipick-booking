export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Settings navigation is now handled by the sidebar
  return <>{children}</>;
}
