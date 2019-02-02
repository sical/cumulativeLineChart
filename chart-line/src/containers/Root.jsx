import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchData } from '../actions/dataset'
import { selectDataset } from '../actions/data'

import App from '../components/App'

import './Root.css'
class Root extends Component {
  componentDidMount () {
    this.props.fetchData()
  }

  handleSelectDataset ( id ) {
    this.props.selectDataset({ id, datasetById: this.props.datasetById })
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
            attrs={this.props.attrs}
            lines={this.props.lines}
            dots={this.props.dots}
            onSelectDataset={this.handleSelectDataset.bind( this )}
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
  attrs: state.data.attrs,
  lines: state.line.lines,
  dots: state.dot.dots,
})

export default connect(
  mapStateToProps,
  { fetchData, selectDataset }
)( Root )
