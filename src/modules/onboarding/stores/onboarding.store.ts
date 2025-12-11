import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface InviteMember {
  email: string
  role: 'viewer' | 'editor' | 'admin'
}

export const useOnboardingStore = defineStore('onboarding', () => {
  const appName = ref('')
  const platform = ref<'android' | 'ios' | 'flutter' | 'react-native' | 'capacitor' | 'cordova'>(
    'capacitor',
  )

  const createNewTeam = ref(false)
  const teamName = ref('')

  const members = ref<InviteMember[]>([])
  const channels = ref<string[]>([])

  const reset = () => {
    appName.value = ''
    platform.value = 'capacitor'
    createNewTeam.value = false
    teamName.value = ''
    members.value = []
    channels.value = []
  }

  return {
    appName,
    platform,
    createNewTeam,
    teamName,
    members,
    channels,
    reset,
  }
})
