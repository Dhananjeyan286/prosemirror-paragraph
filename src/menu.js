import { buildMenuItems } from "prosemirror-example-setup"
import { menuBar, MenuItem, Dropdown } from "prosemirror-menu"
import { getCommands } from "./commands"
import { isSubConfigPresent, getSubConfig, constructAndGetConfig } from "./configUtils"

export function getMenuBarPlugin(options) {
    options.config = constructAndGetConfig(options.config)

    return menuBar({
        floating: options.floatingMenu !== false,
        content: options.menuContent || getMenuBar(options),
    });
}

function getTextALingmentMenu(textAlignmentConfig, setTextAlignment) {
    var leftAlignBtn = new MenuItem({
        title: "Left Align",
        label: "Left Align",
        enable() {
            return true;
        },
        run(state, dispatch) {
            setTextAlignment("left", state, dispatch)
        },
    });
    var centerAlignBtn = new MenuItem({
        title: "Center Align",
        label: "Center Align",
        enable() {
            return true;
        },
        run(state, dispatch) {
            setTextAlignment("center", state, dispatch);
        },
    });
    var rightAlignBtn = new MenuItem({
        title: "Right Align",
        label: "Right Align",
        enable() {
            return true;
        },
        run(state, dispatch) {
            setTextAlignment("right", state, dispatch);
        },
    });
    var justifyAlignBtn = new MenuItem({
        title: "Justify Align",
        label: "Justify Align",
        enable() {
            return true;
        },
        run(state, dispatch) {
            setTextAlignment("justify", state, dispatch);
        },
    });
    return new Dropdown([leftAlignBtn, rightAlignBtn, centerAlignBtn, justifyAlignBtn], { label: "Text-Align" });
}

function getTextDirectionMenu(textDirectionConfig, setTextDirection) {
    var ltrBtn = new MenuItem({
        title: "LTR",
        label: "LTR",
        enable() {
            return true;
        },
        run(state, dispatch) {
            setTextDirection("ltr", state, dispatch);
        },
    });
    var rtlBtn = new MenuItem({
        title: "RTL",
        label: "RTL",
        enable() {
            return true;
        },
        run(state, dispatch) {
            setTextDirection("rtl", state, dispatch);
        },
    });
    return new Dropdown([ltrBtn, rtlBtn], { label: "Text-Direction" })
}

function getLineHeightMenu(lineHeightConfig, setLineHeight) {
    var singleBtn = new MenuItem({
        title: "1.0 (Single)",
        label: "1.0 (Single)",
        enable() {
            return true;
        },
        run(state, dispatch) {
            setLineHeight("1.0", state, dispatch);
        },
    });
    var normalBtn = new MenuItem({
        title: "~1.2 (Normal)",
        label: "~1.2 (Normal)",
        enable() {
            return true;
        },
        run(state, dispatch) {
            setLineHeight("normal", state, dispatch);
        },
    });
    var singleAndHalfBtn = new MenuItem({
        title: "1.5",
        label: "1.5",
        enable() {
            return true;
        },
        run(state, dispatch) {
            setLineHeight("1.5", state, dispatch);
        },
    });
    var doubleBtn = new MenuItem({
        title: "2.0 (Double)",
        label: "2.0 (Double)",
        enable() {
            return true;
        },
        run(state, dispatch) {
            setLineHeight("2.0", state, dispatch);
        },
    });
    return new Dropdown([singleBtn, normalBtn, singleAndHalfBtn, doubleBtn], { label: "Line-height" });
}

export function getMenuBar(options) {
    options.config = constructAndGetConfig(options.config)
    var exampleSetupMenubar = buildMenuItems(options.schema).fullMenu;
    var { setTextAlignment, setTextDirection, setLineHeight } = getCommands(options.config)
    var paraAttrsMenu = []


    if(isSubConfigPresent(options.config, "textAlignment")) {
        var textAlignmentConfig = getSubConfig(options.config, "textAlignment")
        var textAlignmentMenu = getTextALingmentMenu(textAlignmentConfig, setTextAlignment)
        paraAttrsMenu.push(textAlignmentMenu)
    }

    if(isSubConfigPresent(options.config, "textDirection")) {
        var textDirectionConfig = getSubConfig(options.config, "textDirection")
        var textDirectionMenu = getTextDirectionMenu(textDirectionConfig, setTextDirection)
        paraAttrsMenu.push(textDirectionMenu)
    }

    if(isSubConfigPresent(options.config, "lineHeight")) {
        var lineHeightConfig = getSubConfig(options.config, "lineHeight")
        var lineHeightMenu = getLineHeightMenu(lineHeightConfig, setLineHeight)
        paraAttrsMenu.push(lineHeightMenu)
    }

    return exampleSetupMenubar.concat([paraAttrsMenu])
}