import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Widget from "./Widget.tsx";
import PeopleIcon from "@mui/icons-material/People";
import LoginIcon from '@mui/icons-material/Login';
import DownloadIcon from '@mui/icons-material/Download';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import {Box, Button, Grid, IconButton, Typography} from "@mui/material";
import {
    useDeleteUserMutation,
    useEditUserMutation,
    useFetchStatsQuery,
    useFetchUsersQuery
} from "../store/api/endpoints.ts";
import {API_URL} from "../store/api/baseApi.tsx";
import UserEditModal from "./UserEditModal";
import {useState} from "react";
import CreateUserModal from "./CreateUserModal";


const commonColumns = [
    {field: "name", headerName: "Name", width: 200},
    {field: "role", headerName: "Role", width: 150},
    {field: "total_downloads", headerName: "Total Downloads", width: 150},
    {field: "total_logins", headerName: "Total Logins", width: 150},
];


const PerformanceSummary = ({}) => {
    const {data} = useFetchUsersQuery()
    const [deleteUser] = useDeleteUserMutation()
    const {data: stats, refetch: refetchStats} = useFetchStatsQuery()

    const [editUser, setEditUser] = useState(null)
    const [createUserModal, setCreateUserModal] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editUserMutation] = useEditUserMutation()

    const handleEditSubmit =  () => {
        editUserMutation({id: editUser.id, data: editUser})
        setOpenEditModal(false)
    };

    const columns = [
        ...commonColumns,
        {
            field: "edit",
            headerName: "Edit User",
            width: 200,
            renderCell: (params: any) => {
                return (
                    <IconButton onClick={()=>{
                        setEditUser(params.row)
                        setOpenEditModal(true);
                    }}>
                        <ModeEditOutlineIcon/>
                    </IconButton>
                );
            },
        },
        {
            field: "report",
            headerName: "Download Report",
            width: 200,
            renderCell: (params: any) => {
                const userId = params.row.id;
                return (
                    <IconButton onClick={() => {
                        handleDownloadButton(userId)
                    }}>
                        <ArticleIcon/>
                    </IconButton>
                );
            },
        },
        {
            field: "delete",
            headerName: "Delete User",
            width: 200,
            renderCell: (params: any) => {
                const userId = params.row.id;
                return (
                    <IconButton onClick={() => {
                        handleDeleteUser(userId)
                    }}>
                        <DeleteIcon/>
                    </IconButton>
                );
            },
        },
    ];

    const handleDownloadButton = (userId: string) => {
        const downloadUrl = API_URL + `users/${userId}/download_report`;
        window.open(downloadUrl, '_blank');
        refetchStats()
    }

    const handleDeleteUser = (userId: string) => {
        deleteUser(userId)
    }

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Performance Overview
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Button onClick={() => {setCreateUserModal(true)}}>Create User</Button>
            </Box>
            <Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7} lg={4} xl={4}>
                        <Widget
                            title="Total Users"
                            amount={stats?.total_users || 0}
                            icon={<PeopleIcon/>}
                        />
                    </Grid>

                    <Grid item xs={12} md={7} lg={4} xl={4}>
                        <Widget
                            title="Logins Today"
                            amount={stats?.total_logins_today || 0}
                            icon={<LoginIcon/>}
                        />
                    </Grid>
                    <Grid item xs={12} md={7} lg={4} xl={4}>
                        <Widget
                            title="Downloads Today"
                            amount={stats?.total_downloads_today || 0}
                            icon={<DownloadIcon/>}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{height: 400, width: "100%", my: 3}}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    slots={{toolbar: GridToolbar}}
                    pageSizeOptions={[5]}
                    slotProps={{toolbar: {showQuickFilter: true, quickFilterProps: {debounceMs: 500}}}}
                    disableRowSelectionOnClick
                />
            </Box>
            <UserEditModal open={openEditModal} editUser={editUser} setEditUser={setEditUser}  onClose={() => setOpenEditModal(false)} handleEditSubmit={handleEditSubmit}/>
            <CreateUserModal open={createUserModal} onClose={() => {setCreateUserModal(false)}}/>
        </>
    );
};

export default PerformanceSummary;