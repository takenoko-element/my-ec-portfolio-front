import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { selectAuthChecked, selectUser } from "../features/auth/authSlice";

const PrivateRoute = () => {
    const user = useSelector(selectUser);
    const authChecked = useSelector(selectAuthChecked);

    if(!authChecked){
        return <div>Loading...</div>
    }

    // userオブジェクトが存在するかどうかで、ログイン状態を判断
    // もしuserが存在すれば（ログイン済みなら）、「<Outlet />」を表示
    // <Outlet /> は、このPrivateRouteの子ルート（例: <OrderHistoryPage />）に置き換わる
    // もしuserが存在しなければ（未ログインなら）、「<Navigate />」コンポーネントを表示
    // <Navigate /> は、ユーザーを /login ページに強制的にリダイレクトさせる
    return user? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;