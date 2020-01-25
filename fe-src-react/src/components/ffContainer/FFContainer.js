import React from 'react'
import Box from '@material-ui/core/Box'
// import FileItem from '../FileItem'
// import FolderItem from '../FolderItem'
import FFItem from '../ffItem/FFItem'

const FFContainer = props => {
    const { list } = props
    return (
        <Box px={2} py={1}>
            {
                list && list.map( l => <FFItem item={l} key={l.name}/>)
            }
        </Box>
    )
}

export default FFContainer;