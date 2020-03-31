import React from 'react'
import { Icon, List, Popup } from 'semantic-ui-react'
import { Text } from '@statisticsnorway/ssb-component-library'

import { AUTH_API, SSB_COLORS } from '../configurations'

export const DescriptionPopup = (trigger, position='top left', description) =>
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

const ListItemUnkown = value =>
  <List.Item key={value} style={{ color: SSB_COLORS.BLUE }}>
    <Icon name='question' />
    {value}
  </List.Item>

export const RolesView = (key, data) => {
  switch (key) {
    case AUTH_API.ROLE_OBJECT.STRING[0]:
    case AUTH_API.ROLE_OBJECT.STRING[1]:
      return <Text>{data.toString()}</Text>

    case AUTH_API.ROLE_OBJECT.ARRAY[0]:
    case AUTH_API.ROLE_OBJECT.ARRAY[1]:
      return (
        <List horizontal size='large'>
          {AUTH_API.ENUMS[key.toUpperCase()].map(value => {
            if (Object.keys(data).length === 0) {
              return ListItemGood(value)
            } else {
              if (data.hasOwnProperty(AUTH_API.EXCLUDES)) {
                if (data[AUTH_API.EXCLUDES].includes(value)) {
                  return ListItemBad(value)
                } else {
                  return ListItemGood(value)
                }
              } else {
                if (data.hasOwnProperty(AUTH_API.INCLUDES)) {
                  if (!data[AUTH_API.INCLUDES].includes(value)) {
                    return ListItemBad(value)
                  } else {
                    return ListItemGood(value)
                  }
                } else {
                  return ListItemUnkown(value)
                }
              }
            }
          })}
        </List>
      )

    case AUTH_API.ROLE_OBJECT.ENUM:
      return (
        <List horizontal size='large'>
          {AUTH_API.ENUMS.VALUATIONS.map(value => {
              if (data === value) {
                return (
                  <List.Item key={value} style={{ fontWeight: 'bold', color: SSB_COLORS.GREEN }}>{value}</List.Item>
                )
              } else {
                return <List.Item key={value} disabled>{value}</List.Item>
              }
            }
          )}
        </List>
      )

    case AUTH_API.ROLE_OBJECT.LIST:
      return <List size='large'>{data[AUTH_API.INCLUDES].map(path => <List.Item key={path}>{path}</List.Item>)}</List>

    default:
      return <Text>{data.toString()}</Text>
  }
}

export const GroupsView = (key, data) => {
  switch (key) {
    case AUTH_API.GROUP_OBJECT.STRING[0]:
    case AUTH_API.GROUP_OBJECT.STRING[1]:
      return <Text>{data.toString()}</Text>

    case AUTH_API.GROUP_OBJECT.LIST:
      return <List size='large'>{data.map(path => <List.Item key={path}>{path}</List.Item>)}</List>

    default:
      return <Text>{data.toString()}</Text>
  }
}
