import React, { PureComponent } from 'react'
import '../styles/Axis.css'

// import { fromEvent } from 'rxjs'
// import { debounceTime } from 'rxjs/operators'

class Axis extends PureComponent {
  render () {
    return (
      <div id={this.props.id}>
        <div id={this.props.id + '-title'} />
        <div id={this.props.id + '-labels'}>
          {this.props.ticks.map( d => (
            <div key={d.label} style={d.style}>
              <span>{d.label}</span>
            </div>
          ))}
        </div>
        <div id={this.props.id + '-ticks'}>
          {this.props.ticks.map(( d, index ) =>
            index === this.props.ticks.length - 1 ? null : (
              <div key={d.label} style={d.style}>
                <div className={this.props.id + '-tick-wrapper'}>
                  <div className={this.props.id + '-tick'} />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    )
  }
}

export default Axis
