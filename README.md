[![Build Status](https://travis-ci.com/JoakimSM/react-html-parser-ultimate.svg?branch=master)](https://travis-ci.com/JoakimSM/react-html-parser-ultimate)

# react-html-parser-ultimate
A utility for converting HTML strings into React components

### Installation

`npm i react-html-parser-ultimate`

or 

`yarn add react-html-parser-ultimate`

### Usage

import { parseHtml } from 'react-html-parser-ultimate';

parseHtml(html, {
    onTransform: (node, index, nodeToElementFn) => {
        if (node.name === 'div') {
            node.name = 'span';
            return nodeToElementFn(node, index);
        }
        return undefined;
    },
    allowScript: true,
});
