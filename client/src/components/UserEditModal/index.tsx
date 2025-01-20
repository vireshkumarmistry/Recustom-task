import {Box, Button, Modal, TextField, Typography} from '@mui/material';
import styles from './index.module.css';

interface User {
    name: string;
    email: string;
    password: string;
}

interface UserEditModalProps {
    open: boolean;
    onClose: () => void;
    editUser: User | null;
    setEditUser: React.Dispatch<React.SetStateAction<User | null>>;
    handleEditSubmit: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
                                                         open,
                                                         onClose,
                                                         editUser,
                                                         setEditUser,
                                                         handleEditSubmit,
                                                     }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box className={styles.modalBox}>
                <Typography variant="h6">Edit User</Typography>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Name</label>
                    <TextField
                        name="name"
                        value={editUser?.name || ''}
                        onChange={(e) => setEditUser({...editUser!, name: e.target.value})}
                        fullWidth
                        autoComplete="off"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <TextField
                        name="email"
                        type="email"
                        value={editUser?.email || ''}
                        onChange={(e) =>
                            setEditUser({...editUser!, email: e.target.value})
                        }
                        fullWidth
                        autoComplete="off"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <TextField
                        name="password"
                        type="password"
                        value={editUser?.password || ''}
                        onChange={(e) =>
                            setEditUser({...editUser!, password: e.target.value})
                        }
                        fullWidth
                        autoComplete="off"
                    />
                </div>
                <div className={styles.modalButtons}>
                    <Button
                        variant="contained"
                        className={styles.submitButton}
                        onClick={handleEditSubmit}
                    >
                        Save Changes
                    </Button>
                    <Button
                        variant="outlined"
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default UserEditModal;
