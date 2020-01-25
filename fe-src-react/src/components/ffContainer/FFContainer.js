import React from 'react'
import Box from '@material-ui/core/Box'
// import FileItem from '../FileItem'
// import FolderItem from '../FolderItem'
import FFItem from '../ffItem/FFItem'

const FFContainer = props => {
    const { list, handleDirTraverse } = props
    
    return (
        <Box px={2} py={1} mt={5}>
            {
                list && list.map( l => 
                    <FFItem item={l} key={l.name} 
                        handleDirTraverse={handleDirTraverse}
                    />
                )
            }
        </Box>
    )
}

export default FFContainer;