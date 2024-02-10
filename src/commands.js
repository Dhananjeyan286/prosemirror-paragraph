import { constructAndGetConfig, getSubConfig, isSubConfigPresent } from "./configUtils"

var setTextAlignment = function(config) {
    var textDirectionConfig = getSubConfig(config, "textDirection")
    return function(align, state, dispatch) {
        var tr = state.tr
        var { $from, $to } = state.selection
        state.doc.nodesBetween($from.pos, $to.pos, function(node, pos) {
            if (node.type.name === 'paragraph') {
                // if default text-direction is ltr, then 2 cases arises:
                //      1. if current node's text-direction in rtl , then don't put right alignment
                //      2. if current node's text-direction is null(meaning it's text-direction is ltr), then don't put left alignment
                // if default text-direction is rtl, then 2 cases arises:
                //      1. if current node's text-direction is ltr, then don't put left alignment
                //      2. if current node's text-direction is null(meaning it's text-direction is rtl), then don't put right alignment
                // the above things are because text-direction takes care of what text-alignmwnt to follow by default, post that if user wants to change the alignment he can change
                // like if text-direction is rtl and if he wants left-alignment he can set it
                if (textDirectionConfig.default === "ltr") {
                    if (node.attrs.dir === "rtl") {
                        if (align === "right") {
                            align = null;
                        }
                    } else {
                        if (align === "left") {
                            align = null;
                        }
                    }
                } else {
                    if (node.attrs.dir === "ltr") {
                        if (align === "left") {
                            align = null;
                        }
                    } else {
                        if (align === "right") {
                            align = null;
                        }
                    }
                }
                tr.setNodeMarkup(pos, node.type, { ...node.attrs, align: align }, node.marks);
            }
        })
        dispatch(tr);
    }
}

var setLineHeight = function(config) {
    var lineHeightConfig = getSubConfig(config, "lineHeight")
    return function(lineHeight, state, dispatch) {
        var tr = state.tr
        var { $from, $to } = state.selection;
        state.doc.nodesBetween($from.pos, $to.pos, function(node, pos) {
            if (node.type.name === 'paragraph') {
                var defaultLineHeight = lineHeightConfig.default === "normal" ? "normal" : parseFloat(lineHeightConfig.default)
                if( defaultLineHeight === "normal" && lineHeight === defaultLineHeight) {
                    lineHeight = null;
                } else if( parseFloat(lineHeight) === defaultLineHeight ) {
                    lineHeight = null;
                }
                tr.setNodeMarkup(pos, node.type, {...node.attrs, lineHeight: lineHeight}, node.marks)
            }    
        })
        dispatch(tr);
    }
}

var setTextDirection = function(config) {
    var textDirectionConfig = getSubConfig(config, "textDirection")
    var isTextAlignmentPresent = isSubConfigPresent(config, "textAlignment")

    // if align feature is not present or if existing alignment is center or justify then simply change the text-direction alone
    // else change the text-direction as well as set the text-alignment to null, because text-direction will itself take care of alignment, meanign if text-direction is rtl
    // then default alignment will be right or else if text-direction is ltr then default ali0gnment will be left
    // post that if user wants to set the alignment then he can set it manually

    return function(dir, state, dispatch) {
        var tr = state.tr
        var { $from, $to } = state.selection;
        state.doc.nodesBetween($from.pos, $to.pos, function(node, pos) {
            if (node.type.name === 'paragraph') {
                if (dir === textDirectionConfig.default) {
                    dir = null;
                }
                if(isTextAlignmentPresent) {
                    if(node.attrs.align === "center" || node.attrs.align === "justify") {
                        tr.setNodeMarkup(pos, node.type, {...node.attrs, dir: dir}, node.marks)
                    } else {
                        tr.setNodeMarkup(pos, node.type, {...node.attrs, align: null, dir: dir}, node.marks)
                    }
                } else {
                    tr.setNodeMarkup(pos, node.type, {...node.attrs, dir: dir}, node.marks)
                }
            }
        })
        dispatch(tr);
    }
}

export function getCommands(config) {
    config = constructAndGetConfig(config)

    return {
        setLineHeight: setLineHeight(config),
        setTextDirection: setTextDirection(config),
        setTextAlignment: setTextAlignment(config)
    }
}