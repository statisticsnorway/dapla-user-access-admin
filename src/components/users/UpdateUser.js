import useAxios from 'axios-hooks'
import { useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { Button, Divider, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../../context/AppContext'
import { API, AUTH_API, populatedDropdown, renderLabelDropdownSelection, validateUser } from '../../configurations'
import { UI, USERS } from '../../enums'

function UpdateUser () {
  const { authApi, devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  let { state } = useLocation()

  const [isValidUser, setIsValidUser] = useState(false)
  const [updatedUserId, setUpdatedUserId] = useState(state.isNew ? '' : state.user[AUTH_API.USER_OBJECT.STRING])
  const [updatedRoles, setUpdatedRoles] = useState(state.isNew ? [] : state.user[AUTH_API.USER_OBJECT.ARRAY[1]])
  const [updatedGroups, setUpdatedGroups] = useState(state.isNew ? [] : state.user[AUTH_API.USER_OBJECT.ARRAY[0]])

  const [{ data: getRolesData, loading: getRolesLoading, error: getRolesError }, refetchRolesGet] =
    useAxios(`${authApi}${AUTH_API.GET_ROLES}`, { useCache: false })
  const [{ data: getGroupsData, loading: getGroupsLoading, error: getGroupsError }, refetchGroupsGet] =
    useAxios(`${authApi}${AUTH_API.GET_GROUPS}`, { useCache: false })
  const [{ loading: putLoading, error: putError, response: putResponse }, executePut] =
    useAxios({ method: 'PUT' }, { manual: true })

  const handleUpdateUser = () => {
    const putUser = {
      [AUTH_API.USER_OBJECT.STRING]: updatedUserId,
      [AUTH_API.USER_OBJECT.ARRAY[1]]: updatedRoles,
      [AUTH_API.USER_OBJECT.ARRAY[0]]: updatedGroups
    }
    const isValid = validateUser(putUser, language)

    if (isValid.isValid) {
      executePut(API.HANDLE_PUT(
        process.env.NODE_ENV,
        putUser,
        `${authApi}${AUTH_API.PUT_USER(updatedUserId)}`,
        devToken
      ))
    } else {
      setIsValidUser(isValid)
    }
  }

  return (
    <Segment basic>
      <Header size="large">
        <Icon.Group size="large" style={{ marginRight: '0.5rem', marginTop: '0.65rem' }}>
          <Icon name="user" color={state.isNew ? 'green' : 'blue'} />
          <Icon corner="top right" name={state.isNew ? 'plus' : 'pencil'} color={state.isNew ? 'green' : 'blue'} />
        </Icon.Group>
        <Header.Content>
          {state.isNew ? USERS.CREATE_USER[language] : updatedUserId}
          {!state.isNew &&
          <Header.Subheader>{USERS.UPDATE_USER[language]}</Header.Subheader>
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
              value={updatedUserId}
              disabled={!state.isNew}
              label={USERS.USER_ID[language]}
              placeholder={USERS.USER_ID[language]}
              error={isValidUser && isValidUser.reason[AUTH_API.USER_OBJECT.STRING] !== undefined && {
                content: isValidUser.reason[AUTH_API.USER_OBJECT.STRING], pointing: 'below'
              }}
              onChange={(e, { value }) => {
                setIsValidUser(false)
                setUpdatedUserId(value)
              }}
            />
            <Form.Dropdown
              search
              multiple
              required
              selection
              value={updatedGroups}
              placeholder={USERS.GROUPS[language]}
              renderLabel={renderLabelDropdownSelection}
              noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
              error={isValidUser && isValidUser.reason[AUTH_API.USER_OBJECT.ARRAY[0]] !== undefined && {
                content: isValidUser.reason[AUTH_API.USER_OBJECT.ARRAY[0]], pointing: 'below'
              }}
              onChange={(e, { value }) => {
                setIsValidUser(false)
                setUpdatedGroups(value)
              }}
              label={populatedDropdown(
                USERS.GROUPS[language],
                getGroupsLoading,
                refetchGroupsGet,
                getGroupsError,
                USERS.GROUPS_FETCH_ERROR[language]
              )}
              options={!getGroupsLoading && !getGroupsError && getGroupsData !== undefined ?
                getGroupsData[AUTH_API.GROUPS].map(({ groupId }) => ({
                  key: groupId,
                  text: groupId,
                  value: groupId
                }))
                : []
              }
            />
            <Form.Dropdown
              search
              multiple
              required
              selection
              value={updatedRoles}
              placeholder={USERS.ROLES[language]}
              renderLabel={renderLabelDropdownSelection}
              noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
              error={isValidUser && isValidUser.reason[AUTH_API.USER_OBJECT.ARRAY[1]] !== undefined && {
                content: isValidUser.reason[AUTH_API.USER_OBJECT.ARRAY[1]], pointing: 'below'
              }}
              onChange={(e, { value }) => {
                setIsValidUser(false)
                setUpdatedRoles(value)
              }}
              label={populatedDropdown(
                USERS.ROLES[language],
                getRolesLoading,
                refetchRolesGet,
                getRolesError,
                USERS.ROLES_FETCH_ERROR[language]
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
            onClick={() => handleUpdateUser()}
          >
            <Button.Content visible>
              {state.isNew ? USERS.CREATE_USER[language] : USERS.UPDATE_USER[language]}
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

export default UpdateUser
