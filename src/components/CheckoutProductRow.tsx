import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface CheckoutProductRowProps {
  cartItem: CartItem;
  currentStep: number;
  // opcional: permitir mostrar controles desabilitados (somente leitura)
  readOnly?: boolean;
}

export const CheckoutProductRow: React.FC<CheckoutProductRowProps> = ({
  cartItem,
  readOnly = false,
  currentStep,
}) => {
  const { updateQuantity, removeItem } = useCart();

  const { product, variation, quantity } = cartItem;

  // Discount from product promo (percentage). If a variation exists we apply percentage discount to variation.price
  const discountPercentage = product.promo?.percentage_discount ?? 0;

  const unitPrice = variation
    ? discountPercentage > 0
      ? +(variation.price * (1 - discountPercentage / 100)).toFixed(2)
      : variation.price
    : product.promo?.promo_price ?? product.price;

  const totalPrice = unitPrice * quantity;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (readOnly) return;

    const next = Math.max(1, quantity - 1);
    updateQuantity(cartItem.productId, next, cartItem.variationId);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (readOnly) return;

    const next = quantity + 1;

    // calcula estoque máximo relevante
    const maxStock = variation
      ? variation.stock ?? 0
      : product.variations && product.variations.length > 0
      ? product.variations.reduce((acc, v) => acc + (v.stock ?? 0), 0)
      : product.stock ?? Infinity;

    if (next > maxStock) return;

    updateQuantity(cartItem.productId, next, cartItem.variationId);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeItem(cartItem.productId, cartItem.variationId);
  };

  const isOutOfStock = variation
    ? (variation.stock ?? 0) === 0
    : product.variations && product.variations.length > 0
    ? product.variations.every((v) => (v.stock ?? 0) === 0)
    : (product.stock ?? 0) === 0;

  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <div className="flex items-center gap-4">
          <div className="w-20 relative h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                Sem imagem
              </div>
            )}

            {discountPercentage > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-1 left-1 text-xs"
              >
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          <div className="flex-1 flex justify-between items-start gap-2 min-h-full">
            <div className="flex flex-col justify-between min-h-full">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium line-clamp-2">
                    {product.name}
                  </h4>
                  {variation && (
                    <div className="text-xs text-muted-foreground">
                      {variation.name}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "text-sm mt-2 flex items-center gap-2 min-w-fit",
                  (readOnly || currentStep >= 2) && "opacity-50"
                )}
              >
                <div className="flex items-center border rounded-md overflow-hidden">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDecrease}
                    disabled={currentStep >= 2}
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="px-3 py-1 text-sm">{quantity}</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleIncrease}
                    disabled={currentStep >= 2}
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRemove}
                  disabled={currentStep >= 2}
                  aria-label="Remover do carrinho"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="text-right h-full">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-semibold text-md">
                {formatPrice(totalPrice)}
              </div>
              <div className="text-xs">{formatPrice(unitPrice)} un.</div>
            </div>
          </div>
        </div>

        {isOutOfStock && (
          <div className="mt-3 text-sm text-destructive">
            Produto sem estoque suficiente
          </div>
        )}
      </CardContent>
    </Card>
  );
};
