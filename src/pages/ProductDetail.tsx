import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProductById } from "@/hooks/useApi";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import parse from "html-react-parser";
import { toast } from "sonner";
import { calcPercentageDiscount } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProductById(id!);
  const { addItem } = useCart();

  const [selectedVariation, setSelectedVariation] = useState<string | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Produto não encontrado
              </h2>
              <p className="text-muted-foreground mb-4">
                O produto que você está procurando não existe ou foi removido.
              </p>
              <Button asChild>
                <Link to="/products">Ver Todos os Produtos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const hasPromo = !!product.promo;
  const selectedVar = selectedVariation
    ? product.variations.find((v) => v.id === selectedVariation)
    : null;

  const cheaperVariation = product.variations
  .sort((a, b) => a.promo_price - b.promo_price)
  .filter((variation) => variation.stock > 0)
  .filter((variation) => variation.stock > 0)[0]

  const oldPrice = product.variations.length > 0 ? product.variations.find((variation) => variation.id == (selectedVar?.id || cheaperVariation.id)).price : product.price;
  const currentPrice = product.variations.length > 0 ? product.variations.find((variation) => variation.id == (selectedVar?.id || cheaperVariation.id)).promo_price : product?.promo.promo_price;


  const isInStock = selectedVar ? selectedVar.stock > 0 : product.stock > 0;
  const maxAvailableStock = selectedVar ? selectedVar.stock : product.stock;

  const handleAddToCart = () => {
    if (product.variations.length > 0 && !selectedVariation) {
      toast.info("Selecione uma variação", {
        description: "Por favor, escolha o tamanho desejado",
      });
      return;
    }

    if (!isInStock) {
      toast.info("Produto indisponível", {
        description: `Este produto ${
          selectedVar && `na variação ${selectedVar.name}`
        } está fora de estoque`,
      });
      return;
    }

    addItem({
      productId: product.id,
      variationId: selectedVariation || undefined,
      quantity: quantity,
      product: product,
      variation: selectedVar || undefined,
    });

    toast.success("Produto adicionado!", {
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  const features = [
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
      icon: RotateCcw,
      title: "Troca Grátis",
      description: "Até 30 dias para trocar",
    },
  ];

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

  return (
    <Layout>
      <div className="relative container mx-auto px-4 py-8 overflow-hidden">
        {/* Decorative elements */}
        <div
          className="sport-bg-line"
          style={{ top: "5%", left: "0", width: "100%", height: "2px" }}
        />
        <div
          className="sport-bg-circle"
          style={{ top: "25%", right: "3%", width: "320px", height: "320px" }}
        />
        <div
          className="sport-bg-abstract"
          style={{
            bottom: "15%",
            left: "10%",
            width: "200px",
            height: "200px",
            borderRadius: "40% 60% 60% 40% / 50% 50% 50% 50%",
          }}
        />
        <div
          className="sport-bg-line"
          style={{ bottom: "35%", right: "0", width: "70%", height: "2px" }}
        />
        <div
          className="sport-bg-circle"
          style={{ bottom: "5%", left: "5%", width: "260px", height: "260px" }}
        />

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">
            Produtos
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Produtos
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
              {hasPromo && (
                <Badge
                  variant="destructive"
                  className="absolute top-4 left-4 z-10"
                >
                  -{discountPercentage}%
                </Badge>
              )}
              {product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Sem imagem
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-current text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (4.8 • 124 avaliações)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                {hasPromo && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(oldPrice)}
                  </span>
                )}
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(currentPrice)}
                </span>
              </div>

              {/* {hasPromo && (
                <p className="text-sm text-green-600 font-medium">
                  Você economiza {formatPrice(product.price - currentPrice)}
                </p>
              )} */}
            </div>

            <Separator />

            {/* Variations */}
            {product.variations.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Tamanho</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((variation) => (
                    <Button
                      key={variation.id}
                      variant={
                        selectedVariation === variation.id
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedVariation(variation.id)}
                      disabled={variation.stock === 0}
                      className="min-w-[60px]"
                    >
                      {variation.name}
                      {variation.stock === 0 && (
                        <span className="ml-1 text-xs">(Esgotado)</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quantidade</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={quantity >= maxAvailableStock}
                  onClick={() =>
                    quantity < maxAvailableStock && setQuantity(quantity + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <span className="text-sm text-accent block">{`Estoque disponível: ${maxAvailableStock} unidades`}</span>
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.variations.length > 0
                  ? selectedVar
                    ? !isInStock
                      ? `Variação ${selectedVar.name} fora de estoque`
                      : "Adicionar ao carrinho"
                    : "Selecione uma variação"
                  : isInStock
                  ? "Adicionar ao Carrinho"
                  : "Fora de estoque"}
              </Button>
              {/* isInStock ? 'Adicionar ao Carrinho' : `${selectedVar ? `Variação ${selectedVar.name} fora de estoque` : "Fora de estoque"}` */}

              <Button variant="outline" size="lg" className="w-full" disabled>
                <Heart className="mr-2 h-4 w-4" />
                Adicionar aos Favoritos (em breve)
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-3 p-4 bg-muted/30 rounded-lg">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-4">
              <h3 className="font-semibold">Descrição</h3>
              {/* <p className="text-muted-foreground leading-relaxed">
                {product.description || 'Produto de alta qualidade para você torcer com estilo.'}
              </p> */}

              <div>
                {parse(
                  product.description ||
                    "<p>Produto de alta qualidade para você torcer com estilo.</p>"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
