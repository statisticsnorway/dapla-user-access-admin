import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Button, Divider, Dropdown, Icon, Input } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../context/AppContext'
import { AUTH_API, CATALOG_API } from '../configurations'
import { DATASET_STATE, PRIVILEGE, TEST_IDS, UI, USER_ACCESS, VALUATION } from '../enums'

function AppHome () {
  const { authApi, catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [path, setPath] = useState('')
  const [userId, setUserId] = useState('')
  const [state, setState] = useState(AUTH_API.ENUMS.STATES[0])
  const [pathOptions, setPathOptions] = useState([])
  const [verdict, setVerdict] = useState(USER_ACCESS.VERDICTS.UNKOWN)
  const [privilege, setPrivilege] = useState(AUTH_API.ENUMS.PRIVILEGES[0])
  const [maxValuation, setMaxValuation] = useState(AUTH_API.ENUMS.VALUATIONS[0])

  const [{ data: getData, loading: getLoading, error: getError }] =
    useAxios(`${catalogApi}${CATALOG_API.GET_CATALOGS}`)
  const [{ loading, error, response }, refetch] = useAxios(
    `${authApi}${AUTH_API.GET_ACCESS(path, privilege, state, maxValuation, userId)}`, { manual: true }
  )

  useEffect(() => {
    if (!getLoading && !getError && getData !== undefined) {
      try {
        setPathOptions(getData[CATALOG_API.CATALOGS].map(catalog => {
          const catalogPath = catalog[CATALOG_API.CATALOG_OBJECT.OBJECT.NAME][CATALOG_API.CATALOG_OBJECT.OBJECT.STRING[0]]

          return {
            key: catalogPath,
            text: catalogPath,
            value: catalogPath
          }
        }))
      } catch (e) {
        console.log(e)
      }
    }
  }, [getLoading, getError, getData])

  useEffect(() => {
    if (!loading && !error && response) {
      console.log(response)
      setVerdict(response.status)
    }

    if (!loading && error) {
      console.log(error.response)
      setVerdict(error.response.status)
    }
  }, [error, loading, response])

  return (
    <>
      {`${USER_ACCESS.GUIDE[0][language]} `}
      <Input
        value={userId}
        placeholder={UI.USER[language]}
        onChange={(event, { value }) => {
          setUserId(value)
          setVerdict(USER_ACCESS.VERDICTS.UNKOWN)
        }}
      />
      {` ${USER_ACCESS.GUIDE[1][language]} `}
      <Dropdown
        inline
        value={privilege}
        options={AUTH_API.ENUMS.PRIVILEGES.map(option =>
          ({ key: option, text: PRIVILEGE[option][language], value: option })
        )}
        onChange={(event, { value }) => {
          setVerdict(USER_ACCESS.VERDICTS.UNKOWN)
          setPrivilege(value)
        }}
      />
      {` ${USER_ACCESS.GUIDE[2][language]} `}
      <Dropdown
        search
        selection
        value={path}
        allowAdditions
        options={pathOptions}
        data-testid={TEST_IDS.SEARCH_DROPDOWN}
        additionLabel={`${UI.ADD[language]} `}
        placeholder={USER_ACCESS.DATASETS[language]}
        noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
        onChange={(event, { value }) => {
          setVerdict(USER_ACCESS.VERDICTS.UNKOWN)
          setPath(value)
        }}
        onAddItem={(event, { value }) => setPathOptions(
          [{ key: value, text: value, value: value }, ...pathOptions]
        )}
      />
      {` ${USER_ACCESS.GUIDE[3][language]} `}
      <Dropdown
        inline
        value={state}
        options={AUTH_API.ENUMS.STATES.map(option =>
          ({ key: option, text: DATASET_STATE[option][language], value: option })
        )}
        onChange={(event, { value }) => {
          setVerdict(USER_ACCESS.VERDICTS.UNKOWN)
          setState(value)
        }}
      />
      {` ${USER_ACCESS.GUIDE[4][language]} `}
      <Dropdown
        inline
        value={maxValuation}
        options={AUTH_API.ENUMS.VALUATIONS.map(valuation =>
          ({ key: valuation, text: VALUATION[valuation][language], value: valuation })
        )}
        onChange={(event, { value }) => {
          setVerdict(USER_ACCESS.VERDICTS.UNKOWN)
          setMaxValuation(value)
        }}
      />
      <Divider hidden />
      {`${USER_ACCESS.ACCESS[language]}: `}
      {loading ? <Icon loading size='large' name='sync alternate' style={{ color: SSB_COLORS.BLUE }} /> :
        <>
          <Icon
            size='large'
            name={
              verdict === USER_ACCESS.VERDICTS.UNKOWN ?
                'question' : verdict === USER_ACCESS.VERDICTS.OK ?
                'check' : verdict === USER_ACCESS.VERDICTS.FORBIDDEN ?
                  'ban' : 'exclamation triangle'
            }
            style={{
              color:
                verdict === USER_ACCESS.VERDICTS.UNKOWN ?
                  SSB_COLORS.BLUE : verdict === USER_ACCESS.VERDICTS.OK ?
                  SSB_COLORS.GREEN : verdict === USER_ACCESS.VERDICTS.FORBIDDEN ?
                    SSB_COLORS.RED : SSB_COLORS.YELLOW
            }}
          />
          {`(${verdict})`}
        </>
      }
      <Divider hidden />
      <Button primary disabled={loading} onClick={() => refetch()}>{USER_ACCESS.CHECK[language]}</Button>
    </>
  )
}

export default AppHome
