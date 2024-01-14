/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable require-jsdoc */
import React, { Component } from 'react';
import { EditorState as BaseEditorState, convertFromRaw, DraftModel } from 'draft-js';
import { Editor as BaseEditor, EditorProps as BaseEditorProps } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

type EditorProps = BaseEditorProps & {
    onContentChange: (value: BaseEditorState) => void;
    value: DraftModel.Encoding.RawDraftContentState;
};

type EditorState = {
    editorState: BaseEditorState;
};

export default class Editor extends Component<EditorProps, EditorState> {

    constructor(props: EditorProps) {
        super(props);
        try {
            this.state = {
                editorState: BaseEditorState.createWithContent(convertFromRaw(props.value)),
            };
        } catch (error) {
            this.state = {
                editorState: BaseEditorState.createEmpty(),
            };
        }
    }

    onEditorStateChange = (editorState: BaseEditorState) => {
        this.setState({ editorState });
        this.props.onContentChange(editorState);
    };

    filterToolbarButtons = (buttons: string[]) => buttons.filter((button) => button !== 'image');

    render() {
        const { editorState } = this.state;

        const { value, onContentChange, ...props } = this.props;

        return (
            <>
                <BaseEditor
                    editorState={editorState}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        options: this.filterToolbarButtons([
                            'inline', 'list', 'textAlign', 'link', 'history',
                        ]),
                    }}
                    {...props}
                />
            </>
        );
    }
}
