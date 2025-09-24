import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { useProducts, usePromoProducts } from '@/hooks/useApi';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield, HeadphonesIcon } from 'lucide-react';

const Index = () => {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: promoProducts, isLoading: promoLoading } = usePromoProducts();

  const featuredProducts = products?.slice(0, 4) || [];
  const categories = [
    {
      name: 'Uniformes',
      description: 'Camisas, shorts e kits completos',
      image: 'https://images.unsplash.com/photo-1577212017184-80cc0da11082?w=400&h=300&fit=crop',
      link: '/uniformes'
    },
    {
      name: 'Canecas',
      description: 'Canecas térmicas e personalizadas',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
      link: '/canecas'
    },
    {
      name: 'Acessórios',
      description: 'Bandeiras, chaveiros e muito mais',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      link: '/acessorios'
    }
  ];

  const benefits = [
    {
      icon: Truck,
      title: 'Frete Grátis',
      description: 'Em compras acima de R$ 199'
    },
    {
      icon: Shield,
      title: 'Compra Segura',
      description: 'Seus dados protegidos'
    },
    {
      icon: HeadphonesIcon,
      title: 'Atendimento',
      description: 'Suporte especializado'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit">
                  ⚽ Loja Oficial
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Vista as Cores do Seu Time
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Uniformes oficiais, acessórios exclusivos e produtos personalizados para você torcer com estilo.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90" asChild>
                  <Link to="/produtos">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Ver Produtos
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
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
                        <p className="text-xs text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <img
                  src="https://images.unsplash.com/photo-1577212017184-80cc0da11082?w=600&h=600&fit=crop"
                  alt="Uniformes esportivos"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Nossas Categorias</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra nossa seleção completa de produtos esportivos para todos os gostos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.description}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link to={category.link}>
                      Ver Categoria
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
              <p className="text-muted-foreground">Os mais vendidos da semana</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/produtos">
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4" />
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
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <CardContent className="p-12 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <Badge variant="secondary" className="mb-4">
                  🔥 Oferta Limitada
                </Badge>
                <h2 className="text-4xl font-bold">
                  Até 50% OFF em Produtos Selecionados
                </h2>
                <p className="text-xl opacity-90">
                  Aproveite nossa mega promoção e garante os melhores produtos com descontos imperdíveis
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/promocoes">
                    Ver Promoções
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
