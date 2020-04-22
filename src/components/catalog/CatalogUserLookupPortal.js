import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Icon, Portal } from 'semantic-ui-react'

import { ApiContext, sortArrayOfObjects } from '../../utilities'
import { AUTH_API, CATALOG_API } from '../../configurations'
import { CatalogUserLookup } from '../index'

function CatalogUserLookupPortal ({ handleClose, handleOpen, index, open, path, valuation, state }) {
  const { authApi } = useContext(ApiContext)

  const [catalogAccess, setCatalogAccess] = useState([])
  const [direction, setDirection] = useState('descending')

  const [{ data, loading, error }, refetch] =
    useAxios(`${authApi}${AUTH_API.GET_CATALOGACCESS(path.split('/').join('.'), valuation, state)}`, { manual: true })

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      setCatalogAccess(sortArrayOfObjects(data[CATALOG_API.CATALOG_ACCESS], ['user', 'group', 'role']))
    }
    if (!loading && error) {
      console.log(error.response)
    }
  }, [data, error, loading])

  const handleSort = () => {
    setDirection(direction === 'ascending' ? 'descending' : 'ascending')
    setCatalogAccess(sortArrayOfObjects(data[CATALOG_API.CATALOG_ACCESS], ['user', 'group', 'role'], direction))
  }

  return (
    <Portal
      closeOnTriggerClick
      onClose={() => handleClose(index)}
      onOpen={() => {
        refetch()
        handleOpen(index)
      }}
      trigger={
        <Icon
          size='large'
          color={open[index] ? 'green' : 'black'}
          name={open[index] ? 'caret square down outline' : 'caret square right outline'}
        />
      }
    >
      <CatalogUserLookup
        catalogAccess={catalogAccess}
        handleSort={handleSort}
        direction={direction}
        loading={loading}
        error={error}
      />
    </Portal>
  )
}

export default CatalogUserLookupPortal
