<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="space-y-2 text-center">
      <h1 class="text-3xl font-bold tracking-tight">Team Setup</h1>
      <p class="text-muted-foreground">
        Do you want to create this app in an existing team or create a new one?
      </p>
    </div>

    <div class="space-y-6">
      <RadioGroup v-model="mode" class="grid grid-cols-2 gap-4">
        <div>
          <RadioGroupItem id="existing" value="existing" class="peer sr-only" />
          <Label
            for="existing"
            class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
          >
            <ILucideUsers class="mb-3 h-6 w-6" />
            Existing Team
          </Label>
        </div>
        <div>
          <RadioGroupItem id="new" value="new" class="peer sr-only" />
          <Label
            for="new"
            class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
          >
            <ILucideUserPlus class="mb-3 h-6 w-6" />
            New Team
          </Label>
        </div>
      </RadioGroup>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
        mode="out-in"
      >
        <div v-if="mode === 'new'" class="space-y-2">
          <Label for="teamName">New Team Name</Label>
          <Input
            id="teamName"
            v-model="store.teamName"
            placeholder="Acme Inc."
            autofocus
            @keyup.enter="canNext && emit('next')"
          />
        </div>
        <div v-else class="space-y-2">
          <div
            class="rounded-md bg-muted p-4 text-sm text-muted-foreground flex items-center gap-2"
          >
            <ILucideInfo class="w-4 h-4" />
            The app will be created in your current active team.
          </div>
        </div>
      </Transition>

      <div class="pt-4 flex justify-between">
        <Button variant="ghost" @click="emit('back')">Back</Button>
        <Button @click="emit('next')" :disabled="!canNext">
          Next
          <ILucideArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'next'): void
  (e: 'back'): void
}>()

const store = useOnboardingStore()
const mode = ref<'existing' | 'new'>('existing')

watch(
  mode,
  (val) => {
    store.createNewTeam = val === 'new'
  },
  { immediate: true },
)

const canNext = computed(() => {
  if (mode.value === 'new') return !!store.teamName
  return true
})
</script>
