import useAxios from 'axios-hooks'
import { useContext, useEffect, useReducer, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Divider, Form, Grid, Label, Segment } from 'semantic-ui-react'

import { ResponseColumn, SaveUpdateButton, UpdateHeader } from '../common'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import {
  AUTH_API,
  CATALOG_API,
  emptyIncludesExcludes,
  includesExcludesFormLayout,
  moveIncludesExcludes,
  populatedDropdown,
  renderFetchedPathOptionsItems,
  renderTooltipLabelDropdownSelection,
  setupIncludesExcludes,
  setupPathOptions,
  setupPathValues,
  validateRole
} from '../../configurations'
import { DATASET_STATE, PRIVILEGE, ROLES, TEST_IDS, UI, UNRECOGNIZED, VALUATION } from '../../enums'

const addItem = value => ({
  key: value,
  text: value,
  value: value,
  state: '—',
  valuation: '—',
  incatalog: 'false',
  date: '—'
})

const initialState = state => ({
  [AUTH_API.ROLE_OBJECT.ENUM]: state.isNew ? '' : state.role[AUTH_API.ROLE_OBJECT.ENUM],
  [AUTH_API.INCLUDES]: state.isNew ? [] : setupPathValues(state.role, AUTH_API.INCLUDES),
  [AUTH_API.EXCLUDES]: state.isNew ? [] : setupPathValues(state.role, AUTH_API.EXCLUDES),
  [AUTH_API.ROLE_OBJECT.STRING[0]]: state.isNew ? '' : state.role[AUTH_API.ROLE_OBJECT.STRING[0]],
  [AUTH_API.ROLE_OBJECT.STRING[1]]: state.isNew ? '' : state.role[AUTH_API.ROLE_OBJECT.STRING[1]],
  [AUTH_API.ROLE_OBJECT.ARRAY[1]]: state.isNew ?
    emptyIncludesExcludes(PRIVILEGE) : setupIncludesExcludes(state.role, PRIVILEGE, AUTH_API.ROLE_OBJECT.ARRAY[1]),
  [AUTH_API.ROLE_OBJECT.ARRAY[2]]: state.isNew ?
    emptyIncludesExcludes(DATASET_STATE) : setupIncludesExcludes(state.role, DATASET_STATE, AUTH_API.ROLE_OBJECT.ARRAY[2])
})

const stateReducer = (state, action) => {
  switch (action.type) {
    case AUTH_API.INCLUDES:
      return { ...state, [AUTH_API.INCLUDES]: action.payload }

    case AUTH_API.EXCLUDES:
      return { ...state, [AUTH_API.EXCLUDES]: action.payload }

    case AUTH_API.ROLE_OBJECT.ENUM:
      return { ...state, [AUTH_API.ROLE_OBJECT.ENUM]: action.payload }

    case AUTH_API.ROLE_OBJECT.ARRAY[1]:
      return { ...state, [AUTH_API.ROLE_OBJECT.ARRAY[1]]: action.payload }

    case AUTH_API.ROLE_OBJECT.ARRAY[2]:
      return { ...state, [AUTH_API.ROLE_OBJECT.ARRAY[2]]: action.payload }

    case AUTH_API.ROLE_OBJECT.STRING[0]:
      return { ...state, [AUTH_API.ROLE_OBJECT.STRING[0]]: action.payload }

    case AUTH_API.ROLE_OBJECT.STRING[1]:
      return { ...state, [AUTH_API.ROLE_OBJECT.STRING[1]]: action.payload }

    default:
      return state
  }
}

function UpdateRole () {
  const { authApi, catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  let { state } = useLocation()

  const [pathOptions, setPathOptions] = useState([])
  const [isValidated, setIsValidated] = useState(false)
  const [fetchedPathOptions, setFetchedPathOptions] = useState([])
  const [currentState, dispatchState] = useReducer(stateReducer, state, initialState)

  const [{ data: getPathsData, loading: getPathsLoading, error: getPathsError }, refetchPathsGet] =
    useAxios(`${catalogApi}${CATALOG_API.GET_PATHS}`)
  const [{ loading: putLoading, error: putError, response: putResponse }, executePut] =
    useAxios({ method: 'PUT' }, { manual: true })

  const movePrivilege = (privilegeToMove, to) => {
    setIsValidated(false)
    dispatchState({
      type: AUTH_API.ROLE_OBJECT.ARRAY[1],
      payload: moveIncludesExcludes(
        currentState[AUTH_API.ROLE_OBJECT.ARRAY[1]][AUTH_API.INCLUDES],
        currentState[AUTH_API.ROLE_OBJECT.ARRAY[1]][AUTH_API.EXCLUDES],
        privilegeToMove,
        to
      )
    })
  }

  const moveState = (stateToMove, to) => {
    setIsValidated(false)
    dispatchState({
      type: AUTH_API.ROLE_OBJECT.ARRAY[2],
      payload: moveIncludesExcludes(
        currentState[AUTH_API.ROLE_OBJECT.ARRAY[2]][AUTH_API.INCLUDES],
        currentState[AUTH_API.ROLE_OBJECT.ARRAY[2]][AUTH_API.EXCLUDES],
        stateToMove,
        to
      )
    })
  }

  const handleUpdateRole = () => {
    const putRole = {
      [AUTH_API.ROLE_OBJECT.STRING[0]]: currentState[AUTH_API.ROLE_OBJECT.STRING[0]],
      [AUTH_API.ROLE_OBJECT.STRING[1]]: currentState[AUTH_API.ROLE_OBJECT.STRING[1]],
      [AUTH_API.ROLE_OBJECT.ARRAY[0]]: {
        [AUTH_API.INCLUDES]: currentState[AUTH_API.INCLUDES],
        [AUTH_API.EXCLUDES]: currentState[AUTH_API.EXCLUDES]
      },
      [AUTH_API.ROLE_OBJECT.ARRAY[1]]: currentState[AUTH_API.ROLE_OBJECT.ARRAY[1]],
      [AUTH_API.ROLE_OBJECT.ARRAY[2]]: currentState[AUTH_API.ROLE_OBJECT.ARRAY[2]],
      [AUTH_API.ROLE_OBJECT.ENUM]: currentState[AUTH_API.ROLE_OBJECT.ENUM]
    }
    const isValid = validateRole(putRole, getPathsData[CATALOG_API.CATALOGS], language)

    if (isValid.isValid) {
      executePut({
        data: putRole,
        url: `${authApi}${AUTH_API.PUT_ROLE(currentState[AUTH_API.ROLE_OBJECT.STRING[0]])}`
      })
    } else {
      setIsValidated(isValid)
    }
  }

  useEffect(() => {
    if (!getPathsLoading && !getPathsError && getPathsData !== undefined) {
      setFetchedPathOptions(renderFetchedPathOptionsItems(getPathsData[CATALOG_API.CATALOGS], language))

      if (!state.isNew) {
        setPathOptions(setupPathOptions(state.role, getPathsData[CATALOG_API.CATALOGS]))
      }
    }
  }, [getPathsLoading, getPathsError, getPathsData, language, state.isNew, state.role])

  return (
    <Segment basic>
      <UpdateHeader
        logo="vcard"
        isNew={state.isNew}
        create={ROLES.CREATE_ROLE}
        update={ROLES.UPDATE_ROLE}
        id={currentState[AUTH_API.ROLE_OBJECT.STRING[0]]}
      />
      <Divider hidden />
      <Grid columns="equal">
        <Grid.Column>
          <Form size="large">
            <Form.Group widths="equal">
              <Form.Input
                required
                value={currentState[AUTH_API.ROLE_OBJECT.STRING[0]]}
                disabled={!state.isNew}
                label={ROLES.ROLE_ID[language]}
                placeholder={ROLES.ROLE_ID[language]}
                error={isValidated && isValidated.reason[AUTH_API.ROLE_OBJECT.STRING[0]] !== undefined && {
                  content: isValidated.reason[AUTH_API.ROLE_OBJECT.STRING[0]], pointing: 'below'
                }}
                onChange={(e, { value }) => {
                  setIsValidated(false)
                  dispatchState({ type: AUTH_API.ROLE_OBJECT.STRING[0], payload: value })
                }}
              />
              <Form.TextArea
                required
                value={currentState[AUTH_API.ROLE_OBJECT.STRING[1]]}
                label={ROLES.DESCRIPTION[language]}
                placeholder={ROLES.DESCRIPTION[language]}
                error={isValidated && isValidated.reason[AUTH_API.ROLE_OBJECT.STRING[1]] !== undefined && {
                  content: isValidated.reason[AUTH_API.ROLE_OBJECT.STRING[1]], pointing: 'below'
                }}
                onChange={(e, { value }) => {
                  setIsValidated(false)
                  dispatchState({ type: AUTH_API.ROLE_OBJECT.STRING[1], payload: value })
                }}
              />
            </Form.Group>
            <Form.Group widths="equal" style={{ marginTop: '2rem' }}>
              <Form.Field
                required
                error={isValidated && isValidated.reason[AUTH_API.ROLE_OBJECT.ARRAY[1]] !== undefined}
              >
                {isValidated && isValidated.reason[AUTH_API.ROLE_OBJECT.ARRAY[1]] !== undefined &&
                <Label prompt pointing="below">
                  {isValidated.reason[AUTH_API.ROLE_OBJECT.ARRAY[1]]}
                </Label>
                }
                <label>{ROLES.PRIVILEGES[language]}</label>
                {includesExcludesFormLayout(currentState[AUTH_API.ROLE_OBJECT.ARRAY[1]], movePrivilege, PRIVILEGE, language)}
              </Form.Field>
              <Form.Field
                required
                error={isValidated && isValidated.reason[AUTH_API.ROLE_OBJECT.ARRAY[2]] !== undefined}
              >
                {isValidated && isValidated.reason[AUTH_API.ROLE_OBJECT.ARRAY[2]] !== undefined &&
                <Label prompt pointing="below">
                  {isValidated.reason[AUTH_API.ROLE_OBJECT.ARRAY[2]]}
                </Label>
                }
                <label>{ROLES.STATES[language]}</label>
                {includesExcludesFormLayout(currentState[AUTH_API.ROLE_OBJECT.ARRAY[2]], moveState, DATASET_STATE, language)}
              </Form.Field>
            </Form.Group>
            <Form.Field
              required
              style={{ marginTop: '2rem', marginBottom: '2rem' }}
              error={isValidated && isValidated.reason[AUTH_API.ROLE_OBJECT.ENUM] !== undefined}
            >
              {isValidated && isValidated.reason[AUTH_API.ROLE_OBJECT.ENUM] !== undefined &&
              <Label prompt pointing="below">
                {isValidated.reason[AUTH_API.ROLE_OBJECT.ENUM]}
              </Label>
              }
              <label>{ROLES.MAX_VALUATION[language]}</label>
              <Form.Group inline>
                {Object.keys(VALUATION).filter(element => element !== UNRECOGNIZED).map(valuation =>
                  <Form.Radio
                    key={valuation}
                    value={valuation}
                    label={VALUATION[valuation][language]}
                    checked={currentState[AUTH_API.ROLE_OBJECT.ENUM] === valuation}
                    onChange={(e, { value }) => {
                      setIsValidated(false)
                      dispatchState({ type: AUTH_API.ROLE_OBJECT.ENUM, payload: value })
                    }}
                  />
                )}
              </Form.Group>
            </Form.Field>
            <Form.Dropdown
              search
              multiple
              required
              selection
              allowAdditions
              loading={getPathsLoading}
              disabled={getPathsLoading}
              data-testid={TEST_IDS.SEARCH_DROPDOWN}
              additionLabel={`${UI.ADD[language]} `}
              value={currentState[AUTH_API.INCLUDES]}
              placeholder={ROLES.PATHS_INCLUDE[language]}
              options={[...fetchedPathOptions, ...pathOptions]}
              noResultsMessage={UI.SEARCH_NO_RESULTS_CAN_ADD[language]}
              onAddItem={(e, { value }) => setPathOptions([addItem(value), ...pathOptions])}
              renderLabel={(label) => renderTooltipLabelDropdownSelection(label, fetchedPathOptions, language)}
              error={isValidated && isValidated.reason[AUTH_API.ROLE_OBJECT.ARRAY[0]] !== undefined && {
                content: isValidated.reason[AUTH_API.ROLE_OBJECT.ARRAY[0]], pointing: 'below'
              }}
              onChange={(e, { value }) => {
                setIsValidated(false)
                dispatchState({ type: AUTH_API.INCLUDES, payload: value })
              }}
              label={populatedDropdown(
                ROLES.PATHS_INCLUDE[language],
                getPathsLoading,
                refetchPathsGet,
                getPathsError,
                ROLES.PATHS_FETCH_ERROR[language],
                fetchedPathOptions.length
              )}
            />
            <Form.Dropdown
              search
              multiple
              selection
              allowAdditions
              loading={getPathsLoading}
              disabled={getPathsLoading}
              data-testid={TEST_IDS.SEARCH_DROPDOWN}
              additionLabel={`${UI.ADD[language]} `}
              value={currentState[AUTH_API.EXCLUDES]}
              placeholder={ROLES.PATHS_EXCLUDE[language]}
              options={[...fetchedPathOptions, ...pathOptions]}
              noResultsMessage={UI.SEARCH_NO_RESULTS_CAN_ADD[language]}
              onAddItem={(e, { value }) => setPathOptions([addItem(value), ...pathOptions])}
              renderLabel={(label) => renderTooltipLabelDropdownSelection(label, fetchedPathOptions, language)}
              onChange={(e, { value }) => {
                setIsValidated(false)
                dispatchState({ type: AUTH_API.EXCLUDES, payload: value })
              }}
              label={populatedDropdown(
                ROLES.PATHS_EXCLUDE[language],
                getPathsLoading,
                refetchPathsGet,
                getPathsError,
                ROLES.PATHS_FETCH_ERROR[language],
                fetchedPathOptions.length
              )}
            />
          </Form>
          <Divider hidden />
          <SaveUpdateButton
            isNew={state.isNew}
            loading={putLoading}
            create={ROLES.CREATE_ROLE}
            update={ROLES.UPDATE_ROLE}
            handleUpdate={handleUpdateRole}
          />
        </Grid.Column>
        <ResponseColumn response={putResponse} loading={putLoading} error={putError} />
      </Grid>
    </Segment>
  )
}

export default UpdateRole
