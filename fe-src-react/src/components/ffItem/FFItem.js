import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FileOutlineIcon from '@material-ui/icons/DescriptionOutlined';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';

const useStyles = makeStyles(theme => ({
    ffItem: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        "& svg": {
            margin: `0 ${theme.spacing(1)}px`
        }
    },
    fileIcon: {
        
    }
}))

const FFItem = props => {
    const {item} = props
    const classes = useStyles()

    return (
        <Box className={classes.ffItem} mt={1}> 
            {
                item.isDirectory()
                    ? <FolderOpenOutlinedIcon /> 
                    : <FileOutlineIcon />
            }
            <span>{item.name}</span>
        </Box>
    )
}

export default FFItem