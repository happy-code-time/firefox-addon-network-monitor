import * as React from 'react';

import * as FileSaver from 'file-saver';

import { Link } from 'react-router-dom';

import copyToClipBoard from '../Functions/copyToClipboard';

import getTranslations from '../../../Translations';

import getList from '../Functions/storage/getList';

import addItemToList from '../Functions/storage/addItemToList';

import removeItemFromList from '../Functions/storage/removeItemFromList';

import getCurrentLoggedInUser from '../Functions/getCurrentLoggedInUser';

import emptyStorage from '../Functions/storage/emptyStorage';

import setItemRemote from '../Functions/storage/setItemRemote';

import LoadingAnimation from './LoadingAnimation';

import addToStore from '../../Store/addToStore';

import Pagination from './Pagination/Pagination';

import ModuleFullScreenLoadingMin from './ModuleFullScreenLoadingMin';

import NoDataList from './NoDataList';

import NoDataListSearch from './NoDataListSearch';

import ModuleLoading from './ModuleLoading';

import customKey from '../Functions/customKey';

interface ListGlobalModuleProps {
    storageName: string;
}
class ModuleListDomBlocker extends React.Component<ListGlobalModuleProps> {

    public translations: {
        [ key: string ]: any
    };

    public state: {
        [ key: string ]: any
    };

    public Redirection: {
        [ key: string ]: any;
    };

    public storageName: string;
    public listReadable: string;
    public storageKey: string;

    constructor (props) {
        super(props);
        this.changeList=this.changeList.bind(this);
        this.setInputValue=this.setInputValue.bind(this);
        this.setInputValueDomain=this.setInputValueDomain.bind(this);
        this.setInputValueTagname=this.setInputValueTagname.bind(this);
        this.closeMessages=this.closeMessages.bind(this);
        this.setNewLocalStorageData=this.setNewLocalStorageData.bind(this);
        this.deleteAll=this.deleteAll.bind(this);

        this.state={
            data: [],
            inputValue: '',
            inputValueTagname: '',
            inputValueDomain: '',
            messages: [],
            animationLoading: true,
            // export options
            jsonData: {},
            errorMessage: '',
            successMessage: '',
            /**
             * Jsx data: current list
             */
            currentItems: 20,
            itemsPerSite: 20,
        };

        this.translations=getTranslations();
        this.storageName=this.props.storageName;
        this.listReadable=this.translations[ this.storageName ];
        this.storageKey='BLACKLIST';
    }

    componentDidMount() {
        ( async () => {
            let blacklistStorage = {
                [this.storageName]: await getList(this.storageName)
            }

            try {
                blacklistStorage=blacklistStorage[ this.storageName ]? blacklistStorage[ this.storageName ]:[];

                this.setState({
                    data: blacklistStorage,
                    jsonData: blacklistStorage? JSON.stringify({ [ this.storageName ]: blacklistStorage }):'',
                    animationLoading: false
                });
    
            } catch (error) {
                this.setState({
                    animationLoading: false
                });
            }
        })();
    }

    setNewLocalStorageData(newArray) {
        let blacklistStorage=sessionStorage.getItem(this.storageKey);
        let jsonData=this.state.jsonData;

        try {
            blacklistStorage=JSON.parse(blacklistStorage);
            blacklistStorage[ this.storageName ]=newArray;

            if (undefined!==blacklistStorage[ this.storageName ]) {
                jsonData=JSON.stringify({ [ this.storageName ]: blacklistStorage[ this.storageName ] });
            }

            localStorage.setItem(this.storageKey, JSON.stringify(blacklistStorage));
            this.setState({ 
                jsonData 
            });

        } catch (error) {

        }
    }

    deleteAll() {
        this.setState({
            animationLoading: true
        }, async () => {

            if(null == getCurrentLoggedInUser()){
                addToStore(this.translations.listNotSynchronizedUserNotLoggedIn, -1);
            }
    
            const data=this.state.data;
    
            if (data&&data.length) {
                await emptyStorage(this.storageName, []);
                await setItemRemote(this.storageName, [], 'empty');
                
                this.setState({
                    errorMessage: this.translations.emptyListDone,
                    successMessage: '',
                    data: [],
                    animationLoading: false
                });
            }
            else{
                this.setState({
                    animationLoading: false
                });
            }
        });
    }

    setInputValue(e, action) {
        e.persist();

        if (13==e.keyCode||13==e.which) {
            this.changeList(e, 'add');
        }

        else if (27==e.keyCode||27==e.which) {
            this.setState({
                inputValue: ''
            });
        }

        else {
            this.setState({
                inputValue: e.target.value
            });
        }
    }

    /**
     * Set domain name
     * @param e 
     */
    setInputValueDomain(e: any){
        e.persist();

        if (13==e.keyCode||13==e.which) {
            this.changeList(e, 'add');
        }

        else if (27==e.keyCode||27==e.which) {
            this.setState({
                inputValueDomain: ''
            });
        }

        else {
            this.setState({
                inputValueDomain: e.target.value
            });
        }
    }

    /**
     * Set domain name
     * @param e 
     */
    setInputValueTagname(e: any){
        e.persist();

        if (13==e.keyCode||13==e.which) {
            this.changeList(e, 'add');
        }

        else if (27==e.keyCode||27==e.which) {
            this.setState({
                inputValueTagname: ''
            });
        }

        else {
            this.setState({
                inputValueTagname: e.target.value
            });
        }
    }

    changeList(e: any, action: string, value: string = '') {
        e.persist();

        let { inputValueTagname, inputValueDomain, inputValue } = this.state;

        if('blacklistedElementsHref' == this.storageName){
            inputValueTagname = 'a';
        }

        this.setState({
            animationLoading: true
        }, async () => {

            if(null == getCurrentLoggedInUser()){
                addToStore(this.translations.listNotSynchronizedUserNotLoggedIn, -1);
            }
    
            let successMessage: string='';
            let { data }=this.state;
            let response: { error: boolean, message: string, data: [] }={
                error: false,
                message: '',
                data: []
            };
    
            if('add' == action && '' == value){
                value = inputValue;
            }

            if ('add' == action && (!value.length || !inputValueTagname.length || !inputValueDomain.length)) {
                return this.setState({
                    errorMessage: `Error while adding value to the current list ${this.listReadable}. Values cannot be empty`,
                    successMessage: '',
                    animationLoading: false
                });
            }
    
            if ('remove'==action) {
                if (e.target&&e.target.parentNode&&e.target.parentNode.parentNode) {
                    e.target.parentNode.parentNode.classList.add('animation-back');
                }
            }
    
            if ('add'==action) {
                response= await addItemToList(this.storageName, `${inputValueDomain}::${inputValueTagname}::${value}`);
            }
            else {
                response= await removeItemFromList(this.storageName, value);
            }
    
            if (true==response.error) {
                return this.setState({
                    errorMessage: `${response.message}`,
                    successMessage: '',
                    animationLoading: false
                });
            }
    
            successMessage=`${response.message}`;
    
            if (response.data) {
                data=response.data;
            }
    
            this.setState({
                errorMessage: '',
                successMessage,
                inputValue: '',
                inputValueDomain: '',
                inputValueTagname: '',
                data,
                animationLoading: false
            }, () => {
                this.setNewLocalStorageData(data);
            });
        });
    }

    closeMessages() {
        this.setState({
            errorMessage: ''
        });
    }

    setMessageCopyToClipBoard(){
        this.setState({
            successMessage: this.translations.copiedToClipBoard,
            errorMessage: ''
        })
    }

    /**
     * Set default value, like after installation
     */
    resetToDefault(){

        if(null == getCurrentLoggedInUser()){
            addToStore(this.translations.listNotSynchronizedUserNotLoggedIn, -1);
        }

        this.setState({
            animationLoading: true
        }, () => {
            //@ts-ignore
            browser.runtime.sendMessage({
                action: 'set-list-hardcoded',
                list: this.storageName
            })
            .then( data => {
                this.setState({
                    data,
                    animationLoading: false,
                    errorMessage: '',
                    successMessage: '',
                })
            })
            .catch( error => {
                this.setState({
                    animationLoading: false,
                    errorMessage: `${error}`,
                    successMessage: '',
                })
            });
        });
    }

    getData(){
        const { data } = this.state;
        const filtered = data;
        const newStructure = [];

        filtered.map( (item: string) => {
            newStructure.push({
                name: item,
                copyToClipboardJsx: (
                    <i
                        className="fas fa-clipboard clipboard"
                        title={this.translations.action_title_copyToClipboard_single}
                        onClick={ (e) => {
                                copyToClipBoard(e, item, document.documentElement.scrollTop);
                                this.setMessageCopyToClipBoard();
                            }
                        }
                    ></i>
                ),
                removeJsx: (
                    <i
                        title={this.translations.action_title_delete_single}
                        className="fas fa-trash-alt delete"
                        onClick={ (e) => this.changeList(e, 'remove', item) }
                    >
                    </i>
                )
            });
        });

        
        return newStructure;
    }

    /**
     * 
     */
    inputOnChangeCallback(e){

    }

    liOnClickCallback(e, object){

    }

    saveToFileJson(event) {
        event.persist();

        event.target.classList.add('copied-remove');

        setTimeout(() => {
            event.target.classList.remove('copied');
            event.target.classList.remove('copied-remove');

            if (this.state.jsonData) {
                try {
                    var blob = new Blob([JSON.stringify(this.state.jsonData)], { type: "application/json;charset=utf-8" });
                    FileSaver.saveAs(blob, `Protector_SETTINGS_${customKey()}.json`);
                } catch (error) {
                    var blob = new Blob([`Error while creating Blob file. Error message: ${error}.`], { type: "application/json;charset=utf-8" });
                    FileSaver.saveAs(blob, `Protector_SETTINGS_${customKey()}.json`);
                }
            }
        }, 300);
    }
    
    render() {
        const { animationLoading, data, errorMessage, successMessage } = this.state;

        return (
            <div className="Blacklist">
                {
                    animationLoading&&
                    <LoadingAnimation/>
                }
                <h1 className="h1-title">
                    <Link className="single-link-to-list" to='security'>
                        <i className="fas fa-chevron-left"></i>
                    </Link>

                    {
                        `${this.translations[ this.storageName ]} ${ data ? `(${data.length})` : ''}`
                    }
                </h1>
                {
                    ''!== errorMessage&&
                    <div className="error-message">
                        {
                            ''!==errorMessage&&
                            <i className="fas fa-exclamation"></i>
                        }
                        {
                            ''!==errorMessage&&
                            <span>
                                {
                                    errorMessage
                                }
                            </span>
                        }
                    </div>
                }
                {
                    ''!== successMessage&&
                    <div className="successMessages-message">
                        {
                            ''!== successMessage&&
                            <i className="far fa-thumbs-up"></i>
                        }
                        {
                            ''!== successMessage&&
                            <span>
                                {
                                    successMessage
                                }
                            </span>
                        }
                    </div>
                }
                <div className="actions">
                    <Link 
                        title={this.translations.example}
                        to='security-examples'
                        className="button-action"
                    >
                        <i className="far fa-question-circle example-link"></i>
                    </Link>
                    <i 
                        onClick={(e) => { this.saveToFileJson(e) }} 
                        className="fas fa-file-signature button-action icon-iframes"
                    >
                    </i>
                    <i 
                        title={this.translations.restoreDefaultValue}
                        onClick={(e) => this.resetToDefault()}
                        className="far fa-registered button-action"
                    ></i>
                    <i 
                        title={this.translations.action_title_deleteList}
                        onClick={ (e) => { this.deleteAll() } } 
                        className="far fa-trash-alt button-action delete-all"
                    ></i>
                </div>
                <Pagination
                    /**
                     * data
                     */
                    data={this.getData()}
                    /**
                     * How many items display per page
                     */
                    itemsPerSite={20}
                    /**
                     * Display total available items
                     * passed to the module
                     */
                    displayTotal={false}
                    /**
                     * Prefix of the total elements
                     */
                    totalPrefix=''
                    /**
                     * Pages Information
                     */
                    displayPagesInfo={true}
                    paginationTextPrefix={this.translations.page}
                    paginationTextMiddle={this.translations.of}
                    /**
                     * How many sites display: 
                     * - before main page
                     * - after main page
                     */
                    paginationPagesToDisplay={3}
                    /**
                     * Display pagination pages
                     * if false then only the prev and next buttons are displayed
                     */
                    displayPaginationPages={true}
                    /**
                     * Align ul and pagination: 1, 2
                     */
                    alignPagination={1}
                    /**
                     * Align pagination items
                     * 1, 2, 3, 4, 5
                     */
                    alignPagesItems={2}
                    /**
                     * Keys to display from object
                     */
                    display={
                        [
                            'name', 'copyToClipboardJsx', 'removeJsx'
                        ]
                    }
                    env='prod'
                    /**
                     * Display loop index as first
                     * entry for each li element
                     */
                    displayCount={ true }
                    /**
                     * Each new page should start with an: 1 
                     * or increment the counter for each page
                     */
                    resetCountOnEachPage={false}
                    /**
                     * Buttons JSX
                     */
                    previousButton=''
                    nextButton=''
                    /**
                     * Search input field
                     */
                    displaySearch={true}
                    searchPlaceholder={this.translations.searchPlaceholder}
                    searchIcon=''
                    searchSensisitve={false}
                    searchOnKeys={
                        [
                            'name'
                        ]
                    }
                    /**
                     * Search value on start
                     */
                    searchValue=''
                    searchOnKeyDown={true}
                    /**
                     * Search title
                     */
                    searchTitle={this.translations.search}
                    paginationTitle={this.translations.list}
                    /**
                     * No data message
                     */
                    fallbackMounting={<ModuleLoading/>}
                    fallbackLoading={<ModuleFullScreenLoadingMin/>}
                    fallbackLoadingTime={100}
                    fallbackNoData={<NoDataList/> }
                    fallbackNoDataSearch={<NoDataListSearch/> }
                    /**
                     * callbacks
                     */
                    inputOnChangeCallback={this.inputOnChangeCallback}
                    liOnClickCallback={this.liOnClickCallback}
                />
                <h1 className="h1-list">
                    {
                        this.translations.addNewEntryTitle
                    }
                </h1>
                <div className="input-holder input-holder-dom flex">
                    <input
                        className="input"
                        type="text"
                        onKeyDownCapture={ (e) => this.setInputValueDomain(e) }
                        onChange={ (e) => this.setInputValueDomain(e) }
                        value={ this.state.inputValueDomain }
                        placeholder={this.translations.domain}
                    />  
                    <input
                        className="input"
                        type="text"
                        onKeyDownCapture={ (e) => this.setInputValueTagname(e) }
                        onChange={ (e) => this.setInputValueTagname(e) }
                        value={ 'blacklistedElementsHref' == this.storageName ? 'a' : this.state.inputValueTagname }
                        placeholder={this.translations.tag}
                    />                    
                    <input
                        className="input"
                        type="text"
                        onKeyDownCapture={ (e) => this.setInputValue(e, 'add') }
                        onChange={ (e) => this.setInputValue(e, 'add') }
                        value={ this.state.inputValue }
                        placeholder={this.translations.addPlaceholder}
                    />
                    <span
                        className="icon" 
                        onClick={ (e) => this.changeList(e, 'add', this.state.inputValue) }
                    >
                        ➕
                    </span>
                </div>
                <form style={{
                    display: 'none !important',
                    opacity: 0,
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    overflow: 'hidden'
                }}>
                    <textarea
                        id="copy-to-clipboard"
                        value=''
                        readOnly={true}
                    />
                </form>
            </div>
        );
    }
}

export default ModuleListDomBlocker;