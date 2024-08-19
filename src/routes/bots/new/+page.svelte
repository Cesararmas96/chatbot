<script lang="ts">
	import { onMount } from 'svelte'
	import { storeFormNewBots } from '$lib/stores/formnewbot.js'
	import { Form } from '@mixoo/form'
	import { getApiData } from '$lib/services/getData'
	import { merge } from 'lodash-es'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'

	export let data
	$storeFormNewBots = data.FormNewBot
	let jsonSchema = null
	let formBot = $storeFormNewBots
	let schemadefault = {
		properties: {
			updated_at: { attrs: { visible: false } },
			created_at: { attrs: { visible: false } }
		}
	}
	if (formBot) {
		console.log(formBot)
		jsonSchema = merge({}, formBot, schemadefault || {})
		console.log(jsonSchema)
	}

	async function handleSubmitFormLocal(
		handleValidateForm: any,
		type: string,
		handleResetForm: any,
		handleSetFormErrors: any
	) {
		const payload = handleValidateForm()

		if (!Array.isArray(payload)) {
		} else {
			sendErrorNotification('Please review your form responses and complete the required fields.')
		}
		console.log(handleValidateForm)
		console.log(type)
		console.log(handleResetForm)
		console.log(handleSetFormErrors)
	}
</script>

<h1>Crear un Nuevo Bot</h1>
{#if jsonSchema}
	<!-- <Form schema={jsonSchema}></Form> -->

	<Form schema={jsonSchema}>
		<div
			class="w-full"
			slot="buttons-footer"
			let:handleValidateForm
			let:handleResetForm
			let:handleSetFormErrors
		>
			<div class="flex items-end justify-end">
				<button
					class="btn btn-form text-md disabled:text-gray-400 disabled:hover:cursor-not-allowed dark:text-white"
					on:click={() =>
						handleSubmitFormLocal(
							handleValidateForm,
							'formSaved',
							handleResetForm,
							handleSetFormErrors
						)}
				>
					boton
				</button>
			</div>
		</div></Form
	>
{/if}
