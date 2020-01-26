import React from 'react';
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FileOutlineIcon from '@material-ui/icons/DescriptionOutlined';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import LinkIcon from '@material-ui/icons/Link';

const useStyles = makeStyles(theme => ({
    ffItem: {
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        
        "& svg": {
            margin: `0 ${theme.spacing(1)}px`
        },
        "&:hover": {
            backgroundColor: '#eee'
        },
        "&:active": {
            backgroundColor: '#ccc'
        }
    },
    fileIcon: {
        
    },
    dotItem: {
        "& svg": {
            opacity: '.3'
        },
        "& itemName": {
            opacity: '.8'
        }
    },
    itemName: {
        width: 270,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }
}))

const FFItem = props => {
    const {item, handleDirTraverse} = props
    const classes = useStyles()

    const tryToOpen = dirEntry => {
        if(item.isDirectory()) {
            handleDirTraverse({
                direction: "DOWN",
                folderName: dirEntry.name
            })
        }
        else {
            console.log("Currently cannot open ", dirEntry.name)
        }
    }
    

    const itemClass = item.name[0] === '.' ? classes.dotItem : ''

    return (
        <Box mt={1}
            className={clsx(classes.ffItem, itemClass)} 
            title={item.name}
            onDoubleClick={() => tryToOpen(item)}
        > 
            { item.isDirectory() && <FolderOpenOutlinedIcon /> }
            { item.isFile() && <FileOutlineIcon /> }
            { item.isSymbolicLink() && <LinkIcon /> }
            <span className={clsx(classes.itemName, 'itemName')}>{item.name}</span>
        </Box>
    )
}

export default FFItem