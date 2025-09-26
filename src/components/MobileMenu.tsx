import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Home, Package, Coffee, Zap, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export const MobileMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/produtos?busca=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { to: '/', label: 'Início', icon: Home },
    { to: '/produtos', label: 'Todos os Produtos', icon: Package },
    { to: '/uniformes', label: 'Uniformes', icon: Package },
    { to: '/canecas', label: 'Canecas', icon: Coffee },
    { to: '/acessorios', label: 'Acessórios', icon: Package },
    { to: '/promocoes', label: 'Promoções', icon: Zap }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t animate-slide-in-bottom">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Navigation Icons */}
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="flex flex-col items-center space-y-1 p-2 rounded-md hover:bg-muted transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Início</span>
          </Link>
          
          <Link 
            to="/produtos" 
            className="flex flex-col items-center space-y-1 p-2 rounded-md hover:bg-muted transition-colors"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs">Produtos</span>
          </Link>
          
          <Link 
            to="/promocoes" 
            className="flex flex-col items-center space-y-1 p-2 rounded-md hover:bg-muted transition-colors"
          >
            <Zap className="h-5 w-5" />
            <span className="text-xs">Promoções</span>
          </Link>
        </div>

        {/* Right Side - Menu Trigger */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger className='p-2'>
            {/* <Button variant="ghost" className="border text-2xl hover:scale-110 transition-transform duration-200"> */}
              <EllipsisVertical className="h-7 w-7 stroke-[1.5px]" />
            {/* </Button> */}
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-4">
              <Logo showText={true} className="animate-fade-in" />
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produtos..."
                    autoFocus={false}
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
                    className="flex items-center space-x-3 text-sm font-medium hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
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
                    onClick={handleLogout}
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
      </div>
    </div>
  );
};