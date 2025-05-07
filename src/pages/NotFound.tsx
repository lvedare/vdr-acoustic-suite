
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-vdr-blue">404</h1>
        <p className="mt-4 text-xl">Página não encontrada</p>
        <p className="mt-2 text-muted-foreground">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Button asChild className="mt-6 bg-vdr-blue hover:bg-blue-800">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
