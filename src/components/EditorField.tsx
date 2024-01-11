import React from 'react';

import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import { FormFieldProps, FormValue } from '@arandu/laravel-mui-admin/lib/types/form';
import { dotAccessor } from '@arandu/laravel-mui-admin/lib/support/object';

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';



import Editor from './Editor';

const EditorField = ({ form, field }: FormFieldProps) => {

    const {
        state: [data], setProp, errors
    } = form;

    const { 
        name, label
    } = field;

    const value = dotAccessor(data, `${name}.rtf`);

    // const obj = { id: 2, name: 'foo', user: { id: 3, name: 'bar', roles: [ { } ]  } }
    // dotAccessor(obj, 'user.name') // 'bar'
    // config('foo.bar')

    return (
        <FormControl>
            {label && (
                <FormLabel>
                    {label}
                </FormLabel>
            )}
            <Editor
                value={value}
                onContentChange={(v) => {
                    setProp(name, {
                        rtf: convertToRaw(v.getCurrentContent()),
                        plainText: v.getCurrentContent().getPlainText(),
                        html: draftToHtml(convertToRaw(v.getCurrentContent())),
                    } as any);
                }}
            />
            {errors.filter(({ key }) => key === name)
                .map(({ message }, index) => (
                    <FormHelperText key={index} error>{message}</FormHelperText>
                ))}
        </FormControl>
    );
};





export default EditorField;
