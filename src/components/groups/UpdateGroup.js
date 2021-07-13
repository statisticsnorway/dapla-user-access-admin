import useAxios from 'axios-hooks'
import { useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { Button, Divider, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../../context/AppContext'
import { API, AUTH_API, populatedDropdown, renderLabelDropdownSelection, validateGroup } from '../../configurations'
import { GROUPS, UI } from '../../enums'

function UpdateGroup () {
  const { authApi, devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  let { state } = useLocation()

  const [isValidGroup, setIsValidGroup] = useState(false)
  const [updatedRoles, setUpdatedRoles] = useState(state.isNew ? [] : state.group[AUTH_API.GROUP_OBJECT.ARRAY])
  const [updatedGroupId, setUpdatedGroupId] = useState(state.isNew ? '' : state.group[AUTH_API.GROUP_OBJECT.STRING[0]])
  const [updatedDescription, setUpdatedDescription] = useState(state.isNew ? '' : state.group[AUTH_API.GROUP_OBJECT.STRING[1]])

  const [{ data: getRolesData, loading: getRolesLoading, error: getRolesError }, refetchRolesGet] =
    useAxios(`${authApi}${AUTH_API.GET_ROLES}`, { useCache: false })
  const [{ loading: putLoading, error: putError, response: putResponse }, executePut] =
    useAxios({ method: 'PUT' }, { manual: true })

  const handleUpdateGroup = () => {
    const putGroup = {
      [AUTH_API.GROUP_OBJECT.STRING[0]]: updatedGroupId,
      [AUTH_API.GROUP_OBJECT.STRING[1]]: updatedDescription,
      [AUTH_API.GROUP_OBJECT.ARRAY]: updatedRoles
    }
    const isValid = validateGroup(putGroup, language)

    if (isValid.isValid) {
      executePut(API.HANDLE_PUT(
        process.env.NODE_ENV,
        putGroup,
        `${authApi}${AUTH_API.PUT_GROUP(updatedGroupId)}`,
        devToken
      ))
    } else {
      setIsValidGroup(isValid)
    }
  }

  return (
    <Segment basic>
      <Header size="large">
        <Icon.Group size="large" style={{ marginRight: '0.5rem', marginTop: '0.8rem' }}>
          <Icon name="users" color={state.isNew ? 'green' : 'blue'} />
          <Icon corner="top right" name={state.isNew ? 'plus' : 'pencil'} color={state.isNew ? 'green' : 'blue'} />
        </Icon.Group>
        <Header.Content>
          {state.isNew ? GROUPS.CREATE_GROUP[language] : updatedGroupId}
          {!state.isNew &&
          <Header.Subheader>{GROUPS.UPDATE_GROUP[language]}</Header.Subheader>
          }
        </Header.Content>
      </Header>
      <Divider hidden />
      <Grid columns="equal">
        <Grid.Column>
          <Form size="large">
            <Form.Input
              required
              width={8}
              value={updatedGroupId}
              disabled={!state.isNew}
              label={GROUPS.GROUP_ID[language]}
              placeholder={GROUPS.GROUP_ID[language]}
              error={isValidGroup && isValidGroup.reason[AUTH_API.GROUP_OBJECT.STRING[0]] !== undefined && {
                content: isValidGroup.reason[AUTH_API.GROUP_OBJECT.STRING[0]], pointing: 'below'
              }}
              onChange={(e, { value }) => {
                setIsValidGroup(false)
                setUpdatedGroupId(value)
              }}
            />
            <Form.TextArea
              required
              width={8}
              value={updatedDescription}
              label={GROUPS.DESCRIPTION[language]}
              placeholder={GROUPS.DESCRIPTION[language]}
              error={isValidGroup && isValidGroup.reason[AUTH_API.GROUP_OBJECT.STRING[1]] !== undefined && {
                content: isValidGroup.reason[AUTH_API.GROUP_OBJECT.STRING[1]], pointing: 'below'
              }}
              onChange={(e, { value }) => {
                setIsValidGroup(false)
                setUpdatedDescription(value)
              }}
            />
            <Form.Dropdown
              search
              multiple
              required
              selection
              value={updatedRoles}
              placeholder={GROUPS.ROLES[language]}
              renderLabel={renderLabelDropdownSelection}
              noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
              error={isValidGroup && isValidGroup.reason[AUTH_API.GROUP_OBJECT.ARRAY] !== undefined && {
                content: isValidGroup.reason[AUTH_API.GROUP_OBJECT.ARRAY], pointing: 'below'
              }}
              onChange={(e, { value }) => {
                setIsValidGroup(false)
                setUpdatedRoles(value)
              }}
              label={populatedDropdown(
                GROUPS.ROLES[language],
                getRolesLoading,
                refetchRolesGet,
                getRolesError,
                GROUPS.ROLES_FETCH_ERROR[language]
              )}
              options={!getRolesLoading && !getRolesError && getRolesData !== undefined ?
                getRolesData[AUTH_API.ROLES].map(({ roleId }) => ({
                  key: roleId,
                  text: roleId,
                  value: roleId
                }))
                : []
              }
            />
          </Form>
          <Divider hidden />
          <Button
            animated
            size="large"
            primary={!state.isNew}
            positive={state.isNew}
            disabled={putLoading}
            onClick={() => handleUpdateGroup()}
          >
            <Button.Content visible>
              {state.isNew ? GROUPS.CREATE_GROUP[language] : GROUPS.UPDATE_GROUP[language]}
            </Button.Content>
            <Button.Content hidden>
              <Icon name={state.isNew ? 'plus' : 'save'} />
            </Button.Content>
          </Button>
        </Grid.Column>
        <Grid.Column>
          {!putLoading && putError &&
          <ErrorMessage error={putError.response.statusText} title={putError.response.status} language={language} />
          }
          {!putLoading && putResponse && <pre>{JSON.stringify(putResponse, null, 2)}</pre>}
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default UpdateGroup
