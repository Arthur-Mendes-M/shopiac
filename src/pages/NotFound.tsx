import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft, Activity, Users, Trophy, Target } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="container max-w-4xl mx-auto">
        <Card className="overflow-hidden border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 min-h-[600px]">
              {/* Left Side - 404 Design */}
              <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 lg:p-12 flex flex-col justify-center">
                {/* Football Field Pattern Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="h-full w-full relative">
                    {/* Goal Area */}
                    <div className="absolute top-1/2 left-4 w-16 h-32 border-2 border-primary/30 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-4 w-16 h-32 border-2 border-primary/30 -translate-y-1/2"></div>
                    
                    {/* Center Circle */}
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-primary/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    
                    {/* Field Lines */}
                    <div className="absolute top-0 left-1/2 w-px h-full bg-primary/20 -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-primary/20 -translate-y-1/2"></div>
                  </div>
                </div>

                <div className="relative z-10 text-center lg:text-left">
                  {/* 404 with Sports Icons */}
                  <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                    <div className="relative">
                      <span className="text-8xl lg:text-9xl font-black text-primary opacity-20">4</span>
                      <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-primary" />
                    </div>
                    <div className="relative">
                      <span className="text-8xl lg:text-9xl font-black text-primary opacity-20">0</span>
                      <Target className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-primary" />
                    </div>
                    <div className="relative">
                      <span className="text-8xl lg:text-9xl font-black text-primary opacity-20">4</span>
                      <Trophy className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-primary" />
                    </div>
                  </div>

                  <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                    Página fora de jogo!
                  </h1>
                  
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Parece que você tentou um drible que não deu certo. A página que você está procurando 
                    não foi encontrada em nosso campo.
                  </p>

                  {/* Sports-themed suggestions */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Talvez você queira conhecer nossos produtos oficiais</span>
                    </div>
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <Activity className="h-5 w-5 text-primary" />
                      <span>Ou ver as últimas novidades do nosso clube</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-muted/30 to-background">
                <div className="space-y-6">
                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      Vamos voltar ao jogo?
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Escolha uma das opções abaixo para continuar navegando na Shop IAC:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button asChild className="w-full h-12 text-base font-medium" size="lg">
                      <Link to="/">
                        <Home className="mr-3 h-5 w-5" />
                        Ir para a Home
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="w-full h-12 text-base font-medium" size="lg">
                      <Link to="/produtos">
                        <Search className="mr-3 h-5 w-5" />
                        Ver Produtos
                      </Link>
                    </Button>

                    <Button 
                      variant="ghost" 
                      className="w-full h-12 text-base font-medium hover:bg-muted/50" 
                      size="lg"
                      onClick={() => window.history.back()}
                    >
                      <ArrowLeft className="mr-3 h-5 w-5" />
                      Voltar à página anterior
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <div className="text-center text-sm text-muted-foreground">
                      <p>Erro reportado automaticamente</p>
                      <p className="mt-1">URL: {location.pathname}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-semibold">Produtos Oficiais</span>
              </div>
              <p className="text-sm text-muted-foreground">Camisas, acessórios e muito mais</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">Torcida IAC</span>
              </div>
              <p className="text-sm text-muted-foreground">Faça parte da nossa família</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="font-semibold">Entrega Rápida</span>
              </div>
              <p className="text-sm text-muted-foreground">Receba em casa com segurança</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;