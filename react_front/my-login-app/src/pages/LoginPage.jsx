import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { setUserFromToken } from '../store/userSlice';
import { useDispatch } from 'react-redux';

function LoginPage() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

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
        </div>
    )

}

export default LoginPage;
