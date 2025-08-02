import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { setUserFromToken } from "../store/userSlice";

function OAuthRedirectSocialLoginPage() {
    const [params] = useSearchParams();
    const code = params.get("code");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const provider = location.pathname.split("/").pop();

    useEffect(() => {
        const getToken = async () => {
            try {
                const res = await axios.post(`http://localhost:8080/api/auth/${provider}`, { code }, {
                    withCredentials: true,
                });

                const accessToken = res.data.accessToken;
                Cookies.set("accessToken", accessToken, {expires: 0.021});

                dispatch(setUserFromToken(accessToken));
                navigate("/");
            } catch(err) {
                alert(`${provider} 로그인 실패`);
                navigate("/login");
            }
        }

        if(code && provider) getToken();
    }, [code, provider, dispatch, navigate])

    return <div>{provider} login 처리중 ...</div>
}

export default OAuthRedirectSocialLoginPage;
