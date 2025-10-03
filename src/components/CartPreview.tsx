import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ArrowRight, X, Plus, Minus } from 'lucide-react';
import { SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';

export const CartPreview = ({ onClose }: { onClose: () => void }) => {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Carrinho vazio</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Adicione produtos para começar suas compras
          </p>
          <Button asChild onClick={onClose}>
            <Link to="/products">Explorar Produtos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader>
        <SheetTitle>Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4">
          {items.map((item) => {
            const itemPrice = item.product.promo?.promo_price || item.product.price;
            const variationPrice = item.variation?.price || itemPrice;
            const totalItemPrice = variationPrice * item.quantity;

            return (
              <div key={`${item.productId}-${item.variationId || 'no-variation'}`} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                    {item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        Sem imagem
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 -mt-1"
                      onClick={() => removeItem(item.productId, item.variationId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {item.variation && (
                    <p className="text-xs text-muted-foreground mb-1">
                      Tamanho: {item.variation.name}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variationId)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variationId)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {formatPrice(totalItemPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Separator className="my-4" />

      <SheetFooter className="flex-col space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full" size="lg" onClick={onClose}>
            <Link to="/cart">
              Ver Detalhes do Carrinho
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full" onClick={onClose}>
            <Link to="/products">Continuar Comprando</Link>
          </Button>
        </div>
      </SheetFooter>
    </div>
  );
};
