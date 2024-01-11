import { LaravelMuiAdminPlugin } from '@arandu/laravel-mui-admin/lib/types/plugin';

import { addFilter } from '@arandu/laravel-mui-admin';

import EditorField from './components/EditorField';

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


    },

}



export default DraftInputPlugin;

