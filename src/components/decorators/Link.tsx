import { ContentBlock, ContentState } from 'draft-js';
import { config } from '@arandu/laravel-mui-admin';

export function findLinkEntities(contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) {
    contentBlock.findEntityRanges(
        (char) => {
            const entityKey = char.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}

export const Link = (props: any) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData();
    return (
        <a href={url} style={{ color: config('theme.palette.primary.main'), textDecoration: 'underline' }}>
            {props.children}
        </a>
    );
};

// import React from "react";
// import { CompositeDecorator, ContentBlock, ContentState, DraftDecorator } from "draft-js";

// interface LinkProps {
//     entityKey: string;
//     contentState: ContentState;
//     children: React.ReactNode;
// }

// const Link: React.FC<LinkProps> = ({ entityKey, contentState, children }) => {
//     const { url } = contentState.getEntity(entityKey).getData();
//     return <a href={url}>{children}</a>;
// };

// const findLinkEntities: DraftDecorator['strategy'] = (contentBlock, callback, contentState) => {
//     contentBlock.findEntityRanges(character => {
//         const entityKey = character.getEntity();

//         return (
//             entityKey !== null &&
//             contentState.getEntity(entityKey).getType() === "LINK"
//         );
//     }, callback);
// };

// export const createLinkDecorator = (): CompositeDecorator => {
//     return new CompositeDecorator([
//         {
//             strategy: findLinkEntities,
//             component: Link
//         }
//     ]);
// };
