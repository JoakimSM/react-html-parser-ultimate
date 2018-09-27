import { parseHtml } from '..';

const getChildren = data => ({ ...data, node: data.node.props.children });
const executeFn = fn => (data) => {
    fn(data);
    return data;
};
const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x);

test('basic html test', () => {
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

test('inline style test', () => {
    const html = '<div style="padding-right: 10px;"><span>test<br/></span></div>';
    const reactElements = parseHtml(html);
    const divElementHasStyle = reactElements[0].props.style;
    expect(divElementHasStyle).toHaveProperty('paddingRight');
    expect(divElementHasStyle.paddingRight).toBe('10px');
});

test('css style test', () => {
    const cssStyle = '.test { background-color: red; }';
    const html = `<style>${cssStyle}</style><div class="test"><span>test<br/></span></div>`;
    const reactElements = parseHtml(html);
    expect(reactElements[0].props.children).toBe(cssStyle);
});
