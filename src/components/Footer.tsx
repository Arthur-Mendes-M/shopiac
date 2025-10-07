import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SHOP IAC
            </h3>
            <p className="text-sm text-muted-foreground">
              A melhor loja de artigos esportivos do Brasil. Uniformes, acessórios e muito mais para o seu time do coração.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="https://www.instagram.com/itaqua.athletico.clube" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Produtos */}
          <div className="space-y-4">
            <h4 className="font-semibold">Produtos</h4>
            <div className="space-y-2 text-sm">
              <Link to="/products?category=Uniforme" className="block text-muted-foreground hover:text-primary transition-colors">
                Uniformes
              </Link>
              <Link to="/products?category=Caneca" className="block text-muted-foreground hover:text-primary transition-colors">
                Canecas
              </Link>
              <Link to="/products?category=Acessórios" className="block text-muted-foreground hover:text-primary transition-colors">
                Acessórios
              </Link>
              <Link to="/promotions" className="block text-muted-foreground hover:text-primary transition-colors">
                Promoções
              </Link>
            </div>
          </div>

          {/* Atendimento */}
          <div className="space-y-4">
            <h4 className="font-semibold">Atendimento</h4>
            <div className="space-y-2 text-sm">
              <Link to="/contato" className="block text-muted-foreground hover:text-primary transition-colors">
                Fale Conosco
              </Link>
              <Link to="/trocas-devolucoes" className="block text-muted-foreground hover:text-primary transition-colors">
                Trocas e Devoluções
              </Link>
              <Link to="/entrega" className="block text-muted-foreground hover:text-primary transition-colors">
                Política de Entrega
              </Link>
              <Link to="/privacidade" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacidade
              </Link>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contato</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📞 (11) 99999-9999</p>
              <p>✉️ timeiacshop@gmail.com</p>
              <p>🕒 Seg à Sex: 9h às 18h</p>
              <p>📍 São Paulo, SP</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {(new Date().getFullYear()) || "2025"} SportShop. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};