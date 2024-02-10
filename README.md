# Prosemirror-paragraph

This package defines a prosemirror paragraph node which is used to implement features such as **text-alignment, text-direction and line-height.**

## Live Demo

[https://dhananjeyan286.github.io/prosemirror-paragraph/demo/src/index.html](https://dhananjeyan286.github.io/prosemirror-paragraph/demo/src/index.html)

## Installation
```
npm i prosemirror-paragraph
```

## Usage

```js

import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { addParagraphNode, getPlugins } from "prosemirror-paragraph"

let config = ["textAlignment", "textDirection", "lineHeight"] // it can also be like this

// config can also be passed like these
// let config = [
//    "textAlignment", // default value for alignment will be based on default text-direction value
//    {
//        name: "textDirection",
//        default: "ltr" // initially text-direction will be be set to "ltr", default value can also be "rtl"
//    },
//    {
//        name: "lineHeight",
//        default: "normal" // initially line-height will be set to "normal" which is ~1.2, default values can also be anyone of these "1.0", "1.5", "2.0"
//    },
// ];

let nodes = addListNodes(schema.spec.nodes, "paragraph block*", "block")

let mySchema = new Schema({
    nodes: addParagraphNode(nodes, config), // to add the paragraph node along with your basic set of nodes
    marks: schema.spec.marks,
});

window.view = new EditorView(document.querySelector("#editor"), {
    state: EditorState.create({
        schema: mySchema,
        plugins: getPlugins({schema: mySchema, config: config}), // add prosemirror-paragraph related plugin along with the plugins added by prosemirror-example-setup package
    }),
});
```

## APIs Exposed

```js

import { getParagraphNode, addParagraphNode, getCommands, getEnterHandlingPlugin, getMenuBar, getMenuBarPlugin, , constructAndGetConfig  } from "prosemirror-paragraph"

getParagraphNode(config) // returns the paragraph node definition

addParagraphNode(nodes, config) // returns the nodes object after adding the paragraph node

getCommands(config) // returns an object consisting of keys named setLineHeight, setTextDirection and setTextAlignment
// all these keys consists of commands used to change the line-height, text-direction, text-alignment values in the editor

getEnterHandlingPlugin(schema) // returns a plugin to tell to the editor on what needs to be done if enter key is pressed
// it is generally used to carry forward the line-height, text-direction and text-alignment values applied to the previous paragraph
// Note : Push this plugin before pushing any shortcuts plugin so that any function that was bound to the enter key will be overriden by this plugin.

getMenuBar(config) // this returns the content for the menubar for text-alignment, line-height and text-direction, along with the content added by prosemirror-example-setup package

getMenubarPlugin(config) // this returns the plugin for the menubar for text-alignment, line-height and text-direction, along with the menubar added by prosemirror-example-setup package

constructAndGetConfig(config) // if config is a falsy value it returns the default config value, or else it formats the config that you have passed according to the needs of this package.
```

## Authors

[RM. Dhananjeyan](https://github.com/Dhananjeyan286)

## Credits

[Joe B. Lewis](https://github.com/joelewis) - For knowledge sharing

## Issues

Use Github Issues to file requests and bugs.

## License

MIT License
