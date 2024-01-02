import { ModeToggle } from "@/components/DarckMode";
import DropdownUser from "./DropdownUser";
import { useTheme } from "next-themes";

interface HeaderProps {
  title: string;
  icon?: JSX.Element;
}

const Header: React.FC<HeaderProps> = ({ title, icon }) => {
  const { theme } = useTheme();
  const boxShadowColor = theme === 'dark' ? 'dark' : 'black'
  const backgroundColor = theme === 'white' ? 'white' : 'dark';

  return (
    <header className="sticky top-0 z-999 flex w-ful drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none" style={{ boxShadow: `0 0px 1px ${boxShadowColor}`, backgroundColor: backgroundColor }}>
      <div className="flex flex-grow items-center justify-between px-4 py-5 shadow-2 md:px-6 2xl:px-11">
        <div className="flex font-bold text-lg space-between ml-[60px]">
          {icon}
          <h1 className="mx-2">{title}</h1>
        </div>
        <div className="flex items-center mr-6 gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggler --> */}
            <ModeToggle />
            {/* <!-- Dark Mode Toggler --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;