/**
 * Navbar Component
 * 
 * This component renders the application's top navigation bar with the following features:
 * - Logo display on the left side
 * - Application title in the center
 * - Authentication controls on the right side using Clerk
 */
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-2 bg-white shadow-md">
      {/* Left section - Logo */}
      <div className="flex items-center space-x-4">
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-8 w-12"
        />
      </div>
      
      {/* Center section - Application title */}
      <h1 className="text-xl font-semibold">Data Viewer</h1>

      {/* Right section - Authentication controls */}
      <div className="flex items-center space-x-4 ">
        {/* Show sign-in button when user is not authenticated */}
        <SignedOut>
          <Button>
            <SignInButton />
          </Button>
        </SignedOut>
        
        {/* Show user profile button when user is authenticated */}
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