import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
}

const navigation: NavItem[] = [
  { 
    name: 'Rules', 
    href: '/rules'
  },
  { 
    name: 'Audit Log', 
    href: '/audit-log'
  },
  { 
    name: 'Settings', 
    href: '/settings'
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <nav className="flex flex-col px-4 py-2 space-y-1">
      {navigation.map((item) => {
        const isActive = location.pathname.startsWith(item.href);
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'px-4 py-3 text-sm rounded-md transition-colors duration-200',
              isActive
                ? 'bg-[#F5F5F5] text-black font-medium' 
                : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-black'
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
