<script setup>
import { Check, UserPlus } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { toggleTeam } from '@/stores/hospital'
import { toast } from '@/composables/useToast'

// Add/remove a doctor from the user's care team — shared by the list and card views.
const props = defineProps({
  doctor: { type: Object, required: true },
  iconOnly: Boolean
})

function toggle() {
  const doctor = toggleTeam(props.doctor.id)
  toast({
    title: doctor.onTeam ? 'Added to your team' : 'Removed from your team',
    description: doctor.name,
    variant: doctor.onTeam ? 'success' : 'default'
  })
}
</script>

<template>
  <Button
    :variant="doctor.onTeam ? 'soft' : 'outline'"
    :size="iconOnly ? 'icon-sm' : 'sm'"
    :aria-pressed="doctor.onTeam"
    :aria-label="iconOnly ? `${doctor.onTeam ? 'Remove' : 'Add'} ${doctor.name}` : undefined"
    @click="toggle"
  >
    <Check v-if="doctor.onTeam" />
    <UserPlus v-else />
    <template v-if="!iconOnly">{{ doctor.onTeam ? 'On team' : 'Assign' }}</template>
  </Button>
</template>
