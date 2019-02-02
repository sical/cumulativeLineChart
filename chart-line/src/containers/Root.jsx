import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchData } from '../actions/dataset'
import { selectDataset } from '../actions/data'
import { lineOver, lineClick } from '../actions/line'
import App from '../components/App'
import './Root.css'

class Root extends Component {
  componentDidMount () {
    this.props.fetchData()
  }

  handleSelectDataset ( id ) {
    this.props.selectDataset({ id, datasetById: this.props.datasetById })
  }

  handleLineOver ({ id, status }) {
    this.props.lineOver({ id, status })
  }

  handleLineClick ({ id, status }) {
    this.props.lineClick({ id, status })
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
            lineById={this.props.lineById}
            lineIds={this.props.lineIds}
            onSelectDataset={this.handleSelectDataset.bind( this )}
            onLineOver={this.handleLineOver.bind( this )}
            onLineClick={this.handleLineClick.bind( this )}
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
  lineById: state.line.byId,
  lineIds: state.line.ids,
})

export default connect(
  mapStateToProps,
  { fetchData, selectDataset, lineOver, lineClick }
)( Root )
