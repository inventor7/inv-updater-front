<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="space-y-2 text-center">
      <h1 class="text-3xl font-bold tracking-tight">Create your app</h1>
      <p class="text-muted-foreground">
        Let's start by naming your application and choosing its platform.
      </p>
    </div>

    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="appName">App Name</Label>
        <Input
          id="appName"
          v-model="store.appName"
          placeholder="My Awesome App"
          autofocus
          @keyup.enter="canNext && emit('next')"
        />
      </div>

      <div class="space-y-2">
        <Label>Platform / Framework</Label>
        <Select v-model="store.platform">
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="capacitor">Capacitor (Ionic)</SelectItem>
            <SelectItem value="react-native">React Native</SelectItem>
            <SelectItem value="flutter">Flutter</SelectItem>
            <SelectItem value="cordova">Cordova</SelectItem>
            <SelectItem value="android">Native Android</SelectItem>
            <SelectItem value="ios">Native iOS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="pt-4 flex justify-between gap-2">
        <Button variant="ghost" @click="emit('back')">Cancel</Button>
        <Button @click="emit('next')" :disabled="!canNext">
          Next
          <ILucideArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOnboardingStore } from '@/modules/onboarding/stores/onboarding.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'back'): void
}>()

const store = useOnboardingStore()

const canNext = computed(() => !!store.appName)
</script>
