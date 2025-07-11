import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { DictionarySelector } from './components/DictionarySelector'
import { AuthWrapper } from './components/AuthWrapper'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <AuthWrapper>
        <DictionarySelector />
      </AuthWrapper>
    </MantineProvider>
  )
}

export default App
