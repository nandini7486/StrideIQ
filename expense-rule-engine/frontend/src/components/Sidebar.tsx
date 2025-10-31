import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

const NavItem = ({ to, children }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-sm font-medium ${isActive ? 'bg-gray-100 text-black' : 'text-gray-700 hover:bg-gray-50'}`
    }
  >
    {children}
  </NavLink>
);

export function Sidebar() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Policy Engine</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2">
        <ul>
          <li>
            <NavItem to="/rules">
              <span className="w-5 h-5 mr-3">•</span>
              Rules
            </NavItem>
          </li>
          <li>
            <NavItem to="/audit-log">
              <span className="w-5 h-5 mr-3">•</span>
              Audit Log
            </NavItem>
          </li>
          <li>
            <NavItem to="/settings">
              <span className="w-5 h-5 mr-3">•</span>
              Settings
            </NavItem>
          </li>
        </ul>
      </nav>
    </div>
  );
}
