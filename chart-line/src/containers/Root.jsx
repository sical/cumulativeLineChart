import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchData } from '../actions/dataset'

import App from '../components/App'

import './Root.css'
class Root extends Component {
  componentDidMount () {
    this.props.fetchData()
  }

  render () {
    return (
      <div className="Root">
        {this.props.isFetching ? (
          <div>Loading...</div>
        ) : (
          <App
            datasetById={this.props.datasetById}
            datasetIds={this.props.datasetIds}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = ( state, _ ) => ({
  isFetching: state.dataset.isFetching,
  datasetById: state.dataset.byId,
  datasetIds: state.dataset.ids,
})

const mapDispatchToProps = dispatch => ({
  fetchData: _ => dispatch( fetchData( _ )),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Root )
