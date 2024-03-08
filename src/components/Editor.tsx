/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable require-jsdoc */
import React, { Component } from 'react';
//import { EditorState as BaseEditorState, convertFromRaw, DraftModel, CompositeDecorator } from 'draft-js';
import { EditorState as BaseEditorState, convertFromRaw, DraftModel, CompositeDecorator, SelectionState, Modifier, convertToRaw } from 'draft-js';
import { Editor as BaseEditor, EditorProps as BaseEditorProps } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { findLinkEntities, Link } from '../components/decorators/Link';
// import { createLinkDecorator } from '../components/decorators/Link';

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
        // const decorator = createLinkDecorator();
        const decorator = new CompositeDecorator([
            {
                strategy: findLinkEntities,
                component: Link,
            },
        ]);

        try {
            this.state = {
                editorState: props.value
                    ? BaseEditorState.createWithContent(convertFromRaw(props.value), decorator)
                    : BaseEditorState.createEmpty(decorator),
            };
        } catch (error) {
            this.state = {
                editorState: BaseEditorState.createEmpty(decorator),
            };
        }
    }

    onEditorStateChange = (editorState: BaseEditorState) => {
        let contentState = editorState.getCurrentContent();
        let newContentState = contentState;
        const blocks = contentState.getBlockMap();
        
        blocks.forEach((block: any) => {
            const plainText = block.getText();
            const linkRegex = /(http:\/\/|https:\/\/)\S+/g;
            let matchArr;
            while ((matchArr = linkRegex.exec(plainText)) !== null) {
                const start = matchArr.index;
                const end = start + matchArr[0].length;
        
                const selection = new SelectionState({
                    anchorKey: block.getKey(),
                    anchorOffset: start,
                    focusKey: block.getKey(),
                    focusOffset: end,
                });
        
                newContentState = newContentState.createEntity('LINK', 'MUTABLE', { url: matchArr });
                const entityKey = newContentState.getLastCreatedEntityKey();
                newContentState = Modifier.applyEntity(newContentState, selection, entityKey);
            }
        });
        
        const newEditorState = BaseEditorState.push(editorState, newContentState, 'apply-entity');
        
        const updatedEditorState = BaseEditorState.set(editorState, {
            currentContent: newEditorState.getCurrentContent(),
        });
    
        this.setState({ editorState: updatedEditorState });
        this.props.onContentChange(updatedEditorState);
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
