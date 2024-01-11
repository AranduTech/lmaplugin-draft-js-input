 
# Draft JS Input Plugin para Laravel Mui Admin

## Instalação

```
npm i // todas as dependencias @...

npm i @arandu/lmaplugin-draft-js-input
```

 
```

app.
    .withPlugins([

    ])

```




Importação e uso:

```<Editor
    value={content}
    onContentChange={(value) => {
        setState((state) => ({
            ...state,
            content: JSON.stringify(convertToRaw(value.getCurrentContent())),
            meta: {
                ...state.meta,
                plainText: value.getCurrentContent().getPlainText(),
                html: draftToHtml(convertToRaw(value.getCurrentContent())),
            },
        }));
    }}
/>```
-
content: Conteúdo bruto do state do editor
Função onContentChange: Altera a medida que o state do editor é alterado e retorna o value.
plainText: Texto corrido
html: Texto convertido do draft para uma função html utilizando draftToHtml
