<script lang="ts">
    import { redirect } from '@sveltejs/kit'
    import type { Actions, PageServerLoad } from './$types'
    
    export const load: PageServerLoad = async ({ cookies }) => {
        cookies.delete('_session1', { path: "/" })
        cookies.delete('_session2', { path: "/" })
        cookies.delete('_session3', { path: "/" })
    
    
        throw redirect(302, '/auth')
    }
    
    export const actions: Actions = {
        default({ cookies }) {
            cookies.delete('_session1', { path: "/" })
            cookies.delete('_session2', { path: "/" })
            cookies.delete('_session3', { path: "/" })
        
    
            throw redirect(302, '/auth')
        }
    }
    
      </script>
      
      <p>Logging out.</p>
      