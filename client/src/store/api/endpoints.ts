import baseApi from './baseApi';

const endPoints = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchUsers: builder.query<any, void>({
            query: () => 'users/',
            providesTags: ["User"]
        }),
        fetchStats: builder.query<any, void>({
            query: () => 'users/dashboard_stats/',
            providesTags: ["User"]
        }),
        editUser: builder.mutation<any, { id: number, userData: any }>({
            query: ({id, data}) => ({
                url: `users/${id}/update/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        createUser: builder.mutation<any, {userData: any }>({
            query: ( userData) => {
                console.log("userData",userData)
                return ({
                    url: `users/`,
                    method: 'POST',
                    body: userData,
                })
            },
            invalidatesTags: ['User'],
        }),

        deleteUser: builder.mutation<any, { id: number }>({
            query: (userId) => {
                return ({
                    url: `users/${userId}/delete/`,
                    method: 'DELETE',
                })
            },
            invalidatesTags: ['User'],
        }),


    }),
    overrideExisting: false,
});

export const {
    useFetchUsersQuery,
    useFetchStatsQuery,
    useDeleteUserMutation,
    useEditUserMutation,
    useCreateUserMutation
} = endPoints;

export default endPoints;
