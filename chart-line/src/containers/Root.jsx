import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { fetchData } from '../actions/dataset'
import { selectDataset } from '../actions/data'
import { lineOver, lineClick, smallMultiple, progLine } from '../actions/line'
import { addEntity } from '../actions/entity'
import { updateAxisScale } from '../actions/scale'

import App from '../components/App'
import './Root.css'

class Root extends PureComponent {
  componentDidMount () {
    this.props.fetchData()
  }

  handleSelectDataset ( id, state ) {
    this.props.selectDataset({ id, datasetById: this.props.datasetById, state })
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

  handleUpdateAxisScale ( state ) {
    this.props.updateAxisScale( state )
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
            onSmallMultiple={this.props.smallMultiple}
            onProgLine={this.props.progLine}
            onLineOver={this.handleLineOver.bind( this )}
            onLineClick={this.handleLineClick.bind( this )}
            onAddEntity={this.handleAddEntity.bind( this )}
            onUpdateAxisScale={this.handleUpdateAxisScale.bind( this )}
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
  xticks: state.scale.xticks,
  yticks: state.scale.yticks,
})

export default connect(
  mapStateToProps,
  {
    fetchData,
    selectDataset,
    lineOver,
    lineClick,
    addEntity,
    updateAxisScale,
    smallMultiple,
    progLine,
  }
)( Root )
