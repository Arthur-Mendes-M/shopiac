import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/hooks/useApi";
import { Package, Truck, CheckCircle, Clock, Eye } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { OrderStatusMapper, Order } from "@/types";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MyOrders = () => {
  const [searchParams] = useSearchParams();
  const { data: orders, isLoading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filterBy, setFilterBy] = useState<
    keyof typeof OrderStatusMapper | "Todos"
  >("Todos");

  useEffect(() => {
    if(!orders) return
    
    const lookingForNewestOrder = searchParams.get("order");
    const foundOrder = [...orders].sort((a, b) => Number(b.numero) - Number(a.numero))[0]

    if (!lookingForNewestOrder) {
      return;
    }

    setSelectedOrder(foundOrder);
    setSheetOpen(true);
  }, [orders, isLoading]);

  const getStatusIcon = (status: keyof typeof OrderStatusMapper) => {
    switch (status) {
      case "Em aberto":
        return <Clock className="h-4 w-4" />;
      case "Aprovado":
        return <Package className="h-4 w-4" />;
      case "Pronto para envio":
        return <Truck className="h-4 w-4" />;
      case "Entregue":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em aberto":
        return "secondary";
      case "Processando":
        return "default";
      case "Enviado":
        return "default";
      case "Entregue":
        return "default";
      default:
        return "secondary";
    }
  };

  const sortedOrders = orders
    ? [...orders].sort((a, b) => Number(b.numero) - Number(a.numero))
    : [];

  const filteredOrders =
    filterBy !== "Todos"
      ? sortedOrders?.filter((order) => order.situacao === filterBy)
      : sortedOrders;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted rounded w-1/6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  console.log("SORTED ORDERS:", sortedOrders);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mx-auto">
          <div className="flex w-full justify-between items-center mb-8 flex-wrap gap-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
              <p className="text-muted-foreground">
                Acompanhe o status dos seus pedidos
              </p>
            </div>

            <div className="">
              {/* <h4 className="font-medium">Ordenar por</h4> */}
              <Select
                // className="w-full p-2 border cursor-pointer hover:first:text-primary border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                value={filterBy}
                onValueChange={(e) =>
                  setFilterBy(e as keyof typeof OrderStatusMapper | "Todos")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos" className="text-foreground focus:bg-transparent focus:text-primary cursor-pointer">Todos</SelectItem>
                  <SelectItem value="Em aberto" className="text-foreground focus:bg-transparent focus:text-primary cursor-pointer">
                    Aguardando pagamento
                  </SelectItem>
                  <SelectItem value="Aprovado" className="text-foreground focus:bg-transparent focus:text-primary cursor-pointer">
                    Pagamento aprovado
                  </SelectItem>
                  <SelectItem
                    value="Pronto para envio"
                    className="text-foreground focus:bg-transparent focus:text-primary cursor-pointer"
                  >
                    Pedido pronto para envio
                  </SelectItem>
                  <SelectItem value="Entregue" className="text-foreground focus:bg-transparent focus:text-primary cursor-pointer">
                    Pedido entregue
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!orders || orders.length === 0 ? (
            <Card className="animate-scale-in">
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Você ainda não fez nenhum pedido. Que tal dar uma olhada em
                  nossos produtos?
                </p>
                <Button
                  asChild
                  className="hover:scale-105 transition-all duration-200"
                >
                  <Link to="/products">Ver Produtos</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              {filteredOrders.map((order, index) => (
                <Card
                  key={order.id}
                  className="animate-scale-in grow hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center flex-wrap gap-2">
                          <span>Pedido #{order.numero}</span>
                          <Badge
                            variant={getStatusColor(order.situacao)}
                            className="flex items-center space-x-1"
                          >
                            {getStatusIcon(order.situacao)}
                            <span>{order.situacao}</span>
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Pedido realizado em {order.data_pedido}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          R$ {order.valor?.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <Separator />

                    <div className="flex justify-between flex-wrap gap-1 items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          ID do pedido: {order.id}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:scale-105 transition-all duration-200"
                          onClick={() => {
                            setSelectedOrder(order);
                            setSheetOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                        {order.situacao === "Pronto para envio" && (
                          <Button
                            size="sm"
                            className="hover:scale-105 transition-all duration-200"
                          >
                            <Truck className="mr-2 h-4 w-4" />
                            Rastrear
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="space-y-2">
                      <div className="flex justify-between flex-wrap text-xs text-muted-foreground">
                        {/* <span>Pedido confirmado</span>
                        <span>Processando</span>
                        <span>Enviado</span>
                        <span>Entregue</span> */}
                        {Object.values(OrderStatusMapper).map((value, idx) => (
                          <span
                            key={value}
                            className="relative whitespace-nowrap"
                          >
                            {/* {OrderStatusMapper[statusKey as keyof typeof OrderStatusMapper]} */}
                            <span className="absolute -top-1 -left-2 text-primary">
                              {idx + 1}
                            </span>
                            {value}
                          </span>
                        ))}
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 bg-foreground ${
                            order.situacao === "Em aberto"
                              ? "w-1/4"
                              : order.situacao === "Aprovado"
                              ? "w-1/2"
                              : order.situacao === "Pronto para envio"
                              ? "w-3/4"
                              : // order.situacao === 'Entregue' ? 'w-3/4 bg-primary' :
                                // order.situacao === 'Entregue' ? 'w-full bg-primary' : 'w-1/4 bg-secondary'
                                "w-full bg-primary"
                          }`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Order Detail Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-lg overflow-y-auto"
          >
            {selectedOrder && (
              <>
                <SheetHeader>
                  <SheetTitle>Detalhes do Pedido</SheetTitle>
                  <SheetDescription>
                    Pedido #{selectedOrder.numero} • {selectedOrder.data_pedido}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Status */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Status do Pedido
                    </h3>
                    <Badge className={getStatusColor(selectedOrder.situacao)}>
                      {getStatusIcon(selectedOrder.situacao)}
                      {OrderStatusMapper[selectedOrder.situacao] ||
                        selectedOrder.situacao}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Informações do Pedido */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Informações
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          ID do Pedido:
                        </span>
                        <span className="font-medium">{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Número:</span>
                        <span className="font-medium">
                          #{selectedOrder.numero}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data:</span>
                        <span className="font-medium">
                          {selectedOrder.data_pedido}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Valor Total */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Valor Total
                    </h3>
                    <div className="text-2xl font-bold text-primary">
                      R$ {selectedOrder.valor.toFixed(2)}
                    </div>
                  </div>

                  <Separator />

                  {/* Ações */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSheetOpen(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
};

export default MyOrders;
