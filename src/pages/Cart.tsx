import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  ArrowLeft,
  Lock,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number, variationId?: string) => {
    updateQuantity(productId, newQuantity, variationId);
  };

  const handleRemoveItem = (productId: string, variationId?: string) => {
    removeItem(productId, variationId);
    toast.success("Item removido",{
      description: "O produto foi removido do seu carrinho",
    });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Login necessário",{
        description: "Você precisa fazer login para finalizar a compra",
      });
      navigate('/login?redirect=checkout');
      return;
    }
    navigate('/checkout');
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shipping = totalPrice >= 199 ? 0 : 15.90;
  const finalTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
              <p className="text-muted-foreground mb-6">
                Que tal explorar nossos produtos e encontrar algo especial?
              </p>
              <Button size="lg" asChild>
                <Link to="/products">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ir às Compras
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative container mx-auto px-4 py-8 overflow-hidden">
        {/* Decorative elements
        <div className="sport-bg-line" style={{ top: '10%', left: '0', width: '100%', height: '2px' }} />
        <div className="sport-bg-circle" style={{ top: '30%', right: '8%', width: '280px', height: '280px' }} />
        <div className="sport-bg-abstract" style={{ bottom: '20%', left: '5%', width: '170px', height: '170px', borderRadius: '50% 50% 30% 70% / 40% 60% 40% 60%' }} />
        <div className="sport-bg-line" style={{ bottom: '40%', right: '0', width: '60%', height: '2px' }} /> */}
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Meu Carrinho</h1>
            <p className="text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'item' : 'itens'} no seu carrinho
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continuar Comprando
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemPrice = item.product.promo?.promo_price || item.product.price;
              const variationPrice = item.variation?.price || itemPrice;
              const totalItemPrice = variationPrice * item.quantity;

              return (
                <Card key={`${item.productId}-${item.variationId || 'no-variation'}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
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

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">
                              <Link 
                                to={`/product/${item.product.id}`}
                                className="hover:text-primary transition-colors"
                              >
                                {item.product.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.product.category}
                              {item.variation && ` • Tamanho: ${item.variation.name}`}
                            </p>
                            
                            <div className="flex items-center space-x-2 mt-2">
                              {item.product.promo && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(item.product.price)}
                                </span>
                              )}
                              <span className="font-semibold text-primary">
                                {formatPrice(variationPrice)}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.productId, item.variationId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.variationId)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.variationId)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold">{formatPrice(totalItemPrice)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  clearCart();
                  toast("Carrinho limpo", {
                    description: "Todos os itens foram removidos do carrinho",
                  });
                }}
              >
                Limpar Carrinho
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} itens)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Grátis' : formatPrice(shipping)}
                  </span>
                </div>

                {shipping === 0 && totalPrice < 199 && (
                  <p className="text-sm text-green-600">
                    🎉 Você ganhou frete grátis!
                  </p>
                )}

                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Adicione mais {formatPrice(199 - totalPrice)} para ganhar frete grátis
                  </p>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    {isAuthenticated ? (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Finalizar Compra
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Fazer Login para Comprar
                      </>
                    )}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-xs text-center text-muted-foreground">
                      É necessário fazer login para finalizar a compra
                    </p>
                  )}
                </div>

                {/* Security Info */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">Compra 100% segura</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Seus dados estão protegidos
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;