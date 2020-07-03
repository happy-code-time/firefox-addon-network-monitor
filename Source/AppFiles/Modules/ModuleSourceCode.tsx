import React, { Component } from 'react';

import customKey from '../Functions/customKey';
import getDerivedStateFromPropsCheck from '../Functions/getDerivedStateFromPropsCheck';

class ModuleSourceCode extends Component {

    public props: {
        [key: string]: any;
    };

    public state: {
        [key: string]: any;
    };

    public inputNode: any;

    public displayLoading: boolean;

    public isFocus: boolean;

    constructor(props) {
        super(props);
        this.generateCode = this.generateCode.bind(this);
        this.focusIn = this.focusIn.bind(this);
        this.focusOut = this.focusOut.bind(this);

        this.state = {
            /**
             * User
             */
            code: (props.code && typeof '8' == typeof props.code) ? props.code : undefined,
            originalCode: (props.code && typeof '8' == typeof props.code) ? props.code : undefined,
            displayLines: typeof true == typeof props.displayLines ? props.displayLines : false,
            displayInput: typeof true == typeof props.displayInput ? props.displayInput : false,
            inputPlaceholder: (props.inputPlaceholder && typeof '8' == typeof props.inputPlaceholder) ? props.inputPlaceholder : undefined,
            displayLoading: false,
            noData: props.noData ? props.noData : '',
            codeCallback: props.codeCallback && 'function' == typeof props.codeCallback ? props.codeCallback : undefined,
            /**
             * App
             */
            searchValue: '',
            plainValue: '',
            lines: [],
            possibleAvailableTags: [
                'a',
                'abbr',
                'address',
                'area',
                'article',
                'aside',
                'audio',
                'b',
                'base',
                'bdi',
                'bdo',
                'blockquote',
                'body',
                'button',
                'canvas',
                'caption',
                'cite',
                'code',
                'col',
                'colgroup',
                'data',
                'datalist',
                'dd',
                'del',
                'details',
                'dfn',
                'dialog',
                'div',
                'dl',
                'dom-module',
                'dom-repeat',
                'dt',
                'em',
                'embed',
                'fieldset',
                'figure',
                'footer',
                'form',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'head',
                'hgroup',
                'hidden',
                'html',
                'i',
                'iframe',
                'img',
                'input',
                'ins',
                'kbd',
                'label',
                'legend',
                'li',
                'link',
                'main',
                'map',
                'mark',
                'menu',
                'menuitem',
                'meta',
                'nav',
                'noscript',
                'object',
                'ol',
                'optgroup',
                'option',
                'p',
                'pre',
                'progress',
                's',
                'script',
                'section',
                'select',
                'small',
                'source',
                'span',
                'strong',
                'style',
                'sub',
                'summary',
                'sup',
                'svg',
                'table',
                'tbody',
                'td',
                'template',
                'textarea',
                'tfoot',
                'th',
                'time',
                'title',
                'tr',
                'track',
                'u',
                'ul',
                'var',
                'video'
            ],
            attributes: [
                'href',
                'icon',
                'rel',
                'type'
            ],
            textMatcher: [
                {
                    text: ['setting'],
                    color: 'red'
                }
            ]
        };

        this.displayLoading = (typeof true == typeof props.displayLoading) ? props.displayLoading : false;
        this.isFocus = false;
    }

    /**
     * Force re-rendering of this component based
     * on keysChangeListners keys
     * @param {object} props 
     * @param {object} state 
     */
    static getDerivedStateFromProps(props, state) {
        if (getDerivedStateFromPropsCheck(['code', 'displayLines', 'displayInput', 'inputPlaceholder', 'noData', 'codeCallback'], props, state)) {
            return {
                code: (props.code && typeof '8' == typeof props.code) ? props.code : undefined,
                originalCode: (props.code && typeof '8' == typeof props.code) ? props.code : undefined,
                displayLines: typeof true == typeof props.displayLines ? props.displayLines : false,
                displayInput: typeof true == typeof props.displayInput ? props.displayInput : false,
                inputPlaceholder: (props.inputPlaceholder && typeof '8' == typeof props.inputPlaceholder) ? props.inputPlaceholder : undefined,
                displayLoading: false,
                noData: props.noData ? props.noData : '',
                codeCallback: props.codeCallback && 'function' == typeof props.codeCallback ? props.codeCallback : undefined,
            };
        }

        return null;
    }


    componentDidMount() {
        this.setState({
            displayLoading: this.displayLoading
        }, this.generateCode);
    }

    codeCallback(code) {
        const { codeCallback } = this.state;

        if (codeCallback) {
            (codeCallback)(code);
        }
    }

    focusIn() {
        this.isFocus = true;
    }

    focusOut() {
        this.isFocus = false;
    }

    componentDidUpdate() {
        if (this.isFocus && this.inputNode) {
            this.inputNode.focus();
        }
    }

    /**
     * Set value on change input field
     */
    setValue(e) {
        const { originalCode } = this.state;
        let value = e.target.value;
        let code: any = [];

        this.setState({
            searchValue: value,
            displayLoading: this.displayLoading
        }, () => {

            if ('' == value) {
                code = originalCode
            }

            else {
                const lines = originalCode.split('\n');
                value = value.trim();
                
                for (let x = 0; x <= lines.length - 1; x++) {
                    if (-1 !== lines[x].indexOf(value)) {
                        code.push(lines[x]);
                    }
                }

                code = code.join('\n');
            }

            /**
             * User callback
             */
            this.codeCallback(code);

            this.setState({
                code
            }, this.generateCode);
        });
    }

    generateCode() {
        const { code, noData } = this.state;
        const lines = [];

        if (!code || 0 == code.length) {
            return this.setState({
                lines: [
                    noData
                ],
                displayLoading: false
            });
        }

        const codeViaLine = code.split('\n');

        codeViaLine.map((codeLine, indexRoot) => {

            lines.push(
                [
                    <li key={customKey()}>
                        {'\n'}
                    </li>
                ]
            );

            const data = this.generateCodeForSingleLine(codeLine, indexRoot);

            if (data) {
                lines.push(data);
            }
        });

        this.setState({
            displayLoading: false,
            lines
        });
    }

    generateCodeForSingleLine(string, indexRoot) {
        let { possibleAvailableTags, displayLines, textMatcher } = this.state;

        possibleAvailableTags = possibleAvailableTags.sort();
        possibleAvailableTags = possibleAvailableTags.reverse();

        if (!string || !string.length) {
            return null;
        }

        const wordsList = string.split(' ');
        const codes = [];

        const getSingleTagFromText = (singleTag, tagName, singleWord) => {
            singleWord = singleWord.split('');
            let word = '';

            for (let mrx = 0; mrx <= singleWord.length - 1; mrx++) {
                word += singleWord[mrx];

                if (word === singleTag) {

                    codes.push(
                        {
                            type: 'tag',
                            match: tagName,
                            code: `${singleTag}`,
                            color: 'tag_color'
                        }
                    );

                    singleWord = singleWord.join('');
                    singleWord = singleWord.substring(singleTag.length, singleWord.length);
                    singleWord = singleWord.split('');

                    if (!singleWord.length) {
                        return '';
                    }
                }
            }

            if (!singleWord.length) {
                return '';
            }

            if (singleWord.length) {
                return singleWord.join('');
            }
        }

        wordsList.map(singleWord => {
            const tempCopy = singleWord;

            if (singleWord) {
                for (let x = 0; x <= possibleAvailableTags.length - 1; x++) {

                    if (!singleWord.length) {
                        break;
                    }

                    const tagName = possibleAvailableTags[x];
                    const tag = `<${tagName}>`;
                    const tagClose = `</${tagName}>`;
                    const tagOpen = `<${tagName} `;
                    const tagEnd = `/>`;
                    const tags = [tag, tagClose, tagOpen, tagEnd];

                    for (let i = 0; i <= tags.length - 1; i++) {
                        const singleTag = tags[i];
                        singleWord = getSingleTagFromText(singleTag, tagName, singleWord);

                        if (!singleWord.length) {
                            break;
                        }
                    }
                }


                /**
                 * Check for attributes in single word
                 */
                const checkForAttributesStart = (singleWord) => {
                    const attr = `="`;
                    let singleWordItems = singleWord.split(attr);

                    /**
                     * Multiple values
                     */
                    if (1 < singleWordItems.length) {
                        singleWordItems.map((value, index) => {

                            if (0 == index) {

                                codes.push(
                                    {
                                        type: 'attributeName',
                                        code: value
                                    }
                                );
                                codes.push(
                                    {
                                        type: 'attributeEqual',
                                        code: '='
                                    }
                                );
                                codes.push(
                                    {
                                        type: 'attributeStringStart',
                                        code: '"',
                                    }
                                );
                            }
                            else {
                                /**
                                 * Single value as possible end
                                 */
                                if (-1 !== value.indexOf('">') && '">' == value.substring(value.length - 2, value.length)) {

                                    codes.push(
                                        {
                                            type: 'attributeLast',
                                            code: value.substring(0, value.length - 2),
                                            value: value.substring(0, value.length - 2)
                                        }
                                    );

                                    codes.push(
                                        {
                                            type: 'tagStringEnd',
                                            code: '"',
                                            value: '"'
                                        }
                                    );

                                    codes.push(
                                        {
                                            type: 'tagEnd',
                                            code: '>',
                                            value: '>'
                                        }
                                    );
                                }

                                /**
                                 * Single value as possible end
                                 */
                                if (-1 !== value.indexOf('"') && '"' == value.substring(value.length - 1, value.length)) {
                                    codes.push(
                                        {
                                            type: 'attributeValueEnd',
                                            code: value.substring(0, value.length - 1),
                                            value: value.substring(0, value.length - 1)
                                        }
                                    );

                                    codes.push(
                                        {
                                            type: 'tagStringEnd',
                                            code: '"',
                                            value: '"'
                                        }
                                    );
                                }

                                /**
                                 * Single value not as end
                                 */
                                if ('">' !== value.substring(value.length - 2, value.length) && '"' !== value.substring(value.length - 1, value.length)) {
                                    codes.push(
                                        {
                                            type: 'attributeValue',
                                            code: value,
                                            value
                                        }
                                    );
                                }
                            }
                        });
                    }
                    /**
                     * Single values
                     */
                    else {
                        let value = singleWordItems.join('');

                        /**
                         * Single value as possible end
                         */
                        if (-1 !== value.indexOf('">') && '">' == value.substring(value.length - 2, value.length)) {
                            codes.push(
                                {
                                    type: 'attributeLast2',
                                    code: value.substring(0, value.length - 2),
                                    value: value.substring(0, value.length - 2)
                                }
                            );

                            codes.push(
                                {
                                    type: 'tagStringEnd2',
                                    code: '"',
                                    value: '"'
                                }
                            );

                            codes.push(
                                {
                                    type: 'tagEnd2',
                                    code: '>',
                                    value: '>'
                                }
                            );
                        }

                        /**
                         * Single value as possible end
                         */
                        else if (-1 !== value.indexOf('"') && '"' == value.substring(value.length - 1, value.length)) {
                            codes.push(
                                {
                                    type: 'attributeValueEnd2',
                                    code: value.substring(0, value.length - 1),
                                    value: value.substring(0, value.length - 1)
                                }
                            );

                            codes.push(
                                {
                                    type: 'tagStringEnd2',
                                    code: '"',
                                    value: '"'
                                }
                            );
                        }

                        else {
                            /**
                             * It is possible then a tag value not in the list
                             * so not we have to split them by ="
                             */
                            if('<' == value.charAt(0)){
                                codes.push(
                                    {
                                        type: 'tag',
                                        code: value,
                                        value
                                    }
                                );
                            }
                            else{
                                codes.push(
                                    {
                                        type: 'attributeValue',
                                        code: value,
                                        value
                                    }
                                );
                            }
                        }
                    }

                    if (typeof [] == typeof singleWord) {
                        return singleWord.join('');
                    }

                    return singleWord;
                }

                if (tempCopy == singleWord) {

                    codes.push(
                        {
                            type: 'space',
                            code: ` `,
                        }
                    );

                    /**
                     * Extract attributes
                     */
                    if (singleWord) {
                        singleWord = checkForAttributesStart(singleWord);
                    }
                }
                else {
                    if (singleWord) {
                        singleWord = checkForAttributesStart(singleWord);
                    }
                }
            }
            else {
                codes.push(
                    {
                        type: 'space',
                        code: ` `,
                    }
                );
            }
        });

        const jsx = [];

        codes.map(object => {
            jsx.push(
                <span className={object.type ? object.type : ''} key={customKey()}>
                    {
                        object.code
                    }
                </span>
            );
        });

        if (displayLines) {
            return (
                <ul className="flex">
                    <li title={`Line ${indexRoot + 1}`} className="line-number">
                        {
                            indexRoot + 1
                        }
                    </li>
                    <li className="code">
                        {
                            jsx
                        }
                    </li>
                </ul>
            );
        }

        return (
            <ul>
                <li>
                    {
                        jsx
                    }
                </li>
            </ul>
        );
    }

    render() {
        const { lines, displayLoading, displayInput, inputPlaceholder, searchValue } = this.state;

        if (displayLoading) {
            return (
                <div className='loading'>
                    <div className='loading-dots'></div>
                </div>
            );
        }

        return (
            <div className="Code">
                {
                    displayInput &&
                    <div className="search">
                        <input
                            className="input"
                            type='text'
                            onChange={(e) => this.setValue(e)}
                            value={searchValue}
                            placeholder={inputPlaceholder}
                            onFocus={(e) => this.focusIn()}
                            onBlur={(e) => this.focusOut()}
                            ref={node => this.inputNode = node}
                        />
                    </div>
                }
                {
                    lines.map(array => {
                        return (
                            <span key={customKey()}>
                                {
                                    array
                                }
                            </span>
                        )
                    })
                }
            </div>
        );
    }
}
export default ModuleSourceCode;
