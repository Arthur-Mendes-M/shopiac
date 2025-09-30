import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useLogin } from '@/hooks/useApi';
import { Lock, User } from 'lucide-react';
import { PasswordInput } from '@/components/passwordInput';
import { toast } from 'sonner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { mutate: loginMutation, isPending } = useLogin();

  const redirect = searchParams.get('redirect');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.info("Campos obrigatórios", {
        description: "Por favor, preencha todos os campos",
      });
      return;
    }

    loginMutation(formData, {
      onSuccess: (data) => {
        console.log("Login successful:", data);
        authLogin(data.user, data.token);
        toast.success("Login realizado!", {
          description: `Bem-vindo, ${data.user.name}!`,
        });
        
        // Redirect after login
        if (redirect === 'checkout') {
          navigate('/checkout');
        } else {
          navigate('/');
        }
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Fazer Login</CardTitle>
              <p className="text-sm text-muted-foreground">
                Entre com sua conta para continuar
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
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
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <PasswordInput
                      id="password"
                      name="password"
                      placeholder="Digite sua senha"
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
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button> */}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link 
                    to="/forgot-password" 
                    className="text-primary hover:underline"
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Entrando...
                    </div>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Não tem conta?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <Link to="/register">
                      Criar Conta
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;