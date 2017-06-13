// ==UserScript==
// @name         淘米辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  淘米辅助工具
// @author       bmqy
// @match        *://*.juming.com/*
// @match        *://*.ename.com/*
// @match        *://*.yijie.com/*
// @match        *://*.22.cn/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(
        '.taomiTools-a{font-family:Microsoft YaHei;font-size:12px;color:blue;font-weight:normal;}'+
        '.taomiTools-a.tianyancha{color:#009bae;}'+
        '.taomiTools-a.gujia{color:#ff5c03;}'+
        '#domainSearchBtns{color:#666;}'
    );

    window.onload = function(){
        // 识别当前网站
        var sWindowUrl = location.host;

        // 兼容聚名网
        if( sWindowUrl.indexOf('juming.com') !=-1){
            juming.addSearchSuffix();
            juming.openChazczt();
            juming.addDomainSearchInfo();
        }
        // 兼容易名中国
        if( sWindowUrl.indexOf('ename.com') !=-1){
            ename.addDomainSearchInfo();
        }
        // 兼容爱名网
        if( sWindowUrl.indexOf('22.cn') !=-1){
            aiming.addDomainSearchInfo();
        }
    };

    var $ = $ || window.$;

    /*
    “聚名网”辅助
    */
    var juming = new JuMing();
    function JuMing(){
        // 为搜索框自动补全".com"后缀
        this.addSearchSuffix = function (){
            var SearchInput = document.querySelector('#taodm');
            var Reg = /(.com|.net|.cn|.com.cn)$/;
            SearchInput.addEventListener('blur', function(){
                if(SearchInput.value !== '域名信息综合查询' && !SearchInput.value.match(Reg)){
                    SearchInput.value += '.com';
                }
            });
            SearchInput.addEventListener('keydown', function(e){
                if(e.keyCode == 13){
                    if(SearchInput.value !== '域名信息综合查询' && !SearchInput.value.match(Reg)){
                        SearchInput.value += '.com';
                    }
                }
            });
        };
        // 启用"一键检测注册状态"按钮
        this.openChazczt = function (){
            $('#shuchu').on('DOMNodeInserted', function (){
                var BtnChazczt = document.querySelector('#a_plchazc');
                BtnChazczt.setAttribute('onclick','return pl_chazczt2();');
            });
        };

        // 域名列表增加“域名辅助信息查询”按钮，可一键查询该域名企业信息、估价信息
        this.addDomainSearchInfo = function (){
            changeShuchuHtml();
            $(document).on('DOMNodeInserted', '#shuchu', function(){
                if($('#domainSearchBtns').size()===0){
                    changeShuchuHtml();
                }
            });
            function changeShuchuHtml(){
                var DoMainList = $('#shuchu .balist');
                DoMainList.find('tr').each(function(i,e){
                    var AtotalCount = DoMainList.find('tr').size()-1;
                    if(i>0 && i<AtotalCount){
                        var DoMainAObj = $(e).find('td:first-child a');
                        var DoMain = DoMainAObj.text();
                        var DoMainName = DoMain.split('.');
                        var AddDomainSearchBtnsWrap = $('<span id="domainSearchBtns"></span');
                        var AddDomainSearchBtnsHtml = '【<a class="taomiTools-a tianyancha" target="_blank" title="来！天眼查一下" href="http://www.tianyancha.com/search?key='+ DoMainName[0] +'">天眼查</a>|<a class="taomiTools-a gujia" target="_blank" title="来！估个价" href="http://www.cxz.com/s.php?site='+ DoMain +'">估价</a>】';
                        AddDomainSearchBtnsWrap.html(AddDomainSearchBtnsHtml);
                        DoMainAObj.after(AddDomainSearchBtnsWrap);
                    }
                });
            }
        };
    }

    /*
    “易名中国”辅助
    */
    var ename = new Ename();
    function Ename(){
        // 域名列表增加“域名辅助信息查询”按钮，可一键查询该域名企业信息、估价信息
        this.addDomainSearchInfo = function (){
            changeShuchuHtml();
            $(document).on('DOMNodeInserted', '.mod-table', function(){
                if($('#domainSearchBtns').size()===0){
                    changeShuchuHtml();
                }
            });
            function changeShuchuHtml(){
                var DoMainList = $('#content .bookingMain');
                DoMainList.find('tr').each(function(i,e){
                    var AtotalCount = DoMainList.find('tr').size();
                    if(i<AtotalCount){
                        var DoMainAObj = $(e).find('.domain a');
                        var DoMain = DoMainAObj.text();
                        var DoMainName = DoMain.split('.');
                        var AddDomainSearchBtnsWrap = $('<span id="domainSearchBtns"></span');
                        var AddDomainSearchBtnsHtml = '【<a class="taomiTools-a tianyancha" target="_blank" title="来！天眼查一下" href="http://www.tianyancha.com/search?key='+ DoMainName[0] +'">天眼查</a>|<a class="taomiTools-a gujia" target="_blank" title="来！估个价" href="http://www.cxz.com/s.php?site='+ DoMain +'">估价</a>】';
                        AddDomainSearchBtnsWrap.html(AddDomainSearchBtnsHtml);
                        DoMainAObj.after(AddDomainSearchBtnsWrap);
                    }
                });
            }
        };
    }

    /*
    “爱名网”辅助
    */
    var aiming = new AiMing();
    function AiMing(){
        // 域名列表增加“域名辅助信息查询”按钮，可一键查询该域名企业信息、估价信息
        this.addDomainSearchInfo = function (){
            changeShuchuHtml();
            $(document).on('DOMNodeInserted', '#list_id', function(){
                if($('#domainSearchBtns').size()===0){
                    changeShuchuHtml();
                }
            });
            function changeShuchuHtml(){
                var DoMainList = $('#list_id');
                DoMainList.find('li').each(function(i,e){
                    var AtotalCount = DoMainList.find('li').size();
                    if(i<AtotalCount){
                        var DoMainAObj = $(e).find('a.hui6-hover');
                        var DoMain = DoMainAObj.text();
                        var DoMainName = DoMain.split('.');
                        var AddDomainSearchBtnsWrap = $('<span id="domainSearchBtns"></span');
                        var AddDomainSearchBtnsHtml = '【<a class="taomiTools-a tianyancha" target="_blank" title="来！天眼查一下" href="http://www.tianyancha.com/search?key='+ DoMainName[0] +'">天眼查</a>|<a class="taomiTools-a gujia" target="_blank" title="来！估个价" href="http://www.cxz.com/s.php?site='+ DoMain +'">估价</a>】';
                        AddDomainSearchBtnsWrap.html(AddDomainSearchBtnsHtml);
                        DoMainAObj.after(AddDomainSearchBtnsWrap);
                    }
                });
            }
        };
    }
})();