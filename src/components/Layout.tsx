import { Header } from './Header';
import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';
import InstagramButton from './instagramButton';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileMenu />
      <InstagramButton />
    </div>
  );
};