
import Navbar from "../components/Navbar";
import AuthCard from "../components/AuthCard";

const AuthPage = ({ onLoginSuccess }) => {
  return (
    <div>
      <Navbar />
      <AuthCard onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default AuthPage;
