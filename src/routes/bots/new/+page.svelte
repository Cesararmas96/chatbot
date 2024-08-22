<script lang="ts">
	import { onMount } from 'svelte'
	import { Form } from '@mixoo/form'
	import { storeFormNewBots } from '$lib/stores/formnewbot.js'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { getJsonSchema, handleSubmitForm } from '$lib/helpers/formbuilder'
	import { storeUser } from '$lib/stores/session.js'

	export let data
	const baseUrl = import.meta.env.VITE_API_URL
	const token =
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjQ2MDY4NTQuMDc0NDQyLCJpYXQiOjE3MjQyNDY4NTQsImlzcyI6Ik1vYmlsZWluc2lnaHQiLCJ1c2VyIjozNjA4NSwidXNlcm5hbWUiOiJjYXJtYXNAdHJvY2dsb2JhbC5jb20iLCJ1c2VyX2lkIjozNjA4NSwiaWQiOiJjYXJtYXNAdHJvY2dsb2JhbC5jb20iLCJzZXNzaW9uX2lkIjoiZGY1NjgxODYxMjY2NDExZTk3NjZmNzViMGRiOTM5N2IifQ.okyRNlkWZUvzJJopeTs6g0MjgSUOFeAObAh4lNr6Olk'
	const apikey = $storeUser?.apikey
	$storeFormNewBots = data.FormNewBot
	let schema: any = null
	let jsonSchema = $storeFormNewBots

	let schemadefault = {
		properties: {
			config_file: {
				default:
					'/home/jesuslara/proyectos/navigator/navigator-ai/etc/config/chatbots/attbot/config.toml'
			},
			custom_class: { default: 'HRAgent' },
			company_information: {
				type: 'dict',
				default: {
					company: 'T-ROC Global',
					contact_form: 'https://bose.trocdigital.io/bose/bose_ticketing_system',
					contact_email: 'communications@trocglobal.com',
					company_website: 'https://www.trocglobal.com'
				}
			},
			avatar: { default: null },
			enabled: { default: true },
			attributes: { default: {} },
			timezone: { default: 'UTC' },
			rationale: { 'ui:widget': 'textarea' },
			backstory: { 'ui:widget': 'textarea' },
			template_prompt: { default: null },
			pre_instructions: { default: [] },
			llm: { default: 'VertexLLM' },
			llm_config: {
				type: 'dict',
				default: {
					top_k: 20,
					top_p: 0.6,
					chunk_size: 768,
					max_tokens: 2048,
					model_name: 'gemini-1.5-flash-preview-0514',
					use_garden: false,
					temperature: 0.1
				}
			},

			database: {
				type: 'dict',
				default: {
					database: 'ATT',
					dimension: 768,
					index_type: 'SCANN',
					metric_type: 'IP',
					collection_name: 'promotions',
					vector_database: 'MilvusStore'
				}
			},
			bot_type: { attrs: { visible: false } },
			updated_at: { attrs: { visible: false } },
			created_at: { attrs: { visible: false } }
			// created_by: { attrs: { visible: false } },
		},

		required: ['name', 'enabled', 'goal', 'backstory', 'rationale'],

		$withoutDefs: true
	}

	onMount(async () => {
		console.log(token)
		if (jsonSchema) {
			schema = await getJsonSchema(jsonSchema, schemadefault, { baseUrl, token, apikey })
			// console.log(JSON.stringify(schema))
		}
	})

	async function handleSubmitFormLocal(
		handleValidateForm: any,
		handleResetForm: any,
		handleSetFormErrors: any
	) {
		const endpoint = `${import.meta.env.VITE_API_AI_URL}/api/v1/bots`

		const response = await handleSubmitForm(handleValidateForm, 'PUT', schema, {
			endpoint,
			handleSetFormErrors
		})

		if (response) {
			console.log('response', response)
			handleResetForm()
		}
	}
</script>

<div class="mx-5 mb-5">
	<h2 class="font-semibold text-2xl">Create Bot</h2>
	<div class="">
		{#if schema}
			<Form {schema}>
				<div
					class=""
					slot="buttons-footer"
					let:handleValidateForm
					let:handleResetForm
					let:handleSetFormErrors
				>
					<div class="flex items-end justify-end">
						<a
							href="/bots"
							class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
							>Cancel</a
						>

						<button
							class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
							on:click={() =>
								handleSubmitFormLocal(handleValidateForm, handleResetForm, handleSetFormErrors)}
						>
							Create
						</button>
					</div>
				</div>
			</Form>
		{/if}
	</div>
</div>
