import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { User, MapPin, Phone, Mail, CreditCard, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MyAccount = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cpf: user?.cpf_cnpj || ''
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    // Simular API call
    setTimeout(() => {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="animate-slide-in-left">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Informações Pessoais
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <MapPin className="mr-2 h-4 w-4" />
                    Endereços
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Métodos de Pagamento
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                        className="transition-all duration-200 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={userData.cpf}
                        onChange={(e) => setUserData(prev => ({ ...prev, cpf: e.target.value }))}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                        className="transition-all duration-200 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                        className="transition-all duration-200 focus:scale-[1.02]"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={loading}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Address Card */}
              <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Endereços Cadastrados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum endereço cadastrado</p>
                    <Button variant="outline" className="mt-4 hover:scale-105 transition-all duration-200">
                      Adicionar Endereço
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Card */}
              <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start hover:scale-[1.02] transition-all duration-200">
                    Alterar Senha
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:scale-[1.02] transition-all duration-200">
                    Configurar Autenticação em Duas Etapas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyAccount;