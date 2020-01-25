import React from 'react';
import Box from '@material-ui/core/Box';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';

const FolderItem = props => {
    const {item} = props
    return (
        <Box>
            <FolderOpenOutlinedIcon />
            <span>{item.name}</span>
        </Box>
    )
}

export default FolderItem