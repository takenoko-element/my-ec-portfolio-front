import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { auth } from "../../lib/firebase";
import type { RootState } from "../../app/store";

// ユーザー情報の型定義
interface AuthUser {
    uid: string;
    email: string | null;
}

export interface AuthState {
    user: AuthUser | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
}

// 非同期アクション (Thunk)
// 1. 新規登録
export const signUpUser = createAsyncThunk<
    AuthUser, 
    {email: string, password: string}
> (
    'auth/signUpUser',
    async ({email, password}, {rejectWithValue}) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const {uid, email: userEmail} = userCredential.user;
            return {uid, email: userEmail}
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// 2. ログイン
export const loginUser = createAsyncThunk<
    AuthUser,
    {email: string, password: string}
> (
    'auth/loginUser',
    async ({email, password}, {rejectWithValue}) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const {uid, email: userEmail}  = userCredential.user;
            return {uid, email: userEmail};
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// 3. ログアウト
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, {rejectWithValue}) => {
        try {
            await signOut(auth);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Firebaseの認証状態の変更をリッスンしてユーザー情報をセットするReducer
        setUser: (state, action: PayloadAction<AuthUser | null>) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // 新規登録
            .addCase(signUpUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // ログイン
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // ログアウト
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
            })
    }
})

export const {setUser} = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;