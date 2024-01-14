# Draft JS Input Plugin para Laravel Mui Admin

Plugin para o editor de texto do Laravel Mui Admin utilizando o Draft JS.

## Instalação

Instale o draft-js e algumas dependências:

```bash
npm i draft-js @draft-js-plugins/editor @draft-js-plugins/image @draft-js-plugins/static-toolbar @draft-js-plugins/text-alignment draftjs-to-html react-draft-wysiwyg
```

Instale o plugin:

```bash
npm install --save @arandu/lmaplugin-draft-js-input
```

Instale o `arandu/laravel-safe-json-cast`:

```bash
composer require arandu/laravel-safe-json-cast
```

Importe o plugin no seu projeto:

```js
import DraftInputPlugin from '@arandu/lmaplugin-draft-js-input';

export default [
  // ...
  DraftInputPlugin,
];
```

## Uso

Para utilizar o campo de texto, é necessário que a tabela possua um campo `json` para armazenar o conteúdo do editor.

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->json('content');
    $table->timestamps();
});
```

Para utilizar o campo de texto em um formulário, especifique o tipo 'draft' no campo:

```php
// ...
    [
        'name' => 'title',
        'label' => 'Título',
        'required' => true,
    ]
    [
        'type' => 'draft',
        'name' => 'content',
        'label' => 'Conteúdo',
    ],
```

Para o salvamento correto do estado do editor, é necessário que o campo `content` seja um campo json. Utilize o pacote `arandu/laravel-safe-json-cast` para isso.

```php
use Arandu\LaravelSafeJsonCast\Json;

class Post extends Model
{
    protected $casts = [
        'content' => Json::class,
    ];
}
```

Seu modelo deve estar pronto para receber o conteúdo do editor.

## Componente Editor

```js

import { Editor } from '@arandu/lmaplugin-draft-js-input';

import { convertToRaw } from 'draft-js';

<Editor
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
