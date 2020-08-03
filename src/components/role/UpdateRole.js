import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Button, Divider, Form, Grid, Header, Icon, List, Modal, Segment } from 'semantic-ui-react'
import { SSB_COLORS, SSB_STYLE } from '@statisticsnorway/dapla-js-utilities'

import {
  ApiContext,
  convertToIncludesExcludes,
  DescriptionPopup,
  LanguageContext,
  moveIncludesExcludes,
  setupPathOptions
} from '../../utilities'
import { AUTH_API, CATALOG_API, populatedDropdown, VALUATION_COLORS } from '../../configurations'
import { DATASET_STATE, PRIVILEGE, ROLE, TEST_IDS, UI, VALUATION } from '../../enums'

function UpdateRole ({ isNew, refetch, role }) {
  const { authApi, catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [fetchedPathOptions, setFetchedPathOptions] = useState([])
  const [updatedRoleId, setUpdatedRoleId] = useState(isNew ? '' : role[AUTH_API.ROLE_OBJECT.STRING[0]])
  const [updatedDescription, setUpdatedDescription] = useState(isNew ? '' : role[AUTH_API.ROLE_OBJECT.STRING[1]])
  const [updatedMaxValuation, setUpdatedMaxValuation] = useState(isNew ?
    AUTH_API.ENUMS.VALUATIONS[3] : role[AUTH_API.ROLE_OBJECT.ENUM]
  )
  const [updatedPathsInclude, setUpdatedPathsInclude] = useState(isNew ? [] :
    role[AUTH_API.ROLE_OBJECT.LIST].hasOwnProperty(AUTH_API.INCLUDES) ?
      role[AUTH_API.ROLE_OBJECT.LIST][AUTH_API.INCLUDES] : []
  )
  const [updatedPathsExclude, setUpdatedPathsExclude] = useState(isNew ? [] :
    role[AUTH_API.ROLE_OBJECT.LIST].hasOwnProperty(AUTH_API.EXCLUDES) ?
      role[AUTH_API.ROLE_OBJECT.LIST][AUTH_API.EXCLUDES] : []
  )
  const [updatedStates, setUpdatedStates] = useState(isNew ?
    { [AUTH_API.INCLUDES]: [], [AUTH_API.EXCLUDES]: AUTH_API.ENUMS.STATES.map(state => state) }
    :
    convertToIncludesExcludes(role[AUTH_API.ROLE_OBJECT.ARRAY[1]], AUTH_API.ROLE_OBJECT.ARRAY[1].toUpperCase())
  )
  const [updatedPrivileges, setUpdatedPrivileges] = useState(isNew ?
    { [AUTH_API.INCLUDES]: [], [AUTH_API.EXCLUDES]: AUTH_API.ENUMS.PRIVILEGES.map(privilege => privilege) }
    :
    convertToIncludesExcludes(role[AUTH_API.ROLE_OBJECT.ARRAY[0]], AUTH_API.ROLE_OBJECT.ARRAY[0].toUpperCase())
  )
  const [pathOptions, setPathOptions] = useState(isNew ? [] : setupPathOptions(role))

  const [{ data: getData, loading: getLoading, error: getError }, refetchGet] =
    useAxios(`${catalogApi}${CATALOG_API.GET_CATALOGS}`, { manual: true })
  const [{ loading, error, response }, executePut] =
    useAxios({ url: `${authApi}${AUTH_API.PUT_ROLE(updatedRoleId)}`, method: 'PUT' }, { manual: true })

  const moveState = (state, to) => {
    setUpdatedStates(
      moveIncludesExcludes(updatedStates[AUTH_API.INCLUDES], updatedStates[AUTH_API.EXCLUDES], state, to)
    )
  }

  const movePrivilege = (privilege, to) => {
    setUpdatedPrivileges(
      moveIncludesExcludes(updatedPrivileges[AUTH_API.INCLUDES], updatedPrivileges[AUTH_API.EXCLUDES], privilege, to)
    )
  }

  useEffect(() => {
    if (!getLoading && !getError && getData !== undefined) {
      setFetchedPathOptions(getData[CATALOG_API.CATALOGS].map(catalog => ({
        key: catalog.id.path,
        text: catalog.id.path,
        value: catalog.id.path
      })))
    }
  }, [getLoading, getError, getData])

  useEffect(() => {
    if (!loading && response) {
      console.log(response)
    }
    if (!loading && error) {
      console.log(error.response)
    }
  }, [error, loading, response])

  return (
    <Modal
      closeIcon
      size='large'
      open={modalOpen}
      style={SSB_STYLE}
      closeOnEscape={false}
      closeOnDimmerClick={false}
      onMount={() => refetchGet()}
      onClose={() => {
        setModalOpen(false)
        refetch()
      }}
      trigger={DescriptionPopup(
        <Icon.Group size={isNew ? 'huge' : 'big'} style={{ color: SSB_COLORS[isNew ? 'GREEN' : 'BLUE'] }}>
          <Icon link name='address card' onClick={() => setModalOpen(true)} data-testid={TEST_IDS.UPDATE_ROLE} />
          <Icon corner='top right' link name={isNew ? 'plus' : 'pencil'} onClick={() => setModalOpen(true)} />
        </Icon.Group>,
        false,
        'left center'
      )}
    >
      <Header as='h2' style={SSB_STYLE}>
        <Icon.Group size='large' style={{ marginRight: '0.2em', color: SSB_COLORS[isNew ? 'GREEN' : 'BLUE'] }}>
          <Icon name='address card' />
          <Icon corner name={isNew ? 'plus' : 'edit'} />
        </Icon.Group>
        {isNew ? ROLE.CREATE_ROLE[language] : ROLE.UPDATE_ROLE[language]}
      </Header>
      <Modal.Content style={SSB_STYLE}>
        <Form size='large'>
          <Grid columns='equal'>
            <Grid.Column>
              <Form.Input
                required
                disabled={!isNew}
                value={updatedRoleId}
                placeholder={ROLE.ROLE_ID[language]}
                label={<label>{DescriptionPopup(<span>{ROLE.ROLE_ID[language]}</span>)}</label>}
                onChange={(event, { value }) => setUpdatedRoleId(value)}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.TextArea
                rows={2}
                required
                value={updatedDescription}
                placeholder={ROLE.DESCRIPTION[language]}
                label={<label>{DescriptionPopup(<span>{ROLE.DESCRIPTION[language]}</span>)}</label>}
                onChange={(event, { value }) => setUpdatedDescription(value)}
              />
            </Grid.Column>
          </Grid>
          <Grid columns='equal'>
            <Grid.Column>
              <Form.Field required>
                <label>{DescriptionPopup(<span>{ROLE.PRIVILEGES[language]}</span>)}</label>
                <Segment secondary>
                  <Grid columns={2} textAlign='center'>
                    <Divider vertical><Icon name='exchange' color='grey' style={{ fontSize: '1.5em' }} /></Divider>
                    <Grid.Row>
                      <Grid.Column>
                        <Icon size='large' name='check' style={{ color: SSB_COLORS.GREEN }} />
                        <List link selection verticalAlign='middle'>
                          {updatedPrivileges[AUTH_API.INCLUDES].map(privilege =>
                            <List.Item
                              key={privilege}
                              style={{ color: SSB_COLORS.GREEN }}
                              onClick={() => movePrivilege(privilege, AUTH_API.EXCLUDES)}
                            >
                              {PRIVILEGE[privilege][language]}
                            </List.Item>
                          )}
                        </List>
                      </Grid.Column>
                      <Grid.Column>
                        <Icon size='large' name='ban' style={{ color: SSB_COLORS.RED }} />
                        <List link selection verticalAlign='middle'>
                          {updatedPrivileges[AUTH_API.EXCLUDES].map(privilege =>
                            <List.Item
                              key={privilege}
                              style={{ color: SSB_COLORS.RED }}
                              onClick={() => movePrivilege(privilege, AUTH_API.INCLUDES)}
                            >
                              {PRIVILEGE[privilege][language]}
                            </List.Item>
                          )}
                        </List>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field required>
                <label>{DescriptionPopup(<span>{ROLE.STATES[language]}</span>)}</label>
                <Segment secondary>
                  <Grid columns={2} textAlign='center'>
                    <Divider vertical><Icon name='exchange' color='grey' style={{ fontSize: '1.5em' }} /></Divider>
                    <Grid.Row>
                      <Grid.Column>
                        <Icon size='large' name='check' style={{ color: SSB_COLORS.GREEN }} />
                        <List link selection verticalAlign='middle'>
                          {updatedStates[AUTH_API.INCLUDES].map(state =>
                            <List.Item
                              key={state}
                              style={{ color: SSB_COLORS.GREEN }}
                              onClick={() => moveState(state, AUTH_API.EXCLUDES)}
                            >
                              {DATASET_STATE[state][language]}
                            </List.Item>
                          )}
                        </List>
                      </Grid.Column>
                      <Grid.Column>
                        <Icon size='large' name='ban' style={{ color: SSB_COLORS.RED }} />
                        <List link selection verticalAlign='middle'>
                          {updatedStates[AUTH_API.EXCLUDES].map(state =>
                            <List.Item
                              key={state}
                              style={{ color: SSB_COLORS.RED }}
                              onClick={() => moveState(state, AUTH_API.INCLUDES)}
                            >
                              {DATASET_STATE[state][language]}
                            </List.Item>
                          )}
                        </List>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Form.Field>
            </Grid.Column>
          </Grid>
          <Form.Field required style={{ marginTop: '1em' }}>
            <label>{DescriptionPopup(<span>{ROLE.MAX_VALUATION[language]}</span>)}</label>
            <Form.Group inline>
              {AUTH_API.ENUMS.VALUATIONS.map(valuation =>
                <Form.Radio
                  key={valuation}
                  value={valuation}
                  checked={updatedMaxValuation === valuation}
                  onChange={(event, { value }) => setUpdatedMaxValuation(value)}
                  label={
                    <label><span style={{ color: VALUATION_COLORS[valuation] }}>
                      {VALUATION[valuation][language]}
                    </span></label>
                  }
                />
              )}
            </Form.Group>
          </Form.Field>
          <Form.Field required style={{ marginTop: '1em' }}>
            {populatedDropdown(ROLE.PATHS[language], getLoading, refetchGet, getError, ROLE.PATHS_FETCH_ERROR[language])}
            <Grid columns='equal'>
              <Grid.Column textAlign='center'>
                <Icon size='large' name='check' style={{ color: SSB_COLORS.GREEN, marginBottom: '0.5em' }} />
                <Form.Dropdown
                  search
                  multiple
                  required
                  selection
                  allowAdditions
                  value={updatedPathsInclude}
                  data-testid={TEST_IDS.SEARCH_DROPDOWN}
                  additionLabel={`${UI.ADD[language]} `}
                  placeholder={ROLE.PATHS_INCLUDE[language]}
                  options={[...fetchedPathOptions, ...pathOptions]}
                  noResultsMessage={UI.SEARCH_NO_RESULTS_CAN_ADD[language]}
                  onChange={(event, { value }) => setUpdatedPathsInclude(value)}
                  onAddItem={(event, { value }) => setPathOptions(
                    [{ key: value, text: value, value: value }, ...pathOptions]
                  )}
                />
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Icon size='large' name='ban' style={{ color: SSB_COLORS.RED, marginBottom: '0.5em' }} />
                <Form.Dropdown
                  search
                  multiple
                  required
                  selection
                  allowAdditions
                  value={updatedPathsExclude}
                  data-testid={TEST_IDS.SEARCH_DROPDOWN}
                  additionLabel={`${UI.ADD[language]} `}
                  placeholder={ROLE.PATHS_EXCLUDE[language]}
                  options={[...fetchedPathOptions, ...pathOptions]}
                  noResultsMessage={UI.SEARCH_NO_RESULTS_CAN_ADD[language]}
                  onChange={(event, { value }) => setUpdatedPathsExclude(value)}
                  onAddItem={(event, { value }) => setPathOptions(
                    [{ key: value, text: value, value: value }, ...pathOptions]
                  )}
                />
              </Grid.Column>
            </Grid>
          </Form.Field>
        </Form>
        <Divider hidden />
        <Button
          primary
          disabled={loading}
          onClick={() => executePut({
            data: {
              [AUTH_API.ROLE_OBJECT.LIST]: {
                [AUTH_API.INCLUDES]: updatedPathsInclude,
                [AUTH_API.EXCLUDES]: updatedPathsExclude
              },
              [AUTH_API.ROLE_OBJECT.ARRAY[1]]: updatedStates,
              [AUTH_API.ROLE_OBJECT.STRING[0]]: updatedRoleId,
              [AUTH_API.ROLE_OBJECT.ENUM]: updatedMaxValuation,
              [AUTH_API.ROLE_OBJECT.ARRAY[0]]: updatedPrivileges,
              [AUTH_API.ROLE_OBJECT.STRING[1]]: updatedDescription
            }
          })}
        >
          {isNew ? ROLE.CREATE_ROLE[language] : ROLE.UPDATE_ROLE[language]}
        </Button>
      </Modal.Content>
    </Modal>
  )
}

export default UpdateRole
