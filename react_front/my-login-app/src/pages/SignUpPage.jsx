import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:8080/api/auth/signup', {username, password});
            alert("회원가입 성공!");
            navigate('/login');
        } catch(err) {
            alert('회원가입 실패 : ' + (err.response?.data || err.message));
        }
    }

    return (
        <div className="auth-container">
            <h2>회원 가입</h2>
            <form onSubmit={handleSignup}>
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
                <button type="submit">회원가입</button>
            </form>
        </div>
    )
}

export default SignUpPage;