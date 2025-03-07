import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-2 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-8 w-12"
        />
      </div>
      {/* Title */}
      <h1 className="text-xl font-semibold">Data Viewer</h1>

      {/* Clerk Authentication */}
      <div className="flex items-center space-x-4 ">
        <SignedOut>
          <Button>
            <SignInButton />
          </Button>
        </SignedOut>
        <div className="cursor-pointer">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

    </nav>
  );
};

export default Navbar; 