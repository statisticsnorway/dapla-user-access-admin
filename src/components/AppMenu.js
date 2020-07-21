import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Header, Icon, Image, Menu } from 'semantic-ui-react'

import SSBLogo from '../media/ssb-logo-rgb.svg'
import { LanguageContext } from '../utilities'
import { ROUTING, SSB_COLORS } from '../configurations'
import { LANGUAGE, TEST_IDS, UI } from '../enums'

const routeIcons = ['users', 'address card', 'folder open']

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
    <Menu secondary size='huge' icon='labeled' style={{ padding: '1em' }}>
      <Menu.Item as={Link} to={ROUTING.BASE}>
        <Image size='medium' src={SSBLogo} />
      </Menu.Item>
      <Menu.Item>
        <Header size='huge' content={UI.HEADER[language]} />
      </Menu.Item>
      <Menu.Menu position='right'>
        {Object.entries(ROUTING).filter(([route]) => route !== 'BASE' && route !== 'USERS').map(([route, path], index) =>
          <Menu.Item key={path} as={Link} to={path}>
            <Icon link fitted name={routeIcons[index]} size='big' style={{ color: SSB_COLORS.BLUE }} />
            {UI[route][language]}
          </Menu.Item>
        )}
        <Menu.Item
          onClick={() => setSettingsOpen(true)}
          icon={{ name: 'setting', size: 'big', 'data-testid': TEST_IDS.ACCESS_SETTINGS_BUTTON }}
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
