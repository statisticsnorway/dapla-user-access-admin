import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Dropdown, Icon } from 'semantic-ui-react'
import { Button as SSBButton, Text, Title } from '@statisticsnorway/ssb-component-library'

import { ApiContext, LanguageContext } from '../../utilities'
import { API, SSB_COLORS } from '../../configurations'
import { USER_ACCESS } from '../../enums'

function UserAcces ({ user }) {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [namespace, setNamespace] = useState(API.TEMP_DATASETS[0])
  const [privilege, setPrivilege] = useState(API.PRIVILEGES[0])
  const [state, setState] = useState(API.STATES[0])
  const [valuation, setValuation] = useState(API.VALUATIONS[0])
  const [verdict, setVerdict] = useState(USER_ACCESS.VERDICTS.UNKOWN)

  const [{ loading, error, response }, refetch] =
    useAxios(`${authApi}${API.GET_ACCESS(namespace, privilege, state, valuation, user)}`, { manual: true })

  useEffect(() => {
    if (!loading && !error && response) {
      setVerdict(response.statusText)
    }

    if (!loading && error) {
      setVerdict(error.response.statusText)
    }
  }, [error, loading, response])

  return (
    <>
      <Title size={3}>{USER_ACCESS.HEADER[language]}</Title>
      <Text>{`${USER_ACCESS.GUIDE[0][language]} `}</Text>
      <Dropdown
        inline
        options={API.PRIVILEGES.map(privilege => ({ key: privilege, text: privilege, value: privilege }))}
        defaultValue={API.PRIVILEGES[0]}
        onChange={(event, data) => {
          setVerdict(USER_ACCESS.VERDICTS.UNKOWN)
          setPrivilege(data.value)
        }}
      />
      <Text>{` ${USER_ACCESS.GUIDE[1][language]} `}</Text>
      <Dropdown
        inline
        options={API.TEMP_DATASETS.map(dataset => ({ key: dataset, text: dataset, value: dataset }))}
        defaultValue={API.TEMP_DATASETS[0]}
        onChange={(event, data) => {
          setVerdict(USER_ACCESS.VERDICTS.UNKOWN)
          setNamespace(data.value)
        }}
      />
      <Text>{` ${USER_ACCESS.GUIDE[2][language]} `}</Text>
      <Dropdown
        inline
        options={API.STATES.map(state => ({ key: state, text: state, value: state }))}
        defaultValue={API.STATES[0]}
        onChange={(event, data) => {
          setVerdict(USER_ACCESS.VERDICTS.UNKOWN)
          setState(data.value)
        }}
      />
      <Text>{` ${USER_ACCESS.GUIDE[3][language]} `}</Text>
      <Dropdown
        inline
        options={API.VALUATIONS.map(valuation => ({ key: valuation, text: valuation, value: valuation }))}
        defaultValue={API.VALUATIONS[0]}
        onChange={(event, data) => {
          setVerdict(USER_ACCESS.VERDICTS.UNKOWN)
          setValuation(data.value)
        }}
      />
      <Divider hidden />
      <Text style={{ fontWeight: 'bold' }}>{`${USER_ACCESS.ACCESS[language]}: `}</Text>
      {loading ? <Icon size='large' name='sync' style={{ color: SSB_COLORS.BLUE }} loading /> :
        <>
          <Icon
            size='large'
            name={
              verdict === USER_ACCESS.VERDICTS.UNKOWN ?
                'question' : verdict === USER_ACCESS.VERDICTS.OK ?
                'check' : 'ban'
            }
            style={{
              color:
                verdict === USER_ACCESS.VERDICTS.UNKOWN ?
                  SSB_COLORS.BLUE : verdict === USER_ACCESS.VERDICTS.OK ?
                  SSB_COLORS.GREEN : SSB_COLORS.RED
            }}
          />
          <Text>{`(${verdict})`}</Text>
        </>
      }
      <Divider hidden />
      <SSBButton primary disabled={loading} onClick={() => refetch()}>
        <Icon name='user secret' size='large' style={{ paddingRight: '0.5em' }} />
        {USER_ACCESS.CHECK[language]}
      </SSBButton>
    </>
  )
}

export default UserAcces
