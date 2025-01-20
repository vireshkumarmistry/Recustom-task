import React from 'react';
import { Box } from '@mui/material';

interface PageContainerProps {
    children: React.ReactNode;
    title?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 1500,
                    padding: 3,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default PageContainer;
