import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const PrivateRoute = () => {
    const {user, authChecked} = useAuth();

    if(!authChecked){
        return <div>Loading...</div>
    }

    // <Outlet /> は、このPrivateRouteの子ルート（例: <OrderHistoryPage />）に置き換わる
    return user? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;