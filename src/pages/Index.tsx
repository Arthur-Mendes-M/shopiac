import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, usePromoProducts } from "@/hooks/useApi";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  HeadphonesIcon,
  SearchX,
  Flame,
  Zap,
} from "lucide-react";
import SponsorsInfiniteCarousel from "@/components/sponsorsCarousel";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ThemeProvider";

const Index = () => {
  const { theme } = useTheme();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: promoProducts, isLoading: promoLoading } = usePromoProducts();

  const featuredProducts = products?.slice(0, 4) || [];
  const categories = [
    {
      name: "Uniformes",
      description: "Camisas, shorts e kits completos",
      // image: 'https://images.unsplash.com/photo-1577212017184-80cc0da11082?w=400&h=300&fit=crop',
      image: "/bone.png",
      link: "/uniformes",
    },
    {
      name: "Canecas",
      description: "Canecas térmicas e personalizadas",
      // image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
      image: "/caneca.png",
      link: "/canecas",
    },
    {
      name: "Acessórios",
      description: "Bandeiras, chaveiros e muito mais",
      // image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      image: "/caderno.png",
      link: "/acessorios",
    },
  ];

  const benefits = [
    {
      icon: Truck,
      title: "Frete Grátis",
      description: "Em compras acima de R$ 199",
    },
    {
      icon: Shield,
      title: "Compra Segura",
      description: "Seus dados protegidos",
    },
    {
      icon: HeadphonesIcon,
      title: "Atendimento",
      description: "Suporte especializado",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/50 via-background to-accent/10 animate-fade-in">
        {/* Decorative elements */}
        <div className="sport-bg-line" style={{ top: '10%', left: '0', width: '100%', height: '2px' }} />
        <div className="sport-bg-line" style={{ top: '60%', left: '0', width: '100%', height: '1px', opacity: 0.5 }} />
        <div className="sport-bg-circle" style={{ top: '20%', right: '10%', width: '300px', height: '300px' }} />
        <div className="sport-bg-circle" style={{ bottom: '10%', left: '5%', width: '200px', height: '200px' }} />
        <div className="sport-bg-abstract" style={{ top: '30%', right: '5%', width: '150px', height: '150px', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }} />
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit animate-bounce-in">
                  ⚽ Loja Oficial
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-scale-in">
                  Vista as Cores do Seu Time
                </h1>
                <p
                  className="text-xl text-muted-foreground max-w-lg animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  Uniformes oficiais, acessórios exclusivos e produtos
                  personalizados para você torcer com estilo.
                </p>
              </div>

              <div
                className="flex flex-col sm:flex-row gap-4 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link to="/products">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Ver Produtos
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link to="/promocoes">
                    Ver Promoções
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{benefit.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 hover:scale-105 transition-transform duration-500">
                <img
                  src={
                    theme === "dark"
                      ? "/hero-image.png"
                      : "/hero_light_image.png"
                  }
                  alt="Uniformes esportivos"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-20 animate-fade-in overflow-hidden">
        {/* Decorative elements */}
        <div className="sport-bg-line" style={{ top: '30%', left: '0', width: '60%', height: '1px', opacity: 0.3 }} />
        <div className="sport-bg-abstract" style={{ bottom: '20%', right: '10%', width: '100px', height: '100px', borderRadius: '50% 50% 30% 70% / 60% 40% 60% 40%' }} />
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12 animate-scale-in">
            <h2 className="text-3xl font-bold">Nossas Categorias</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra nossa seleção completa de produtos esportivos para todos
              os gostos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-scale-in hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white animate-slide-in-left">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-white/80">
                      {category.description}
                    </p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                    asChild
                  >
                    <Link to={category.link}>
                      Ver Categoria
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Products */}
      <section className="relative py-20 bg-muted/30 animate-fade-in overflow-hidden" id="destaques">
        {/* Decorative elements */}
        <div className="sport-bg-circle" style={{ top: '10%', left: '5%', width: '250px', height: '250px' }} />
        <div className="sport-bg-line" style={{ top: '50%', left: '0', width: '100%', height: '1px', opacity: 0.2 }} />
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12 animate-slide-in-left">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                {" "}
                <Flame className="w-8 h-8 text-primary" /> Produtos em promoção
              </h2>
              <p className="text-muted-foreground">
                Produtos que estão no precinho pra você levar hoje!
              </p>
            </div>
            <Button
              variant="outline"
              className="hover:scale-105 transition-all duration-200"
              asChild
            >
              <Link to="/promocoes">
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4 hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {promoLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-t-lg" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promoProducts.length > 0 ? (
                promoProducts.slice(0, 4).map((product, index) => (
                  <div
                    key={product.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-5 min-h-[30vh] col-span-full text-xs opacity-80">
                  <SearchX className="w-12 h-12 animate-magnifier" />
                  <span className="px-2 text-xl text-muted-foreground">
                    Nenhum produto em promoção por enquanto... Volte mais tarde!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-20 animate-fade-in">
        <div className="container group relative mx-auto px-4">
          <Card className="relative overflow-hidden full-red-gradient text-primary-foreground animate-scale-in hover:scale-[1.02] transition-all duration-500">
            <CardContent className="p-12 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <Badge variant="secondary" className="mb-4 animate-bounce-in">
                  🔥 Oferta Limitada
                </Badge>
                <h2 className="text-4xl font-bold animate-slide-in-left">
                  Até 50% OFF em Produtos Selecionados
                </h2>
                <p
                  className="text-xl opacity-90 animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  Aproveite nossa mega promoção e garante os melhores produtos
                  com descontos imperdíveis
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="hover:scale-110 transition-all duration-300 animate-bounce-in hover:bg-foreground"
                  style={{ animationDelay: "0.4s" }}
                  asChild
                >
                  <Link to="/promocoes">
                    Ver Promoções
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CardContent>

            <div className="text-sm opacity-65 absolute bottom-2 left-2">
              <span>* Válido por tempo limitado</span>
            </div>
          </Card>

          {/* <img src="/ball.png" className="group-hover:scale-[1.02] size-[80px] object-cover duration-500 transition-all absolute -bottom-4 -left-4 group-hover:-translate-x-8 group-hover:translate-y-8 " /> */}

          <img
            src="/ball.png"
            className="group-hover:scale-[1.3] scale-[1.02] size-[50px] md:size-[100px] object-cover duration-500 transition-all absolute bottom-4 right-6 group-hover:translate-x-8 group-hover:translate-y-8 "
          />

          <img
            src="/ball.png"
            className="group-hover:scale-[1.3] size-[65px] md:size-[120px] object-cover duration-500 transition-all absolute -top-4 -left-4 group-hover:-translate-x-8 group-hover:-translate-y-8 "
          />

          <img
            src="/ball.png"
            className="group-hover:scale-[1.3] size-[80px] md:size-[150px] object-cover duration-500 transition-all absolute top-0 -right-4 group-hover:translate-x-8 group-hover:-translate-y-8 "
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative py-20 bg-muted/30 animate-fade-in overflow-hidden" id="destaques">
        {/* Decorative elements */}
        <div className="sport-bg-circle" style={{ bottom: '15%', right: '5%', width: '220px', height: '220px' }} />
        <div className="sport-bg-abstract" style={{ top: '25%', left: '8%', width: '120px', height: '120px', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12 animate-slide-in-left">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold  flex items-center gap-2">
                <Zap className="w-8 h-8 text-primary" /> Produtos em Destaque
              </h2>
              <p className="text-muted-foreground">
                Os mais vendidos da semana
              </p>
            </div>
            <Button
              variant="outline"
              className="hover:scale-105 transition-all duration-200"
              asChild
            >
              <Link to="/products">
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4 hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-t-lg" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-5 min-h-[30vh] col-span-full text-xs opacity-80">
                  <SearchX className="w-12 h-12 animate-magnifier" />
                  <span className="px-2 text-xl text-muted-foreground">
                    Nenhum produto em destaque por enquanto... Volte mais tarde!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Sponsors Carousel */}
      <section className="container animate-fade-in w-full bg-gradient-background py-20 mx-auto">
        <SponsorsInfiniteCarousel />
      </section>
    </Layout>
  );
};

export default Index;
