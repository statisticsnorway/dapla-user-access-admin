import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Form, Header, Icon, Modal, Popup } from 'semantic-ui-react'
import { Button as SSBButton } from '@statisticsnorway/ssb-component-library'

import { ApiContext, DescriptionPopup, LanguageContext } from '../../utilities'
import { AUTH_API, CATALOG_API, SSB_COLORS, SSB_STYLE } from '../../configurations'
import { ROLE, TEST_IDS, UI } from '../../enums'
import { ErrorMessage } from '../index'

function UpdateRole ({ isNew, refetch, role }) {
  const { authApi, catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [pathOptions, setPathOptions] = useState([])
  const [updatedStates, setUpdatedStates] = useState(isNew ? [] : role[AUTH_API.ROLE_OBJECT.ARRAY[1]]) // TODO: Handle includes/excludes
  const [updatedRoleId, setUpdatedRoleId] = useState(isNew ? '' : role[AUTH_API.ROLE_OBJECT.STRING[0]])
  const [updatedPrivileges, setUpdatedPrivileges] = useState(isNew ? [] : role[AUTH_API.ROLE_OBJECT.ARRAY[0]]) // TODO: Handle includes/excludes
  const [updatedMaxValuation, setUpdatedMaxValuation] = useState(isNew ? '' : role[AUTH_API.ROLE_OBJECT.ENUM])
  const [updatedDescription, setUpdatedDescription] = useState(isNew ? '' : role[AUTH_API.ROLE_OBJECT.STRING[1]])
  const [updatedPaths, setUpdatedPaths] = useState(isNew ? [] : role[AUTH_API.ROLE_OBJECT.LIST][AUTH_API.INCLUDES])

  const [{ data: getData, loading: getLoading, error: getError }, refetchGet] =
    useAxios(`${catalogApi}${CATALOG_API.GET_CATALOGS}`, { manual: true })
  const [{ loading, error, response }, executePut] =
    useAxios({ url: `${authApi}${AUTH_API.PUT_ROLE(updatedRoleId)}`, method: 'PUT' }, { manual: true })

  useEffect(() => {
    if (!getLoading && !getError && getData !== undefined) {
      setPathOptions(getData[CATALOG_API.CATALOGS].map(catalog => ({
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
        if (!isNew) {
          refetch()
        }
      }}
      trigger={DescriptionPopup(
        <Icon.Group size='big' style={{ color: SSB_COLORS[isNew ? 'GREEN' : 'BLUE'] }}>
          <Icon
            link
            name='address card'
            data-testid={TEST_IDS.UPDATE_ROLE}
            onClick={() => setModalOpen(true)}
          />
          <Icon corner link name={isNew ? 'plus' : 'edit'} onClick={() => setModalOpen(true)} />
        </Icon.Group>,
        'left center'
      )}
    >
      <Header as='h2' style={SSB_STYLE}>
        {isNew ?
          <>
            <Icon.Group size='large' style={{ marginRight: '0.2em', color: SSB_COLORS.BLUE }}>
              <Icon name='address card' />
              <Icon corner name='edit' />
            </Icon.Group>
            {ROLE.CREATE_ROLE[language]}
          </>
          :
          <>
            <Icon.Group size='large' style={{ marginRight: '0.2em', color: SSB_COLORS.BLUE }}>
              <Icon name='address card' />
              <Icon corner name='edit' />
            </Icon.Group>
            {ROLE.UPDATE_ROLE[language]}
          </>
        }
      </Header>
      <Modal.Content style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            required
            disabled={!isNew}
            value={updatedRoleId}
            placeholder={ROLE.ROLE_ID[language]}
            label={<label>{DescriptionPopup(<span>{ROLE.ROLE_ID[language]}</span>)}</label>}
            onChange={(event, { value }) => setUpdatedRoleId(value)}
          />
          <Form.TextArea
            rows={2}
            required
            value={updatedDescription}
            placeholder={ROLE.DESCRIPTION[language]}
            label={<label>{DescriptionPopup(<span>{ROLE.DESCRIPTION[language]}</span>)}</label>}
            onChange={(event, { value }) => setUpdatedDescription(value)}
          />
          <Form.Dropdown
            multiple
            required
            selection
            value={updatedPrivileges}
            placeholder={ROLE.PRIVILEGES[language]}
            label={<label>{DescriptionPopup(<span>{ROLE.PRIVILEGES[language]}</span>)}</label>}
            onChange={(event, { value }) => setUpdatedPrivileges(value)}
            options={AUTH_API.ENUMS.PRIVILEGES.map(privilege => ({
              key: privilege,
              text: privilege,
              value: privilege
            }))}
          />
          <Form.Dropdown
            search
            multiple
            required
            selection
            allowAdditions
            value={updatedPaths}
            options={pathOptions}
            placeholder={ROLE.PATHS[language]}
            data-testid={TEST_IDS.SEARCH_DROPDOWN}
            additionLabel={`${UI.ADD[language]} `}
            noResultsMessage={UI.SEARCH_NO_RESULTS_CAN_ADD[language]}
            onChange={(event, { value }) => setUpdatedPaths(value)}
            onAddItem={(event, { value }) => setPathOptions(
              [{ key: value, text: value, value: value }, ...pathOptions]
            )}
            label={
              <label>
                {DescriptionPopup(<span>{ROLE.PATHS[language]} </span>)}
                {DescriptionPopup(
                  <Icon
                    link
                    loading={getLoading}
                    name='sync alternate'
                    onClick={() => refetchGet()}
                    style={{ color: SSB_COLORS.BLUE }}
                  />
                )}
                {getError &&
                <Popup
                  basic
                  flowing
                  trigger={<Icon name='exclamation triangle' style={{ color: SSB_COLORS.YELLOW }} />}
                >
                  <ErrorMessage error={getError} title={ROLE.PATHS_FETCH_ERROR[language]} />
                </Popup>
                }
              </label>
            }
          />
          <Form.Dropdown
            required
            selection
            value={updatedMaxValuation}
            placeholder={ROLE.MAX_VALUATION[language]}
            label={<label>{DescriptionPopup(<span>{ROLE.MAX_VALUATION[language]}</span>)}</label>}
            options={AUTH_API.ENUMS.VALUATIONS.map(state => ({ key: state, text: state, value: state }))}
            onChange={(event, { value }) => setUpdatedMaxValuation(value)}
          />
          <Form.Dropdown
            multiple
            required
            selection
            value={updatedStates}
            placeholder={ROLE.STATES[language]}
            label={<label>{DescriptionPopup(<span>{ROLE.STATES[language]}</span>)}</label>}
            options={AUTH_API.ENUMS.STATES.map(state => ({ key: state, text: state, value: state }))}
            onChange={(event, { value }) => setUpdatedStates(value)}
          />
        </Form>
        <Divider hidden />
        <SSBButton
          primary
          disabled={loading}
          onClick={() => executePut({
            data: {
              [AUTH_API.ROLE_OBJECT.LIST]: { [AUTH_API.INCLUDES]: updatedPaths },
              [AUTH_API.ROLE_OBJECT.ARRAY[1]]: updatedStates,
              [AUTH_API.ROLE_OBJECT.STRING[0]]: updatedRoleId,
              [AUTH_API.ROLE_OBJECT.ENUM]: updatedMaxValuation,
              [AUTH_API.ROLE_OBJECT.ARRAY[0]]: updatedPrivileges,
              [AUTH_API.ROLE_OBJECT.STRING[1]]: updatedDescription
            }
          })}
        >
          {isNew ? ROLE.CREATE_ROLE[language] : ROLE.UPDATE_ROLE[language]}
        </SSBButton>
      </Modal.Content>
    </Modal>
  )
}

export default UpdateRole
