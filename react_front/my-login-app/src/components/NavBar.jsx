import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import Cookies from 'js-cookie';
import { logout } from '../store/userSlice';

const NavBar = () => {
    const location = useLocation();
    const {role, isAuthenticated} = useSelector((state) => state.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/api/auth/logout");
        } catch(err) {
            console.log("서버 로그아웃 실패 : " + err);
        }

        Cookies.remove("accessToken");
        dispatch(logout());

        navigate("/");
    }

    return (
        <nav className='navbar'>
            <div className='navbar-logo'>My Login App</div>
            <div className='navbar-links'>
                <Link className={location.pathname === "/" ? "active" : ""} to="/">HOME</Link>
                {/* 로그인 한 경우만 표시 */}
                {isAuthenticated ? (
                    <>
                        {/* 관리자일때만 추가 표시 */}
                        {role === 'ROLE_ADMIN' && <Link className={location.pathname === "/admin" ? "active" : ""} to="/admin">ADMIN</Link>}
                        <Link onClick={handleLogout} >LOGOUT</Link>
                    </>
                ) : (
                    <>
                        <Link className={location.pathname === "/login" ? "active" : ""} to="/login">LOGIN</Link>
                        <Link className={location.pathname === "/signup" ? "active" : ""} to="/signup">SIGNUP</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default NavBar;
