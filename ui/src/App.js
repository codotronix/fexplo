import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import './App.css'
import TopNav from './components/topNav/TopNav'
import FFContainer from './components/ffContainer/FFContainer'
import * as Actions from './redux/actions'

const App = props => {
  useEffect(() => {
    props.initStateToHome()
  }, [props])

  return (
    <div className="App">
      <TopNav />
      {/* <FFContainer /> */}
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  initStateToHome: () => dispatch(Actions.initStateToHome())
})

export default connect(null, mapDispatchToProps)(App)
