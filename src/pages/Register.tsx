import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useRegister, useViaCep } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserPlus, MapPin } from 'lucide-react';
import { Address } from '@/types';
import { cpfCNPJFormatter, formatPhoneNumber } from '@/lib/utils';
import { PasswordInput } from '@/components/passwordInput';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf_cnpj: ''
  });
  
  const [addressData, setAddressData] = useState<Partial<Address>>({
    zip_code: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: dados pessoais, 2: endereço (opcional)
  
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { mutate: registerMutation, isPending } = useRegister();
  
  // ViaCEP integration
  const cepQuery = useViaCep(addressData.zip_code || '');

  // Update address when CEP is found
  React.useEffect(() => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate required fields
      const requiredFields = ['name', 'email', 'password', 'phone', 'cpf_cnpj'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios",
          variant: "destructive",
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Senhas não conferem",
          description: "As senhas digitadas não são iguais",
          variant: "destructive",
        });
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Senha muito fraca",
          description: "A senha deve ter pelo menos 6 caracteres",
          variant: "destructive",
        });
        return;
      }

      // Go to next step (address - optional)
      setStep(2);
      return;
    }

    // Step 2: Register user
    const cleanCpf = formData.cpf_cnpj.replace(/\D/g, '');
    const cleanPhone = formData.phone.replace(/\D/g, '');

    registerMutation({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: cleanPhone,
      cpf_cnpj: cleanCpf
    }, {
      onSuccess: (data) => {
        authLogin(data.user, data.token);
        toast({
          title: "Cadastro realizado!",
          description: `Bem-vindo, ${data.user.name}!`,
        });
        navigate('/');
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const skipAddress = () => {
    registerMutation({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone.replace(/\D/g, ''),
      cpf_cnpj: formData.cpf_cnpj.replace(/\D/g, '')
    }, {
      onSuccess: (data) => {
        authLogin(data.user, data.token);
        toast({
          title: "Cadastro realizado!",
          description: `Bem-vindo, ${data.user.name}!`,
        });
        navigate('/');
      }
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {step === 1 ? (
                  <UserPlus className="h-6 w-6 text-primary" />
                ) : (
                  <MapPin className="h-6 w-6 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {step === 1 ? 'Criar Conta' : 'Endereço (Opcional)'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {step === 1 
                  ? 'Preencha seus dados para criar sua conta'
                  : 'Adicione seu endereço ou pule esta etapa'
                }
              </p>
              
              {/* Step indicator */}
              <div className="flex justify-center space-x-2 pt-4">
                <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-primary' : 'bg-muted'}`} />
                <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-primary' : 'bg-muted'}`} />
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 ? (
                  // Step 1: Personal Data
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cpf_cnpj">CPF/CNPJ *</Label>
                        <Input
                          id="cpf_cnpj"
                          name="cpf_cnpj"
                          type="text"
                          placeholder="000.000.000-00"
                          value={cpfCNPJFormatter(formData.cpf_cnpj)}
                          onChange={handleInputChange}
                          maxLength={18}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="text"
                          placeholder="(11) 99999-9999"
                          value={formatPhoneNumber(formData.phone)}
                          onChange={handleInputChange}
                          maxLength={15}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Senha *</Label>
                        <div className="relative">
                          <PasswordInput
                            id="password"
                            name="password"
                            placeholder="Mínimo 6 caracteres"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                          {/* <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button> */}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Digite a senha novamente"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Continuar
                    </Button>
                  </>
                ) : (
                  // Step 2: Address (Optional)
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zip_code">CEP</Label>
                        <Input
                          id="zip_code"
                          name="zip_code"
                          type="text"
                          placeholder="00000-000"
                          value={addressData.zip_code}
                          onChange={handleAddressChange}
                          maxLength={9}
                        />
                        {cepQuery.isLoading && (
                          <p className="text-xs text-muted-foreground">Buscando CEP...</p>
                        )}
                        {cepQuery.error && (
                          <p className="text-xs text-destructive">CEP não encontrado</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Logradouro</Label>
                        <Input
                          id="address"
                          name="address"
                          type="text"
                          placeholder="Rua, Avenida..."
                          value={addressData.address || ''}
                          onChange={handleAddressChange}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="number">Número</Label>
                          <Input
                            id="number"
                            name="number"
                            type="text"
                            placeholder="123"
                            value={addressData.number}
                            onChange={handleAddressChange}
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
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input
                          id="neighborhood"
                          name="neighborhood"
                          type="text"
                          placeholder="Nome do bairro"
                          value={addressData.neighborhood || ''}
                          onChange={handleAddressChange}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            placeholder="Cidade"
                            value={addressData.city || ''}
                            onChange={handleAddressChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">Estado</Label>
                          <Input
                            id="state"
                            name="state"
                            type="text"
                            placeholder="SP"
                            value={addressData.state || ''}
                            onChange={handleAddressChange}
                            maxLength={2}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Criando conta...
                          </div>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Criar Conta
                          </>
                        )}
                      </Button>

                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        size="lg"
                        onClick={skipAddress}
                        disabled={isPending}
                      >
                        Pular e Criar Conta
                      </Button>

                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full" 
                        onClick={() => setStep(1)}
                        disabled={isPending}
                      >
                        Voltar
                      </Button>
                    </div>
                  </>
                )}
              </form>

              {step === 1 && (
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Já tem conta?
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" className="w-full" size="lg" asChild>
                      <Link to="/login">
                        Fazer Login
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;