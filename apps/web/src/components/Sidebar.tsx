import { NavLink } from "react-router-dom";
import logo from "../assets/Ma5zan-logo.png";
import Icon from "./ui/Icon";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/leads", label: "Leads", icon: "leaderboard" },
  { to: "/contacts", label: "Contacts", icon: "person" },
  { to: "/companies", label: "Companies", icon: "corporate_fare" },
  { to: "/deals", label: "Deals", icon: "handshake" },
  { to: "/tasks", label: "Tasks", icon: "task" },
  { to: "/notes", label: "Notes", icon: "description" },
  { to: "/activities", label: "Activities", icon: "history" },
  { to: "/tags", label: "Tags", icon: "label" },
  { to: "/users", label: "Users", icon: "group" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-outline-variant bg-surface-container-low transition-transform duration-300
          md:static md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 no-underline"
            onClick={onClose}
          >
            <img src={logo} alt="Ma5zan" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h2 className="font-title-lg text-title-lg font-black text-on-surface">Ma5zan</h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Sales Workspace</p>
            </div>
          </NavLink>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-label-lg text-label-lg no-underline rounded-full transition-colors ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} filled={isActive} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 mt-auto space-y-1">
          <NavLink
            to="/leads/new"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 mb-6 bg-primary text-on-primary py-3 px-4 rounded-full font-label-lg text-label-lg hover:opacity-90 transition-all shadow-md no-underline"
          >
            <Icon name="add" />
            Create Lead
          </NavLink>
          <NavLink
            to="#"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all no-underline font-label-lg text-label-lg"
          >
            <Icon name="contact_support" />
            Support
          </NavLink>
          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all no-underline font-label-lg text-label-lg"
          >
            <Icon name="settings" />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
}
