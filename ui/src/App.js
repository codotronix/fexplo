import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import './App.scss'
import TopNav from './components/topNav/TopNav'
import FFContainer from './components/ffContainer/FFContainer'
import { actionGoToUrl } from './redux/actions'
import { getHomePath } from './service/FileManager'

const App = props => {
  useEffect(() => {
    const url = getHomePath()
    props.goToUrl(url)
  }, [props])

  return (
    <div className="App">
      <TopNav />
      <FFContainer />
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  goToUrl: url => dispatch(actionGoToUrl(url))
})

export default connect(null, mapDispatchToProps)(App)
