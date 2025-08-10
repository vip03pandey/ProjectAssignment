import { useNavigate } from "react-router";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../ui/resizable-navbar";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function NavbarDemo() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  
 
  const getDashboardLink = () => {
    if (user?.role === 'provider') {
      return '/service-provider';
    }
    return '/dashboard';
  };

  const navItems = [
    {
      name: "About Us",
      link: "#features",
    },
    {
      name: "Contact Us",
      link: "#pricing",
    },
    {
      name: "Dashboard",
      link: getDashboardLink()
    }
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="relative w-full">
      <Navbar className="!bg-white !text-1xl !text-blaxck">
        <NavBody className="!text-black">
          <NavbarLogo />
          <NavItems items={navItems} className="!text-black !hover:text-white" />
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-black">Hello, {user.name}</span>
                <NavbarButton 
                  variant="secondary" 
                  className="!bg-red-600 !text-white hover:!bg-red-700" 
                  onClick={handleLogout}
                >
                  Logout
                </NavbarButton>
              </div>
            ) : (
              <NavbarButton 
                variant="secondary" 
                className="!bg-black !text-white" 
                onClick={() => navigate("/signin")}
              >
                Login
              </NavbarButton>
            )}
          </div>
        </NavBody>

   
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300">
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {loading ? (
                <div className="text-sm text-gray-500 text-center">Loading...</div>
              ) : user ? (
                <>
                  <div className="text-center text-sm font-medium text-black">Hello, {user.name}</div>
                  <NavbarButton
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="primary"
                    className="w-full !bg-red-600 !text-white">
                    Logout
                  </NavbarButton>
                </>
              ) : (
                <>
                  <NavbarButton
                    onClick={() => {
                      navigate("/signin");
                      setIsMobileMenuOpen(false);
                    }}
                    variant="primary"
                    className="w-full">
                    Login
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => {
                      navigate("/signup");
                      setIsMobileMenuOpen(false);
                    }}
                    variant="primary"
                    className="w-full">
                    Sign Up
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {/* Navbar */}
    </div>
  );
}
