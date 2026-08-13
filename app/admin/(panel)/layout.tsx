import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-8 py-4">
          <p className="text-xs uppercase tracking-widest text-foreground/50">Administration</p>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
