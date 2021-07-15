import useAxios from 'axios-hooks'
import { useLocation } from 'react-router-dom'
import { useContext, useReducer, useState } from 'react'
import { Divider, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react'

import { ResponseColumn, SaveUpdateButton } from '../common'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import { AUTH_API, populatedDropdown, renderLabelDropdownSelection, validateUser } from '../../configurations'
import { UI, USERS } from '../../enums'

const initialState = state => ({
  [AUTH_API.USER_OBJECT.STRING]: state.isNew ? '' : state.user[AUTH_API.USER_OBJECT.STRING],
  [AUTH_API.USER_OBJECT.ARRAY[0]]: state.isNew ? [] : state.user[AUTH_API.USER_OBJECT.ARRAY[0]],
  [AUTH_API.USER_OBJECT.ARRAY[1]]: state.isNew ? [] : state.user[AUTH_API.USER_OBJECT.ARRAY[1]]
})

const stateReducer = (state, action) => {
  switch (action.type) {
    case AUTH_API.USER_OBJECT.STRING:
      return { ...state, [AUTH_API.USER_OBJECT.STRING]: action.payload }

    case AUTH_API.USER_OBJECT.ARRAY[0]:
      return { ...state, [AUTH_API.USER_OBJECT.ARRAY[0]]: action.payload }

    case AUTH_API.USER_OBJECT.ARRAY[1]:
      return { ...state, [AUTH_API.USER_OBJECT.ARRAY[1]]: action.payload }

    default:
      return state
  }
}

function UpdateUser () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  let { state } = useLocation()

  const [isValidated, setIsValidated] = useState(false)
  const [currentState, dispatchState] = useReducer(stateReducer, state, initialState)

  const [{ data: getRolesData, loading: getRolesLoading, error: getRolesError }, refetchRolesGet] =
    useAxios(`${authApi}${AUTH_API.GET_ROLES}`, { useCache: false })
  const [{ data: getGroupsData, loading: getGroupsLoading, error: getGroupsError }, refetchGroupsGet] =
    useAxios(`${authApi}${AUTH_API.GET_GROUPS}`, { useCache: false })
  const [{ loading: putLoading, error: putError, response: putResponse }, executePut] =
    useAxios({ method: 'PUT' }, { manual: true })

  const handleUpdateUser = () => {
    const isValid = validateUser(currentState, language)

    if (isValid.isValid) {
      executePut({
        data: currentState,
        url: `${authApi}${AUTH_API.PUT_USER(currentState[AUTH_API.USER_OBJECT.STRING])}`
      })
    } else {
      setIsValidated(isValid)
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
          {state.isNew ? USERS.CREATE_USER[language] : currentState[AUTH_API.USER_OBJECT.STRING]}
          {!state.isNew && <Header.Subheader>{USERS.UPDATE_USER[language]}</Header.Subheader>}
        </Header.Content>
      </Header>
      <Divider hidden />
      <Grid columns="equal">
        <Grid.Column>
          <Form size="large">
            <Form.Input
              required
              width={8}
              disabled={!state.isNew}
              label={USERS.USER_ID[language]}
              placeholder={USERS.USER_ID[language]}
              value={currentState[AUTH_API.USER_OBJECT.STRING]}
              error={
                isValidated && isValidated.reason[AUTH_API.USER_OBJECT.STRING] !== undefined &&
                { content: isValidated.reason[AUTH_API.USER_OBJECT.STRING], pointing: 'below' }
              }
              onChange={(e, { value }) => {
                setIsValidated(false)
                dispatchState({ type: AUTH_API.USER_OBJECT.STRING, payload: value })
              }}
            />
            <Form.Dropdown
              search
              multiple
              required
              selection
              loading={getGroupsLoading}
              disabled={getGroupsLoading}
              placeholder={USERS.GROUPS[language]}
              renderLabel={renderLabelDropdownSelection}
              noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
              value={currentState[AUTH_API.USER_OBJECT.ARRAY[0]]}
              error={
                isValidated && isValidated.reason[AUTH_API.USER_OBJECT.ARRAY[0]] !== undefined &&
                { content: isValidated.reason[AUTH_API.USER_OBJECT.ARRAY[0]], pointing: 'below' }
              }
              onChange={(e, { value }) => {
                setIsValidated(false)
                dispatchState({ type: AUTH_API.USER_OBJECT.ARRAY[0], payload: value })
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
              loading={getRolesLoading}
              disabled={getRolesLoading}
              placeholder={USERS.ROLES[language]}
              renderLabel={renderLabelDropdownSelection}
              noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
              value={currentState[AUTH_API.USER_OBJECT.ARRAY[1]]}
              error={
                isValidated && isValidated.reason[AUTH_API.USER_OBJECT.ARRAY[1]] !== undefined &&
                { content: isValidated.reason[AUTH_API.USER_OBJECT.ARRAY[1]], pointing: 'below' }
              }
              onChange={(e, { value }) => {
                setIsValidated(false)
                dispatchState({ type: AUTH_API.USER_OBJECT.ARRAY[1], payload: value })
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
          <SaveUpdateButton
            isNew={state.isNew}
            loading={putLoading}
            create={USERS.CREATE_USER}
            update={USERS.UPDATE_USER}
            handleUpdate={handleUpdateUser}
          />
        </Grid.Column>
        <ResponseColumn response={putResponse} loading={putLoading} error={putError} />
      </Grid>
    </Segment>
  )
}

export default UpdateUser
