<script setup>
import { RouterLink, useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Button from '@/components/ui/Button.vue'
import FormField from '@/components/forms/FormField.vue'
import { useForm, isVisible } from '@/composables/useForm'
import { toast } from '@/composables/useToast'

const router = useRouter()

const fields = [
  { name: 'firstName', label: 'First name', required: true, autocomplete: 'given-name' },
  { name: 'lastName', label: 'Last name', required: true, autocomplete: 'family-name' },
  { name: 'role', label: 'Account type', type: 'select', required: true, span: 2, default: 'Doctor', options: ['Doctor', 'Surgeon', 'Pharmacist', 'Patient'] },
  {
    name: 'license',
    label: 'Medical licence number',
    placeholder: '8 digits',
    required: true,
    span: 2,
    visible: (v) => v.role !== 'Patient'
  },
  { name: 'email', label: 'Email', type: 'email', required: true, span: 2, autocomplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', required: true, minLength: 8, span: 2, autocomplete: 'new-password', hint: 'At least 8 characters.' }
]
const { values, errors, validate } = useForm(fields)

function submit() {
  if (!validate()) return
  toast({ title: 'Account created', description: `Welcome, ${values.firstName}!`, variant: 'success' })
  router.push('/')
}
</script>

<template>
  <AuthLayout title="Create an account" description="Get your team set up in under a minute.">
    <form class="grid gap-5 sm:grid-cols-2" novalidate @submit.prevent="submit">
      <template v-for="field in fields" :key="field.name">
        <FormField
          v-if="isVisible(field, values)"
          v-model="values[field.name]"
          :field="field"
          :error="errors[field.name]"
          id-prefix="signup"
        />
      </template>
      <Button type="submit" size="lg" class="w-full sm:col-span-2">Create account</Button>
    </form>
    <p class="mt-6 text-center text-sm text-muted-foreground">
      Already have an account?
      <RouterLink to="/login" class="font-medium text-primary hover:underline">Sign in</RouterLink>
    </p>
  </AuthLayout>
</template>
