import {isCallExpression, isNoSubstitutionTemplateLiteral, isStringLiteral} from "typescript";

export function buildKeysFromASTNodes(nodes): {key: string, lang: string}[] {
    const result = [];

    for (let node of nodes) {
        if (isCallExpression(node.parent)) {
            const data = {};

            const [key, _, lang] = node.parent.arguments;
            if (isStringLiteral(key) || isNoSubstitutionTemplateLiteral(key)) {
                data["key"] = key.text;
            }

            if (!data["key"]) continue;

            if (lang && (isStringLiteral(lang) || isNoSubstitutionTemplateLiteral(lang))) {
                data["lang"] = lang.text;
            }

            result.push(data);
        }
    }

    return result;
}