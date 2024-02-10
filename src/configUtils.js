export function getSubConfig(config, item) {
    return config.filter((subConfig) => subConfig.name === item)[0]
}

var defaultConfig = [
    {
        name: "textAlignment" // no need to get default text-alignment value from user, because on setting default value to
        // editor.editorView.dom.style property, text direction causes problems
        // Eg: let default text alignment be left which is set to editor.editorView.dom.style property, now if user sets the current para to rtl
        // the cursor movement acts accordingly for rtl, but the text is aligned to left instead of right(for rtl default text-direction is right)
        // because of text-align is set to left in editor.editorView.dom because default text-alignment got from the user is left, so
        // if user chooses rtl as text-direction then we need to decide whether to change text-align property also or retain the existing text-align property
        // and few more cases like these as well needs to be looked into, and also most of the users will have default text-alignment property based on 
        // text-direction property only(if ltr then text-align: left is used, if rtl then text-align: right is used)
        // that is why we don't get default text-align property.
    },
    {
        name: "textDirection",
        default: "ltr", // "rtl"
    },
    {
        name: "lineHeight",
        default: "normal", // "1.0", "1.5", "2.0"
    },
];
// var defaultConfig = ["textAlignment", "textDirection", "lineHeight"] // it can also be like this

export function formatConfig(config) {
    return config.map((subConfig) => {
        return typeof subConfig === "string" ? { name: subConfig } : subConfig
    })
}

export function isSubConfigPresent(config, name) {
    return config.find((subConfig) => {
        return subConfig.name === name
    })
}

export function constructAndGetConfig(config) {
    if(!config) {
        return defaultConfig
    } else {
        config = formatConfig(config)
        return config.map((subConfig) => {
            return Object.assign({}, getSubConfig(defaultConfig, subConfig.name), subConfig)
        })
    }   
}

export { defaultConfig }