import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { calcPercentageDiscount } from "@/lib/utils";
interface HorizontalProductCardProps {
  product: Product;
}

export const HorizontalProductCard: React.FC<HorizontalProductCardProps> = ({
  product,
}) => {
  const { addItem } = useCart();

  // Check if product is truly out of stock
  const isOutOfStock =
    product.variations.length > 0
      ? product.variations.every((v) => v.stock === 0)
      : product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variations.length > 0) {
      // Se tem variações, vai para página do produto
      return;
    }

    if (isOutOfStock) {
      toast.info("Produto indisponível", {
        description: "Este produto está fora de estoque",
      });
      return;
    }

    addItem({
      productId: product.id,
      quantity: 1,
      product: product,
    });

    toast.success("Produto adicionado!", {
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const discountPercentage =
    product.variations.length > 0
      ? calcPercentageDiscount({
          oldValue: product.variations.sort(
            (a, b) => a.promo_price - b.promo_price
          )[0].price,
          newValue: product.variations.sort(
            (a, b) => a.promo_price - b.promo_price
          )[0].promo_price,
        })
      : product.promo?.percentage_discount || 0;

  const finalPrice =
    product.variations.length > 0
      ? product.variations
          .sort((a, b) => a.promo_price - b.promo_price)
          .filter((variation) => variation.stock > 0)[0].promo_price
      : product.price;
  const withoutDiscountPrice =
    product.variations.length > 0
      ? product.variations
          .sort((a, b) => a.promo_price - b.promo_price)
          .filter((variation) => variation.stock > 0)[0].price
      : product.price;

  const hasPromo = !!product.promo;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-scale-in">
      <Link to={`/product/${product.id}`}>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {/* Product Image */}
            <div className="w-24 min-h-full max-h-full flex-shrink-0 relative overflow-hidden rounded-lg bg-muted">
              {hasPromo && (
                <Badge
                  variant="destructive"
                  className="absolute top-1 left-1 z-10 text-xs animate-bounce-in"
                >
                  -{discountPercentage}%
                </Badge>
              )}

              {product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  Sem imagem
                </div>
              )}

              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div
                  className="absolute inset-0 flex items-center justify-center px-1 animate-fade-in"
                  style={{
                    backgroundImage:
                      product.images.length > 0
                        ? `url(${product.images[0]})`
                        : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/60" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">
                      {product.category}
                    </Badge>
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    {hasPromo && (
                      <span className="text-xs text-muted-foreground line-through block">
                        {formatPrice(withoutDiscountPrice)}
                      </span>
                    )}
                    <span
                      className={`font-bold text-sm ${
                        hasPromo ? "text-destructive" : "text-foreground"
                      }`}
                    >
                      {formatPrice(finalPrice)}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">(4.8)</span>
                </div>

                {product.variations.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {product.variations.length} variações disponíveis
                  </p>
                )}
              </div>

              {/* Add to Cart Button */}
              <div className="mt-3">
                <Button
                  className="w-full transition-all duration-200"
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  {!isOutOfStock && <ShoppingCart className="w-4 h-4 mr-2" />}
                  {isOutOfStock
                    ? "Sem estoque"
                    : product.variations.length > 0
                    ? "Ver Opções"
                    : "Adicionar"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
