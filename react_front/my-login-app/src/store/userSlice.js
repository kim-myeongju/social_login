import {createSlice} from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const initialState = {
    username: null,
    role: null,
    isAuthenticated: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserFromToken(state, action) {
            const token = action.payload;
            try {
                const decoded = jwtDecode(token);
                state.username = decoded.sub;
                state.role = decoded.role;
                state.isAuthenticated = true;
            } catch {
                state.username = null;
                state.role = null;
                state.isAuthenticated = false;
            }
        },
        logout(state) {
            Cookies.remove("accessToken");
            state.username = null;
            state.role = null;
            state.isAuthenticated = false;
        }
    }
});

export const {setUserFromToken, logout} = userSlice.actions;
export default userSlice.reducer;
