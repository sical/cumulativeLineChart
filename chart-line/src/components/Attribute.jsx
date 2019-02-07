import React from 'react'
import { DragSource } from 'react-dnd'

const attributeSource = {
  beginDrag ( props ) {
    return {
      name: props.name,
    }
  },
  endDrag ( _ /*props*/, monitor /* component*/ ) {
    if ( !monitor.didDrop()) {
      return
    }
    // const item = monitor.getItem()
    // const dropResult = monitor.getDropResult()
  },
}

const Attribute = ({ name, isDragging, connectDragSource }) => {
  const border = isDragging ? '1px dashed #fff' : 'none'
  return connectDragSource(
    <div className="attribute-label" style={{ border }}>
      <span>{name}</span>
    </div>
  )
}

export const ItemType = {
  ATTRIBUTE: 'attribute',
}

export default DragSource(
  ItemType.ATTRIBUTE,
  attributeSource,
  ( connect, monitor ) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)( Attribute )
