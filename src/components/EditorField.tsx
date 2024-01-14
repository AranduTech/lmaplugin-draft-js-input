import React from 'react';

import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import { FormFieldProps, FormValue } from '@arandu/laravel-mui-admin/lib/types/form';
import { dotAccessor } from '@arandu/laravel-mui-admin/lib/support/object';

// import Fieldset from '@mui/material/Fieldset';
import MuiFormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';

import { styled } from '@mui/material/styles';

import Editor from './Editor';
import { Palette, PaletteColor, useTheme } from '@mui/material';

import { useThemeProps } from '@mui/material/styles';

const Fieldset = styled(
    'fieldset', 
    { shouldForwardProp: (prop) => prop !== 'color' }
)(({ theme, color }) => ({
    textAlign: 'left',
    position: 'absolute',
    left: 0,
    top: -5,
    bottom: 0,
    right: 0,
    margin: 0,
    padding: `${0} ${theme.spacing(1)}`,
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.palette.grey[400],
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius,
    '&.focused': {
        borderColor: (theme.palette[color as keyof Palette] as PaletteColor).main,
        borderWidth: 2,
    },
    '& > legend': {
        float: 'unset',
        width: 'auto',
        overflow: 'hidden',
        display: 'block',
        padding: 0,
        height: 11,
        fontSize: '0.9em', // correct value was 0.75em but it was too small
        visibility: 'hidden',
        maxWidth: '100%',
        whiteSpace: 'nowrap',
    },
}));

const FormControl = styled(MuiFormControl)(({ theme }) => ({
    '& .rdw-editor-toolbar': {
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
    },
    '& .rdw-editor-main': {
        padding: theme.spacing(1),
    }
}));

const EditorField = ({ form, field }: FormFieldProps) => {

    const {
        state: [data], setProp, errors
    } = form;

    const { 
        name, label,
        color = 'primary', // variant = 'outlined',
    } = field;

    const value = dotAccessor(data, `${name}.rtf`);

    const [focused, setFocused] = React.useState(false);

    // const classes = use

    // const { 
    //     color: themeColor = (palette[color as keyof Palette] as PaletteColor).main,
    // } = useThemeProps({
    //     name: 'MuiOutlinedInput',
    //     props: { color }
    // });

    // const obj = { id: 2, name: 'foo', user: { id: 3, name: 'bar', roles: [ { } ]  } }
    // dotAccessor(obj, 'user.name') // 'bar'
    // config('foo.bar')

    return (
        <FormControl fullWidth>
            {label && (
                <InputLabel shrink>
                    {label}
                </InputLabel>
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
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            {errors.filter(({ key }) => key === name)
                .map(({ message }, index) => (
                    <FormHelperText key={index} error>{message}</FormHelperText>
                ))}
            <Fieldset 
                color={color}
                className={focused ? 'focused' : ''}
            >
                {label && (
                    <legend>
                        {label}
                    </legend>
                )}
            </Fieldset>
        </FormControl>
    );
};





export default EditorField;
