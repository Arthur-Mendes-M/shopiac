import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { User, MapPin, KeyRound } from "lucide-react";
import { cpfCNPJFormatter, formatPhoneNumber } from "@/lib/utils";
import { AddressList } from "@/components/AddressList";
import { AddressForm } from "@/components/AddressForm";
import { Address } from "@/types";
import { useApi } from "@/hooks/useApi";
import { SecurityDialog } from "@/components/securityDialog";
import { Navigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const MyAccount = () => {
  const { user, updateUser: updateSavedUserData, isAuthenticated } = useAuth();
  const { getAddresses, createAddress, updateUser } = useApi();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  const forgotParam = searchParams.get('forgot');

  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    cpf: user?.cpf_cnpj || "",
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      cpf: user?.cpf_cnpj || "",
    });
  }, [user]);

  useEffect(() => {
    // Verificar se há parâmetro forgot na URL
    if (forgotParam === 'true') {
      setIsSecurityOpen(true);
      toast.info("Altere sua senha agora", {
        description: "Seu acesso temporário expira em 1 hora.",
        duration: 5000,
      });
      // Remover o parâmetro da URL após abrir o dialog
      setSearchParams({});
    }
  }, [forgotParam]);

  const loadAddresses = async () => {
    try {
      const response = await getAddresses();
      setAddresses(response.data || []);
    } catch (error) {
      toast.error( "Erro ao carregar endereços", {
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);

    try {
      await updateUser({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      });

      updateSavedUserData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      });

      toast.success("Perfil atualizado", {
        description: "Suas informações foram salvas com sucesso.",
      });
      setLoading(false);
    } catch (error) {
      toast.error("Erro ao salvar perfil.",{
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
      setLoading(false);
      return;
    }
  };

  const handleCreateAddress = async (address: Address) => {
    if(addresses.length >= 5) {
      toast.info("Limite de 5 endereços excedido", {
        description: "Caso queira cadastrar um novo endereço, apague ao menos um!"
      });
      return
    }

    setAddressLoading(true);
    try {
      await createAddress(address);
      toast.success("Endereço cadastrado", {
        description: "Endereço salvo com sucesso.",
      });
      setShowAddressForm(false);
      loadAddresses();
    } catch (error) {
      toast.error("Erro ao salvar endereço", {
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    } finally {
      setAddressLoading(false);
    }
  };

  if (!isAuthenticated) {
    // console.log("NÃO TA ");
    Navigate({ to: "/login", replace: true });
    // return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e preferências
            </p>
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
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
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
                  <Button
                    onClick={() => setIsSecurityOpen(true)}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    Alterar senha
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
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="transition-all duration-200 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF/CNPJ</Label>
                      <Input
                        id="cpf"
                        value={cpfCNPJFormatter(userData.cpf)}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            cpf: e.target.value,
                          }))
                        }
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
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="transition-all duration-200 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formatPhoneNumber(userData.phone)}
                        minLength={10}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
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

              {/* Address Section */}
              <div className="space-y-6">
                {(showAddressForm && addresses.length <=4 ) ? (
                  <AddressForm
                    onSubmit={handleCreateAddress}
                    onCancel={() => setShowAddressForm(false)}
                    isLoading={addressLoading}
                  />
                ) : (
                  <AddressList
                    addresses={addresses}
                    onAddNew={() => setShowAddressForm(true)}
                    onDeleteAddress={(deletedAddressId) =>
                      setAddresses((prev) =>
                        prev.filter((addr) => addr.id !== deletedAddressId)
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SecurityDialog open={isSecurityOpen} onOpenChange={setIsSecurityOpen} />
    </Layout>
  );
};

export default MyAccount;
