import React from 'react';
import Box from '@material-ui/core/Box';
import FileOutlineIcon from '@material-ui/icons/DescriptionOutlined';

const FileItem = props => {
    const {item} = props
    return (
        <Box>
            <FileOutlineIcon />
            <span>{item.name}</span>
        </Box>
    )
}

export default FileItem