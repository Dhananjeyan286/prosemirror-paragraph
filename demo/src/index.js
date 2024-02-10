import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { addParagraphNode, getPlugins } from "prosemirror-paragraph"

let config = [
    "textAlignment",
    {
        name: "textDirection",
        default: "ltr" // "rtl"
    },
    {
        name: "lineHeight",
        default: "normal" // "1.0", "1.5", "2.0"
    },
];

// let config = ["textAlignment", "textDirection", "lineHeight"] // it can also be like this

let nodes = addListNodes(schema.spec.nodes, "paragraph block*", "block")

let mySchema = new Schema({
    nodes: addParagraphNode(nodes, config),
    marks: schema.spec.marks,
});

window.view = new EditorView(document.querySelector("#editor"), {
    state: EditorState.create({
        schema: mySchema,
        plugins: getPlugins({schema: mySchema, config: config}),
    }),
});