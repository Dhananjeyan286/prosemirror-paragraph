import { getSubConfig, isSubConfigPresent, constructAndGetConfig } from "./configUtils"

export function getParagraphNode(config) {
    config = constructAndGetConfig(config);

    var paragraphNode = {
        content: "inline*", // no i18n
        group: "block", // no i18n
        attrs: {
            align: { default: null },
            lineHeight: { default: null },
            dir: { default: null }
        },
        parseDOM: [
            {
                tag: "p",
                getAttrs: function(el) {
                    var align = null, lineHeight = null, dir = null;
                    if(isSubConfigPresent(config, "lineHeight")) {
                        var lineHeightConfig = getSubConfig(config, "lineHeight")
                        var defaultLineHeight = lineHeightConfig.default === "normal" ? "normal" : parseFloat(lineHeightConfig.default);
                        
                        if(el.style.lineHeight) {
                            let lineHeightVal = el.style.lineHeight

                            if(lineHeightVal === "normal") {
                                if(defaultLineHeight !== lineHeightVal) {
                                    lineHeight = lineHeightVal
                                }
                            } else {
                                lineHeightVal = parseFloat(lineHeightVal)
                                if(lineHeightVal !== parseFloat(defaultLineHeight)) {
                                    lineHeight = lineHeightVal
                                }
                            }
                        } 
                    }

                    if(isSubConfigPresent(config, "textAlignment")) {
                        var defaultAlign = getSubConfig(config, "textAlignment").default
                        if(el.style.textAlign && el.style.textAlign !== defaultAlign) {
                            align = el.style.textAlign
                        }
                    }

                    if(isSubConfigPresent(config, "textDirection")) {
                        var defaultDir = getSubConfig(config, "textDirection").default

                        // el.style.direction has more priority than el.getAttribute("dir")
                        if(el.style.direction && el.style.direction !== defaultDir) {
                            dir = el.style.direction
                        } else if(el.getAttribute("dir") && el.getAttribute("dir") !== defaultDir) {
                            dir = el.getAttribute("dir")
                        }
                    }

                    return {
                        align: align,
                        lineHeight: lineHeight,
                        dir: dir
                    };
                },
            },
        ], // no i18n
        toDOM: function (node) {
            var textAlign = node.attrs.align;
            var lineHeight = node.attrs.lineHeight;
            var dir = node.attrs.dir

            var styleText = "";

            styleText = styleText + (textAlign ? "text-align:" + textAlign + ";" : "");
            styleText = styleText + (lineHeight ? "line-height:" + lineHeight + ";" : "");

            var attrs = {};

            if (dir) {
                attrs.dir = dir;
            }

            if (styleText) {
                attrs.style = styleText;
            }

            return ["p", attrs, 0]; // no i18n
        },
    };

    return paragraphNode
}

export function addParagraphNode(nodes, config) {
    nodes.remove("paragraph") // if paragraph node is already there in the nodes map, remove it and then add it
    return nodes.addToStart("paragraph", getParagraphNode(config))
}