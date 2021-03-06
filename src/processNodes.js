import isEmptyTextNode from './utils/isEmptyTextNode';
import convertNodeToElement from './convertNodeToElement';

function processScriptNode(node, foundScripts) {
    if (node.children.length > 0) {
        foundScripts.push(
            node.children[0].data,
        );
    }
}

function processNodesScriptEnabled(nodes, transform) {
    const scripts = [];
    const processNodesInner = innerNodes => innerNodes
        .filter(node => !isEmptyTextNode(node))
        .reduce((accElements, node, index) => {
            const nodeType = node.type;
            // handle scripts separately
            if (nodeType === 'script') {
                processScriptNode(node, scripts);
                return accElements;
            }

            // return the result of the transform function if applicable
            let transformed;
            if (typeof transform === 'function') {
                transformed = transform(node, index, (alteredNode, alteredIndex, alteredTransform) => convertNodeToElement(alteredNode, alteredIndex, processNodesInner, alteredTransform || transform));
                if (transformed === null || !!transformed) {
                    accElements.push(transformed);
                    return accElements;
                }
            }

            // otherwise convert the node as standard
            accElements.push(convertNodeToElement(node, index, processNodesInner, transform));
            return accElements;
        }, []);

    const elements = processNodesInner(nodes);

    return {
        elements,
        scripts,
    };
}

function processNodesScriptDisabled(nodes, transform) {
    return nodes
        .filter(node => !isEmptyTextNode(node))
        .map((node, index) => {
            // return the result of the transform function if applicable
            let transformed;
            if (typeof transform === 'function') {
                transformed = transform(node, index, (alteredNode, alteredIndex, alteredTransform) => convertNodeToElement(alteredNode, alteredIndex, processNodesScriptDisabled, alteredTransform || transform));
                if (transformed === null || !!transformed) {
                    return transformed;
                }
            }

            // otherwise convert the node as standard
            return convertNodeToElement(node, index, processNodesScriptDisabled, transform);
        });
}

/**
 * Processes the nodes generated by htmlparser2 and convert them into React elements
 * @param {*} nodes List of nodes to process
 * @param {*} transform Transform function to optionally apply to nodes
 * @param {*} allowScript Boolean
 * @returns {React.Element[]|Object} The list of processed React elements or an object with React elements and scripts if scripts are allowed
 */
export default function processNodes(nodes, transform, allowScript) {
    return (allowScript
        ? processNodesScriptEnabled(nodes, transform)
        : processNodesScriptDisabled(nodes, transform)
    );
}
