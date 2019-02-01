export const DataAction = {
  FETCH_DATA: 'FETCH_DATA',
  REQ_FETCH_DATA: 'REQ_FETCH_DATA',
  FETCH_DATA_SUCCESS: 'FETCH_DATA_SUCCESS',
  FETCH_DATA_FAILURE: 'FETCH_DATA_FAILURE',
}

export const fetchData = payload => ( dispatch, getState ) => {
  dispatch( reqFetchData() )

  console.log( ' load data ', payload )

  setTimeout( () => {
    dispatch( fetchDataSuccess() )
  }, 2000 )
}
export const reqFetchData = _ => ( { type: DataAction.REQ_FETCH_DATA } )
export const fetchDataSuccess = _ => ( { type: DataAction.FETCH_DATA_SUCCESS } )
export const fetchDataFailure = _ => ( { type: DataAction.FETCH_DATA_FAILURE } )
