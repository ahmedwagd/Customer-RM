import { NavLink } from "react-router-dom";
import logo from "../assets/Ma5zan-logo.png";
import Icon from "./ui/Icon";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
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
          fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-outline-variant bg-brand-surface-secondary transition-transform duration-300
          md:static md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-center py-4 px-6 border-b border-outline-variant">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 no-underline"
            onClick={onClose}
          >
            <img src={logo} alt="Ma5zan" className="h-32 w-auto" />
          </NavLink>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2.5 text-label-lg no-underline transition-colors ${
                  isActive
                    ? "bg-primary-fixed text-on-primary-fixed-variant"
                    : "text-brand-neutral hover:bg-surface-container-high"
                }`
              }
            >
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
