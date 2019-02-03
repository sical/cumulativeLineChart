import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { fetchData } from '../actions/dataset'
import { selectDataset } from '../actions/data'
import { lineOver, lineClick } from '../actions/line'
import { addEntity } from '../actions/entity'

import App from '../components/App'
import './Root.css'

class Root extends PureComponent {
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

  handleAddEntity ({ attribute }) {
    this.props.addEntity({ attribute })
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
            entityById={this.props.entityById}
            entityIds={this.props.entityIds}
            onSelectDataset={this.handleSelectDataset.bind( this )}
            onLineOver={this.handleLineOver.bind( this )}
            onLineClick={this.handleLineClick.bind( this )}
            onAddEntity={this.handleAddEntity.bind( this )}
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
  entityById: state.entity.byId,
  entityIds: state.entity.ids,
})

export default connect(
  mapStateToProps,
  { fetchData, selectDataset, lineOver, lineClick, addEntity }
)( Root )
