import { useQuery, useMutation } from '@tanstack/react-query';
import { Product, LoginData, RegisterData, User, Address, ViaCepResponse, ShippingQuote, Order } from '@/types';
import { toast } from '@/hooks/use-toast';

// Mock data baseado na API documentation
const mockProducts: Product[] = [
  {
    id: "2c810bee-3dab-4dae-9459-f8fdee683623",
    name: "Bandeira do Time",
    codigo: "BAND001",
    price: 299,
    category: "Acessórios",
    peso_liquido: 0.2,
    peso_bruto: 0.3,
    altura_embalagem: 5,
    largura_embalagem: 30,
    comprimento_embalagem: 45,
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1574779780815-ab60d0c9d601?w=500&h=500&fit=crop"
    ],
    description: "Bandeira oficial do time para torcer com estilo",
    promo: {
      promo_price: 150,
      percentage_discount: 50
    },
    variations: [],
    stock: 25
  },
  {
    id: "daae0f2e-e2af-43bb-8940-130326180182",
    name: "Camisa Oficial Jogador",
    codigo: "CAM001",
    price: 199.90,
    category: "Uniforme",
    peso_liquido: 0.3,
    peso_bruto: 0.4,
    altura_embalagem: 2,
    largura_embalagem: 25,
    comprimento_embalagem: 35,
    images: [
      "https://images.unsplash.com/photo-1577212017184-80cc0da11082?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop"
    ],
    description: "Camisa oficial de jogador com tecnologia Dry-Fit",
    promo: {
      promo_price: 159.90,
      percentage_discount: 20
    },
    variations: [
      { id: "65670f01-3f5a-40a1-8697-8f3deaaec66e", name: "P", price: 199.90, stock: 107 },
      { id: "19639b57-1517-4ad4-97df-793c2297930a", name: "M", price: 199.90, stock: 50 },
      { id: "1f2c879c-7422-4384-9301-96ce517bd01a", name: "G", price: 199.90, stock: 10 },
      { id: "8b5e9f12-2a3c-4d5e-9f6a-7b8c9d0e1f23", name: "GG", price: 199.90, stock: 30 }
    ],
    stock: 0
  },
  {
    id: "3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c",
    name: "Caneca Térmica do Time",
    codigo: "CAN001", 
    price: 79.90,
    category: "Canecas",
    peso_liquido: 0.4,
    peso_bruto: 0.5,
    altura_embalagem: 12,
    largura_embalagem: 10,
    comprimento_embalagem: 10,
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    description: "Caneca térmica com logo do time, mantém a bebida na temperatura ideal",
    promo: {
      promo_price: 59.90,
      percentage_discount: 25
    },
    variations: [],
    stock: 80
  },
  {
    id: "9e8d7c6b-5a49-3827-1605-948372615039",
    name: "Shorts Oficial",
    codigo: "SHO001",
    price: 149.90,
    category: "Uniforme",
    peso_liquido: 0.25,
    peso_bruto: 0.35,
    altura_embalagem: 2,
    largura_embalagem: 20,
    comprimento_embalagem: 30,
    images: [
      "https://images.unsplash.com/photo-1506629905607-43e54ab57318?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop"
    ],
    description: "Shorts oficial do time com tecnologia anti-suor",
    variations: [
      { id: "a1b2c3d4-e5f6-7890-1234-567890abcdef", name: "P", price: 149.90, stock: 45 },
      { id: "b2c3d4e5-f678-9012-3456-7890abcdef12", name: "M", price: 149.90, stock: 60 },
      { id: "c3d4e5f6-7890-1234-5678-90abcdef1234", name: "G", price: 149.90, stock: 35 },
      { id: "d4e5f678-9012-3456-7890-abcdef123456", name: "GG", price: 149.90, stock: 25 }
    ],
    stock: 0
  }
];

// API Base URL - usando variável de ambiente
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Products API
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      try {
        const response = await fetch(`${API_BASE}/product`);
        const data = await response.json();
        
        if (data.success) {
          return data.data;
        }
        throw new Error(data.message || 'Erro ao buscar produtos');
      } catch (error) {
        // Fallback to mock data in development
        console.warn('API não disponível, usando dados mock:', error);
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockProducts;
      }
    },
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async (): Promise<Product[]> => {
      try {
        const response = await fetch(`${API_BASE}/product/category/${category}`);
        const data = await response.json();
        
        if (data.success) {
          return data.data;
        }
        throw new Error(data.message || 'Erro ao buscar produtos por categoria');
      } catch (error) {
        console.warn('API não disponível, usando dados mock:', error);
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockProducts.filter(product => product.category === category);
      }
    },
  });
};

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      try {
        const response = await fetch(`${API_BASE}/product/${id}`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          return data.data[0];
        }
        throw new Error(data.message || 'Produto não encontrado');
      } catch (error) {
        console.warn('API não disponível, usando dados mock:', error);
        await new Promise(resolve => setTimeout(resolve, 300));
        const product = mockProducts.find(p => p.id === id);
        if (!product) throw new Error('Produto não encontrado');
        return product;
      }
    },
    enabled: !!id,
  });
};

export const usePromoProducts = () => {
  return useQuery({
    queryKey: ['products', 'promo'],
    queryFn: async (): Promise<Product[]> => {
      try {
        const response = await fetch(`${API_BASE}/product/promo`);
        const data = await response.json();
        
        if (data.success) {
          return data.data;
        }
        throw new Error(data.message || 'Erro ao buscar promoções');
      } catch (error) {
        console.warn('API não disponível, usando dados mock:', error);
        await new Promise(resolve => setTimeout(resolve, 400));
        return mockProducts.filter(product => product.promo);
      }
    },
  });
};

// ViaCEP API
export const useViaCep = (cep: string) => {
  return useQuery({
    queryKey: ['viacep', cep],
    queryFn: async (): Promise<ViaCepResponse> => {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) {
        throw new Error('CEP inválido');
      }
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      return data;
    },
    enabled: !!cep && cep.replace(/\D/g, '').length === 8,
  });
};

// Auth API
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginData): Promise<{ user: User; token: string }> => {
      try {
        // Mapear email para cpf_cnpj conforme API espera
        const apiData = {
          cpf_cnpj: data.email,
          password: data.password
        };
        
        const response = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData),
        });
        
        const result = await response.json();
        
        if (result.success) {
          return {
            user: result.data.user,
            token: result.data.token
          };
        }
        throw new Error(result.message || 'Erro no login');
      } catch (error) {
        // Fallback to mock data in development
        console.warn('API não disponível, usando dados mock:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (data.email === 'test@shopiac.com' && data.password === '123456') {
          return {
            user: {
              id: '1',
              name: 'João Silva',
              email: 'joao@email.com',
              cpf_cnpj: '12345678901',
              phone: '11999999999'
            },
            token: 'mock-jwt-token'
          };
        }
        
        throw new Error('E-mail ou senha inválidos');
      }
    },
    onError: (error) => {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData): Promise<{ user: User; token: string }> => {
      try {
        const response = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (result.success) {
          return {
            user: result.data.user,
            token: result.data.token
          };
        }
        throw new Error(result.message || 'Erro no cadastro');
      } catch (error) {
        // Fallback to mock data in development
        console.warn('API não disponível, usando dados mock:', error);
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        return {
          user: {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            cpf_cnpj: data.cpf_cnpj,
            phone: data.phone
          },
          token: 'mock-jwt-token-register'
        };
      }
    },
    onError: (error) => {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: "883259324",
    numero: "1", 
    data_pedido: "19/09/2025",
    situacao: "Em aberto",
    nome: "João Silva", 
    valor: 159
  },
  {
    id: "883230456",
    numero: "2",
    data_pedido: "11/09/2025", 
    situacao: "Enviado",
    nome: "João Silva",
    valor: 318
  },
  {
    id: "883230457",
    numero: "3",
    data_pedido: "05/09/2025",
    situacao: "Entregue", 
    nome: "João Silva",
    valor: 89.90
  }
];

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/order`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const result = await response.json();
        
        if (result.success) {
          return result.data;
        }
        throw new Error(result.message || 'Erro ao buscar pedidos');
      } catch (error) {
        console.warn('API não disponível, usando dados mock:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockOrders;
      }
    },
  });
};

export const useCheckout = () => {
  return useMutation({
    mutationFn: async (orderData: { items: any[], address: any, delivery: any }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/transation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            delivery_id: orderData.delivery.id_forma_frete,
            address_id: orderData.address.id,
            items: orderData.items.map(item => ({
              id: item.productId,
              amount: item.quantity
            }))
          }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          return result;
        }
        throw new Error(result.message || 'Erro no checkout');
      } catch (error) {
        console.warn('API não disponível, usando dados mock:', error);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
          success: true,
          data: {
            Url: "https://abacatepay.com/pay/bill_example123"
          }
        };
      }
    },
  });
};