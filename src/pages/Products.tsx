import { useState } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProductCard } from '@/components/ProductCard';
import { HorizontalProductCard } from '@/components/HorizontalProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts, useProductsByCategory, usePromoProducts } from '@/hooks/useApi';
import { Filter, Grid, List } from 'lucide-react';

const Products = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Detect category from URL path
  const getCategory = () => {
    if (location.pathname === '/uniformes') return 'Uniforme';
    if (location.pathname === '/canecas') return 'Canecas';
    if (location.pathname === '/acessorios') return 'Acessórios';
    if (location.pathname === '/promocoes') return 'promo';
    return searchParams.get('categoria');
  };

  const category = getCategory();
  const searchTerm = searchParams.get('busca');
  
  const { data: allProducts, isLoading } = useProducts();
  const { data: categoryProducts, isLoading: categoryLoading } = useProductsByCategory(category || '');
  const { data: promoProducts, isLoading: promoLoading } = usePromoProducts();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  
  // Determina quais produtos mostrar
  const products = category ? categoryProducts : allProducts;
  const loading = category ? categoryLoading : isLoading;
  
  // Filtra por busca se houver
  const filteredProducts = products?.filter(product => 
    !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Ordena produtos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.promo?.promo_price || a.price) - (b.promo?.promo_price || b.price);
      case 'price-high':
        return (b.promo?.promo_price || b.price) - (a.promo?.promo_price || a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getPageTitle = () => {
    if (searchTerm) return `Resultados para "${searchTerm}"`;
    if (category) return category;
    return 'Todos os Produtos';
  };

  const categories = [
    { name: 'Todos', value: '', count: allProducts?.length || 0 },
    { name: 'Uniformes', value: 'Uniforme', count: allProducts?.filter(p => p.category === 'Uniforme').length || 0 },
    { name: 'Canecas', value: 'Canecas', count: allProducts?.filter(p => p.category === 'Canecas').length || 0 },
    { name: 'Acessórios', value: 'Acessórios', count: allProducts?.filter(p => p.category === 'Acessórios').length || 0 },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            {sortedProducts.length} produtos encontrados
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </h3>

                {/* Categories */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium">Categorias</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat.value}
                        variant={category === cat.value || (!category && cat.value === '') ? 'default' : 'ghost'}
                        className="w-full justify-between"
                        size="sm"
                        onClick={() => {
                          const params = new URLSearchParams();
                          if (cat.value !== '') {
                            params.set('categoria', cat.value);
                          }
                          const newUrl = `/produtos${params.toString() ? '?' + params.toString() : ''}`;
                          navigate(newUrl);
                        }}
                      >
                        {cat.name}
                        <Badge variant="secondary">{cat.count}</Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-4">
                  <h4 className="font-medium">Ordenar por</h4>
                  <select 
                    className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">Nome A-Z</option>
                    <option value="price-low">Menor Preço</option>
                    <option value="price-high">Maior Preço</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
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
            ) : sortedProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.map((product) => (
                  viewMode === 'grid' ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <HorizontalProductCard key={product.id} product={product} />
                  )
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou fazer uma nova busca
                  </p>
                  <Button onClick={() => window.location.href = '/produtos'}>
                    Ver Todos os Produtos
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;