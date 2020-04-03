import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'

import { ErrorMessage } from '../components'
import { DescriptionPopup } from '../utilities'
import { SSB_COLORS } from './'

export const populatedDropdown = (label, loading, refetch, error, errorTitle) =>
  <label>
    {DescriptionPopup(<span>{label} </span>)}
    {DescriptionPopup(
      <Icon
        link
        loading={loading}
        name='sync alternate'
        onClick={() => refetch()}
        style={{ color: SSB_COLORS.BLUE }}
      />
    )}
    {error &&
    <Popup
      basic
      flowing
      trigger={<Icon name='exclamation triangle' style={{ color: SSB_COLORS.YELLOW }} />}
    >
      <ErrorMessage error={error} title={errorTitle} />
    </Popup>
    }
  </label>
