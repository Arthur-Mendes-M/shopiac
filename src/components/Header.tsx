import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Search,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/produtos?busca=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const totalItems = getTotalItems();

  const navigationItems = [
    { to: "/produtos", label: "Todos os Produtos" },
    { to: "/uniformes", label: "Uniformes" },
    { to: "/canecas", label: "Canecas" },
    { to: "/acessorios", label: "Acessórios" },
    { to: "/promocoes", label: "Promoções" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <div className="container mx-auto px-4 h-16 flex items-center gap-5 justify-between">
        {/* Logo */}
        <Link to="/" className="animate-fade-in">
          <Logo className="hover:scale-105 transition-transform duration-200" />
        </Link>

        {/* Navigation Links with Categories Dropdown */}
        {/* <nav className="hidden lg:flex items-center space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              >
                Categorias
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="animate-scale-in">
              <DropdownMenuItem onClick={() => navigate('/uniformes')} className="hover:bg-muted transition-colors">
                Uniformes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/canecas')} className="hover:bg-muted transition-colors">
                Canecas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/acessorios')} className="hover:bg-muted transition-colors">
                Acessórios
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/produtos')} className="hover:bg-muted transition-colors">
                Todos os Produtos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link 
            to="/promocoes" 
            className="text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
          >
            Promoções
          </Link>
        </nav> */}

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="flex items-center space-x-6">
            {/* Categorias Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  "flex gap-1 items-center group text-sm font-medium bg-transparent hover:bg-transparent focus:bg-transparent relative",
                  "after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary",
                  "after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                )}
              >
                <span>Categorias</span>
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </NavigationMenuTrigger>

              <NavigationMenuContent className="absolute left-0 top-full mt-2 w-48 rounded-md border bg-background shadow-md p-2">
                <ul className="flex flex-col gap-1">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/uniformes"
                        className="block px-2 py-1 rounded hover:bg-muted"
                      >
                        Uniformes
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/canecas"
                        className="block px-2 py-1 rounded hover:bg-muted"
                      >
                        Canecas
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/acessorios"
                        className="block px-2 py-1 rounded hover:bg-muted"
                      >
                        Acessórios
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li className="border-t my-1" />
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/produtos"
                        className="block px-2 py-1 rounded hover:bg-muted"
                      >
                        Todos os Produtos
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Promoções */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/promocoes"
                  className="text-sm font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  Promoções
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex items-center space-x-2 flex-1 max-w-sm mx-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center space-x-2 gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:scale-110 transition-transform duration-200"
            onClick={() => navigate("/carrinho")}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center animate-bounce-in"
              >
                {totalItems}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          {isAuthenticated ? (
            // <DropdownMenu>
            //   <DropdownMenuTrigger asChild>
            //     <Button
            //       variant="ghost"
            //       size="icon"
            //       className="hover:scale-110 transition-transform duration-200 hidden sm:flex"
            //     >
            //       <User className="h-5 w-5" />
            //     </Button>
            //   </DropdownMenuTrigger>
            //   <DropdownMenuContent align="end" className="animate-scale-in">
            //     <DropdownMenuLabel>Olá, {user?.name}</DropdownMenuLabel>
            //     <DropdownMenuSeparator />
            //     <DropdownMenuItem
            //       onClick={() => navigate("/minha-conta")}
            //       className="hover:bg-muted transition-colors"
            //     >
            //       <User className="mr-2 h-4 w-4" />
            //       Minha Conta
            //     </DropdownMenuItem>
            //     <DropdownMenuItem
            //       onClick={() => navigate("/meus-pedidos")}
            //       className="hover:bg-muted transition-colors"
            //     >
            //       <ShoppingCart className="mr-2 h-4 w-4" />
            //       Meus Pedidos
            //     </DropdownMenuItem>
            //     <DropdownMenuSeparator />
            //     <DropdownMenuItem
            //       onClick={handleLogout}
            //       className="hover:bg-muted transition-colors"
            //     >
            //       <LogOut className="mr-2 h-4 w-4" />
            //       Sair
            //     </DropdownMenuItem>
            //   </DropdownMenuContent>
            // </DropdownMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hover:scale-110 transition-all duration-200 hidden sm:flex relative p-4"
                    >
                      <User className="h-5 w-5" />
                      <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </Button>
                  </NavigationMenuTrigger>

                  {/* Posicionamento absoluto para dropdown */}
                  <NavigationMenuContent className="absolute right-0 top-full mt-1 animate-scale-in min-w-[200px] z-50 bg-popover shadow-lg rounded-md">
                    <div className="flex flex-col p-2">
                      <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                        Olá, {user?.name}
                      </div>
                      <div className="my-1 border-t border-muted" />
                      <NavigationMenuItem asChild>
                        <button
                          onClick={() => navigate("/minha-conta")}
                          className="hover:bg-muted transition-colors flex items-center w-full px-2 py-1 rounded"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Minha Conta
                        </button>
                      </NavigationMenuItem>
                      <NavigationMenuItem asChild>
                        <button
                          onClick={() => navigate("/meus-pedidos")}
                          className="hover:bg-muted transition-colors flex items-center w-full px-2 py-1 rounded"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Meus Pedidos
                        </button>
                      </NavigationMenuItem>
                      <div className="my-1 border-t border-muted" />
                      <NavigationMenuItem asChild>
                        <button
                          onClick={handleLogout}
                          className="hover:bg-muted transition-colors flex items-center w-full px-2 py-1 rounded"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sair
                        </button>
                      </NavigationMenuItem>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="hover:scale-105 transition-transform duration-200"
              >
                Entrar
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/cadastro")}
                className="hover:scale-105 transition-transform duration-200"
              >
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
