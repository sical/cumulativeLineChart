import React, { Component } from 'react'
import './App.css'

class App extends Component {
  handleChange ( e ) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onSelectDataset( e.target.value )
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
                {this.props.lines.map( line => (
                  <path key={line.id} d={line.d} style={line.style} />
                ))}
              </g>
              <g className="dots">
                {this.props.dots.map( dot =>
                  dot.children.map(( d, index ) => (
                    <circle
                      key={dot.id + index}
                      cx={d.cx}
                      cy={d.cy}
                      style={dot.style}
                    />
                  ))
                )}
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
