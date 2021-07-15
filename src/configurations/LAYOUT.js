import React from 'react'
import { Divider, Grid, Header, Icon, Item, List, Message, Popup, Table } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { AUTH_API } from './API'
import { DATASET_STATE, ROLES, TEST_IDS, VALUATION } from '../enums'

export const populatedDropdown = (label, loading, refetch, error, errorTitle, length) =>
  <label>
    {`${label} `}
    <Icon
      link
      fitted
      color="blue"
      loading={loading}
      name="sync alternate"
      onClick={() => refetch()}
      data-testid={TEST_IDS.DROPDOWN_REFRESH}
    />
    <span style={{ fontSize: 'smaller', fontWeight: 'normal' }}>{` (${length}) `}</span>
    {error &&
    <Popup
      basic
      flowing
      trigger={<Icon name="exclamation triangle" color="orange" />}
    >
      <ErrorMessage error={error} title={errorTitle} />
    </Popup>
    }
  </label>

export const renderLabelDropdownSelection = label => ({
  size: 'large',
  content: label.text,
  style: { fontSize: '1rem', marginTop: '0.35rem' }
})

export const renderTooltipLabelDropdownSelection = (label, pathOptions, language) => {
  const thisPath = pathOptions.filter(({ value }) => value === label.text)
  const state = thisPath[0] === undefined ? '—' : DATASET_STATE[thisPath[0].state][language]
  const valuation = thisPath[0] === undefined ? '—' : VALUATION[thisPath[0].valuation][language]
  const date = thisPath[0] === undefined ? '—' : label.date

  return ({
    size: 'large',
    icon: label.incatalog !== 'true' ? 'folder open' : 'file',
    style: { fontSize: '1rem', marginTop: '0.35rem' },
    content: (
      <Popup
        flowing
        trigger={<span>{label.text}</span>}
        content={
          <>
            <p>{`${ROLES.STATE[language]}: `}<b>{state}</b></p>
            <p>{`${ROLES.MAX_VALUATION[language]}: `}<b>{valuation}</b></p>
            <p>{`${ROLES.DATASET_DATE[language]}: `}<b>{date}</b></p>
          </>
        }
      />
    )
  })
}

export const includesExcludesTableLayout = (simpleView, list, text, language) =>
  <Table.Cell style={{ paddingLeft: 0, paddingRight: 0 }} textAlign={simpleView ? 'center' : 'left'}>
    {simpleView ?
      list.only !== '' ?
        <Icon
          size="large"
          name={list.only === AUTH_API.INCLUDES ? 'check' : 'ban'}
          color={list.only === AUTH_API.INCLUDES ? 'green' : 'red'}
        />
        :
        <>
          <Icon
            name={list.favors === AUTH_API.INCLUDES ? 'ban' : 'check'}
            color={list.favors === AUTH_API.INCLUDES ? 'red' : 'green'}
          />
          {list.favors === AUTH_API.INCLUDES ?
            Object.keys(list.list)
              .filter(element => !list.list[element])
              .map(privilege => text[privilege][language])
              .join(', ')
            :
            Object.keys(list.list)
              .filter(element => list.list[element])
              .map(privilege => text[privilege][language])
              .join(', ')
          }
        </>
      :
      <Grid columns="equal" celled="internally" textAlign="center">
        {Object.keys(list.list).map(privilege =>
          <Grid.Column key={privilege}>
            <Icon
              fitted
              color={list.list[privilege] ? 'green' : 'red'}
              name={list.list[privilege] ? 'check' : 'ban'}
            />
          </Grid.Column>
        )}
      </Grid>
    }
  </Table.Cell>

export const includesExcludesFormLayout = (updated, move, text, language) =>
  <Message>
    <Grid columns="equal" textAlign="center">
      <Divider vertical><Icon name="exchange" color="grey" style={{ fontSize: '1.5rem' }} /></Divider>
      <Grid.Column>
        <Icon size="large" name="check" color="green" />
        <List link selection verticalAlign="middle">
          {updated[AUTH_API.INCLUDES].map(element =>
            <List.Item
              key={element}
              onClick={() => move(element, AUTH_API.EXCLUDES)}
            >
              {text[element][language]}
            </List.Item>
          )}
        </List>
      </Grid.Column>
      <Grid.Column>
        <Icon size="large" name="ban" color="red" />
        <List link selection verticalAlign="middle">
          {updated[AUTH_API.EXCLUDES].map(element =>
            <List.Item
              key={element}
              onClick={() => move(element, AUTH_API.INCLUDES)}
            >
              {text[element][language]}
            </List.Item>
          )}
        </List>
      </Grid.Column>
    </Grid>
  </Message>

export const renderFetchedPathOptionsItems = (paths, language) => paths.map(({ id, state, valuation }) => {
  const pathDate = new Date(id.timestamp)
  const dateLocalized = pathDate.toLocaleDateString()

  return ({
    key: id.path,
    text: id.path,
    value: id.path,
    state: state,
    valuation: valuation,
    incatalog: 'true',
    date: dateLocalized,
    content: (
      <Item.Group>
        <Item>
          <Item.Content>
            <Item.Header as={Header} size="tiny">{id.path}</Item.Header>
            <Item.Extra>
              {`
              ${ROLES.STATE[language]}: ${DATASET_STATE[state][language]},
              ${ROLES.MAX_VALUATION[language]}: ${VALUATION[valuation][language]},
              ${ROLES.DATASET_DATE[language]}: ${dateLocalized}
              `}
            </Item.Extra>
          </Item.Content>
        </Item>
      </Item.Group>
    )
  })
})
