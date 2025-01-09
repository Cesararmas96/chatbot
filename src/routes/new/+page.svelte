<script lang="ts">
	import { onMount } from 'svelte'
	import { Form } from '@mixoo/form'
	import { storeFormNewBots } from '$lib/stores/formnewbot.js'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { getJsonSchema, handleSubmitForm } from '$lib/helpers/formbuilder'
	import { storeUser } from '$lib/stores/session.js'

	// import('@mixoo/ui/css/theme/default.css')
	// import('@mixoo/form/css/theme/default.css')

	const baseUrl = import.meta.env.VITE_API_URL

	export let data
	const { user } = data
	let token = user.token

	const apikey = $storeUser?.apikey
	$storeFormNewBots = data.FormNewBot
	let schema: any = null
	let jsonSchema = $storeFormNewBots

	let schemadefault = {
		properties: {
			name: { default: '' },
			description: { default: '' },
			config_file: { attrs: { visible: false } },
			custom_class: { attrs: { visible: false } },
			company_information: { attrs: { visible: false } },
			avatar: { attrs: { visible: false } },
			enabled: { attrs: { visible: false } },
			timezone: { attrs: { visible: false } },
			attributes: { attrs: { visible: false } },
			role: { default: '' },
			goal: { default: '' },
			rationale: { default: '', 'ui:widget': 'textarea' },
			backstory: { default: '', 'ui:widget': 'textarea' },
			language: { attrs: { visible: false } },
			template_prompt: { attrs: { visible: false } },
			// pre_instructions: { default: [] },
			llm: { attrs: { visible: false } },
			llm_config: { attrs: { visible: false } },

			embedding_name: { attrs: { visible: false } },
			tokenizer: { attrs: { visible: false } },
			summarize_model: { attrs: { visible: false } },
			classification_model: { attrs: { visible: false } },

			database: { attrs: { visible: false } },
			updated_at: { attrs: { visible: false } },
			created_at: { attrs: { visible: false } },
			created_by: { attrs: { visible: false } }
		},

		required: ['name', 'goal', 'backstory', 'rationale'],

		$withoutDefs: true
	}

	onMount(async () => {
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
			handleSetFormErrors,
			defaults: {
				custom_class: 'HRAgent',
				config_file:
					'/home/jesuslara/proyectos/navigator/navigator-ai/etc/config/chatbots/attbot/config.toml',
				company_information: {
					company: 'T-ROC Global',
					contact_form: 'https://bose.trocdigital.io/bose/bose_ticketing_system',
					contact_email: 'communications@trocglobal.com',
					company_website: 'https://www.trocglobal.com'
				},
				avatar: '',
				enabled: true,
				timezone: 'UTC',
				attributes: {},
				language: 'en',
				template_prompt: '',
				llm: 'VertexLLM',
				llm_config: {
					top_k: 20,
					top_p: 0.6,
					chunk_size: 768,
					max_tokens: 2048,
					model_name: 'gemini-1.5-flash-preview-0514',
					use_garden: false,
					temperature: 0.1
				},

				embedding_name: 'thenlper/gte-base',
				tokenizer: 'thenlper/gte-base',
				summarize_model: 'facebook/bart-large-cnn',
				classification_model: 'facebook/bart-large-cnn',

				database: {
					database: 'ATT',
					dimension: 768,
					index_type: 'SCANN',
					metric_type: 'IP',
					collection_name: 'promotions',
					vector_database: 'MilvusStore'
				}
			},
			options: {
				headers: {
					authorization: `Bearer ${token}`
				}
			}
		})

		if (response) {
			console.log('response', response)
			handleResetForm()
		}
	}
</script>

<div>
	<h2 class="font-semibold text-2xl">Create Bot</h2>
	<div class="bg-white dark:bg-gray-700 px-4 pb-4 border mt-4 rounded-md">
		{#if schema}
			<Form {schema}>
				<div
					class=""
					slot="buttons-footer"
					let:handleValidateForm
					let:handleResetForm
					let:handleSetFormErrors
				>
					<div class="flex items-end justify-end mt-5">
						<a
							href="/bots"
							class="text-slate-700 hover:text-white border border-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-slate-500 dark:focus:ring-slate-800"
							>Cancel</a
						>

						<button
							class="text-white border bg-slate-800 hover:bg-slate-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:hover:bg-slate-800 focus:outline-none dark:focus:ring-slate-4z00"
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
