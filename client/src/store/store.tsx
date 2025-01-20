import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import baseApi from './api/baseApi';

const persistConfig = {
    key: 'root',
    storage,
};

interface AuthState {
    token: string | null;
    user: Record<string, any> | null;
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<{ token: string; user: any }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<{ user: any }>) => {
            state.user = action.payload.user;
        },
    },
});

export const {setToken, logout, setError, clearError, setUser} = authSlice.actions;

// 4. Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

// 5. Configure the store with the persisted reducer
export const store = configureStore({
    reducer: {
        auth: persistedReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

// 7. Define TypeScript types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
