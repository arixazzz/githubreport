import { Home, Code2, Layers } from "lucide-react"

export default function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Code2, label: "Repositori" },
    { icon: Layers, label: "Listing Project" },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">G</span>
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">GitRepo Platform</h2>
            <p className="text-xs text-muted-foreground">Sistem Dokumentasi</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="pt-6 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">GitRepo v1.0</p>
      </div>
    </aside>
  )
}
