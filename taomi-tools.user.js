// ==UserScript==
// @name         淘米辅助工具
// @namespace    http://bmqy.net/
// @version      0.4.0
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
        '#domainSearchBtns{font-size:12px;color:#666;}'+
        '#timeBar{width:120px; height:18px;background-color:#f5f5f5;display:none;position:absolute;top:50%;left:50%;}'+
        '#timeBar > span{height:100%;line-height:18px;background-color:red;float:left;display:inline-block;}'+
        '#timeBar > span > em{color:#fff;font-size:12px;font-style:normal;text-shadow:0.3px 0.3px 0 #666;position:absolute;left:0;top:0;right:0;}'
    );

    window.onload = function(){
        // 识别当前网站
        var sWindowUrl = location.host;

        // 兼容万网
        if( sWindowUrl.indexOf('aliyun.com') !=-1){
            wanwang.addDomainSearchInfo();
            wanwang.addDomainSearchInfoForDetail();
            wanwang.customDomainMultiSelect();
        }
        // 兼容聚名网
        if( sWindowUrl.indexOf('juming.com') !=-1){
            juming.addSearchSuffix();
            juming.openChazczt();
            juming.addDomainSearchInfo();
            juming.addDomainSearchInfoForSaleDetail();
            juming.addDomainSearchInfoForJingjiaDetail();
            juming.customDomainMultiSelect();
        }
        // 兼容易名中国
        if( sWindowUrl.indexOf('ename.com') !=-1){
            ename.addDomainSearchInfo();
            ename.addDomainSearchInfoForDetail();
            //ename.customDomainMultiSelect();
        }
        // 兼容爱名网
        if( sWindowUrl.indexOf('22.cn') !=-1){
            aiming.addDomainSearchInfo();
            aiming.addDomainSearchInfoForDetail();
            aiming.customDomainMultiSelect();
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

    // 域名列表增加“域名辅助信息查询”按钮，可一键查询该域名企业信息、估价信息、综合信息等按钮
    function doAddDomainSearchInfoBtns(objName, cellName, domainWarpName, isBegin1){
        if($(objName).size() > 0){
            changeShuchuHtml(isBegin1);
            $(document).on('DOMNodeInserted', objName, function(){
                if($('#domainSearchBtns').size()===0){
                    changeShuchuHtml(isBegin1);
                }
            });
        }
        function changeShuchuHtml(isBegin1){
            var aDoMainList = $(objName);
            aDoMainList.find(cellName).each(function(i,e){
                var AtotalCount = aDoMainList.find(cellName).size();
                var oDoMainA = $(e).find(domainWarpName);
                var sDoMain = oDoMainA.text();

                if(isBegin1){
                    if(i<AtotalCount){
                        oDoMainA.append(getDomainSearchInfoBtns(sDoMain));
                    }
                }
                else{
                    if(i>0 && i<AtotalCount){
                        oDoMainA.append(getDomainSearchInfoBtns(sDoMain));
                    }
                }
            });
        }
    }

    // 域名出售列表自定义批量多选
    function doCustomDomainMultiSelect(objName, checkboxName){
        if($(objName).size() > 0){
            openCustomDomainMultiSelect();
            $(document).on('DOMNodeInserted', objName, function(){
                if($(objName).size() > 0){
                    openCustomDomainMultiSelect();
                }
            });
        }

        function openCustomDomainMultiSelect(){
            var aDoMainList = $(objName);
            var aSelected = [];
            var j = 0; // 批量选择起始位置
            var t = 3000; // 单位：毫秒
            var _t = t;
            var oTimeInterval = null;
            var oTimeOut = null;
            var selectedStart = true;

            var oTimerBar = $('<div id="timeBar"><span style="width:10%"><em>'+ t / 1000 +'秒后结束批量选择</em></span></div>');
            $('body').append(oTimerBar);
            // 批量选择
            aDoMainList.find(checkboxName).each(function(index, element){
                $(element).on('click', function(){
                    if($(element).prop('checked') === true){
                        // 开始批量选择
                        if(selectedStart){
                            oTimerBar.show();
                            $(document).mousemove(function(e){
                                oTimerBar.css({'top':e.pageY + 20, 'left':e.pageX + 20});
                            });
                            j = index;
                            aSelected.push($(element));
                            selectedStart = false;

                            oTimeInterval = setInterval(function(){
                                oTimerBar.find('span').css({'width': (_t -= 10) / t * 100 +'%'});
                            },10);

                            // 3秒钟后取消批量选择
                            oTimeOut = setTimeout(function(){
                                selectedStart = true;
                                clearInterval(oTimeInterval);
                                _t = t;
                                oTimerBar.hide().find('span').css({'width': '100%'});
                                console.log('取消批量选择');
                            }, t);
                        }
                        else{
                            // 结束批量选择
                            if(index > j){
                                for(;j<index;j++){
                                    aDoMainList.find(checkboxName).eq(j).prop('checked', true);
                                    aSelected.push(aDoMainList.find(checkboxName).eq(j));
                                }
                            }
                            else{
                                for(;index<j;j--){
                                    aDoMainList.find(checkboxName).eq(j).prop('checked', true);
                                    aSelected.push(aDoMainList.find(checkboxName).eq(j));
                                }
                            }
                            j = 0;
                            selectedStart = true;
                            aSelected = [];
                            clearInterval(oTimeInterval);
                            _t = t;
                            oTimerBar.hide().find('span').css({'width': '100%'});
                        }
                    }
                    else{
                        j = 0;
                        selectedStart = true;
                        aSelected = [];
                        clearInterval(oTimeInterval);
                        _t = t;
                        oTimerBar.hide().find('span').css({'width': '100%'});
                    }
                });
            });
        }
    }

    /*
    “万网”辅助
    */
    var wanwang = new WanWang();
    function WanWang(){
        // 域名列表增加“域名辅助信息查询”按钮
        this.addDomainSearchInfo = function (){
            doAddDomainSearchInfoBtns('.J_result_data', 'tr', '.first');
        };
        // 域名出售详情页增加“域名辅助信息查询”按钮
        this.addDomainSearchInfoForDetail = function (){
            if($('.tao-title .tdo-name').size() > 0){
                var oPageTitle = $('.tao-title .tdo-name');
                var sDoMain = oPageTitle.text();
                oPageTitle.append(getDomainSearchInfoBtns(sDoMain));
            }
        };
        // 域名出售列表自定义批量多选
        this.customDomainMultiSelect = function (){
            doCustomDomainMultiSelect('.J_result_data', 'input[name=check-cart-box]');
        };
    }

    /*
    “聚名网”辅助
    */
    var juming = new JuMing();
    function JuMing(){
        // 为搜索框自动补全".com"后缀
        this.addSearchSuffix = function (){
            if($('#taodm').size() > 0){
                var oSearchInput = document.querySelector('#taodm');
                var rReg = /(.com|.net|.cn|.com.cn|.net.cn|.cc|.me|.wang|.tv|.top|.vip)$/;
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
            }
        };
        // 启用"一键检测注册状态"按钮
        this.openChazczt = function (){
            if($('#a_plchazc').size() > 0){
                $('#shuchu').on('DOMNodeInserted', function (){
                    var oBtnChazczt = document.querySelector('#a_plchazc');
                    oBtnChazczt.setAttribute('onclick','return pl_chazczt2();');
                });
            }
        };
        // 域名列表增加“域名辅助信息查询”按钮
        this.addDomainSearchInfo = function (){
            doAddDomainSearchInfoBtns('#shuchu', 'tr', 'td:first-child a');
        };
        // 域名出售详情页增加“域名辅助信息查询”按钮
        this.addDomainSearchInfoForSaleDetail = function (){
            if($('.pjtitle').size() > 0){
                var oPageTitle = $('.pjtitle');
                var sDoMain = oPageTitle.text();
                var sDoMainName = sDoMain.split('.');
                oPageTitle.after(getDomainSearchInfoBtns(sDoMain, sDoMainName[0]));
            }
        };
        // 域名竞价情页增加“域名辅助信息查询”按钮
        this.addDomainSearchInfoForJingjiaDetail = function (){
            if($('.orderinfo h1').size() > 0){
                var oPageTitle = $('.orderinfo h1');
                var oPageJingJiaTools = $('#app_zhcxsc');
                var sDoMain = oPageTitle.attr('title');
                oPageJingJiaTools.prepend(getDomainSearchInfoBtns(sDoMain));
            }
        };
        // 域名出售列表自定义批量多选
        this.customDomainMultiSelect = function (){
            doCustomDomainMultiSelect('#shuchu .balist', 'input[name=xzid],input[name=ym]');
        };
    }

    /*
    “易名中国”辅助
    */
    var ename = new Ename();
    function Ename(){
        // 域名列表增加“域名辅助信息查询”按钮
        this.addDomainSearchInfo = function (){
            doAddDomainSearchInfoBtns('#content .bookingMain', 'tr', '.domain a');
        };
        // 域名出售详情页增加“域名辅助信息查询”按钮
        this.addDomainSearchInfoForDetail = function (){
            if($('.domain_head .title').size() > 0){
                var oPageTitle = $('.domain_head .title');
                var sDoMain = oPageTitle.text();
                oPageTitle.append(getDomainSearchInfoBtns(sDoMain));
            }
        };
        // 域名出售列表自定义批量多选
        this.customDomainMultiSelect = function (){
            doCustomDomainMultiSelect('#content .bookingMain', 'input[name="domains[]"]');
        };
    }

    /*
    “爱名网”辅助
    */
    var aiming = new AiMing();
    function AiMing(){
        // 域名列表增加“域名辅助信息查询”按钮
        this.addDomainSearchInfo = function (){
            doAddDomainSearchInfoBtns('#list_id', 'li', 'a.hui6-hover', true);
        };
        // 域名出售详情页增加“域名辅助信息查询”按钮
        this.addDomainSearchInfoForDetail = function (){
            if($('.detail-tit .dt-yuming').size() > 0){
                var oPageTitle = $('.detail-tit .dt-yuming');
                var sDoMain = oPageTitle.text();
                oPageTitle.append(getDomainSearchInfoBtns(sDoMain));
            }
        };
        // 域名出售列表自定义批量多选
        this.customDomainMultiSelect = function (){
            doCustomDomainMultiSelect('#list_id', 'input[name="yd_cb_domain"],input[name="chkDomain"]');
        };
    }
})();
