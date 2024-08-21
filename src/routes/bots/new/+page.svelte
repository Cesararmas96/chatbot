<script lang="ts">
	import { onMount } from 'svelte'
	import { Form } from '@mixoo/form'
	import { storeFormNewBots } from '$lib/stores/formnewbot.js'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import {
		getJsonSchema,
		handleSubmitForm,
	} from '$lib/helpers/formbuilder'
	import { storeUser } from '$lib/stores/session.js'

	export let data
	const baseUrl = import.meta.env.VITE_API_URL
	const token = $storeUser?.token
	const apikey = $storeUser?.apikey
	$storeFormNewBots = data.FormNewBot
	let schema: any = null
	let jsonSchema = $storeFormNewBots
	let schemadefault = {
		properties: {
			rationale: {"ui:widget": 'textarea'},
			backstory: {"ui:widget": 'textarea'},
			collection_name: { "type": "string", default: "codebase_flowtask"},
			llm: {type: "dict", default: {
				name: "VertexLLM",
				model: "chat",
				"config": {
					"temperature": 0.2
				}
			}},
			attributes: { attrs: { visible: false } },
			bot_type: { attrs: { visible: false } },
			classification_model: { attrs: { visible: false } },
			config_file: { attrs: { visible: false } },
			enabled: {default: true },
			description: { attrs: { visible: false } },
			embedding_name: { attrs: { visible: false } },
			// goal: { attrs: { visible: false } },
			updated_at: { attrs: { visible: false } },
			custom_class: { attrs: { visible: false } },
			avatar: { attrs: { visible: false } },
			created_at: { attrs: { visible: false } },
			language: { attrs: { visible: false } },
			summarize_model: { attrs: { visible: false } },
			tokenizer: { attrs: { visible: false } },
			created_by: { attrs: { visible: false } },
		},
		required: [
        "name",
        "enabled",
        "goal",
        "backstory",
        "rationale"
    ],
		$withoutDefs: true
	}

onMount(async () => {
	if (jsonSchema) {
		schema = await getJsonSchema(jsonSchema, schemadefault, {baseUrl, token, apikey})
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

<h1>Crear un Nuevo Bot</h1>
{#if schema}
	<Form schema={schema}>
		<div
			class="w-full"
			slot="buttons-footer"
			let:handleValidateForm
			let:handleResetForm
			let:handleSetFormErrors
		>
			<div class="flex items-end justify-end">
				<button
					on:click={() =>
						handleSubmitFormLocal(
							handleValidateForm,
							handleResetForm,
							handleSetFormErrors
						)}
				>
					boton
				</button>
			</div>
		</div>
		</Form>
{/if}
