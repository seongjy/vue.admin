<script setup lang="ts">
import { useCookie } from '@compositions/useCookie'
import { useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'

const { getCookie, setCookie } = useCookie()
const router = useRouter()
const queryClient = useQueryClient()

queryClient.invalidateQueries()

if (getCookie('token')) {
  setCookie('token', getCookie('token'), { maxAge: 0 })
  setCookie('username', getCookie('username'), { maxAge: 0 })
  setCookie('serviceNo', getCookie('serviceNo'), { maxAge: 0 })
  localStorage.removeItem('sessionTime')
}

router.replace('/login')
</script>
