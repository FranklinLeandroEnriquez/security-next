import { ModeToggle } from "@/components/DarckMode";
import DropdownUser from "./DropdownUser";
import { useTheme } from "next-themes";

interface HeaderProps {
  title: string;
  icon?: JSX.Element;
}

const Header: React.FC<HeaderProps> = ({ title, icon }) => {
  const { theme } = useTheme();
  const themeClass = theme === 'dark' ? 'bg-[#181817]' : 'bg-white shadow-xl shadow-zinc-500/15';

  return (
    <header className={`h-15 flex flex-col w-full box-border flex-shrink-0 sticky
                       top-0 right-0 shadow-none justify-center backdrop-blur-[10px]
                       transition-shadow duration-300 ease-in-out z-50 ${themeClass} `}>
      <div className="flex flex-grow items-center justify-between px-4 py-[9px] shadow-2 md:px-6 2xl:px-11">
        <div className="flex font-bold text-lg space-between ml-[60px]">
          {icon}
          <h1 className="mx-2">{title}</h1>
        </div>
        <div className="flex items-center mr-8 gap-3 2xsm:gap-7">
          <div className="flex items-center gap-2 2xsm:gap-4 ml-2">
            {/* <!-- Dark Mode Toggler --> */}
            <ModeToggle />
            {/* <!-- Dark Mode Toggler --> */}
          </div>
          <div>
            {/* <!-- User Area --> */}
            <DropdownUser />
            {/* <!-- User Area --> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;