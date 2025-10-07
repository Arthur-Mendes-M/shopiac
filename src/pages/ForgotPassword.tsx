import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { Mail, ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { forgotPassword } = useApi();

  const token = searchParams.get('token');

  useEffect(() => {
    // Se houver token, fazer login automático
    if (token) {
      handleTokenLogin(token);
    }
  }, [token]);

  useEffect(() => {
    // Cooldown timer
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleTokenLogin = async (tokenValue: string) => {
    if (!tokenValue || tokenValue.length < 10) {
      toast.error("Token inválido", {
        description: "O link de recuperação está inválido ou malformado.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPassword(email, tokenValue);
      
      if (response.success && response.data?.user && response.data?.token) {
        authLogin(response.data.user, response.data.token);
        
        toast.success("Acesso temporário ativado!", {
          description: "Seu login expira em 1 hora. Altere sua senha agora.",
          duration: 6000,
        });

        // Aguardar um pouco para o toast aparecer antes de redirecionar
        setTimeout(() => {
          navigate('/account?forgot=true');
        }, 1000);
      }
    } catch (error) {
      toast.error("Erro ao processar token", {
        description: error instanceof Error ? error.message : "Token inválido ou expirado.",
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error("Email inválido", {
        description: "Por favor, digite um email válido.",
      });
      return;
    }

    if (cooldown > 0) {
      toast.info("Aguarde para reenviar", {
        description: `Você poderá solicitar novamente em ${cooldown} segundos.`,
      });
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email);
      
      setEmailSent(true);
      setCooldown(60);
      
      toast.success("Email enviado!", {
        description: "Verifique sua caixa de entrada e spam. O link expira em 1 hora.",
        duration: 6000,
      });
    } catch (error) {
      toast.error("Erro ao enviar email", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Se houver token, mostrar tela de loading
  if (token) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-lg font-medium">Processando acesso temporário...</p>
              <p className="text-sm text-muted-foreground">Aguarde um momento.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
              <p className="text-sm text-muted-foreground">
                Digite seu email para receber um link de acesso temporário
              </p>
            </CardHeader>

            <CardContent>
              {emailSent && (
                <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Email enviado com sucesso! Verifique sua caixa de entrada.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {cooldown > 0 && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Aguarde {cooldown} segundos para solicitar novamente
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading || cooldown > 0}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Enviando...
                    </div>
                  ) : cooldown > 0 ? (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Aguarde {cooldown}s
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar Link de Recuperação
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o login
                </Link>
              </div>

              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">
                  <strong>Como funciona:</strong><br />
                  1. Digite seu email cadastrado<br />
                  2. Clique em um link no email recebido<br />
                  3. Você terá 1 hora para alterar sua senha
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
