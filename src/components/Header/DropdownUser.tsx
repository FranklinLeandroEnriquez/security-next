import { use, useContext, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogInIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { useUserFunctions } from "@/contexts/UserFunctionProvider";
import { useSessionAuth } from "@/hooks/useSessionAuth";


const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const authContext = useContext(AuthContext);
  const router = useRouter();
  const userFunctions = useUserFunctions();
  const { getAuthResponse } = useSessionAuth();
  const authResponse = getAuthResponse();

  const email = authResponse?.email;
  const username = authResponse?.username;

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  const logoutHandler = () => {
    authContext?.clearAuthResponse();
    router.push('/login');
  }

  return (
    <div className="flex">
      <div className="flex items-center gap-4">
        <span className="hidden text-right lg:block mr-2">
          <h3 className="block text-sm font-medium">
            {username?.toUpperCase()}
          </h3>
          <span className="block text-xs">{email}</span>
        </span>

        <span className="h-12 w-12 rounded-full flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </span>
      </div>
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <LogInIcon></LogInIcon>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={logoutHandler}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div >
  );
};

export default DropdownUser;