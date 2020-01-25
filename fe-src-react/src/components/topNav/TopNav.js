import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles(theme => ({
    topNav: {
        display: "flex",
        alignItems: "center",
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: "#fff",
        zIndex: 99,
        top: 0,
        "& svg": {
            marginRight: theme.spacing(.5),
            padding: `0 ${theme.spacing(1)}px`,
            width: "auto",
            borderRadius: 4
        },
        "& svg:hover": {
            backgroundColor: '#eee'
        },
        "& svg:active": {
            backgroundColor: '#ccc'
        }
    },
    navUrlBar: {
        flexGrow: 1,
        "& input": {
            padding: `${theme.spacing(.5)}px ${theme.spacing(1)}px`
        }
    },
    navIcon: {

    }
}))

const TopNav = props => {
    const classes = useStyles()
    const {url, handleDirTraverse} = props
    const handleNav = direction => {
        handleDirTraverse({direction})
    }
    return (
        <Box px={1} pt={2} className={classes.topNav}>
            <KeyboardArrowLeftIcon onClick={() => handleNav("LEFT")} />
            <KeyboardArrowRightIcon onClick={() => handleNav("RIGHT")} />
            <KeyboardArrowUpIcon onClick={() => handleNav("UP")} />
            <TextField 
                value={url}
                variant="outlined" 
                autocomplete="off" 
                autocorrect="off" 
                autocapitalize="off" 
                spellcheck="false"
                className={classes.navUrlBar} />
        </Box>
    )
}

export default TopNav