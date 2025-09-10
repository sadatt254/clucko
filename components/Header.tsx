import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Rocket, Wheat, Activity, LogOut } from "lucide-react";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";

export const Header = ({ className }: { className?: string }) => {
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pillRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClick = (e: { target: any; }) => {
      if (pillRef.current && !pillRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [isDropdownOpen]);

  const disableLogin = !ready || (ready && authenticated);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = [
    { label: "My Farm", active: false, icon: Wheat },
    { label: "Missions", active: true, icon: Rocket },
    { label: "Activity", active: false, icon: Activity },
  ];

  console.log("User:", user);

  const [profileDropdown, setProfileDropdown] = useState(false);

  return (
    <>
      <nav
        className={cn(
          "w-full flex flex-col pt-4 px-20 fixed top-0 z-50 transition-all duration-300",
          isScrolled && isMobile ? "bg-black/50 backdrop-blur-md" : "bg-transparent px-8",
          className
        )}
      >
        <div className={cn("flex items-center", isMobile ? "justify-between" : "justify-between")}>
          {/* Left: Logo */}
          <div className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          </div>

          {/* Center Navigation (Desktop Only) */}
          {!isMobile && (
            <div className="flex items-center bg-crypto-card border border-[#292e33] rounded-full p-1 shadow-crypto">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "px-6 py-3 text-sm font-medium rounded-full transition-all duration-300",
                    item.active
                      ? "bg-[#4b6153] text-[#65ec72] shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Right Section: Connect/Profile */}
          <div>
            {!authenticated ? (
              <button
                onClick={() => login()}
                disabled={disableLogin}
                className="flex items-center px-3 py-2 rounded-full bg-[#65EC72] text-[#171617] font-semibold hover:bg-green-700 transition"
              >
                Connect
              </button>
            ) : (
              <div className="relative profile-pill">
                <button
                  className="flex items-center px-4 py-2 rounded-full bg-[#65EC72] cursor-pointer"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  aria-haspopup="true"
                  aria-expanded={profileDropdown}
                >
                  <img
                    src="/default-avatar.png"
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover mr-3"
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-[#171617] text-xs">
                      {String(user?.email?.address) ?? "No Email"}
                    </span>
                    <span className="font-mono text-xs text-[#292e33] truncate max-w-[120px]">
                      {user?.wallet?.address ?? "No Wallet"}
                    </span>
                  </div>
                </button>
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-[#292e33] rounded-xl shadow-lg py-2 z-10">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdown(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-[#171617] hover:bg-[#f9fafb] font-medium transition"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && (
          <div
            className={cn(
              "flex items-center fixed bottom-0 left-0 right-0 p-4 bg-[#171617] border-t-4 border-x-8 border-[#292e33] rounded-t-3xl w-full justify-between"
            )}
          >
            {navItems.map((item, index) => (
              <button
                key={item.label}
                className={cn(
                  "transition-all duration-300",
                  "px-6 py-3 rounded-full",
                  item.active ? "bg-[#65ec72] p-4" : "bg-transparent",
                  index === 0 && "rounded-tl-full rounded-bl-full",
                  index === navItems.length - 1 && "rounded-tr-full rounded-br-full"
                )}
                aria-label={item.label}
              >
                <item.icon className={cn("h-6 w-6", item.active ? "text-black" : "text-white")} />
              </button>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};
