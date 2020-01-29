import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { isDirectory, getParentPath } from '../../service/FileManager'
import { actionGoForward, actionGoBackward, actionGoToUrl } from '../../redux/actions'
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
        height: 50,
        backgroundColor: "#fff",
        zIndex: 99,
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
    const { url, goForward, goBackward, goToUrl } = props
    const [ urlTxt, setUrlTxt ] = useState(url)

    useEffect(() => setUrlTxt(props.url), [props])

    const handleEnterUrl = e => {
        if (e.keyCode === 13) {
            if (isDirectory(urlTxt)) {
                goToUrl(urlTxt)
            }
            else {
                alert(`"${urlTxt}" - is not a valid directory`)
            }
        }
    }

    const goOneUp = () => {
        const parentUrl = getParentPath(url)
        if (parentUrl) {
            goToUrl(parentUrl)
        }
    }

    return (
        <Box px={1} className={classes.topNav} boxShadow={1}>
            <KeyboardArrowLeftIcon onClick={goBackward} />
            <KeyboardArrowRightIcon onClick={goForward} />
            <KeyboardArrowUpIcon onClick={goOneUp} />
            <TextField 
                value={urlTxt}
                variant="outlined" 
                autoComplete="off" 
                autoCorrect="off" 
                autoCapitalize="off" 
                spellCheck="false"
                className={classes.navUrlBar} 
                onKeyUp={e => handleEnterUrl(e)}
                onChange={e => setUrlTxt(e.target.value)}
            />
        </Box>
    )
}

const mapStateToProps = state => ({
    url: state.fmr.url
})

const mapDispatchToProps = dispatch => ({
    goForward: () => dispatch(actionGoForward()),
    goBackward: () => dispatch(actionGoBackward()),
    goToUrl: url => dispatch(actionGoToUrl(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(TopNav)