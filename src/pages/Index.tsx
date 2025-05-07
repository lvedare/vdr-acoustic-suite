
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    if (isLoggedIn) {
      // If logged in, navigate to the dashboard
      navigate("/");
    } else {
      // If not logged in, redirect to the login page
      navigate("/login");
    }
  }, [navigate]);

  // This component doesn't render anything
  return null;
};

export default Index;
