import React, { PureComponent } from 'react'
import classNames from 'classnames'

import '../styles/Axis.css'
import './App.css'
import Attribute from './Attribute'
import DropPlaceholder from './DropPlaceholder'

import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

class App extends PureComponent {
  constructor ( props ) {
    super( props )
    this.el = null
  }

  componentDidMount () {
    this.el = document.getElementById( 'line-chart' )
    this.sub = fromEvent( window, 'resize' )
      .pipe( debounceTime( 500 ))
      .subscribe( _ => {
        const width = this.el.clientWidth
        const height = this.el.clientHeight
        this.props.onUpdateAxisScale({ width, height })
      })
  }

  componentDidUnMount () {
    this.sub.unsubscribe()
  }

  handleChange ( e ) {
    e.preventDefault()
    e.stopPropagation()
    const width = this.el.clientWidth
    const height = this.el.clientHeight
    this.props.onSelectDataset( e.target.value, { width, height })
  }

  handleLineMouseEnter ( id, e ) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onLineOver({ id, status: true })
  }

  handleLineMouseLeave ( id, e ) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onLineOver({ id, status: false })
  }

  handleEntityMouseEnter ( id, e ) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onLineOver({ id, status: true })
  }

  handleEntityMouseLeave ( id, e ) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onLineOver({ id, status: false })
  }

  handleClick ( id, e ) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onLineClick({ id })
  }

  handleDrop ( parent, attribute ) {
    switch ( parent ) {
      case 'xAxis':
        break
      case 'yAxis':
        break
      case 'entity':
        this.props.onAddEntity({ attribute })
        break
      default:
        break
    }
  }

  handleSmallMultipleClick ( key, e ) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onSmallMultiple( key )
  }

  svgRef = () => {}

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
          <button onClick={this.handleSmallMultipleClick.bind( this, 'day' )}>
            Day Small-Multiples
          </button>
          <button onClick={this.handleSmallMultipleClick.bind( this, 'week' )}>
            Week Small-Multiples
          </button>
          <button onClick={this.handleSmallMultipleClick.bind( this, 'month' )}>
            Month Small-Multiples
          </button>
          <button onClick={this.handleSmallMultipleClick.bind( this, 'year' )}>
            Year Small-Multiples
          </button>
        </div>
        <div className="Chart">
          <div id="chart-header" />

          <div id="attribute-header" />
          <div id="attribute">
            {Object.keys( this.props.attrs ).map( name => (
              <Attribute key={name} name={name} />
            ))}
          </div>

          <div id="corner-top-left" />
          <div id="corner-top-right" />

          <div id="margin-top" />
          <div id="margin-left" />

          <div id="line-chart">
            <DropPlaceholder
              className="y-axis-drop-box"
              onDrop={this.handleDrop.bind( this, 'xAxis' )}
            />
            <DropPlaceholder
              className="x-axis-drop-box"
              onDrop={this.handleDrop.bind( this, 'yAxis' )}
            />

            <svg id="svg">
              <g className="x-axis" />
              <g className="y-axis" />
              <g className="x-grid" />
              <g className="y-grid" />
              <g className="lines">
                {this.props.lineIds.map( key => [
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
                    onMouseEnter={this.handleLineMouseEnter.bind( this, key )}
                    onMouseLeave={this.handleLineMouseLeave.bind( this, key )}
                    onClick={this.handleClick.bind( this, key )}
                  />,
                ])}
              </g>
            </svg>
          </div>

          <div id="margin-bottom" />
          <div id="margin-right">
            <DropPlaceholder
              className="entity-drop-box"
              onDrop={this.handleDrop.bind( this, 'entity' )}
            />
            {this.props.entityIds.map( entityName => (
              <div className="entity-wrapper" key={entityName}>
                {Object.keys( this.props.entityById[entityName]).map( key => (
                  <div
                    key={key}
                    style={this.props.entityById[entityName][key].style}
                    onMouseEnter={this.handleEntityMouseEnter.bind(
                      this,
                      this.props.entityById[entityName][key].id
                    )}
                    onMouseLeave={this.handleEntityMouseLeave.bind(
                      this,
                      this.props.entityById[entityName][key].id
                    )}>
                    {key}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div id="corner-bottom-left" />
          <div id="corner-bottom-right" />

          <div id="chart-footer" />
          <div id="canvas" />
          <div id="canvas-header" />
        </div>
        <div id="tooltip" />
      </div>
    )
  }
}

export default App
