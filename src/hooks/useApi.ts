import { useQuery, useMutation } from '@tanstack/react-query';
import { Product, LoginData, RegisterData, User, ViaCepResponse, Order, OrderDetails } from '@/types';
import { toast } from 'sonner';

// Mock data baseado na API documentation
// const mockProducts: Product[] = [
//   {
//     id: "2c810bee-3dab-4dae-9459-f8fdee683623",
//     name: "Bandeira do Time",
//     codigo: "BAND001",
//     price: 299,
//     category: "Acessórios",
//     peso_liquido: 0.2,
//     peso_bruto: 0.3,
//     altura_embalagem: 5,
//     largura_embalagem: 30,
//     comprimento_embalagem: 45,
//     images: [
//       "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
//       "https://images.unsplash.com/photo-1574779780815-ab60d0c9d601?w=500&h=500&fit=crop"
//     ],
//     description: "Bandeira oficial do time para torcer com estilo",
//     promo: {
//       promo_price: 150,
//       percentage_discount: 50
//     },
//     variations: [],
//     stock: 25
//   },
//   {
//     id: "daae0f2e-e2af-43bb-8940-130326180182",
//     name: "Camisa Oficial Jogador",
//     codigo: "CAM001",
//     price: 199.90,
//     category: "Uniforme",
//     peso_liquido: 0.3,
//     peso_bruto: 0.4,
//     altura_embalagem: 2,
//     largura_embalagem: 25,
//     comprimento_embalagem: 35,
//     images: [
//       "https://images.unsplash.com/photo-1577212017184-80cc0da11082?w=500&h=500&fit=crop",
//       "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
//       "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop"
//     ],
//     description: "Camisa oficial de jogador com tecnologia Dry-Fit",
//     promo: {
//       promo_price: 159.90,
//       percentage_discount: 20
//     },
//     variations: [
//       { id: "65670f01-3f5a-40a1-8697-8f3deaaec66e", name: "P", price: 199.90, stock: 107 },
//       { id: "19639b57-1517-4ad4-97df-793c2297930a", name: "M", price: 199.90, stock: 50 },
//       { id: "1f2c879c-7422-4384-9301-96ce517bd01a", name: "G", price: 199.90, stock: 10 },
//       { id: "8b5e9f12-2a3c-4d5e-9f6a-7b8c9d0e1f23", name: "GG", price: 199.90, stock: 30 }
//     ],
//     stock: 0
//   },
//   {
//     id: "3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c",
//     name: "Caneca Térmica do Time",
//     codigo: "CAN001", 
//     price: 79.90,
//     category: "Caneca",
//     peso_liquido: 0.4,
//     peso_bruto: 0.5,
//     altura_embalagem: 12,
//     largura_embalagem: 10,
//     comprimento_embalagem: 10,
//     images: [
//       "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=500&fit=crop",
//       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
//     ],
//     description: "Caneca térmica com logo do time, mantém a bebida na temperatura ideal",
//     promo: {
//       promo_price: 59.90,
//       percentage_discount: 25
//     },
//     variations: [],
//     stock: 80
//   },
//   {
//     id: "9e8d7c6b-5a49-3827-1605-948372615039",
//     name: "Shorts Oficial",
//     codigo: "SHO001",
//     price: 149.90,
//     category: "Uniforme",
//     peso_liquido: 0.25,
//     peso_bruto: 0.35,
//     altura_embalagem: 2,
//     largura_embalagem: 20,
//     comprimento_embalagem: 30,
//     images: [
//       "https://images.unsplash.com/photo-1506629905607-43e54ab57318?w=500&h=500&fit=crop",
//       "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop"
//     ],
//     description: "Shorts oficial do time com tecnologia anti-suor",
//     variations: [
//       { id: "a1b2c3d4-e5f6-7890-1234-567890abcdef", name: "P", price: 149.90, stock: 45 },
//       { id: "b2c3d4e5-f678-9012-3456-7890abcdef12", name: "M", price: 149.90, stock: 60 },
//       { id: "c3d4e5f6-7890-1234-5678-90abcdef1234", name: "G", price: 149.90, stock: 35 },
//       { id: "d4e5f678-9012-3456-7890-abcdef123456", name: "GG", price: 149.90, stock: 25 }
//     ],
//     stock: 0
//   }
// ];

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
        // return mockProducts;
        return [];
      }
    },
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async (): Promise<Product[]> => {
      if (!category) return [];
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
        // return mockProducts.filter(product => product.category === category);
        return [];
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
        // const product = mockProducts.find(p => p.id === id);
        const product = null;
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
        // return mockProducts.filter(product => product.promo);
        return [];
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

      // Mapear email para cpf_cnpj conforme API espera
      const apiData = {
        email: data.email,
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
      throw new Error(result.message)
    },
    onError: (error) => {
      toast.error("Erro ao tentar fazer login", {
        description: error.message,
      });
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData): Promise<{ user: User; token: string }> => {

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

      throw new Error(result.message);

    },
    onError: (error) => {
      toast.error("Erro ao tentar realizar cadastro", {
        description: error.message || 'Favor tente novamente em instantes',
      });
    }
  });
};

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
        // return mockOrders;
        return [];
      }
    },
  });
};

// export const useCheckout = () => {
//   return useMutation({
//     mutationFn: async (orderData: { items: any[], address: any, delivery: any }) => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch(`${API_BASE}/transation`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             delivery_id: orderData.delivery.id_forma_frete,
//             address_id: orderData.address.id,
//             items: orderData.items.map(item => ({
//               id: item.productId,
//               amount: item.quantity
//             }))
//           }),
//         });

//         const result = await response.json();

//         if (result.success) {
//           return result;
//         }
//         throw new Error(result.message || 'Erro no checkout');
//       } catch (error) {
//         console.warn('API não disponível, usando dados mock:', error);
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         return {
//           success: true,
//           data: {
//             Url: "https://abacatepay.com/pay/bill_example123"
//           }
//         };
//       }
//     },
//   });
// };

// Main API hook
export const useApi = () => {
  const getAddresses = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/address`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao buscar endereços');
      }

      return result;
    } catch (error) {
      console.warn('API não disponível, usando dados mock:', error);
      return { success: true, data: [] };
    }
  };

  const createAddress = async (address: any) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/address`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Address: address.address,
          Number: address.number,
          zip_code: address.zip_code.replace(/\D/g, ''),
          city: address.city,
          State: address.state,
          Complement: address.complement || '',
          neighborhood: address.neighborhood
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao criar endereço');
      }

      return result;
    } catch (error) {
      console.warn('API não disponível, usando dados mock:', error);
      throw error; // Re-throw para que o erro seja tratado no componente
    }
  };

  const deleteAddress = async (addressId: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao deletar endereço');
      }

      return result;
    } catch (error) {
      console.warn('API não disponível, usando dados mock:', error);
      throw error; // Re-throw para que o erro seja tratado no componente
    }
  };


  const calculateShipping = async (items: any[], cep_destino: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
      const response = await fetch(`${API_BASE_URL}/frete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.productId,
            amount: item.quantity
          })),
          cep_destino: cep_destino.replace(/\D/g, '')
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao calcular frete');
      }

      return result;
    } catch (error) {
      console.warn('API não disponível, usando dados mock:', error);
      throw error;
    }
  };

  const createTransaction = async (orderData: { items: any[], address: any, delivery: any, coupon?: string }) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
      const token = localStorage.getItem('token');

      const body: any = {
        delivery_id: orderData.delivery.id_forma_frete,
        address_id: orderData.address.id,
        items: orderData.items.map(item => ({
          id: item.variationId || item.productId,
          amount: item.quantity
        }))
      };

      // Adicionar cupom se fornecido
      if (orderData.coupon) {
        body.coupon = orderData.coupon;
      }

      const response = await fetch(`${API_BASE_URL}/transation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao criar transação');
      }

      return result;
    } catch (error) {
      console.warn('API não disponível, usando dados mock:', error);
      throw error;
    }
  };

  const updateUser = async (user: any) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          email: user.email
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao atualizar usuário');
      }

      return result;
    } catch (error) {
      console.warn('API não disponível, usando dados mock:', error);
      throw error; // Re-throw para que o erro seja tratado no componente
    }
  };

  const updateUserPassword = async ({ new_password, old_password }: { old_password: string, new_password: string }) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/user/password`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: old_password,
          new_password: new_password
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao atualizar senha');
      }

      return result;
    } catch (error) {
      console.warn('API não disponível, usando dados mock:', error);
      throw error; // Re-throw para que o erro seja tratado no componente
    }
  };

  const updateUserPasswordWithoutCurrent = async ({ new_password }: { new_password: string }) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/forgot-password/update`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_password: new_password
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao atualizar senha');
      }

      return result;
    } catch (error) {
      console.warn('API não disponível, usando dados mock:', error);
      throw error; // Re-throw para que o erro seja tratado no componente
    }
  };

  const searchProducts = async (query: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
      const response = await fetch(`${API_BASE_URL}/product?s=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        return result.data || [];
      }
      return [];
    } catch (error) {
      console.warn('Erro ao buscar produtos:', error);
      return [];
    }
  };

  // const getCoupon = async (couponCode: string) => {
  //   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`${API_BASE_URL}/coupon/${couponCode}`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     const result = await response.json();

  //     if (!result.success) {
  //       throw new Error(result.message || 'Cupom inválido');
  //     }

  //     return result;
  //   } catch (error) {
  //     console.warn('Erro ao buscar cupom:', error);
  //     throw error;
  //   }
  // };

  const getOrderDetails = async (orderId: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao buscar detalhes do pedido');
      }

      return result.data;
    } catch (error) {
      console.warn('Erro ao buscar detalhes do pedido:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string, token?: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
      // Se houver token, fazer login com token temporário
      if (token) {
        const response = await fetch(`${API_BASE_URL}/forgot-password/validate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Token inválido ou expirado');
        }

        return result;
      }

      // Caso contrário, solicitar email de recuperação
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao enviar email de recuperação');
      }

      return result;
    } catch (error) {
      console.warn('Erro ao processar recuperação de senha:', error);
      throw error;
    }
  };

  return {
    getAddresses,
    createAddress,
    calculateShipping,
    createTransaction,
    updateUser,
    updateUserPassword,
    deleteAddress,
    searchProducts,
    // getCoupon,
    getOrderDetails,
    forgotPassword,
    updateUserPasswordWithoutCurrent
  };
};