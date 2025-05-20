
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar se existe algum usuário no sistema
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Se não existir nenhum usuário, criar um usuário administrador padrão
    if (users.length === 0) {
      const adminUser = {
        id: 1,
        name: "Administrador",
        email: "admin@vdr.com",
        password: "admin123", // Em produção, isso seria feito com hash
        role: "administrador",
        active: true,
      };
      
      users.push(adminUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Exibir mensagem no console para o usuário saber as credenciais iniciais
      console.log("Credenciais iniciais criadas:");
      console.log("E-mail: admin@vdr.com");
      console.log("Senha: admin123");
    }
    
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    if (isLoggedIn) {
      // If logged in, navigate to the dashboard
      navigate("/dashboard");
    } else {
      // If not logged in, redirect to the login page
      navigate("/login");
    }
  }, [navigate]);

  // This component doesn't render anything
  return null;
};

export default Index;
