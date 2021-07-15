import useAxios from 'axios-hooks'
import { useLocation } from 'react-router-dom'
import { useContext, useReducer, useState } from 'react'
import { Divider, Form, Grid, Segment } from 'semantic-ui-react'

import { ResponseColumn, SaveUpdateButton, UpdateHeader } from '../common'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import { AUTH_API, populatedDropdown, renderLabelDropdownSelection, validateGroup } from '../../configurations'
import { GROUPS, UI } from '../../enums'

const initialState = state => ({
  [AUTH_API.GROUP_OBJECT.ARRAY]: state.isNew ? [] : state.group[AUTH_API.GROUP_OBJECT.ARRAY],
  [AUTH_API.GROUP_OBJECT.STRING[0]]: state.isNew ? '' : state.group[AUTH_API.GROUP_OBJECT.STRING[0]],
  [AUTH_API.GROUP_OBJECT.STRING[1]]: state.isNew ? '' : state.group[AUTH_API.GROUP_OBJECT.STRING[1]]
})

const stateReducer = (state, action) => {
  switch (action.type) {
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

  const [isValidated, setIsValidated] = useState(false)
  const [currentState, dispatchState] = useReducer(stateReducer, state, initialState)

  const [{ data: getRolesData, loading: getRolesLoading, error: getRolesError }, refetchRolesGet] =
    useAxios(`${authApi}${AUTH_API.GET_ROLES}`, { useCache: false })
  const [{ loading: putLoading, error: putError, response: putResponse }, executePut] =
    useAxios({ method: 'PUT' }, { manual: true })

  const handleUpdateGroup = () => {
    const isValid = validateGroup(currentState, language)

    if (isValid.isValid) {
      executePut({
        data: currentState,
        url: `${authApi}${AUTH_API.PUT_GROUP(currentState[AUTH_API.GROUP_OBJECT.STRING[0]])}`
      })
    } else {
      setIsValidated(isValid)
    }
  }

  return (
    <Segment basic>
      <UpdateHeader
        logo="users"
        isNew={state.isNew}
        create={GROUPS.CREATE_GROUP}
        update={GROUPS.UPDATE_GROUP}
        id={currentState[AUTH_API.GROUP_OBJECT.STRING[0]]}
      />
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
                isValidated && isValidated.reason[AUTH_API.GROUP_OBJECT.STRING[0]] !== undefined &&
                { content: isValidated.reason[AUTH_API.GROUP_OBJECT.STRING[0]], pointing: 'below' }
              }
              onChange={(e, { value }) => {
                setIsValidated(false)
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
                isValidated && isValidated.reason[AUTH_API.GROUP_OBJECT.STRING[1]] !== undefined &&
                { content: isValidated.reason[AUTH_API.GROUP_OBJECT.STRING[1]], pointing: 'below' }
              }
              onChange={(e, { value }) => {
                setIsValidated(false)
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
                isValidated && isValidated.reason[AUTH_API.GROUP_OBJECT.ARRAY] !== undefined &&
                { content: isValidated.reason[AUTH_API.GROUP_OBJECT.ARRAY], pointing: 'below' }
              }
              onChange={(e, { value }) => {
                setIsValidated(false)
                dispatchState({ type: AUTH_API.GROUP_OBJECT.ARRAY, payload: value })
              }}
              label={populatedDropdown(
                GROUPS.ROLES[language],
                getRolesLoading,
                refetchRolesGet,
                getRolesError,
                GROUPS.ROLES_FETCH_ERROR[language],
                !getRolesLoading && !getRolesError && getRolesData !== undefined ? getRolesData[AUTH_API.ROLES].length : 0
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
