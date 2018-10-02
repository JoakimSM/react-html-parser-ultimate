import htmlparser2 from 'htmlparser2';
import processNodes from './processNodes';

/**
 * Parses a HTML string and returns a list of React components generated from it
 *
 * @param {String} html The HTML to convert into React component
 * @param {Object} options Options to pass. onTransform has the following signature: (node, index, convertNodeToElement). convertNodeToElement takes three arguments: node, index and a new transform function
 * @returns {Array} List of top level React elements
 */
export default function parseHtml(html, {
    decodeEntities = true,
    onTransform,
    preprocessNodes = nodes => nodes,
    allowScript = false,
} = {}) {
    const nodes = preprocessNodes(htmlparser2.parseDOM(html, { decodeEntities }));
    return processNodes(nodes, onTransform, allowScript);
}
