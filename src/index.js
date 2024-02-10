import { keymap } from "prosemirror-keymap";
import { history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { Plugin } from "prosemirror-state";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { menuBar } from "prosemirror-menu"
import { buildInputRules, buildKeymap } from "prosemirror-example-setup"

import { getMenuBar, getMenuBarPlugin } from "./menu"
import { getEnterHandlingPlugin } from "./keyBindings"
import { isSubConfigPresent, getSubConfig, constructAndGetConfig } from "./configUtils"
import { addParagraphNode, getParagraphNode } from "./node"
import { getCommands } from "./commands"

function getStyleText(config) {
    var styleText = ``

    if (isSubConfigPresent(config, "lineHeight")) {
        var lineHeightConfig = getSubConfig(config, "lineHeight");
        styleText += "line-height: " + lineHeightConfig.default + ";";
    }

    return styleText
}

export function getPlugins(options) {
    options.config = constructAndGetConfig(options.config)

    let plugins = [
        buildInputRules(options.schema),
        getEnterHandlingPlugin(options.schema),
        keymap(buildKeymap(options.schema, options.mapKeys)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
    ];
    if (options.menuBar !== false)
        plugins.push(
            menuBar({
                floating: options.floatingMenu !== false,
                content: options.menuContent || getMenuBar(options),
            })
        );
    if (options.history !== false) {
        plugins.push(history());
    }

    var attributes = {
        class: "ProseMirror-example-setup-style",
        style: getStyleText(options.config)
    }

    if(isSubConfigPresent(options.config, "textDirection")) {
        attributes.dir = getSubConfig(options.config, "textDirection").default
    }

    return plugins.concat(
        new Plugin({
            props: { attributes: attributes }
        })
    );
}

export { getMenuBar, getMenuBarPlugin, getEnterHandlingPlugin, constructAndGetConfig, addParagraphNode, getParagraphNode, getCommands }
