import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variations.length > 0) {
      // Se tem variações, vai para página do produto
      return;
    }

    if (product.stock === 0) {
      toast({
        title: "Produto indisponível",
        description: "Este produto está fora de estoque",
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      quantity: 1,
      product: product,
    });

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const discountPercentage = product.promo?.percentage_discount || 0;
  const finalPrice = product.promo?.promo_price || product.price;
  const hasPromo = !!product.promo;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-scale-in hover:scale-[1.02]">
      <Link to={`/produto/${product.id}`}>
        <CardContent className="p-4">
          {/* Product Image */}
          <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-muted">
            {hasPromo && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 left-2 z-10 animate-bounce-in"
              >
                -{discountPercentage}%
              </Badge>
            )}
            
            {product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Sem imagem
              </div>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-fade-in">
                <Badge variant="secondary">Fora de Estoque</Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs transition-all duration-200 hover:scale-105">
              {product.category}
            </Badge>
            
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-all duration-300">
              {product.name}
            </h3>
            
            {/* Rating placeholder */}
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 fill-current text-yellow-400 hover:scale-125 transition-transform duration-200" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">(4.8)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              {hasPromo && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className={`font-bold transition-all duration-200 ${hasPromo ? 'text-destructive animate-bounce' : 'text-foreground'}`}>
                {formatPrice(finalPrice)}
              </span>
            </div>

            {product.variations.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {product.variations.length} variações disponíveis
              </p>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full hover:scale-105 transition-all duration-200"
          size="sm"
          onClick={handleAddToCart}
          disabled={product.stock === 0 && product.variations.length === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-bounce" />
          {product.variations.length > 0 ? 'Ver Opções' : 'Adicionar'}
        </Button>
      </CardFooter>
    </Card>
  );
};