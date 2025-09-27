import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Address } from '@/types';
import { MapPin, Plus, Check } from 'lucide-react';

interface AddressListProps {
  addresses: Address[];
  selectedAddressId?: string;
  onSelectAddress?: (address: Address) => void;
  onAddNew: () => void;
  title?: string;
  allowSelection?: boolean;
}

export const AddressList: React.FC<AddressListProps> = ({ 
  addresses, 
  selectedAddressId,
  onSelectAddress,
  onAddNew,
  title = "Endereços Cadastrados",
  allowSelection = false
}) => {
  const formatAddress = (address: Address) => {
    const parts = [
      address.address,
      address.number,
      address.complement,
      address.neighborhood,
      address.city,
      address.state,
      address.zip_code
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            {title}
          </div>
          <Button onClick={onAddNew} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {
              addresses.length === 0 ? "Adicionar Primeiro Endereço" : "Adicionar Novo"
            }
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum endereço cadastrado</p>
            {/* <Button variant="outline" onClick={onAddNew} className="mt-4">
              Adicionar Primeiro Endereço
            </Button> */}
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg transition-colors ${
                  allowSelection && selectedAddressId === address.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                } ${allowSelection ? 'cursor-pointer' : ''}`}
                onClick={() => allowSelection && onSelectAddress?.(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {allowSelection && selectedAddressId === address.id && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <p className="font-medium text-sm">
                        {address.address}, {address.number}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {address.complement && `${address.complement}, `}
                      {address.neighborhood}, {address.city} - {address.state}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {address.zip_code}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};