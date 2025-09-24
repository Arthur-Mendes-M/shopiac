import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useViaCep } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  MapPin, 
  Truck, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { Address } from '@/types';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: address, 2: shipping, 3: payment
  const [addressData, setAddressData] = useState<Address>({
    zip_code: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ViaCEP integration
  const cepQuery = useViaCep(addressData.zip_code);

  // Mock shipping options
  const shippingOptions = [
    {
      id: '1',
      name: 'Correios PAC',
      price: 15.90,
      days: '5-7 dias úteis',
      type: 'normal'
    },
    {
      id: '2', 
      name: 'Correios SEDEX',
      price: 29.90,
      days: '2-3 dias úteis',
      type: 'express'
    },
    {
      id: '3',
      name: 'Entrega Expressa',
      price: 39.90,
      days: '1-2 dias úteis',
      type: 'express'
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }

    if (items.length === 0) {
      navigate('/carrinho');
      return;
    }
  }, [isAuthenticated, items.length, navigate]);

  // Update address when CEP is found
  useEffect(() => {
    if (cepQuery.data && !cepQuery.error) {
      setAddressData(prev => ({
        ...prev,
        address: cepQuery.data.logradouro,
        neighborhood: cepQuery.data.bairro,
        city: cepQuery.data.localidade,
        state: cepQuery.data.uf
      }));
    }
  }, [cepQuery.data, cepQuery.error]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'zip_code') {
      const cleanValue = value.replace(/\D/g, '');
      const formattedValue = cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
      setAddressData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setAddressData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressSubmit = () => {
    const requiredFields = ['zip_code', 'address', 'number', 'neighborhood', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !addressData[field as keyof Address]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos do endereço",
        variant: "destructive",
      });
      return;
    }

    setStep(2);
  };

  const handleFinishPurchase = async () => {
    if (!selectedShipping) {
      toast({
        title: "Selecione o frete",
        description: "Por favor, escolha uma opção de entrega",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call to create transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock Abacate Pay URL
      const paymentUrl = `https://abacatepay.com/pay/bill_${Math.random().toString(36).substr(2, 9)}`;
      
      toast({
        title: "Pedido criado!",
        description: "Você será redirecionado para o pagamento",
      });

      // Clear cart
      clearCart();
      
      // In a real implementation, redirect to Abacate Pay
      // window.location.href = paymentUrl;
      
      // For demo, show success message
      toast({
        title: "Redirecionamento simulado",
        description: `URL de pagamento: ${paymentUrl}`,
      });
      
      navigate('/pedidos');
      
    } catch (error) {
      toast({
        title: "Erro ao processar pedido",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getTotalPrice();
  const shippingCost = selectedShipping?.price || 0;
  const total = subtotal + shippingCost;

  if (!isAuthenticated || items.length === 0) {
    return null; // Will redirect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Finalizar Compra</h1>
            <p className="text-muted-foreground">Complete os dados para finalizar seu pedido</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/carrinho')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Carrinho
          </Button>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {step > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
            </div>
            <span className="font-medium">Endereço</span>
          </div>
          
          <div className="flex-1 h-px bg-border" />
          
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {step > 2 ? <CheckCircle className="h-4 w-4" /> : '2'}
            </div>
            <span className="font-medium">Frete</span>
          </div>
          
          <div className="flex-1 h-px bg-border" />
          
          <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              3
            </div>
            <span className="font-medium">Pagamento</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">CEP *</Label>
                      <Input
                        id="zip_code"
                        name="zip_code"
                        type="text"
                        placeholder="00000-000"
                        value={addressData.zip_code}
                        onChange={handleAddressChange}
                        maxLength={9}
                        required
                      />
                      {cepQuery.isLoading && (
                        <p className="text-xs text-muted-foreground">Buscando CEP...</p>
                      )}
                      {cepQuery.error && (
                        <p className="text-xs text-destructive">CEP não encontrado</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Logradouro *</Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Rua, Avenida..."
                        value={addressData.address}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="number">Número *</Label>
                        <Input
                          id="number"
                          name="number"
                          type="text"
                          placeholder="123"
                          value={addressData.number}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          name="complement"
                          type="text"
                          placeholder="Apto, Bloco..."
                          value={addressData.complement}
                          onChange={handleAddressChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro *</Label>
                      <Input
                        id="neighborhood"
                        name="neighborhood"
                        type="text"
                        placeholder="Nome do bairro"
                        value={addressData.neighborhood}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          placeholder="Cidade"
                          value={addressData.city}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Estado *</Label>
                        <Input
                          id="state"
                          name="state"
                          type="text"
                          placeholder="SP"
                          value={addressData.state}
                          onChange={handleAddressChange}
                          maxLength={2}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleAddressSubmit} className="w-full" size="lg">
                    Continuar para Frete
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Opções de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedShipping?.id === option.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedShipping(option)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedShipping?.id === option.id
                              ? 'border-primary bg-primary'
                              : 'border-border'
                          }`} />
                          <div>
                            <p className="font-medium">{option.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{option.days}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(option.price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Voltar
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1" disabled={!selectedShipping}>
                      Continuar para Pagamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Finalizar Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <p className="font-medium text-blue-900">Pagamento via Abacate Pay</p>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Você será redirecionado para uma página segura para finalizar o pagamento
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frete ({selectedShipping?.name}):</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Voltar
                    </Button>
                    <Button 
                      onClick={handleFinishPurchase} 
                      className="flex-1" 
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Processando...
                        </div>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Finalizar Compra
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => {
                    const itemPrice = item.product.promo?.promo_price || item.product.price;
                    const variationPrice = item.variation?.price || itemPrice;
                    const totalItemPrice = variationPrice * item.quantity;

                    return (
                      <div key={`${item.productId}-${item.variationId || 'no-variation'}`} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          {item.variation && (
                            <p className="text-muted-foreground text-xs">
                              Tam: {item.variation.name}
                            </p>
                          )}
                          <p className="text-muted-foreground text-xs">
                            Qtd: {item.quantity}
                          </p>
                        </div>
                        <span>{formatPrice(totalItemPrice)}</span>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {selectedShipping && (
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {/* Security badges */}
                <div className="space-y-2 pt-4">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Entrega garantida</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;