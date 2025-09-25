import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/produtos?busca=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalItems = getTotalItems();

  const navigationItems = [
    { to: '/produtos', label: 'Todos os Produtos' },
    { to: '/uniformes', label: 'Uniformes' },
    { to: '/canecas', label: 'Canecas' },
    { to: '/acessorios', label: 'Acessórios' },
    { to: '/promocoes', label: 'Promoções' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-4">
              <Logo showText={true} className="animate-fade-in" />
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produtos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <Link 
                    key={item.to}
                    to={item.to} 
                    className="text-sm font-medium hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile User Menu */}
              {isAuthenticated ? (
                <div className="space-y-3 pt-4 border-t">
                  <div className="px-3 py-2">
                    <p className="font-medium">Olá, {user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Link 
                    to="/minha-conta" 
                    className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Minha Conta</span>
                  </Link>
                  <Link 
                    to="/meus-pedidos" 
                    className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Meus Pedidos</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Entrar
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      navigate('/cadastro');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Cadastrar
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="animate-fade-in">
          <Logo className="hover:scale-105 transition-transform duration-200" />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link 
              key={item.to}
              to={item.to} 
              className="text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-2 flex-1 max-w-sm mx-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:scale-110 transition-transform duration-200"
            onClick={() => navigate('/carrinho')}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200 hidden sm:flex">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-scale-in">
                <DropdownMenuLabel>Olá, {user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/minha-conta')} className="hover:bg-muted transition-colors">
                  <User className="mr-2 h-4 w-4" />
                  Minha Conta
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/meus-pedidos')} className="hover:bg-muted transition-colors">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Meus Pedidos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-muted transition-colors">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/login')}
                className="hover:scale-105 transition-transform duration-200"
              >
                Entrar
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate('/cadastro')}
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