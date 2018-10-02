import getConverter from './convertersForTypes';

/**
 * Converts a htmlparser2 node to a React element
 *
 * @param {Object} node The htmlparser2 node to convert
 * @param {Number} index The index of the current node
 * @param {Function} transform Transform function to apply to children of the node
 * @returns {React.Element}
 */
export default function convertNodeToElement(node, index, onProcessChildren, transform) {
    return getConverter(node.type)(node, index, onProcessChildren, transform);
}
