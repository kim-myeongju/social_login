import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Cookies from 'js-cookie';
import { setUserFromToken } from '../store/userSlice';
import { useDispatch } from 'react-redux';

function LoginPage() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API;
    const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    const KAKAO_AUTH_LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', {username, password}, {withCredentials:true});
            
            Cookies.set('accessToken', res.data.accessToken);
            dispatch(setUserFromToken(res.data.accessToken));

            alert("로그인 성공! access token : " + res.data.accessToken, {expires: 0.021, path: '/'});
            navigate("/");
        } catch(err) {
            alert("로그인 실패 : " + (err.response?.data || err.message));
        }
    }

    const handleKakaoLogin = () => {
        window.location.href = KAKAO_AUTH_LOGIN_URL;
    }

    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    }

    return (
        <div className='auth-container'>
            <h2>로그인</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type='submit'>로그인</button>
            </form>

            <div className='social-login'>
                <button onClick={handleKakaoLogin} className='kakao-btn'>
                    <p>kakao login</p>
                </button>
            </div>
            <div className='social-login'>
                <button onClick={handleGoogleLogin} className='google-btn'>
                    <p>google login</p>
                </button>
            </div>
        </div>
    )

}

export default LoginPage;
