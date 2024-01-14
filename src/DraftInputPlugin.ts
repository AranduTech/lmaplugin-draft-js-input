import { LaravelMuiAdminPlugin } from '@arandu/laravel-mui-admin/lib/types/plugin';

import { addFilter, config } from '@arandu/laravel-mui-admin';

import EditorField from './components/EditorField';
import { ModelSchema } from '@arandu/laravel-mui-admin/lib/types/model';
import { FormState, UseFormOptions } from '@arandu/laravel-mui-admin/lib/types/form';
import { dotSetter } from '@arandu/laravel-mui-admin/lib/support/object';

const DraftInputPlugin: LaravelMuiAdminPlugin = {

    macros: () => {

        addFilter(
            'form_field_type_mapping',
            (map: object) => {
                // { autocomplete: Autocomplete }
                return {
                    ...map,
                    draft: EditorField,
                };
            }
        );

        // Find all 'draft' fields in models and add filters to them

        const modelsSchema: ModelSchema = config('boot.models');

        Object.entries(modelsSchema).forEach(([className, schema]) => {
                
            if (!schema.fields) {
                return;
            }

            Object.entries(schema.fields).forEach(([schema, fields]) => {

                if (fields.some((field) => field.type && ['draft'].includes(field.type))) {
                    addFilter(
                        `model_form_options_${className}_${schema}`,
                        (options: UseFormOptions) =>  ({
                            ...options,
                            transformPayload: (payload: FormState) => {
                                const newPayload = structuredClone(
                                    typeof options.transformPayload === 'function'
                                        ? options.transformPayload(payload)
                                        : payload
                                );

                                fields.forEach((field) => {
                                    if (field.type && ['draft'].includes(field.type)) {
                                        dotSetter(newPayload, field.name, JSON.stringify(payload[field.name]));
                                    }
                                });

                                return newPayload;
                            },
                        })
                    );
                }
            });
        });


    },

}



export default DraftInputPlugin;

