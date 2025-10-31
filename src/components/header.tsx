import { LogOut, User } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-primary/15 border-b border-sidebar-border px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">G</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">GitRepo Platform</h1>
          <p className="text-xs text-muted-foreground">Sistem Dokumentasi Riwayat Perubahan</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <User size={18} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Bendry Lakburlawai</p>
            <p className="text-xs text-muted-foreground">21 repositori</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-primary transition-colors">
          <LogOut size={16} />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </header>
  )
}
