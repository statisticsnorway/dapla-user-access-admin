import useAxios from 'axios-hooks'
import { useLocation } from 'react-router-dom'
import { useContext, useReducer } from 'react'
import { Divider, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react'

import { ResponseColumn, SaveUpdateButton } from '../common'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import { AUTH_API, populatedDropdown, renderLabelDropdownSelection, validateGroup } from '../../configurations'
import { GROUPS, UI } from '../../enums'

const VALIDATED = 'validated'

const initialState = state => ({
  [VALIDATED]: false,
  [AUTH_API.GROUP_OBJECT.ARRAY]: state.isNew ? [] : state.group[AUTH_API.GROUP_OBJECT.ARRAY],
  [AUTH_API.GROUP_OBJECT.STRING[0]]: state.isNew ? '' : state.group[AUTH_API.GROUP_OBJECT.STRING[0]],
  [AUTH_API.GROUP_OBJECT.STRING[1]]: state.isNew ? '' : state.group[AUTH_API.GROUP_OBJECT.STRING[1]]
})

const stateReducer = (state, action) => {
  switch (action.type) {
    case VALIDATED:
      return { ...state, [VALIDATED]: action.payload }

    case AUTH_API.GROUP_OBJECT.ARRAY:
      return { ...state, [AUTH_API.GROUP_OBJECT.ARRAY]: action.payload }

    case AUTH_API.GROUP_OBJECT.STRING[0]:
      return { ...state, [AUTH_API.GROUP_OBJECT.STRING[0]]: action.payload }

    case AUTH_API.GROUP_OBJECT.STRING[1]:
      return { ...state, [AUTH_API.GROUP_OBJECT.STRING[1]]: action.payload }

    default:
      return state
  }
}

function UpdateGroup () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  let { state } = useLocation()

  const [currentState, dispatchState] = useReducer(stateReducer, state, initialState)

  const [{ data: getRolesData, loading: getRolesLoading, error: getRolesError }, refetchRolesGet] =
    useAxios(`${authApi}${AUTH_API.GET_ROLES}`, { useCache: false })
  const [{ loading: putLoading, error: putError, response: putResponse }, executePut] =
    useAxios({ method: 'PUT' }, { manual: true })

  const handleUpdateGroup = () => {
    const putGroup = {
      [AUTH_API.GROUP_OBJECT.ARRAY]: currentState[AUTH_API.GROUP_OBJECT.ARRAY],
      [AUTH_API.GROUP_OBJECT.STRING[0]]: currentState[AUTH_API.GROUP_OBJECT.STRING[0]],
      [AUTH_API.GROUP_OBJECT.STRING[1]]: currentState[AUTH_API.GROUP_OBJECT.STRING[1]]
    }
    const isValid = validateGroup(putGroup, language)

    if (isValid.isValid) {
      executePut({
        data: putGroup,
        url: `${authApi}${AUTH_API.PUT_GROUP(currentState[AUTH_API.GROUP_OBJECT.STRING[0]])}`
      })
    } else {
      dispatchState({ type: VALIDATED, payload: isValid })
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
          {state.isNew ? GROUPS.CREATE_GROUP[language] : currentState[AUTH_API.GROUP_OBJECT.STRING[0]]}
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
              disabled={!state.isNew}
              label={GROUPS.GROUP_ID[language]}
              placeholder={GROUPS.GROUP_ID[language]}
              value={currentState[AUTH_API.GROUP_OBJECT.STRING[0]]}
              error={
                currentState[VALIDATED] && currentState[VALIDATED].reason[AUTH_API.GROUP_OBJECT.STRING[0]] !== undefined &&
                { content: currentState[VALIDATED].reason[AUTH_API.GROUP_OBJECT.STRING[0]], pointing: 'below' }
              }
              onChange={(e, { value }) => {
                dispatchState({ type: VALIDATED, payload: false })
                dispatchState({ type: AUTH_API.GROUP_OBJECT.STRING[0], payload: value })
              }}
            />
            <Form.TextArea
              required
              width={8}
              label={GROUPS.DESCRIPTION[language]}
              placeholder={GROUPS.DESCRIPTION[language]}
              value={currentState[AUTH_API.GROUP_OBJECT.STRING[1]]}
              error={
                currentState[VALIDATED] && currentState[VALIDATED].reason[AUTH_API.GROUP_OBJECT.STRING[1]] !== undefined &&
                { content: currentState[VALIDATED].reason[AUTH_API.GROUP_OBJECT.STRING[1]], pointing: 'below' }
              }
              onChange={(e, { value }) => {
                dispatchState({ type: VALIDATED, payload: false })
                dispatchState({ type: AUTH_API.GROUP_OBJECT.STRING[1], payload: value })
              }}
            />
            <Form.Dropdown
              search
              multiple
              required
              selection
              loading={getRolesLoading}
              disabled={getRolesLoading}
              placeholder={GROUPS.ROLES[language]}
              renderLabel={renderLabelDropdownSelection}
              noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
              value={currentState[AUTH_API.GROUP_OBJECT.ARRAY]}
              error={
                currentState[VALIDATED] && currentState[VALIDATED].reason[AUTH_API.GROUP_OBJECT.ARRAY] !== undefined &&
                { content: currentState[VALIDATED].reason[AUTH_API.GROUP_OBJECT.ARRAY], pointing: 'below' }
              }
              onChange={(e, { value }) => {
                dispatchState({ type: VALIDATED, payload: false })
                dispatchState({ type: AUTH_API.GROUP_OBJECT.ARRAY, payload: value })
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
          <SaveUpdateButton
            isNew={state.isNew}
            loading={putLoading}
            create={GROUPS.CREATE_GROUP}
            update={GROUPS.UPDATE_GROUP}
            handleUpdate={handleUpdateGroup}
          />
        </Grid.Column>
        <ResponseColumn response={putResponse} loading={putLoading} error={putError} />
      </Grid>
    </Segment>
  )
}

export default UpdateGroup
