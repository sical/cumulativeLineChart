import React, { Component } from 'react'
import classNames from 'classnames'

import './App.css'

class App extends Component {
  handleChange ( e ) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onSelectDataset( e.target.value )
  }

  handleMouseEnter ( id, e ) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onLineOver({ id, status: true })
  }

  handleMouseLeave ( id, e ) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onLineOver({ id, status: false })
  }

  handleClick ( id, e ) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onLineClick({ id })
  }

  render () {
    return (
      <div className="App">
        <div className="Toolbar">
          <div className="dataset-select">
            <select name="dataset" onChange={this.handleChange.bind( this )}>
              <option value={null}>---</option>
              {( this.props.datasetIds || []).map( key => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="Chart">
          <div id="margin-top" />
          <div id="margin-right" />
          <div id="corner-top-right" />
          <div id="corner-top-left" />
          <div id="margin-left" />
          <div id="margin-bottom" />
          <div id="corner-bottom-left" />
          <div id="corner-bottom-right" />
          <div id="attribute-header" />
          <div id="canvas-header" />
          <div id="chart-header" />
          <div id="chart-footer" />
          <div id="attribute">
            {Object.keys( this.props.attrs ).map( key => (
              <div key={key} className="attribute-label">
                <span>{key}</span>
              </div>
            ))}
          </div>
          <div id="line-chart">
            <svg>
              <g className="x-axis" />
              <g className="y-axis" />
              <g className="x-grid" />
              <g className="y-grid" />
              <g className="lines">
                {this.props.lineIds.map( key => [
                  <path
                    className={classNames( 'line-ink', {
                      'ink-pressed': this.props.lineById[key].isPressed,
                      'ink-over':
                        !this.props.lineById[key].isPressed &&
                        this.props.lineById[key].isHovered,
                      'ink-hide':
                        !this.props.lineById[key].isHovered &&
                        this.props.lineById.isHovered,
                    })}
                    id={this.props.lineById[key].id}
                    key={this.props.lineById[key].id + 'ink'}
                    d={this.props.lineById[key].d}
                    style={this.props.lineById[key].inkStyle}
                  />,
                  <path
                    className={classNames( 'line-shadow', {
                      'shadow-over': this.props.lineById[key].isHovered,
                    })}
                    key={this.props.lineById[key].id + 'shadow'}
                    d={this.props.lineById[key].d}
                    style={this.props.lineById[key].shadowStyle}
                    onMouseEnter={this.handleMouseEnter.bind( this, key )}
                    onMouseLeave={this.handleMouseLeave.bind( this, key )}
                    onClick={this.handleClick.bind( this, key )}
                  />,
                  this.props.lineById[key].dots.map(( d, index ) => (
                    <circle
                      className={classNames( 'dot-ink', {
                        'ink-pressed': this.props.lineById[key].isPressed,
                        'ink-over': this.props.lineById[key].isHovered,
                      })}
                      key={this.props.lineById[key].id + index}
                      cx={d.cx}
                      cy={d.cy}
                      style={this.props.lineById[key].dotStyle}
                    />
                  )),
                ])}
              </g>
            </svg>
          </div>
          <div id="canvas" />
        </div>
        <div id="tooltip" />
      </div>
    )
  }
}

export default App
