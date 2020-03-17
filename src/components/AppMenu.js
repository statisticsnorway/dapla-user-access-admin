import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Image, Menu } from 'semantic-ui-react'
import { Title } from '@statisticsnorway/ssb-component-library'

import SSBLogo from '../media/ssb-logo-rgb.svg'
import { LanguageContext } from '../utilities'
import { ROUTING, SSB_COLORS } from '../configurations'
import { LANGUAGE, TEST_IDS, UI } from '../enums'

function AppMenu ({ setSettingsOpen }) {
  const { language, setLanguage } = useContext(LanguageContext)

  const dropdownItems = Object.keys(LANGUAGE.LANGUAGES).map(languageName =>
    <Dropdown.Item
      key={languageName}
      content={LANGUAGE[languageName][language]}
      onClick={() => setLanguage(LANGUAGE.LANGUAGES[languageName].languageCode)}
    />
  )

  return (
    <Menu secondary size='huge' style={{ padding: '1em' }}>
      <Menu.Item as={Link} to={ROUTING.BASE}>
        <Image size='medium' src={SSBLogo} />
      </Menu.Item>
      <Menu.Item>
        <Title size={1}>{UI.HEADER[language]}</Title>
      </Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item
          onClick={() => setSettingsOpen(true)}
          icon={{ name: 'setting', size: 'large', 'data-testid': TEST_IDS.ACCESS_SETTINGS_BUTTON }}
          style={{ color: SSB_COLORS.GREEN }}
        />
        <Dropdown item text={`${LANGUAGE.LANGUAGE[language]} (${LANGUAGE.LANGUAGE_CHOICE[language]})`}>
          <Dropdown.Menu>{dropdownItems}</Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  )
}

export default AppMenu