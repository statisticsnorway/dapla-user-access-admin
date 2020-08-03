import React from 'react'
import { Icon, List, Popup } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { AUTH_API, checkAccess } from '../configurations'
import { DATASET_STATE, PRIVILEGE, VALUATION } from '../enums'

export const DescriptionPopup = (trigger, description = false, position = 'top left') =>
  <Popup basic flowing position={position} trigger={trigger}>
    <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
    {description ? description : '[Placeholder description]'}
  </Popup>

const ListItemBad = value =>
  <List.Item key={value} style={{ color: SSB_COLORS.RED }}>
    <Icon name='ban' />
    {value}
  </List.Item>

const ListItemGood = value =>
  <List.Item key={value} style={{ color: SSB_COLORS.GREEN }}>
    <Icon name='check' />
    {value}
  </List.Item>

export const PseudoConfigView = pseudoConfig => {
  if (typeof pseudoConfig === 'object' && pseudoConfig !== null) {
    if (Object.keys(pseudoConfig).length !== 0) {
      return <Popup
        basic
        flowing
        position='left center'
        trigger={<Icon name='key' style={{ color: SSB_COLORS.YELLOW }} />}
      >
        <pre>{JSON.stringify(pseudoConfig, null, 2)}</pre>
      </Popup>
    } else {
      return null
    }
  } else {
    return null
  }
}

export const RolesView = (key, data, language) => {
  switch (key) {
    case AUTH_API.ROLE_OBJECT.STRING[0]:
    case AUTH_API.ROLE_OBJECT.STRING[1]:
      return data.toString()

    case AUTH_API.ROLE_OBJECT.ARRAY[0]:
      return (
        <List horizontal size='large'>
          {AUTH_API.ENUMS[key.toUpperCase()].map(value =>
            checkAccess(data, value) ?
              ListItemGood(PRIVILEGE[value][language])
              :
              ListItemBad(PRIVILEGE[value][language])
          )}
        </List>
      )
    case AUTH_API.ROLE_OBJECT.ARRAY[1]:
      return (
        <List horizontal size='large'>
          {AUTH_API.ENUMS[key.toUpperCase()].map(value =>
            checkAccess(data, value) ?
              ListItemGood(DATASET_STATE[value][language])
              :
              ListItemBad(DATASET_STATE[value][language])
          )}
        </List>
      )

    case AUTH_API.ROLE_OBJECT.ENUM:
      return (
        <List horizontal size='large'>
          {AUTH_API.ENUMS.VALUATIONS.map(value => {
              if (data === value) {
                return (
                  <List.Item key={value} style={{ fontWeight: 'bold', color: SSB_COLORS.GREEN }}>
                    {VALUATION[value][language]}
                  </List.Item>
                )
              } else {
                return <List.Item key={value} disabled>{VALUATION[value][language]}</List.Item>
              }
            }
          )}
        </List>
      )

    case AUTH_API.ROLE_OBJECT.LIST:
      return <List size='large'>
        {data.hasOwnProperty(AUTH_API.INCLUDES) && data[AUTH_API.INCLUDES].map(path =>
          <List.Item key={path} style={{ color: SSB_COLORS.GREEN }}>{path}</List.Item>
        )}
        {data.hasOwnProperty(AUTH_API.EXCLUDES) && data[AUTH_API.EXCLUDES].map(path =>
          <List.Item key={path} style={{ color: SSB_COLORS.RED }}>{path}</List.Item>
        )}
      </List>

    default:
      return data.toString()
  }
}

export const GroupsView = (key, data) => {
  switch (key) {
    case AUTH_API.GROUP_OBJECT.STRING[0]:
    case AUTH_API.GROUP_OBJECT.STRING[1]:
      return data.toString()

    case AUTH_API.GROUP_OBJECT.LIST:
      return <List size='large'>{data.map(role => <List.Item key={role}>{role}</List.Item>)}</List>

    default:
      return data.toString()
  }
}
