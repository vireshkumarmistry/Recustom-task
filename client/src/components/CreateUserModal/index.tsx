import React, { useState } from "react";
import { Modal, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {useCreateUserMutation} from "../../store/api/endpoints.ts";

const ROLE_TYPES = [
    { value: "Admin", name: "Admin" },
    { value: "User", name: "User" },
];

const CreateUserModal: React.FC<{ open: boolean, onClose: () => void }> = ({ open, onClose }) => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [userRole, setUserRole] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [createUser] = useCreateUserMutation()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleRoleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setUserRole(e.target.value as string);
    };

    const handleSubmit = () => {
        if (!userData.name || !userData.email || !userData.password || !userRole) {
            setError("All fields are required");
            return;
        }

        const payload = { ...userData, role: userRole }
        createUser(payload)
        setUserData({
            name: "",
            email: "",
            password: "",
        })
        setUserRole("")
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div
                className="modalContent"
                style={{
                    padding: "20px",
                    backgroundColor: "white",
                    margin: "auto",
                    maxWidth: "400px",
                    marginTop: "100px",
                }}
            >
                <Typography variant="h6" sx={{ fontSize: "1.5rem", marginBottom: "16px" }}>
                    Create User
                </Typography>

                {error && <Typography color="error">{error}</Typography>}

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px" }}>Name</label>
                    <TextField
                        sx={{ width: "100%" }}
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        fullWidth
                        autoComplete="off"
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px" }}>Email</label>
                    <TextField
                        sx={{ width: "100%" }}
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        fullWidth
                        autoComplete="off"
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px" }}>Password</label>
                    <TextField
                        sx={{ width: "100%" }}
                        name="password"
                        type="password"
                        value={userData.password}
                        onChange={handleInputChange}
                        fullWidth
                        autoComplete="off"
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <FormControl variant="outlined" required sx={{ width: "100%" }}>
                        <InputLabel>User Type</InputLabel>
                        <Select
                            value={userRole}
                            onChange={handleRoleChange}
                            label="User Role"
                            name="role"
                        >
                            {ROLE_TYPES.map((role, i) => (
                                <MenuItem key={i} value={role.value}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <Button
                    variant="contained"
                    sx={{ marginTop: "16px" }}
                    onClick={handleSubmit}
                >
                    Create User
                </Button>
            </div>
        </Modal>
    );
};

export default CreateUserModal;
