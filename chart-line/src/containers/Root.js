import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchData } from '../actions/data'

import App from '../components/App'

import './Root.css'
class Root extends Component {
  componentDidMount () {
    this.props.fetchData()
  }

  render () {
    return (
      <div className="Root">
        {this.props.isFetching ? <div>Loading...</div> : <App />}
      </div>
    )
  }
}

const mapStateToProps = ( state, _ ) => ({
  isFetching: state.data.isFetching,
})

const mapDispatchToProps = dispatch => ({
  fetchData: _ => dispatch( fetchData( _ )),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Root )
