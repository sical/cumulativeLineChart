import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'

import { ItemType } from './Attribute'

const boxTarget = {
  drop ( props, monitor ) {
    //return { name: 'AxisDrop' }
    props.onDrop( monitor.getItem())
  },
}

class DropPlaceholder extends Component {
  render () {
    const { canDrop, isOver, connectDropTarget, className } = this.props
    const isActive = canDrop && isOver

    let background = '#ccc0',
      pointerEvents = 'none'
    if ( isActive ) {
      background = '#7775'
      pointerEvents = 'all'
    } else if ( canDrop ) {
      background = '#ccc4'
      pointerEvents = 'all'
    }

    return connectDropTarget(
      <div className={className} style={{ background, pointerEvents }} />
    )
  }
}

export default DropTarget(
  ItemType.ATTRIBUTE,
  boxTarget,
  ( connect, monitor ) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)( DropPlaceholder )
