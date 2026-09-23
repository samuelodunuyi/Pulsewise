<script setup>
import { RouterLink, useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Button from '@/components/ui/Button.vue'
import FormField from '@/components/forms/FormField.vue'
import { useForm } from '@/composables/useForm'
import { toast } from '@/composables/useToast'
import { APP_NAME, APP_DOMAIN } from '@/config/brand'

const router = useRouter()

const fields = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@hospital.org', required: true, autocomplete: 'email', default: `samuel.deo@${APP_DOMAIN}` },
  { name: 'password', label: 'Password', type: 'password', required: true, autocomplete: 'current-password', default: 'demo-password' }
]
const { values, errors, validate } = useForm(fields)

// No backend: any valid-looking credentials sign you in to the demo.
function submit() {
  if (!validate()) return
  toast({ title: 'Welcome back', description: `Signed in to the ${APP_NAME} demo.`, variant: 'success' })
  router.push('/')
}
</script>

<template>
  <AuthLayout title="Sign in" description="Demo mode — credentials are pre-filled, just press sign in.">
    <form class="space-y-5" novalidate @submit.prevent="submit">
      <FormField
        v-for="field in fields"
        :key="field.name"
        v-model="values[field.name]"
        :field="field"
        :error="errors[field.name]"
        id-prefix="login"
      />
      <Button type="submit" size="lg" class="w-full">Sign in</Button>
    </form>
    <p class="mt-6 text-center text-sm text-muted-foreground">
      New to {{ APP_NAME }}?
      <RouterLink to="/signup" class="font-medium text-primary hover:underline">Create an account</RouterLink>
    </p>
  </AuthLayout>
</template>
