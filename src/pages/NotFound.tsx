import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-border bg-card">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 active:bg-secondary rounded-lg">
          <ArrowLeft size={22} className="text-foreground" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <button onClick={() => navigate('/')} className="text-primary underline hover:text-primary/90">
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
