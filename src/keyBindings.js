import { createParagraphNear, liftEmptyBlock, chainCommands, splitBlock } from "prosemirror-commands"
import { splitListItem } from "prosemirror-schema-list"
import { keymap } from "prosemirror-keymap"

function enterHandler(schema) {
    if(schema.nodes.listItem) {
        return chainCommands(splitListItem(listItem), createParagraphNear, liftEmptyBlock, splitBlockKeepAttrsAndMarks);
    } else {
        return chainCommands(createParagraphNear, liftEmptyBlock, splitBlockKeepAttrsAndMarks);
    }
}

export function splitBlockKeepAttrsAndMarks(state, dispatch) {
    return splitBlock(state, dispatch && (tr => {
        /**
         * This code is to store the attributes of "p tag alone".
         * There would be 2 fragments in the content array, the first fragment would contain all the attributes of the previous p tag from which enter key is pressed and the second fragment would contain an empty p tag.
         */

        if (tr.steps[0] && tr.steps[0].slice && tr.steps[0].slice.content && tr.steps[0].slice.content.content[0] && tr.steps[0].slice.content.content[1]) {
            
            let beforeFragment = tr.steps[0].slice.content.content[0];
            let afterFragment = tr.steps[0].slice.content.content[1];
            let beforeFragmentNodeName = beforeFragment.type && beforeFragment.type.name;
            let afterFragmentNodeName = afterFragment.type && afterFragment.type.name;

            if (beforeFragmentNodeName === afterFragmentNodeName && beforeFragmentNodeName === "paragraph") {
                tr.setNodeMarkup(tr.steps[0].from+1, null, beforeFragment.attrs) 
            }

        }
        dispatch(tr)
    }))
}

export function getEnterHandlingPlugin(schema) {
    var key = {}
    key.Enter = enterHandler(schema)
    return keymap(key)
}