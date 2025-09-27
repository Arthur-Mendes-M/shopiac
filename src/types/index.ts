export interface Product {
  id: string;
  name: string;
  codigo: string;
  price: number;
  category: 'Uniforme' | 'Acessórios' | 'Caneca';
  peso_liquido: number;
  peso_bruto: number;
  altura_embalagem: number;
  largura_embalagem: number;
  comprimento_embalagem: number;
  images: string[];
  description: string;
  promo?: {
    promo_price: number;
    percentage_discount: number;
  };
  variations: ProductVariation[];
  stock: number;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  variationId?: string;
  quantity: number;
  product: Product;
  variation?: ProductVariation;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cpf_cnpj: string;
  phone: string;
  token?: string;
}

export interface Address {
  id?: string;
  client_id?: string;
  address: string;
  number: string;
  neighborhood: string;
  zip_code: string;
  city: string;
  state: string;
  complement?: string;
  created_at?: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface ShippingQuote {
  tipo_entrega: string;
  preco: number;
  prazo: number;
  id_forma_envio: string;
  nome_forma_envio: string;
  id_forma_frete: string;
  nome_forma_frete: string;
}

export interface Order {
  id: string;
  numero: string;
  data_pedido: string;
  situacao: keyof typeof OrderStatusMapper;
  nome: string;
  valor: number;
}

export const OrderStatusMapper = {
  'Em aberto': 'Aguardando pagamento',
  'Aprovado': 'Pagamento aprovado',
  'Pronto para envio': 'Pedido pronto para envio',
  'Entregue': 'Pedido entregue',
}

// ---------- New statuses ----------
  // 'Enviado': 'Pedido enviado',
  // 'Em separação': 'Pedido em separação',
  // 'Em embalagem': 'Pedido em embalagem',
  // 'Despachado': 'Pedido despachado',
  // 'Em transporte': 'Pedido em transporte',
  // 'Saiu para entrega': 'Pedido saiu para entrega',
  // 'Devolvido': 'Pedido devolvido',
  // 'Cancelado': 'Pedido cancelado'
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  cpf_cnpj: string;
}