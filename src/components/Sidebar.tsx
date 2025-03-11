
import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  Clock, 
  ThumbsUp, 
  Film, 
  Music2, 
  GamepadIcon, 
  Newspaper, 
  Trophy, 
  Shirt, 
  Flame, 
  ShoppingBag,
  History,
  PlaySquare,
  ChevronDown,
  User 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const SidebarItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => {
  return (
    <div 
      className={cn(
        "flex items-center py-2 px-3 cursor-pointer rounded-lg transition-colors hover:bg-youtube-hover",
        active ? "bg-youtube-hover" : ""
      )}
      onClick={onClick}
    >
      <div className="mr-4 text-white">{icon}</div>
      <span className={cn("text-sm", active ? "font-medium" : "")}>{label}</span>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div 
      className={cn(
        "fixed left-0 top-14 bottom-0 bg-youtube-dark transition-all duration-300 overflow-y-auto",
        isOpen ? "w-60" : "w-20",
        "z-10"
      )}
    >
      <div className="py-3">
        {isOpen ? (
          <>
            <div className="mb-3">
              <SidebarItem 
                icon={<Home size={20} />} 
                label="Home" 
                active={isActive('/')}
                onClick={() => navigate('/')}
              />
              <SidebarItem 
                icon={<Compass size={20} />} 
                label="Explore" 
                active={isActive('/explore')}
                onClick={() => navigate('/explore')}
              />
            </div>
            
            <div className="border-t border-youtube-border pt-3 mb-3">
              <div className="px-4 mb-2 text-sm text-youtube-gray">You</div>
              <SidebarItem 
                icon={<User size={20} />} 
                label="Your channel" 
                onClick={() => {}}
              />
              <SidebarItem 
                icon={<History size={20} />} 
                label="History" 
                onClick={() => {}}
              />
              <SidebarItem 
                icon={<PlaySquare size={20} />} 
                label="Your videos" 
                onClick={() => {}}
              />
              <SidebarItem 
                icon={<Clock size={20} />} 
                label="Watch later" 
                onClick={() => {}}
              />
              <SidebarItem 
                icon={<ThumbsUp size={20} />} 
                label="Liked videos" 
                onClick={() => {}}
              />
              <div className="flex items-center py-2 px-3 cursor-pointer hover:bg-youtube-hover rounded-lg">
                <div className="mr-4"><ChevronDown size={20} /></div>
                <span className="text-sm">Show more</span>
              </div>
            </div>
            
            <div className="border-t border-youtube-border pt-3 mb-3">
              <div className="px-4 mb-2 text-sm text-youtube-gray">Explore</div>
              <SidebarItem 
                icon={<Flame size={20} />} 
                label="Trending" 
                onClick={() => navigate('/trending')}
              />
              <SidebarItem 
                icon={<Music2 size={20} />} 
                label="Music" 
                onClick={() => navigate('/music')}
              />
              <SidebarItem 
                icon={<Film size={20} />} 
                label="Movies" 
                onClick={() => {}}
              />
              <SidebarItem 
                icon={<GamepadIcon size={20} />} 
                label="Gaming" 
                onClick={() => {}}
              />
              <SidebarItem 
                icon={<Newspaper size={20} />} 
                label="News" 
                onClick={() => {}}
              />
              <SidebarItem 
                icon={<Trophy size={20} />} 
                label="Sports" 
                onClick={() => {}}
              />
              <SidebarItem 
                icon={<Shirt size={20} />} 
                label="Fashion" 
                onClick={() => {}}
              />
              <SidebarItem 
                icon={<ShoppingBag size={20} />} 
                label="Shopping" 
                onClick={() => {}}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center py-2">
              <div 
                className={cn(
                  "flex flex-col items-center p-3 cursor-pointer rounded-lg transition-colors hover:bg-youtube-hover",
                  isActive('/') ? "bg-youtube-hover" : ""
                )}
                onClick={() => navigate('/')}
              >
                <Home size={20} />
                <span className="text-xs mt-1">Home</span>
              </div>
              <div 
                className={cn(
                  "flex flex-col items-center p-3 cursor-pointer rounded-lg transition-colors hover:bg-youtube-hover",
                  isActive('/explore') ? "bg-youtube-hover" : ""
                )}
                onClick={() => navigate('/explore')}
              >
                <Compass size={20} />
                <span className="text-xs mt-1">Explore</span>
              </div>
              <div 
                className="flex flex-col items-center p-3 cursor-pointer rounded-lg transition-colors hover:bg-youtube-hover"
              >
                <History size={20} />
                <span className="text-xs mt-1">History</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
