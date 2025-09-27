import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useViaCep } from '@/hooks/useApi';
import { Address } from '@/types';
import { MapPin, Plus } from 'lucide-react';

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  onCancel: () => void;
  isLoading?: boolean;
  title?: string;
}

export const AddressForm: React.FC<AddressFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  title = "Novo Endereço"
}) => {
  const [addressData, setAddressData] = useState<Address>({
    zip_code: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const cepQuery = useViaCep(addressData.zip_code);

  useEffect(() => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'zip_code') {
      const cleanValue = value.replace(/\D/g, '');
      const formattedValue = cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
      setAddressData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setAddressData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ['zip_code', 'address', 'number', 'neighborhood', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !addressData[field as keyof Address]);
    
    if (missingFields.length > 0) {
      return;
    }

    onSubmit(addressData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zip_code">CEP *</Label>
            <Input
              id="zip_code"
              name="zip_code"
              type="text"
              placeholder="00000-000"
              value={addressData.zip_code}
              onChange={handleInputChange}
              maxLength={9}
              required
            />
            {cepQuery.isLoading && (
              <p className="text-xs text-muted-foreground">Buscando CEP...</p>
            )}
            {cepQuery.error && (
              <p className="text-xs text-destructive">CEP não encontrado</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Logradouro *</Label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="Rua, Avenida..."
              value={addressData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                name="number"
                type="text"
                placeholder="123"
                value={addressData.number}
                onChange={handleInputChange}
                required
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
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro *</Label>
            <Input
              id="neighborhood"
              name="neighborhood"
              type="text"
              placeholder="Nome do bairro"
              value={addressData.neighborhood}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Cidade"
                value={addressData.city}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                name="state"
                type="text"
                placeholder="SP"
                value={addressData.state}
                onChange={handleInputChange}
                maxLength={2}
                required
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Endereço"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};