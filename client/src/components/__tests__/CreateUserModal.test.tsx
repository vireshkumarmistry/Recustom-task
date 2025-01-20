import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useCreateUserMutation } from '../../store/api/endpoints';
import CreateUserModal from "../CreateUserModal";

vi.mock('../../store/api/endpoints', () => ({
    useCreateUserMutation: vi.fn(),
}));

const mockOnClose = vi.fn();

describe('CreateUserModal', () => {
    it('renders the modal and shows the create user form', () => {
        render(<CreateUserModal open={true} onClose={mockOnClose} />);

        // Check if the modal opens with the correct content
        expect(screen.getByText('Create User')).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('User Role')).toBeInTheDocument();
    });

    it('displays error message if fields are empty and submit is clicked', async () => {
        render(<CreateUserModal open={true} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Create User'));

        // Check if the error message is displayed
        await waitFor(() => expect(screen.getByText('All fields are required')).toBeInTheDocument());
    });

    it('calls the createUser mutation when all fields are filled', async () => {
        const mockCreateUser = vi.fn();
        (useCreateUserMutation as vi.Mock).mockReturnValue([mockCreateUser]);

        render(<CreateUserModal open={true} onClose={mockOnClose} />);

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('User Role'), { target: { value: 'Admin' } });

        fireEvent.click(screen.getByText('Create User'));

        await waitFor(() => expect(mockCreateUser).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'Admin',
        }));

        // Check if the modal closes after submitting
        expect(mockOnClose).toHaveBeenCalled();
    });

});
