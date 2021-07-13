import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Divider, Form, Grid, Header, Icon, Item, Label, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../../context/AppContext'
import {
  API,
  AUTH_API,
  CATALOG_API,
  emptyIncludesExcludes,
  includesExcludesFormLayout,
  moveIncludesExcludes,
  populatedDropdown,
  renderTooltipLabelDropdownSelection,
  setupIncludesExcludes,
  setupPathOptions,
  setupPathValues,
  validateRole
} from '../../configurations'
import { DATASET_STATE, PRIVILEGE, ROLES, TEST_IDS, UI, VALUATION } from '../../enums'

function UpdateRole () {
  const { authApi, catalogApi, devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  let { state } = useLocation()

  const [isValidRole, setIsValidRole] = useState(false)
  const [fetchedPathOptions, setFetchedPathOptions] = useState([])
  const [pathOptions, setPathOptions] = useState(state.isNew ? [] : setupPathOptions(state.role))
  const [updatedRoleId, setUpdatedRoleId] = useState(state.isNew ? '' : state.role[AUTH_API.ROLE_OBJECT.STRING[0]])
  const [updatedMaxValuation, setUpdatedMaxValuation] = useState(state.isNew ? '' : state.role[AUTH_API.ROLE_OBJECT.ENUM])
  const [updatedDescription, setUpdatedDescription] = useState(state.isNew ? '' : state.role[AUTH_API.ROLE_OBJECT.STRING[1]])
  const [updatedPathsInclude, setUpdatedPathsInclude] = useState(state.isNew ? [] : setupPathValues(state.role, AUTH_API.INCLUDES))
  const [updatedPathsExclude, setUpdatedPathsExclude] = useState(state.isNew ? [] : setupPathValues(state.role, AUTH_API.EXCLUDES))
  const [updatedPrivileges, setUpdatedPrivileges] = useState(state.isNew ? emptyIncludesExcludes(PRIVILEGE) : setupIncludesExcludes(state.role, PRIVILEGE, AUTH_API.ROLE_OBJECT.ARRAY[1]))
  const [updatedStates, setUpdatedStates] = useState(state.isNew ? emptyIncludesExcludes(DATASET_STATE) : setupIncludesExcludes(state.role, DATASET_STATE, AUTH_API.ROLE_OBJECT.ARRAY[2]))

  const [{ data: getPathsData, loading: getPathsLoading, error: getPathsError }, refetchPathsGet] =
    useAxios(`${catalogApi}${CATALOG_API.GET_PATHS}`)
  const [{ loading: putLoading, error: putError, response: putResponse }, executePut] =
    useAxios({ method: 'PUT' }, { manual: true })

  const movePrivilege = (privilege, to) => {
    setIsValidRole(false)
    setUpdatedPrivileges(
      moveIncludesExcludes(updatedPrivileges[AUTH_API.INCLUDES], updatedPrivileges[AUTH_API.EXCLUDES], privilege, to)
    )
  }

  const moveState = (state, to) => {
    setIsValidRole(false)
    setUpdatedStates(
      moveIncludesExcludes(updatedStates[AUTH_API.INCLUDES], updatedStates[AUTH_API.EXCLUDES], state, to)
    )
  }

  const handleUpdateRole = () => {
    const putRole = {
      [AUTH_API.ROLE_OBJECT.STRING[0]]: updatedRoleId,
      [AUTH_API.ROLE_OBJECT.STRING[1]]: updatedDescription,
      [AUTH_API.ROLE_OBJECT.ARRAY[0]]: {
        [AUTH_API.INCLUDES]: updatedPathsInclude,
        [AUTH_API.EXCLUDES]: updatedPathsExclude
      },
      [AUTH_API.ROLE_OBJECT.ARRAY[1]]: updatedPrivileges,
      [AUTH_API.ROLE_OBJECT.ARRAY[2]]: updatedStates,
      [AUTH_API.ROLE_OBJECT.ENUM]: updatedMaxValuation
    }
    const isValid = validateRole(putRole, getPathsData[CATALOG_API.CATALOGS], language)

    if (isValid.isValid) {
      executePut(API.HANDLE_PUT(
        process.env.NODE_ENV,
        putRole,
        `${authApi}${AUTH_API.PUT_ROLE(updatedRoleId)}`,
        devToken
      ))
    } else {
      setIsValidRole(isValid)
    }
  }

  useEffect(() => {
    if (!getPathsLoading && !getPathsError && getPathsData !== undefined) {
      setFetchedPathOptions(getPathsData[CATALOG_API.CATALOGS].map(({ id, state, valuation }) => ({
        key: id.path,
        text: id.path,
        value: id.path,
        state: state,
        valuation: valuation,
        content: (
          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header as={Header} size="tiny">{id.path}</Item.Header>
                <Item.Extra>
                  {`${ROLES.STATE[language]}: ${DATASET_STATE[state][language]}, 
                  ${ROLES.MAX_VALUATION[language]}: ${VALUATION[valuation][language]}`}
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        )
      })))
    }
  }, [getPathsLoading, getPathsError, getPathsData, language])

  return (
    <Segment basic>
      <Header size="large">
        <Icon.Group size="large" style={{ marginRight: '0.5rem', marginTop: '0.65rem' }}>
          <Icon name="user" color={state.isNew ? 'green' : 'blue'} />
          <Icon corner="top right" name={state.isNew ? 'plus' : 'pencil'} color={state.isNew ? 'green' : 'blue'} />
        </Icon.Group>
        <Header.Content>
          {state.isNew ? ROLES.CREATE_ROLE[language] : updatedRoleId}
          {!state.isNew &&
          <Header.Subheader>{ROLES.UPDATE_ROLE[language]}</Header.Subheader>
          }
        </Header.Content>
      </Header>
      <Divider hidden />
      <Grid columns="equal">
        <Grid.Column>
          <Form size="large">
            <Form.Group widths="equal">
              <Form.Input
                required
                value={updatedRoleId}
                disabled={!state.isNew}
                label={ROLES.ROLE_ID[language]}
                placeholder={ROLES.ROLE_ID[language]}
                error={isValidRole && isValidRole.reason[AUTH_API.ROLE_OBJECT.STRING[0]] !== undefined && {
                  content: isValidRole.reason[AUTH_API.ROLE_OBJECT.STRING[0]], pointing: 'below'
                }}
                onChange={(e, { value }) => {
                  setIsValidRole(false)
                  setUpdatedRoleId(value)
                }}
              />
              <Form.TextArea
                required
                value={updatedDescription}
                label={ROLES.DESCRIPTION[language]}
                placeholder={ROLES.DESCRIPTION[language]}
                error={isValidRole && isValidRole.reason[AUTH_API.ROLE_OBJECT.STRING[1]] !== undefined && {
                  content: isValidRole.reason[AUTH_API.ROLE_OBJECT.STRING[1]], pointing: 'below'
                }}
                onChange={(e, { value }) => {
                  setIsValidRole(false)
                  setUpdatedDescription(value)
                }}
              />
            </Form.Group>
            <Form.Group widths="equal" style={{ marginTop: '2rem' }}>
              <Form.Field
                required
                error={isValidRole && isValidRole.reason[AUTH_API.ROLE_OBJECT.ARRAY[1]] !== undefined}
              >
                {isValidRole && isValidRole.reason[AUTH_API.ROLE_OBJECT.ARRAY[1]] !== undefined &&
                <Label prompt pointing="below">
                  {isValidRole.reason[AUTH_API.ROLE_OBJECT.ARRAY[1]]}
                </Label>
                }
                <label>{ROLES.PRIVILEGES[language]}</label>
                {includesExcludesFormLayout(updatedPrivileges, movePrivilege, PRIVILEGE, language)}
              </Form.Field>
              <Form.Field
                required
                error={isValidRole && isValidRole.reason[AUTH_API.ROLE_OBJECT.ARRAY[2]] !== undefined}
              >
                {isValidRole && isValidRole.reason[AUTH_API.ROLE_OBJECT.ARRAY[2]] !== undefined &&
                <Label prompt pointing="below">
                  {isValidRole.reason[AUTH_API.ROLE_OBJECT.ARRAY[2]]}
                </Label>
                }
                <label>{ROLES.STATES[language]}</label>
                {includesExcludesFormLayout(updatedStates, moveState, DATASET_STATE, language)}
              </Form.Field>
            </Form.Group>
            <Form.Field
              required
              style={{ marginTop: '2rem', marginBottom: '2rem' }}
              error={isValidRole && isValidRole.reason[AUTH_API.ROLE_OBJECT.ENUM] !== undefined}
            >
              {isValidRole && isValidRole.reason[AUTH_API.ROLE_OBJECT.ENUM] !== undefined &&
              <Label prompt pointing="below">
                {isValidRole.reason[AUTH_API.ROLE_OBJECT.ENUM]}
              </Label>
              }
              <label>{ROLES.MAX_VALUATION[language]}</label>
              <Form.Group inline>
                {Object.keys(VALUATION).filter(element => element !== 'UNRECOGNIZED').map(valuation =>
                  <Form.Radio
                    key={valuation}
                    value={valuation}
                    label={VALUATION[valuation][language]}
                    checked={updatedMaxValuation === valuation}
                    onChange={(e, { value }) => {
                      setIsValidRole(false)
                      setUpdatedMaxValuation(value)
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
              value={updatedPathsInclude}
              data-testid={TEST_IDS.SEARCH_DROPDOWN}
              additionLabel={`${UI.ADD[language]} `}
              placeholder={ROLES.PATHS_INCLUDE[language]}
              options={[...fetchedPathOptions, ...pathOptions]}
              noResultsMessage={UI.SEARCH_NO_RESULTS_CAN_ADD[language]}
              onChange={(e, { value }) => setUpdatedPathsInclude(value)}
              renderLabel={(label) => renderTooltipLabelDropdownSelection(label, fetchedPathOptions, language)}
              onAddItem={(e, { value }) => setPathOptions([{ key: value, text: value, value: value }, ...pathOptions])}
              error={isValidRole && isValidRole.reason[AUTH_API.ROLE_OBJECT.ARRAY[0]] !== undefined && {
                content: isValidRole.reason[AUTH_API.ROLE_OBJECT.ARRAY[0]], pointing: 'below'
              }}
              label={populatedDropdown(
                ROLES.PATHS_INCLUDE[language],
                getPathsLoading,
                refetchPathsGet,
                getPathsError,
                ROLES.PATHS_FETCH_ERROR[language]
              )}
            />
            <Form.Dropdown
              search
              multiple
              selection
              allowAdditions
              value={updatedPathsExclude}
              data-testid={TEST_IDS.SEARCH_DROPDOWN}
              additionLabel={`${UI.ADD[language]} `}
              placeholder={ROLES.PATHS_EXCLUDE[language]}
              options={[...fetchedPathOptions, ...pathOptions]}
              noResultsMessage={UI.SEARCH_NO_RESULTS_CAN_ADD[language]}
              onChange={(e, { value }) => setUpdatedPathsExclude(value)}
              renderLabel={(label) => renderTooltipLabelDropdownSelection(label, fetchedPathOptions, language)}
              onAddItem={(e, { value }) => setPathOptions([{ key: value, text: value, value: value }, ...pathOptions])}
              label={populatedDropdown(
                ROLES.PATHS_EXCLUDE[language],
                getPathsLoading,
                refetchPathsGet,
                getPathsError,
                ROLES.PATHS_FETCH_ERROR[language]
              )}
            />
          </Form>
          <Divider hidden />
          <Button
            animated
            size="large"
            primary={!state.isNew}
            positive={state.isNew}
            disabled={putLoading}
            onClick={() => handleUpdateRole()}
          >
            <Button.Content visible>
              {state.isNew ? ROLES.CREATE_ROLE[language] : ROLES.UPDATE_ROLE[language]}
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

export default UpdateRole
