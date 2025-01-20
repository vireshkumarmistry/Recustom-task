import {createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError} from '@reduxjs/toolkit/query/react';
import type {RootState} from '../store';

export const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL", API_URL)

const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers, {getState}) => {
            const state = getState() as RootState;
            const token = state.auth.token;
            return headers;
        },
    }) as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    endpoints: () => ({}),
    tagTypes: ['User'],
});

export default baseApi;
