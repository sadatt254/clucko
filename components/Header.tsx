"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Rocket, Wheat, Activity, Wallet } from "lucide-react";
import { usePrivy, useLoginWithEmail } from "@privy-io/react-auth";

interface NavigationProps {
  className?: string;
}

const Modal = ({
  children,
  open,
  onClose,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="bg-[#171617] rounded-lg p-8 shadow-crypto border border-[#292e33] w-full max-w-[400px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const OTPInput = ({
  length,
  value,
  onChange,
}: {
  length: number;
  value: string;
  onChange: (val: string) => void;
}) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value;
    if (!val.match(/^[0-9a-zA-Z]?$/)) return; // allow only single char
    const newVal = value.split("");
    newVal[idx] = val;
    onChange(newVal.join("").slice(0, length));
    if (val && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    if (!pasteData) return;
    const newVal = value.split("");
    for (let i = 0; i < pasteData.length; i++) {
      newVal[i] = pasteData[i];
    }
    onChange(newVal.join("").slice(0, length));
    inputsRef.current[Math.min(pasteData.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {[...Array(length)].map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          maxLength={1}
          value={value[idx] || ""}
          onChange={(e) => handleInputChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-12 h-12 rounded-md bg-[#292e33] border border-[#3a3f45] text-white text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#65ec72]"
          spellCheck="false"
          autoComplete="one-time-code"
          inputMode="numeric"
        />
      ))}
    </div>
  );
};

export const Header = ({ className }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { user, logout, authenticated, ready } = usePrivy();
  const isLoggedIn = ready && authenticated;
  console.log(user);

  const { sendCode, loginWithCode, state } = useLoginWithEmail({
    onComplete: () => {
      setEmail("");
      setCode("");
      setCodeSent(false);
      setLoginModalOpen(false);
    },
    onError: (err) => {
      alert(err.message || "Login error");
    },
  });

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

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

  const shortAddress =
    user?.linkedAccounts?.find((acct) => acct.type === "smart_wallet")?.address ||
    user?.wallet?.address ||
    "";

  const handleSendCode = async () => {
    if (!email) {
      alert("Please enter an email");
      return;
    }
    await sendCode({ email });
    setCodeSent(true);
  };

  const handleLoginWithCode = async () => {
    if (code.length !== 6) {
      alert("Please complete the 6 digit code");
      return;
    }
    await loginWithCode({ code });
  };

  return (
    <>
      <nav
        className={cn(
          "w-full flex flex-col pt-4 px-20 fixed top-0 z-50 transition-all duration-300",
          isScrolled && isMobile ? "bg-black/50 backdrop-blur-md" : "bg-transparent",
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

          {/* Right Section: Connect Button / Profile */}
          <div>
            {isLoggedIn ? (
              <div
                className={cn(
                  "flex items-center gap-2",
                  isMobile ? "rounded-full" : "bg-[#171617] rounded-full p-2 px-6"
                )}
              >
                <img
                  src={user?.google?.picture || "/profile.jpg"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
                {!isMobile && (
                  <div className="text-white text-sm flex flex-col min-w-[180px]">
                    <p className="text-xs text-[#65ec72] font-mono font-bold truncate break-words">
                      {shortAddress || "Your Wallet Address"}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono font-semibold truncate">
                      {user?.google?.email || user?.email?.address || "No email"}
                    </p>
                  </div>
                )}
                {!isMobile && (
                  <button
                    className="ml-4 text-red-500 hover:underline"
                    onClick={() => logout()}
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center px-3 py-2 rounded-full bg-[#65EC72] text-[#171617] font-semibold hover:bg-green-700 transition"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#151515] mr-2">
                  <Wallet className="h-3 w-3 text-white" />
                </span>
                Sign In
              </button>
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
              >
                <item.icon className={cn("h-6 w-6", item.active ? "text-black" : "text-white")} />
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <Modal open={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
        {isLoggedIn ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-white">Logged In</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              You are logged in as {user?.google?.email || user?.email?.address || "user"}.
            </p>
            <button
              onClick={() => logout()}
              className="w-full px-5 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : !codeSent ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-white">Sign In with Email</h2>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className="w-full rounded-full p-3 mb-4 text-white bg-[#292e33] border border-[#3a3f45] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#65ec72]"
              autoFocus
            />
            <button
              onClick={handleSendCode}
              className="w-full px-5 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Send Code
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-white">Enter 6-digit Code</h2>
            <p className="text-muted-foreground mb-4 text-sm">Check your email for the code.</p>
            <OTPInput length={6} value={code} onChange={setCode} />
            <button
              onClick={handleLoginWithCode}
              className="w-full mt-6 px-5 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => setCodeSent(false)}
              className="w-full mt-2 px-5 py-2 rounded-full bg-transparent text-muted-foreground font-semibold hover:text-white transition"
            >
              Back
            </button>
          </>
        )}
        {state.status === "error" && (
          <p className="text-red-500 text-sm mt-4">{state.error?.message || "Login error"}</p>
        )}
      </Modal>
    </>
  );
};