import { getApiData } from '$lib/services/getData'
import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
import { merge } from 'lodash-es'

let $defs: any
let $endSchema: any
let $baseURL
const $boolYesOrNot: string[] = []

export const getJsonSchema = async (jsonSchema: any, schemadefault: any, credentials: any) => {
	$baseURL = credentials?.baseUrl

	jsonSchema = merge({}, jsonSchema, schemadefault || {})
	jsonSchema['noHeader'] = true

	if (schemadefault?.$withoutDefs && jsonSchema?.$defs) {
		$defs = jsonSchema.$defs
		delete jsonSchema.$defs
	}

	Object.keys(jsonSchema.properties).map((property) => {
		if (jsonSchema.properties[property]?.enum_type?.type) {
			if (jsonSchema.properties[property]['ui:bool']) {
				$boolYesOrNot.push(property)
			}

			delete jsonSchema.properties[property]?.enum_type?.type
		}

		if (jsonSchema.properties[property]?.type === 'array') {
			jsonSchema.properties[property].type = 'select'
		}

		if (
			jsonSchema.properties[property]?.$ref?.api &&
			['object', 'select', 'dropdown'].includes(jsonSchema.properties[property]?.type) &&
			jsonSchema.properties[property]?.['ui:widget'] !== 'adv-search'
		) {
			jsonSchema.properties[property].type =
				jsonSchema.properties[property].type === 'dropdown' ? 'dropdown' : 'select'

			if (jsonSchema.properties[property]?.endpoint)
				jsonSchema.properties[property].$ref.api = jsonSchema.properties[property].endpoint

			jsonSchema.properties[property].$ref['_fetch'] = {
				baseUrl: `${credentials?.baseUrl}/${
					schemadefault?.properties &&
					schemadefault?.properties[property] &&
					schemadefault?.properties[property]?.$ref?.url
						? schemadefault?.properties[property]?.$ref?.url &&
						  schemadefault?.properties[property]?.$ref?.url === ' '
							? ''
							: schemadefault?.properties[property]?.$ref?.url
						: 'api/v1/'
				}`,
				headers: !credentials?.apikey
					? { authorization: `Bearer ${credentials?.token}` }
					: { 'x-api-key': credentials?.token }
			}

			delete jsonSchema.properties[property]?.$ref?.$ref
		}

		if (
			jsonSchema.properties[property]?.type === 'search' ||
			jsonSchema.properties[property]?.['ui:widget'] === 'adv-search'
		) {
			jsonSchema.properties[property].type = 'search'

			jsonSchema.properties[property]['_fetch'] = {
				url: `${credentials?.baseUrl}/${
					schemadefault?.properties &&
					schemadefault?.properties[property] &&
					schemadefault?.properties[property]?._fetch?.url
						? schemadefault?.properties[property]?._fetch?.url
						: `api/v1/${jsonSchema.properties[property]?.$ref?.api}`
				}`,
				headers: !credentials?.apikey
					? { authorization: `Bearer ${credentials?.token}` }
					: { 'x-api-key': credentials?.token },
				id: jsonSchema.properties[property]?.$ref?.id,
				label: jsonSchema.properties[property]?.$ref?.value
			}

			if ($defs && $defs[property] && jsonSchema.properties[property]['ui:widget:filterby']) {
				const _schema: Record<string, any> = {
					type: 'object',
					title: '',
					noHeader: true,
					properties: {},
					description: ''
				}
				jsonSchema.properties[property]['ui:widget:filterby'].map((item: any) => {
					if ($defs[property]?.properties[item]) {
						_schema.properties[item] = $defs[property].properties[item]
					}
				})

				jsonSchema.properties[property]['_schema'] = _schema
			}

			// jsonSchema.properties[property]['_result'] = {}
			delete jsonSchema.properties[property]?.$ref
		}

		if (jsonSchema.properties[property]?.enum_type) {
			jsonSchema.properties[property].items = jsonSchema.properties[property]?.enum_type
			delete jsonSchema.properties[property]?.enum_type
		}

		if (
			jsonSchema.properties[property]?.type === 'text' ||
			jsonSchema.properties[property]?.['ui:widget'] === 'textarea'
		) {
			jsonSchema.properties[property].type = 'string'
			jsonSchema.properties[property]['format'] = 'textarea'
		}

		// if (jsonSchema.properties[property]?.type === 'datetime') {
		// 	jsonSchema.properties[property].attrs.visible = false
		// }

		if (
			jsonSchema.properties[property]?.['ui:widget'] === 'ImageUploader' ||
			jsonSchema.properties[property]?.['ui:widget'] === 'dropzone'
		) {
			// TODO: improve
			jsonSchema.properties[property].type = 'upload'

			delete jsonSchema.properties[property].attrs.placeholder

			jsonSchema.properties[property].attrs['fetching'] = {
				url: `${credentials?.baseUrl}/services/files/static/images/badges/`,
				method: 'PUT',
				payload: 'file_name',
				headers: !credentials?.apikey
					? { authorization: `Bearer ${credentials?.token}` }
					: { 'x-api-key': credentials?.token }
			}

			if (jsonSchema.properties[property]?.['ui:help'])
				jsonSchema.properties[property].attrs.help = jsonSchema.properties[property]?.['ui:help']
		}

		if (jsonSchema.properties[property]?.['ui:widget'] === 'rating') {
			jsonSchema.properties[property].type = 'rating'
		}

		if (jsonSchema.properties[property]?.['ui:widget'] === 'scale') {
			jsonSchema.properties[property].type = 'scale'
		}
	})

	// console.log(JSON.stringify(jsonSchema))
	return jsonSchema
}


export const handleSubmitForm = async (handleValidateForm: any, method: string, schema: any, extra: any) => {
	const payload = handleValidateForm()

	// console.log(payload)
	if (!Array.isArray(payload)) {
		let filteredPayload = { ...extra?.defaults, ...payload }

		extra?._ignore?.forEach((item: any) => {
			if (item.includes('.')) {
				const recursive = item.split('.')

				filteredPayload[recursive[0]] &&
					filteredPayload[recursive[0]].forEach((recurs: any) => {
						if (recurs?.data) recurs.data = recurs.data.split('base64,')[1]

						delete recurs[recursive[1]]
					})
			}

			delete filteredPayload[item]
		})

		if ($boolYesOrNot.length > 0) {
			filteredPayload = utilFunctionsMap['handleFunctionBooleanYesOrNot']({
				data: filteredPayload,
				params: schema,
				extra: {
					extra
				}
			})
		}

		return await handleSubmit(filteredPayload, method, schema, extra)
	} else {
		sendErrorNotification('Please review your form responses and complete the required fields.')
	}
}

 async  function handleSubmit(payload: any, method: string, schema: any, extra: any) {
	let url = `${extra?.endpoint}`
	let message = 'Successfully created'

	if (method === 'POST') {
		url = `${url}${extra.primaryKey}`
		message = 'Successfully updated'
	}

	try {
		const dataModel = await getApiData(url, method, payload, {}, extra.options)

		if (dataModel) {
			sendSuccessNotification(dataModel?.message || message)

			return { response: dataModel || message }
		} else {
			console.log('Error here', dataModel)
			return false
		}
	} catch (error: any) {
		console.log(error)
		sendErrorNotification('An error occurred, please try again.')
		return false
	}
}

export const utilFunctionsMap: { [key: string]: (params: any) => any } = {
	handleFunctionBooleanYesOrNot: handleFunctionBooleanYesOrNot
}


function handleFunctionBooleanYesOrNot(params: any) {
	const formData = params.data

	Object.keys(formData).forEach((item) => {
		if ($boolYesOrNot.includes(item)) {
			const $enum = $endSchema.properties[item]?.items?.enum?.find(
				(itemEnum:any) => itemEnum.value === formData[item]
			)

			if ($enum) {
				formData[item] = $enum
			}
		}
	})

	return formData
}
