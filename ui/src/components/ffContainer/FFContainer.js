import React from 'react'
import Box from '@material-ui/core/Box'
import FFItem from '../ffItem/FFItem'
import { connect } from 'react-redux'

const FFContainer = props => {
    const { ffList } = props
    
    return (
        <Box px={2} py={1} mt={5}>
            {
                ffList.map( l => 
                    <FFItem item={l} key={l.name} 
                        handleDirTraverse={() => {}}
                    />
                )
            }
        </Box>
    )
}

const mapStateToProps = state => ({
    ffList: state.fmr.ffList
})
export default connect(mapStateToProps)(FFContainer);