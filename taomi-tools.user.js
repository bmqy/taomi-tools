// ==UserScript==
// @name         淘米辅助工具
// @namespace    http://bmqy.net/
// @version      0.3.7
// @description  为方便域名爱好者打造的辅助型工具。支持万网、聚名网、易名中国、爱名网（可能会不定期更新）。
// @author       bmqy
// @match        *://*.aliyun.com/*
// @match        *://*.juming.com/*
// @match        *://*.ename.com/*
// @match        *://*.22.cn/*
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(
        '.taomiTools-a{font-family:Microsoft YaHei;font-size:12px;color:blue;font-weight:normal;}'+
        '.taomiTools-a.tianyancha{color:#009bae !important;}'+
        '.taomiTools-a.gujia{color:#ff5c03 !important;}'+
        '.taomiTools-a.wanwang{color:#1dbbd8 !important;}'+
        '.taomiTools-a.zhanzhang{color:#069 !important;}'+
        '#domainSearchBtns{font-size:12px;color:#666;}'
    );

    window.onload = function(){
        // 识别当前网站
        var sWindowUrl = location.host;

        // 兼容万网
        if( sWindowUrl.indexOf('aliyun.com') !=-1){
            wanwang.addDomainSearchInfo();
            wanwang.addDomainSearchInfoForDetail();
        }
        // 兼容聚名网
        if( sWindowUrl.indexOf('juming.com') !=-1){
            juming.addSearchSuffix();
            juming.openChazczt();
            juming.addDomainSearchInfo();
            juming.addDomainSearchInfoForSaleDetail();
            juming.addDomainSearchInfoForJingjiaDetail();
        }
        // 兼容易名中国
        if( sWindowUrl.indexOf('ename.com') !=-1){
            ename.addDomainSearchInfo();
            ename.addDomainSearchInfoForDetail();
        }
        // 兼容爱名网
        if( sWindowUrl.indexOf('22.cn') !=-1){
            aiming.addDomainSearchInfo();
            aiming.addDomainSearchInfoForDetail();
        }
    };

    var $ = $ || window.$;

    // 获取“域名辅助信息查询”按钮
    function getDomainSearchInfoBtns(domain){
        var _sDomain = domain.trim();
        var _sDomainName = _sDomain.split('.')[0];
        var AddDomainSearchBtnsWrap = $('<span id="domainSearchBtns"></span');
        var AddDomainSearchBtnsHtml = '【';
        AddDomainSearchBtnsHtml += '<a class="taomiTools-a tianyancha" target="_blank" title="来！天眼查一下" href="http://www.tianyancha.com/search?key='+ _sDomainName +'">眼</a>';
        AddDomainSearchBtnsHtml += '|<a class="taomiTools-a gujia" target="_blank" title="来！估个价" href="http://www.cxz.com/s.php?site='+ _sDomain +'">估</a>';
        AddDomainSearchBtnsHtml += '|<a class="taomiTools-a wanwang" target="_blank" title="查，已注册后缀域名" href="https://wanwang.aliyun.com/domain/searchresult/?keyword='+ _sDomainName +'&suffix=.com">注</a>';
        AddDomainSearchBtnsHtml += '|<a class="taomiTools-a zhanzhang" target="_blank" title="来！站长工具走起" href="http://www.aizhan.com/cha/'+ _sDomain +'/">站</a>';
        AddDomainSearchBtnsHtml += '|<a class="taomiTools-a zhanzhang" target="_blank" title="来！查查whois历史" href="http://www.cxw.com/whois/history?domain='+ _sDomain +'">历</a>';
        AddDomainSearchBtnsHtml += '】';
        AddDomainSearchBtnsWrap.html(AddDomainSearchBtnsHtml);
        return AddDomainSearchBtnsWrap;
    }

    /*
    “万网”辅助
    */
    var wanwang = new WanWang();
    function WanWang(){
        // 域名列表增加“域名辅助信息查询”按钮，可一键查询该域名企业信息、估价信息
        this.addDomainSearchInfo = function (){
            changeShuchuHtml();
            $(document).on('DOMNodeInserted', '.J_result_data', function(){
                if($('#domainSearchBtns').size()===0){
                    changeShuchuHtml();
                }
            });
            function changeShuchuHtml(){
                var aDoMainList = $('.J_result_data');
                aDoMainList.find('tr').each(function(i,e){
                    var AtotalCount = aDoMainList.find('tr').size();
                    if(i>0 && i<AtotalCount){
                        var oDoMainA = $(e).find('.first');
                        var sDoMain = oDoMainA.text();
                        oDoMainA.append(getDomainSearchInfoBtns(sDoMain));
                    }
                });
            }
        };
        // 域名出售详情页增加“天眼查”和“估价”按钮
        this.addDomainSearchInfoForDetail = function (){
            var oPageTitle = $('.tao-title .tdo-name');
            var sDoMain = oPageTitle.text();
            oPageTitle.append(getDomainSearchInfoBtns(sDoMain));
        };
    }

    /*
    “聚名网”辅助
    */
    var juming = new JuMing();
    function JuMing(){
        // 为搜索框自动补全".com"后缀
        this.addSearchSuffix = function (){
            var oSearchInput = document.querySelector('#taodm');
            var rReg = /(.com|.net|.cn|.com.cn)$/;
            oSearchInput.addEventListener('blur', function(){
                if(oSearchInput.value !== '域名信息综合查询' && !oSearchInput.value.match(rReg)){
                    oSearchInput.value += '.com';
                }
            });
            oSearchInput.addEventListener('keydown', function(e){
                if(e.keyCode == 13){
                    if(oSearchInput.value !== '域名信息综合查询' && !oSearchInput.value.match(rReg)){
                        oSearchInput.value += '.com';
                    }
                }
            });
        };
        // 启用"一键检测注册状态"按钮
        this.openChazczt = function (){
            $('#shuchu').on('DOMNodeInserted', function (){
                var oBtnChazczt = document.querySelector('#a_plchazc');
                oBtnChazczt.setAttribute('onclick','return pl_chazczt2();');
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
                var aDoMainList = $('#shuchu .balist');
                aDoMainList.find('tr').each(function(i,e){
                    var AtotalCount = aDoMainList.find('tr').size()-1;
                    if(i>0 && i<AtotalCount){
                        var oDoMainA = $(e).find('td:first-child a');
                        var sDoMain = oDoMainA.text();
                        oDoMainA.after(getDomainSearchInfoBtns(sDoMain));
                    }
                });
            }
        };
        // 域名出售详情页增加“天眼查”和“估价”按钮
        this.addDomainSearchInfoForSaleDetail = function (){
            var oPageTitle = $('.pjtitle');
            var sDoMain = oPageTitle.text();
            var sDoMainName = sDoMain.split('.');
            oPageTitle.after(getDomainSearchInfoBtns(sDoMain, sDoMainName[0]));
        };
        // 域名竞价情页增加“天眼查”和“估价”按钮
        this.addDomainSearchInfoForJingjiaDetail = function (){
            var oPageTitle = $('.orderinfo h1');
            var oPageJingJiaTools = $('#app_zhcxsc');
            var sDoMain = oPageTitle.attr('title');
            oPageJingJiaTools.prepend(getDomainSearchInfoBtns(sDoMain));
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
                var aDoMainList = $('#content .bookingMain');
                aDoMainList.find('tr').each(function(i,e){
                    var AtotalCount = aDoMainList.find('tr').size();
                    if(i<AtotalCount){
                        var oDoMainA = $(e).find('.domain a');
                        var sDoMain = oDoMainA.text();
                        oDoMainA.after(getDomainSearchInfoBtns(sDoMain));
                    }
                });
            }
        };
        // 域名出售详情页增加“天眼查”和“估价”按钮
        this.addDomainSearchInfoForDetail = function (){
            var oPageTitle = $('.domain_head .title');
            var sDoMain = oPageTitle.text();
            oPageTitle.append(getDomainSearchInfoBtns(sDoMain));
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
                var aDoMainList = $('#list_id');
                aDoMainList.find('li').each(function(i,e){
                    var AtotalCount = aDoMainList.find('li').size();
                    if(i<AtotalCount){
                        var oDoMainA = $(e).find('a.hui6-hover');
                        var sDoMain = oDoMainA.text();
                        oDoMainA.after(getDomainSearchInfoBtns(sDoMain));
                    }
                });
            }
        };
        // 域名出售详情页增加“天眼查”和“估价”按钮
        this.addDomainSearchInfoForDetail = function (){
            var oPageTitle = $('.detail-tit .dt-yuming');
            var sDoMain = oPageTitle.text();
            oPageTitle.append(getDomainSearchInfoBtns(sDoMain));
        };
    }
})();
