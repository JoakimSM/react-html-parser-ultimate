import { parseHtml } from '..';
import React from 'react';

const getChildren = data => ({ ...data, node: data.node.props.children });
const executeFn = fn => (data) => {
    fn(data);
    return data;
};
const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x);

test('html is undefined', () => {
    const html = undefined;
    const reactElements = parseHtml(html);
    expect(reactElements.length).toBe(0);
});

test('html is undefined with allow script', () => {
    const html = undefined;
    const reactElements = parseHtml(html, { allowScript: true });
    expect(reactElements.elements.length).toBe(0);
    expect(reactElements.scripts.length).toBe(0);
});

test('html is empty string', () => {
    const html = '';
    const reactElements = parseHtml(html);
    expect(reactElements.length).toBe(0);
});

test('basic html', () => {
    const html = '<div><span>test<br/></span></div>';
    const reactElements = parseHtml(html);

    const getElementCheckList = pipe(
        executeFn(data => data.checklist.push(data.node.type)),
        getChildren,
        executeFn(data => data.checklist.push(data.node.type)),
        getChildren,
        executeFn(data => data.checklist.push(data.node[0])),
        executeFn(data => data.checklist.push(data.node[1].type)),
    );

    const listFromElements = getElementCheckList({ node: reactElements[0], checklist: [] }).checklist;
    const htmlFromElements = `<${listFromElements[0]}><${listFromElements[1]}>${listFromElements[2]}<${listFromElements[3]}/></${listFromElements[1]}></${listFromElements[0]}>`;
    expect(html).toBe(htmlFromElements);
});

test('inline style', () => {
    const html = '<div style="padding-right: 10px;"><span>test<br/></span></div>';
    const reactElements = parseHtml(html);
    const divElementHasStyle = reactElements[0].props.style;
    expect(divElementHasStyle).toHaveProperty('paddingRight');
    expect(divElementHasStyle.paddingRight).toBe('10px');
});

test('css style', () => {
    const cssStyle = '.test { background-color: red; }';
    const html = `<style>${cssStyle}</style><div class="test"><span>test<br/></span></div>`;
    const reactElements = parseHtml(html);
    expect(reactElements[0].props.children).toBe(cssStyle);
});

test('onclick button attribute', () => {
    const html = '<script>function clickerFunction() { document.getElementById("clicker").innerHtml = "CLICKED"; }</script><button id="clicker" onclick="myfunction()">click me</button>';
    const reactElements = parseHtml(html, { allowScript: true });
    expect(reactElements.elements[0].props.onclick).toBeDefined();
});

test('transform div to span', () => {
    const html = '<div><span>test<br/></span></div>';
    const reactElements = parseHtml(html, {
        onTransform: (node, index, nodeToElementFn) => {
            if (node.name === 'div') {
                node.name = 'span';
                return nodeToElementFn(node, index);
            }
            return undefined;
        },
    });
    expect(reactElements[0].type).toBe('span');
});

test('custom transform', () => {
    const html = '<div>testText<input/></div>';
    const reactElements = parseHtml(html, {
        onTransform: (node) => {
            if (node.name === 'input') {
                return React.createElement('InputElement');
            }
            return undefined;
        },
    });

    const getElementCheckList = pipe(
        executeFn((data) => { data.checklist.push(data.node.type); }),
        getChildren,
        executeFn((data) => { data.checklist.push(data.node[0]); data.checklist.push(data.node[1].type); }),
    );
    const listFromElements = getElementCheckList({ node: reactElements[0], checklist: [] }).checklist.map(element => (element === 'InputElement' ? 'input' : element));
    const htmlFromElements = `<${listFromElements[0]}>${listFromElements[1]}<${listFromElements[2]}/></${listFromElements[0]}>`;
    expect(htmlFromElements).toBe(html);
});
