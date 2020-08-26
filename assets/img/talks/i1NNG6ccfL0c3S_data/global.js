(function($$, $){
  $.fn.extend({
    highlightIn: function(color) {
      if (this[0]) {
        var bgelement = this; while (bgelement.css('background-color') == 'transparent') {
          bgelement = bgelement.parent();
        }
        this[0].originalColor = bgelement.css('background-color');
      }
      this.css({'opacity': '0.5', 'filter': 'alpha(opacity = 50)'}).highlightFade({end: (color || [255,255,128])});
    },
    highlightOut: function(color) {
      if (!color && this[0] && this[0].originalColor) {
        color = this[0].originalColor;
      }
      try {
        this.highlightFade({end: (color || [255,255,255])}).css({'opacity': '', 'filter': ''});
      } catch (e) {
        this.css({'background-color': '', 'opacity': '', 'filter': ''});
      }
    }
  });
  $$.extend = function (destination, source, callback) {
    for (var property in source) {
      destination[property] = source[property];
    }
    if($$.dev) {
      destination.__noSuchMethod__ = function (prop, args){
        error(prop, " : no such method exists", args);
      };
    }
    if ($.isFunction(callback)) {
      callback();
    }
    return destination;
  };
  $$.colors = [   "#000000", "#444444", "#666666", "#999999", "#CCCCCC", "#EEEEEE", "#F3F3F3", "#FFFFFF",
                  "#FF0000", "#FF9900", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#9900FF", "#FF00FF",
                  "#FFCCCC", "#FCE5CD", "#FFF2CC", "#D9EAD3", "#D0E0E3", "#CFE2F3", "#D9D2E9", "#EAD1DC",
                  "#EA9999", "#F9CB9C", "#FFE599", "#B6D7A8", "#A2C4C9", "#9FC5E8", "#B4A7D6", "#D5A6BD",
                  "#E06666", "#F6B26B", "#FFD966", "#93C47D", "#76A5AF", "#6FA8DC", "#8E7CC3", "#C27BA0",
                  "#CC0000", "#E69138", "#F1C232", "#6AA84F", "#45818E", "#3D85C6", "#674EA7", "#A64D79",
                  "#990000", "#B45F06", "#BF9000", "#38761D", "#134F5C", "#0B5394", "#351C75", "#741B47",
                  "#660000", "#783F04", "#7F6000", "#274E13", "#0C343D", "#073763", "#20124D", "#4C1130" ];
  $$.time_formats = [
    [60, 'just now', 1],
    [120, '1 minute ago', '1 minute from now'],
    [3600, 'minutes', 60],
    [7200, '1 hour ago', '1 hour from now'],
    [86400, 'hours', 3600],
    [172800, 'yesterday', 'tomorrow'],
    [604800, 'days', 86400],
    [1209600, 'last week', 'next week'],
    [2419200, 'weeks', 604800],
    [4838400, 'last month', 'next month'],
    [29030400, 'months', 2419200],
    [58060800, 'last year', 'next year'],
    [2903040000, 'years', 29030400]
  ];
  $$.cache = {};
  $$.extend(window, {
    log: ($$.dev && window.console) ? function() {
      try{console.log.apply(console, arguments);}catch(e){}
    } : function() { },
    error: ($$.dev && window.console) ? function() {
      try{console.error.apply(console, arguments);}catch(e){}
    } : function() { },
    dir: ($$.dev && window.console) ? function(a) {
      try{console.dir(a);}catch(e){}
    } : function() { },
    info: ($$.dev && window.console) ? function(a) {
      try{console.info(a);}catch(e){}
    } : function() { },
    toggle_language: function(display_languagebar, select_language) {
      if (display_languagebar === true) {
        $('#general_bar_1,#general_bar_2').toggle();
        if(select_language !== "") {
          $("#language_selected_map").val(select_language);
        }
      } else {
        $('#general_bar_1,#general_bar_2').toggle();
      }
    },
    pretty_date: function(date_str) {
      // Input: "2013/07/25 11:39:02 +0530"
      // Output: 4 Months Ago
      var seconds = (new Date() - new Date(date_str)) / 1000;
      if (seconds < 60) {
        return "just now";
      }
      var token = 'ago',
        list_choice = 1,
        i = 0,
        format;
      while (true) {
        format = $$.time_formats[i++];
        if (format === undefined || format === null) {
          return date_str;
        }
        if (seconds < format[0]) {
          if (typeof format[2] === 'string') {
            return format[list_choice];
          } else {
            return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
          }
        }
      }
      return date_str;
    },
    cookie: function(name, value, options) {
      /* view http://plugins.jquery.com/files/jquery.cookie.js.txt
         here we directly append this to window object instead of jQuery */
        if (typeof value != 'undefined') {
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    },
    isInternalRedirect: function(url) {
      if (!url){
        return false;
      }
      url = decodeURIComponent(url);
      var dummy_anchor = document.createElement('a');
      dummy_anchor.href = url;
      var is_valid_protocol = /http(s)?:$/.test(dummy_anchor.protocol);
      var is_valid_hostname = (new RegExp('^' + location.hostname + '$')).test(dummy_anchor.hostname);
      return (is_valid_protocol && is_valid_hostname);
    },
    location_without_params: function() {
      return document.location.protocol + '//' + document.location.host + document.location.pathname;
    },
    getUrlVars: function(url){
      url = url ? url : window.location.href;
      var vars = [], hash;
      var hashes = url.slice(url.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },
    getUrlVar: function(name,url){
      return this.getUrlVars(url)[name];
    },
    isBrowserMSIE: function() {
      return $.browser.msie;
    }
  }, function(){
    log("logging enabled");
    log("Window object extended");
  });

  $$.extend(Math, {
    uuid : (function() { /* Taken from http://www.broofa.com/Tools/Math.uuid.js */
      var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      return function (len, radix) {
        var chars = CHARS, uuid = [];
        var i = 0;
        radix = radix || chars.length;
        if (len) {
          for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random()*radix];
          }
        } else {
          var r;
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random()*16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
        return uuid.join('');
      };
    })()
  });

  $$.extend(String.prototype, {
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
    specialChar: {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '\\': '\\\\'
    },
    blank: function(s) {
      return (/^\s*$/).test(this.s(s) || ' ');
    },
    capitalize: function(s) {
      s = this.s(s);
      s = s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();
      return this.r(arguments,0,s);
    },
    empty: function(s) {
      return this.s(s) === '';
    },
    escapeHTML: function(s) {
      s = this.s(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      return this.r(arguments,0,s);
    },
    evalScripts: function(s) {
      var scriptTags = this.extractScripts(this.s(s)), results = [];
      if (scriptTags.length > 0) {
        for (var i = 0; i < scriptTags.length; i++) {
          results.push(eval(scriptTags[i]));
        }
      }
      return results;
    },
    extractScripts: function(s) {
      var matchAll = new RegExp(this.ScriptFragment, 'img');
      var matchOne = new RegExp(this.ScriptFragment, 'im');
      var scriptMatches = this.s(s).match(matchAll) || [];
      var scriptTags = [];
      if (scriptMatches.length > 0) {
        for (var i = 0; i < scriptMatches.length; i++) {
          scriptTags.push(scriptMatches[i].match(matchOne)[1] || '');
        }
      }
      return scriptTags;
    },
    gsub: function(pattern, replacement, s) {
      s = this.s(s);
      if ($.isFunction(replacement)) { s = this.sub(pattern, replacement, -1, s); }
      else { s = s.split(pattern).join(replacement); }
      return this.r(arguments,2,s);
    },
    include: function(pattern, s) {
      return this.s(s).indexOf(pattern) > -1;
    },
    interpolate: function(obj, pattern, s) {
      s = this.s(s);
      if (!pattern) { pattern = /(\#\{\s*(\w+)\s*\})/; }
      var gpattern = new RegExp(pattern.source, "g");
      var matches = s.match(gpattern), i;
      for (i=0; i<matches.length; i++) {
        try  {
          s = s.replace(matches[i], obj[matches[i].match(pattern)[2]].gsub("$", "$$").toString().escapeHTML());
        } catch (e) {
        }
      }
      return this.r(arguments,2,s);
    },
    scan: function(pattern, replacement, s) {
      s = this.s(s);
      this.sub(pattern, replacement, -1, s);
      return this.r(arguments,2,s);
    },
    startsWith: function(pattern, s) {
      return this.s(s).indexOf(pattern) === 0;
    },
    strip: function(s) {
      s = $.trim(this.s(s));
      return this.r(arguments,0,s);
    },
    stripScripts: function(s) {
      s = this.s(s).replace(new RegExp(this.ScriptFragment, 'img'), '');
      return this.r(arguments,0,s);
    },
    stripTags: function(s) {
      s = this.s(s).replace(/<\/?[^>]+>/gi, '');
      return this.r(arguments,0,s);
    },
    sub: function(pattern, replacement, count, s) {
      s = this.s(s);
      if (pattern.source && !pattern.global) {
        var patternMods = (pattern.ignoreCase)?"ig":"g";
        patternMods += (pattern.multiline)?"m":"";
        pattern = new RegExp(pattern.source, patternMods);
      }
      var sarray = s.split(pattern), matches = s.match(pattern);
      if ($.browser.msie) {
        if (s.indexOf(matches[0]) === 0) {
          sarray.unshift("");
        }
        if (s.lastIndexOf(matches[matches.length-1]) == s.length - matches[matches.length-1].length) {
          sarray.push("");
        }
      }
      count = (count < 0)?(sarray.length-1):count || 1;
      s = sarray[0];
      for (var i=1; i<sarray.length; i++) {
        if (i <= count) {
          if ($.isFunction(replacement)) {
            s += replacement(matches[i-1] || matches) + sarray[i];
          } else { s += replacement + sarray[i]; }
        } else { s += (matches[i-1] || matches) + sarray[i]; }
      }
      return this.r(arguments,3,s);
    },
    truncate: function(length, truncation, s) {
      s = this.s(s);
      length = length || 30;
      truncation = (!truncation) ? '...' : truncation;
      s = (s.length > length) ? s.slice(0, length - truncation.length) + truncation : String(s);
      return this.r(arguments,2,s);
    },
    unescapeHTML: function(s) {
      s = this.stripTags(this.s(s)).replace(/&amp;/g,'&').replace(/&lt;/g,
                                                                  '<').replace(/&gt;/g,'>').replace(/&quot;/,'"');
      return this.r(arguments,0,s);
    },
    r: function(args, size, s) {
      if (args.length > size || this.str === undefined) {
        return s;
      } else {
        this.str = ''+s;
        return this;
      }
    },
    s: function(s) {
      if (s === '' || s) { return s; }
      if (this.str === '' || this.str) { return this.str; }
      return this;
    },
    chop: function(){
      return this.slice(0, this.length - 1);
    }
  }, function (){
    log("String object extended");
  });

  $$.extend(Array.prototype, {
    empty: function(){
      return (this.length < 1);
    }
  });
  $$.extend($$, {
    pluralize: function(n, s) {
      if (n.toString() === "0" || n.toString() === "") {
        return "";
      } else if (n.toString() === "1") {
        return "1 " + s;
      } else {
        return n.toString() + " " + s + "s";
      }
    },
    createElement: function(type, prop){
      var element = document.createElement(type);
      for (var i in prop) {
        element.setAttribute(i, prop[i]);
      }
      return element;
    },
    isHomePage: function() {
      return window.location.pathname == '/';
    },
    isSlideViewPage: function() {
      return slideshare_object.slideshow !== undefined;
    },
    tooltip: function (message,element_id){
      $('#'+element_id).hover(function(e) {
        var element = $(e.currentTarget),
            position = element.position();
        $$.cache.toolTip = element.append("<div class='tooltip' style='top:"+position.top+"px;left:"+
                                          position.left+"px;z-index:9999999;'>"+message+"</div>").children('.tooltip');
      }, function() {
        $$.cache.toolTip.remove();
        delete $$.cache.toolTip;
      });
    },
    add_contact: function(contactee_id, success_callback, error_callback) {
      var url = "/contact/create";
      $.ajax({
        url : url,
        type : 'POST',
        dataType : 'json',
        data : {
          'contactee' : contactee_id
        },
        success : function(response) {
          if(response.suspended) {
            window.location.replace('/login');
          } else if(response.follow_limit_reached) {
            window.location.reload();
          } else {
            success_callback(response);
          }
        },
        error : error_callback
      });
    },
    delete_contact: function(contactee_id, success_callback, fail_callback) {
      $.ajax({
        url: '/contact/delete',
        type: 'POST',
        dataType: 'json',
        data: {
          'contactee': contactee_id
        },
        success: function(resp) {
          if(resp.success) {
            success_callback(resp);
          } else {
            fail_callback(resp);
          }
        },
        error: function(resp) {
          fail_callback(resp);
        }
      });
    },
    addRedirectURLForLogin: function (){
      $('a[href="/login"]')
      .filter(':not(.void_redirect_link)').attr('href',
        window.location.pathname.match(/^\/login$|^\/signup$|^\/$/) ? '/login' : '/login?from_source='+
        encodeURIComponent(window.location.pathname));
      $('a[href="/signup"]').filter(':not(.void_redirect_link)').attr('href',
        window.location.pathname.match(/^\/login$|^\/signup$|^\/$/) ? '/signup' : '/signup?from_source='+
        encodeURIComponent(window.location.pathname));
      if($$.user.loggedin) {
        jQuery('a[href="/login?from=upload&from_source=/upload"]').attr('href','/upload');
      }
    },
    alert: function(message, customTitle){
      customTitle = customTitle || "Alert!";
      $('body').append('<div id="dialog" class="ui-state-error ui-corner-all" title="'+customTitle+
        '" style="display:none;"><p>'+
        '<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span>'+message+'</p></div>');
      $("#dialog").dialog({
        bgiframe: false,
        modal: false,
        closeOnEscape: true,
        close: function(){
          $('#dialog').remove();
        },
        buttons: {
          Ok: function() {
            $('#dialog').remove();
          }
        }
      });
    },
    confirm: function(title,message,callback, falseCallBack, height, width){
      if(title === null) {
        title = "Confirm";
      }
      if(message === null) {
        message = "Are you sure want to proceed ?";
      }
      $('body').append('<div id="dialog" style="display:none;" title="'+title+'">'+
        '<p><span class="ui-icon ui-icon-info" style="float:left; margin:0 7px 20px 0;"></span>'+message+'</p></div>');
      $("#dialog").dialog({
        bgiframe: true,
        resizable: false,
        height: height,
        width: width,
        modal: false,
        overlay: {
          backgroundColor: '#000',
          opacity: 0.5
        },
        closeOnEscape: true,
        dialogClass: 'confirm',
        close: function(){
          $(this).dialog('destroy');
          $('#dialog').remove();
        },
        buttons: {
          'Ok': function() {
            $(this).dialog('destroy');
            $('#dialog').remove();
            if ($.isFunction(callback)) {
              callback();
            }
            return true;
          },
          'Cancel': function() {
            $(this).dialog('destroy');
            $('#dialog').remove();
            if ($.isFunction(falseCallBack)) {
              falseCallBack();
            }
            return false;
          }
        }
      });
    },
    miniDialog: function(element, yesCallback, noCallback) {
      var yesButton = element.find('#yes');
      var noButton = element.find('#no');
      var clearDialog = function(e) {
        element.hide();
        yesButton.unbind('click');
        noButton.unbind('click');
      };

      yesButton.click(function(e) {
        clearDialog();
        yesCallback(e);
      });
      noButton.click(function(e) {
        clearDialog();
        noCallback(e);
      });
      $('body').click(clearDialog);
    },
    prompt: function(title,message,default_value,callback, optional_message){
      optional_message = optional_message || "";
      if (title === null || message === null || callback === null) {
        return false;
      }
      default_value = default_value || "";
      $('body').append('<div id="dialog" style="display:none;" title="'+title+'"><label for="prompt_value">'+
        message+'</label>&nbsp;&nbsp;<input type="text" id="prompt_value" value="'+default_value+'"/><br><br><span>'+
        optional_message+'</span></div>');
      if (optional_message.blank()) {
        optional_message = null;
      }
      $("#dialog").dialog({
        bgiframe: true,
        resizable: false,
        height: optional_message === null ? 300 : 180,
        width: optional_message === null ? 300 : 500,
        modal: false,
        overlay: {
          backgroundColor: '#000',
          opacity: 0.5
        },
        closeOnEscape: true,
        dialogClass: 'confirm',
        close: function(){
          $(this).dialog('destroy');
          $('#dialog').remove();
        },
        buttons: {
          'Ok': function() {
            var value = $('#prompt_value').val();
            $(this).dialog('destroy');
            $('#dialog').remove();
            if ($.isFunction(callback)) {
              callback(value);
            }
            return true;
          },
          'Close': function() {
            $(this).dialog('destroy');
            $('#dialog').remove();
            return false;
          }
        }
      });
    },
    dropDown: function(hoverTargetId,dropDownId){
      $(hoverTargetId).hover(function() {
        $(dropDownId).show();
      }, function() {
        $(dropDownId).hide();
      });
    },
    makeExternalLinksOpenInNewTab: function(){
      $('a[hostname!='+window.location.hostname+']').attr('target','_blank');
    },
    ga: function(tag, type, optional_label, optional_value, isNonInteractiveEvent){
      if(type.match(/pageload/)){
        $$.cache.pageTag = type;
      }
      $(function(){
        try{
          log([
            new Date(),
            "Event tracking",
            tag,
            type,
            _gaq && _gaq.push(["_trackEvent", tag, type, optional_label, optional_value, !!isNonInteractiveEvent])
          ]);
        } catch(e){}
      });
    },
    flashNoticeClose: function(){
      $("#page-error .closeThis, #page-success .closeThis, #page-notice .closeThis, #page-warning .closeThis," +
        "#page-message .closeThis, .information .closeThis").on( "click", function (e) {
          $(e.target).parent().hide();
          return false;
        });
    },
    hideAllNotices: function(){
      $("#page-error , #page-success , #page-notice , #page-warning ," +
        "#page-message , .information").hide();
    },
    handleSearchFields: function(){
      $('.headerSearch input.text').focus(function() {
        if ($(this).val() == 'Search'){
          $(this).val('');
        }
      });
      $('.headerSearch input.text').blur(function() {
        $(this).val($.trim($(this).val()));
      });
      $('.headerSearch').submit(function(event) {
        var searchField = $(this).find('input.text');
        searchField.val($.trim(searchField.val()));
        if (searchField.val() == 'Search' || searchField.val() === ''){
          event.preventDefault();
          searchField.focus();
        }
      });
    },
    colorEntered: function(){
      $('.color_picker').each(function(i,j){
        var element =  $(j);
        element.children('div').css('background-color',element.siblings('input').val());
      });
    },
    colorPicker: function(){
      $$.colorString = '<div style="top: #{top}px; left: #{left}px;" class="picker">';
      for(var i in $$.colors) {
        $$.colorString += '<div onclick="slideshare_object.colorPicked(this);"'+
          ' style="margin: 2px; float: left; width: 12px; height: 12px; '+
          'background-color: '+$$.colors[i]+' ; cursor: pointer;">&nbsp;</div>';
      }
      $$.colorString += '</div>';
      $$.colorEntered();
      $('.color_hex').blur(function(e) {
        var element = $(e.target);
        element.siblings('div.color_picker').children().css('background-color', element.val());
      });
      $('.color_picker div').click(function(e) {
        var element = $(e.target),
            position = element.position(),
            parent = element.parent().parent();
        if(parent.children().length == 3){
          $('.picker').remove();
          parent.append(slideshare_object.colorString.interpolate({top: position.top, left: position.left - 146}));
        }
        else {
          parent.children(':last').remove();
        }
      });
    },
    colorPicked: function(e){
      var element = $(e),
          parent = element.parent(),
          color = slideshare_object.rgb2hex(element.css('background-color'));
      parent.siblings('div.color_picker').children().css('background-color', color).end().siblings('input').val(color);
      parent.remove();
    },
    rgb2hex: function(str){
      if ($.browser.msie) {
        return str.toUpperCase();
      }else{
        var parts = str.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete (parts[0]);
        for (var i = 1; i <= 3; ++i) {
          parts[i] = parseInt(parts[i], 10).toString(16);
          if (parts[i].length == 1) {
            parts[i] = '0' + parts[i];
          }
        }
        return '#'+parts.join('').toUpperCase();
      }
    },
    tabs: function(id){
      $(id).find(':first li a').click(function(e) {
        var element = $(e.target);
        $(id).children(':not(:first)').hide();
        element.parent().attr('class','ui-tabs-selected').siblings().removeAttr('class');
        $(e.target.hash).show();
        $('#redirect').val(e.target.hash);
        return false;
      }).end().children(':not(:first)').hide().end().find(':first li a:first').click();
    },
    checkGlobals: function() {
      try{
        if($$.dontCheckGlobals) {
          return true;
        }
        if ( console.groupCollapsed ) {
          console.groupCollapsed( "ss inits" );
        }
        info("Globals objects used");
        var a = {},b = [],d = document;
        var e = 'addEventListener,document,location,navigator,window'.split(','),i = e.length;
        var w = window,g = {},f = d.createElement('iframe');
        for (var v in w) {
          a[v] = { 'type': typeof w[v],'val': w[v] };
        }
        f.style.display = 'none';
        d.body.appendChild(f);
        f.src = 'about:blank';
        f = f.contentWindow || f.contentDocument;
        for (v in a) {
          if (typeof f[v] != 'undefined') {
            delete a[v];
          }
        }
        while (--i) {
          delete a[e[i]];
        }
        dir(a);
        if ( console.groupEnd ) {
          console.groupEnd( "ss inits" );
        }
      }catch(ex){}
    },
    showPopup: function (url) {
      var w=660, h=490, Xpos=((screen.availWidth - w)/2),Ypos=((screen.availHeight - h)/2);
      window.open(url, 'ss_share', 'width=' + w + ',height=' + h + ',toolbar=no,resizable=fixed,'+
        'status=no,scrollbars=no,menubar=no,screenX=' + Xpos+',screenY='+Ypos ).focus();
    },
    dimLight: {
      init: function (options) {
        $$.cache.dimLight = {};
        $$.cache.currentDimLight = options.name;
        $$.cache.dimLight[options.name] = {
          'url': options.url,
          'type': options.type,
          'datatype': options.datatype,
          'data': options.data,
          'callback': options.callback,
          'backoff': options.backoff,
          'defaultBackoff': options.backoff
        };
        $$.cache.dimLight[$$.cache.currentDimLight].start = true;
        $$.dimLight.send();
      },
      send: function () {
        if($$.cache.dimLight[$$.cache.currentDimLight].start){
          $$.cache.dimLight[$$.cache.currentDimLight].start = false;
          $.ajax({
            url: $$.cache.dimLight[$$.cache.currentDimLight].url,
            type: $$.cache.dimLight[$$.cache.currentDimLight].type,
            dataType: $$.cache.dimLight[$$.cache.currentDimLight].datatype,
            data: {'ids' : $$.cache.dimLight[$$.cache.currentDimLight].data},
            beforeSend: function(){
              info("Dimlight call triggered for "+$$.cache.currentDimLight+" at "+Date());
            },
            success: function(data) {
              info("Dimlight success for "+$$.cache.currentDimLight+" at "+Date());
              $$.cache.dimLight[$$.cache.currentDimLight].start = true;
              if($.isFunction($$.cache.dimLight[$$.cache.currentDimLight].callback)){
                $$.cache.dimLight[$$.cache.currentDimLight].callback(data);
              }
              window.setTimeout( $$.dimLight.send, $$.cache.dimLight[$$.cache.currentDimLight].defaultBackoff );
            },
            error: function() {
              info("Dimlight error for "+$$.cache.currentDimLight+" at "+Date());
              error(arguments);
              window.setTimeout( $$.dimLight.send, $$.cache.dimLight[$$.cache.currentDimLight].backoff );
              $$.cache.dimLight[$$.cache.currentDimLight].start = true;
              $$.cache.dimLight[$$.cache.currentDimLight].backoff *= 1.3;
            }
          });
        }
      },
      stop: function () {
        while($$.cache.dimLight[$$.cache.currentDimLight].start){
          info("Stopping Dimlight...");
          $$.cache.dimLight[$$.cache.currentDimLight].start = false;
          info("Stopped Dimlight...");
        }
        return !$$.cache.dimLight[$$.cache.currentDimLight].start;
      }
    },
    scrollTo: function (id) {
      var $target = $(id);
      if ($target.length) {
        $('html,body').animate({scrollTop: $target.offset().top - 100}, 1000);
        $target.focus();
      }
    },
    tagTextBoxInteraction: function (elem) {
      $.each(elem, function(i,j){
        if (j.value.blank()) {
          j.value = 'separate tags by comma';
          $(j).attr("style","color:#777");
        }
        $(j).focus(function(){
          if (this.value == 'separate tags by comma') { this.value = ""; $(j).attr("style","color:#333"); }
        }).blur(function () {
          if (this.value.blank()) { this.value = "separate tags by comma"; $(j).attr("style","color:#777"); }
        });
      });
    },
    initTagTextBox: function () {
      var elem = $('.action-tags-text-input');
      $$.tagTextBoxInteraction(elem);
    },
    getStyle: function(url){
      $.get(url, function(data){
        $('head').append("<style>"+data+"</style>");
      });
    },
    // Not bieng used anywhere in code now after removing from fbAutologin
    refreshTopNav : function() {
      //refresh the data shown in top nav
      $.get(slideshare_object.top_nav.get_url, function(data) {
        var topNavLinks = $('#topNavLinks-11');
        topNavLinks.empty().prepend(data);
      });
    },
    updateLoginSpecificContent: function() {
      $$.addRedirectURLForLogin(); //updates links as per user data
      $('.j-logged-out').hide();
      if($$.user.is_pro){
        $('.j-pro-text').show();
      }else{
        $('.j-non-pro-text').show();
      }
      $('.j-intro-username').text($$.user.name.split(' ')[0]);
      $('.j-intro-profileinfo').attr('href','/'+$$.user.login + '/edit_mypersonalinfo');
    },
    setupTopnavMenu : function(){
      /*Code for usermenu*/
      $('.j-userName').bind('mouseenter', function(event) {
        if ($('.j-userDropDown').is(':hidden'))
        {
          $('.j-userDropDown').show();
          $('.j-userName').addClass('userNameSelected');
        }
      });
      $('.j-userDropDown').bind('mouseleave',function(event){
        $('.j-userDropDown').hide();
        $('.j-userName').removeClass('userNameSelected');
      });
    },
    topNavUploadTrack: function(){
      // adding ga calls to track logged in and logged out users clicking on topnav upload link
      $('.mainNav li a:contains(Upload)').bind('click',function(e){
        var href=$(e.target).attr('href');

        //match the href with a regular expression to detect if the user is logged in or logged out.
        window._gaq = _gaq || [];
        window._gaq.push(['_trackEvent', 'interactive_upload', 'top_nav_click',
                            /^\/login/.test(href) ? 'logged_out' : 'logged_in']);
        window._gaq.push(['_trackPageview', '/uploadTopNav']);
      });
    },
    topNavClickTrack: function(){
      $('.navbar-inner').click(function() {
        window._gaq.push(['_trackEvent','top_nav','topnav_click']);
      });

      function navTracking() {
        var action = $(this).data('ga');
        if(action) {
          window._gaq.push(['_trackEvent', 'top_nav', action]);
        }
      }

      $('body').on('submit', '#desktop-navbar-search', navTracking);
      $('body').on('click', '#main_navbar a', navTracking);

      $(document).ready(function () {
        if ($('.sub-navbar').length) {
          slideshare_object.ga('sub_navbar', 'load');
        }
      });

      $('body').on('click', '[data-ga-cat]', function() {
        var gaCategory = $(this).data('ga-cat');
        var gaAction = $(this).data('ga-action');
        var gaLabel = $(this).data('ga-label');
        var gaValue = $(this).data('ga-value');
        var gaNonInteractive = $(this).data('ga-noninteractive') || false;

        if (gaCategory && gaAction) {
          slideshare_object.ga(gaCategory, gaAction, gaLabel, gaValue, gaNonInteractive);
        }
      });
    },
    localizeForOtherLanguages: function(){
      if ((parts = location.hostname.split('.')).length === 3) {
        first_part = parts.shift();
        // For french and spanish
        if (first_part.match(/fr|es|pt/)) {
          $(".btn-social").removeClass("btn-social").addClass("btn-social-other");
          $(".btn-fb-modal").removeClass("btn-fb-modal").addClass("btn-fb-modal-other");
          $(".modal-login-header").removeClass("modal-login-header").addClass("modal-login-header-other");
        } else if (first_part.match(/de/)) {
          $(".btn-fb-modal").removeClass("btn-fb-modal").addClass("btn-fb-modal-de");
        }
        // for all other
        if (!first_part.match(/www/)) {
          $(".container-box .login-wrapper").removeClass("login-wrapper").addClass("login-wrapper-other");
          $(".or").removeClass("or").addClass("or-other");
          $("#smt-lang-selector").addClass("lang-selector-other");
        }
      }
    },
    action_from_email_check: function(){
      // instead of auto_login auth_code this auth_code is used in like email to verify the user
      var auth_code = getUrlVar("auth_code");
      if (auth_code && !slideshare_object.user.loggedin){
        var login_source = getUrlVar("login_source"), from = getUrlVar("from"), login_url = "/signup?";
        login_url += from ? "from="+from+"&" : "";
        login_url += login_source ? "login_source="+login_source : "";
        initiate_login_modal(login_url, "#login_modal");
      }
    },
    setLanguageSelector: function(){
      /*Need to put li elements(with class="www"/"fr"..) for each language in the html as well
      Not creating those elements in js because of seo considerations
      */
      var langs_supported = {
        www: "English",
        fr: "Français",
        es: "Español",
        pt: "Português (Brasil)",
        de: "Deutsch"
      };
      var cur_url = window.location.href;

      //Set current Langauge  in selector
      var cur_subdomain  = cur_url.match(/:\/\/([^.]*)/)[1];
      $('.'+cur_subdomain).addClass('active');
      //map current url to corresponding url in other language
      $.each(langs_supported, function(lang_key, lang_string){
        //change the subdomain of current url to subdomain of target language
        var cur_url_for_lang = cur_url.replace(/:\/\/([^.]*)/, '://'+lang_key);
        $('.lang .' + lang_key + " a" ).attr('href', cur_url_for_lang);
      });
    },

    logged_out_action_modal_player_click: function(elem) {
      var $elem = $(elem);
      $('.modal-player .close').click();
      $('.j-carousel-modal-close').click();
      if(window.initiate_login_modal){
        initiate_login_modal($elem.attr("href"), $elem.data("target"));
      } else {
        window.location.href = $elem.attr("href");
      }
    },

    // Checks if the given url is a download url
    isDownloadUrl: function(url) {
      url = url || window.location.href;
      return ((getUrlVar('download_id', url) &&
               getUrlVar('download_id', url).length > 0) ||
              getUrlVar('abbr', url) === 'true' ||
              getUrlVar('from', url) === 'download');
    }
  }, function (){
    log("$$ object extended");
  });
  $$.extend($.fn, {
    toggleText: function() {
      this.each(function(i, j) {
        j = $(j);
        j.data('text_to_toggle', j.val());
        tc = j.attr('class').match(/(quietest|quieter|quiet)/);
        tc = tc ? tc.join(' ') : '';
        j.data('quiet_class', tc);
        j.focus(function() {
          var e = $(this);
          if (e.val() == e.data('text_to_toggle')) {
            e.val("").removeClass(j.data('quiet_class'));
          }
        }).blur(function() {
          var e = $(this);
          if (e.val().length < 1) {
            e.val(e.data('text_to_toggle')).addClass(j.data('quiet_class'));
          }
        });
      });
    },
    fixPNG: function(){
      return this.each(function () {
        var image = $(this).css('backgroundImage');
        if (image.match(/^url\(["']?(.*\.png)["']?\)$/i)) {
          image = RegExp.$1;
          $(this).css({
            'backgroundImage': 'none',
            'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod="+
              ($(this).css('backgroundRepeat') == 'no-repeat' ? 'crop' : 'scale') + ", src='" + image + "')"
          }).each(function () {
            var position = $(this).css('position');
            if (position != 'absolute' && position != 'relative') {
              $(this).css('position', 'relative');
            }
          });
        }
      });
    }
  }, function (){
    log("$.fn object extended");
  });

  $$.setupTopnavMenu();

  formatThousands = function (value, separator) {
    if (separator === undefined) {separator = ',';}
    var buf = [];
    value = String(value).split('').reverse();
    for (var i = 0; i < value.length; i++) {
        if (i % 3 === 0 && i !== 0) {
            buf.push(separator);
        }
        buf.push(value[i]);
    }
    return buf.reverse().join('');
  };

  $$.extend($$, {
    autosuggest_top: function() {
      $("body").on("click", "#desktop-navbar-search .searchSuggestionsTop li", function() {
        $("#search_query_top").val($(this).text());
        $(".searchSuggestionsTop").remove();
        $('#desktop-navbar-search').submit();
      });
      $("body").on("mousemove", "#desktop-navbar-search .searchSuggestionsTop li", function() {
        $("#search_query_top").val($(this).text());
        $(this).attr("class", "searchHighlight");
      });
      $("body").on("mouseout", "#desktop-navbar-search .searchSuggestionsTop li", function() {
        $(this).removeAttr("class");
      });
      $("body").on("mouseover", "#desktop-navbar-search .searchSuggestionsTop", function() {
        /* Remove any initial suggestions from keyboard
        when the mouse pointer is moved inside suggestion box */
        var temp = $(".searchSuggestionsTop li.searchHighlight");
        if (temp.length !== 0) {
          temp.removeAttr("class");
        }
      });
      $("body").on("blur", "#search_query_top", function() {
        if($(".searchSuggestionsTop .searchHighlight").length !== 0){
          $('#desktop-navbar-search').submit();
        }
        else{
          $(".searchSuggestionsTop").hide();
        }
      });
      $("body").on("focus", "#search_query_top", function() {
        $(".searchSuggestionsTop").show();
      });
      var delay = (function(){
        var timer = 0;
        return function(callback, ms) {
          clearTimeout(timer);
          timer = setTimeout(callback, ms);
        };
      })();
      $("body").on('keyup', '#search_query_top', function(event) {
      delay(function() {
        var flag = 0;
        var suggestion = null;
        var current_suggestion = null;
        var new_suggestion = null;
        if (parseInt(event.keyCode, 10) == 40) {
          /* Down key */
          /* Remove any previous suggestions (from mouse) */
          current_suggestion = $(".searchSuggestionsTop li.searchHighlight");
          if (current_suggestion[0] == $(".searchSuggestionsTop li:hover")[0]) {
            $(".searchSuggestionsTop li:hover").removeAttr("class");
            $(".searchSuggestionsTop").mouseout(); // :P
          }
          if (current_suggestion.length === 0) {
            /* No current suggestion
            * Go to the first suggestion */
            suggestion = $(".searchSuggestionsTop li:first");
            suggestion.attr("class", "searchHighlight");
            $("#search_query_top").val(suggestion.text());
          }
          else if (current_suggestion[0] == $(".searchSuggestionsTop li:last")[0]) {
            /* Last suggestion selected
            * Go back to the first suggestion */
            suggestion = $(".searchSuggestionsTop li:first");
            suggestion.attr("class", "searchHighlight");
            $(".searchSuggestionsTop li:last").removeAttr("class");
            $("#search_query_top").val(suggestion.text());
          }
          else {
            new_suggestion = current_suggestion.next();
            $("#search_query_top").val(new_suggestion.text());
            current_suggestion.removeAttr("class");
            new_suggestion.attr("class", "searchHighlight");
          }
          flag = 1;
        }
        if (parseInt(event.keyCode, 10) == 38) {
          /* Up key */
          /* Remove any previous suggestions (from mouse) */
          current_suggestion = $(".searchSuggestionsTop li.searchHighlight");
          if (current_suggestion[0] == $(".searchSuggestionsTop li:hover")[0]) {
            $(".searchSuggestionsTop li:hover").removeAttr("class");
            $(".searchSuggestionsTop").mouseout(); // :P
          }
          if (current_suggestion.length === 0) {
            /* No current suggestion
            * Go to the last suggestion */
            suggestion = $(".searchSuggestionsTop li:last");
            suggestion.attr("class", "searchHighlight");
            $("#search_query_top").val(suggestion.text());
          }
          else if (current_suggestion[0] == $(".searchSuggestionsTop li:first")[0]) {
            /* First suggestion selected
            Go back to the last suggestion*/
            suggestion = $(".searchSuggestionsTop li:last");
            suggestion.attr("class", "searchHighlight");
            $(".searchSuggestionsTop li:first").removeAttr("class");
            $("#search_query_top").val(suggestion.text());
          }
          else {
            new_suggestion = current_suggestion.prev();
            $("#search_query_top").val(new_suggestion.text());
            current_suggestion.removeAttr("class");
            new_suggestion.attr("class", "searchHighlight");
          }
          flag = 1;
        }
        if (parseInt(event.keyCode, 10) === 37 || parseInt(event.keyCode, 10) === 39){
          /* left or right arrow key press */
          return;
        }

        if (flag === 1) {
          return;
        }

        var user_query = $("#search_query_top").val();
        new_auto_suggest_query = user_query.replace(/[\(\)\[\]\!\#\~'"*&]/gi,'').replace(/\s{2,}/g,' ');
        new_auto_suggest_query = $.trim(new_auto_suggest_query);
        new_auto_suggest_query = new_auto_suggest_query.replace(/ /g,'?');
        if(new_auto_suggest_query.length === 0){
          $(".searchSuggestionsTop").remove();
          return false;
        }
        if($.inArray('site_search', slideshare_object.feature_flag) !== -1){
          return false;
        }

        new_auto_suggest_query = new_auto_suggest_query + "*";
        new_auto_suggest_query = new_auto_suggest_query + "&rows=5&wt=json&sort=frequency%20desc";
        new_auto_suggest_query += "&fq=%2Bresults%3A%5B10%20TO%20*%5D&json.wrf=?";
        if (new_auto_suggest_query.length > 2) {
          var autosuggest_url = "//autosuggest.slideshare.net/?q=" + new_auto_suggest_query;
          $.getJSON(autosuggest_url, function(data) {
            if (data.response.docs.length > 0) {
              $(".searchSuggestionsTop").remove();
              $("<ul class='searchSuggestionsTop'></ul>").insertAfter("#search_query_top");
              //clean user query for special chars.
              user_query = $.trim(user_query);
              user_query = user_query.replace(/[^\w\s]/g,"");
              //replace multispaces from user query
              user_query = user_query.replace(/\s{2,}/g, " ");
              $.each(data.response.docs, function(i, item) {
                var suggested_part = item.query;
                suggested_part = suggested_part.replace(user_query,"");
                // special case when user query is not in suggestions
                if(suggested_part == item.query) {
                  $("<li><b>" + suggested_part + "</b></li>").appendTo(".searchSuggestionsTop");
                } else {//user query is in suggestions
                  $("<li>" + user_query + "<b>"+suggested_part + "</b></li>").appendTo(".searchSuggestionsTop");
                }
              });
            }
            else {
              $(".searchSuggestionsTop").remove();
            }
          });
        }
      }, 50);
      });
    }
  }, function() {
    log("$$ extended");
  });


  $(document).ready(function() {
    // returns the hostname of a url
    function url_hostname(url) {
      var a = document.createElement('a');
      // converting relative url to absolute url for hostname resolution on IE
      a.href = url;
      var tempUrl = a.href;
      a.href = tempUrl;
      return a.hostname;
    }
    /* All non-GET requests will add the authenticity token
       if not already present in the data packet */
    window._xhrQ = window._xhrQ || [];
    $(document).bind("ajaxSend", function(elm, xhr, s) {
      /* donot append authtoken to crossdomain requests */
      if (url_hostname(s.url) !== window.location.hostname){
        return;
      }
      if (s.type == "GET") {
        return;
      }
      if (s.data && (typeof window._auth_token_name != 'undefined') && s.data.match(new RegExp("\\b" + window._auth_token_name + "="))) {
        return;
      }
      if (!window._auth_token_name || !window._auth_token){
        // no csrf protection present.
        // get authenticity token
        if (!window._xhrCSRF){
          // get the csrf token
          window._xhrCSRF = true;
          $.ajax({
            url: '/account/get_form_authenticity_token',
            dataType: 'json',
            type: 'GET',
            success: function(data){
              window._auth_token = data.auth_token;
              window._auth_token_name = 'authenticity_token';
              var i, xhrQ = window._xhrQ;
              // I would like to use q.unshift, but it doesnt work on IE<=8
              for(i in xhrQ){
                if(xhrQ.hasOwnProperty(i)){
                  $.ajax(xhrQ[i]);
                }
              }
              window._xhrQ = [];
            }
          });
        }
        // if post request, then queue
        if (s.type != 'GET'){
          _xhrQ.push(s);
          xhr.abort();
          return false;
        }
      }

      if (s.data) {
        s.data = s.data + "&";
      } else {
        s.data = "";
        /* if there was no data, $ didn't set the content-type */
        xhr.setRequestHeader("Content-Type", s.contentType);
      }
      s.data = s.data + encodeURIComponent(window._auth_token_name) +
        "=" + encodeURIComponent(window._auth_token);
    });
    /*$$.makeExternalLinksOpenInNewTab(jQuery);*/
    $$.addRedirectURLForLogin();
    $$.flashNoticeClose();
    $$.handleSearchFields();
    $$.initTagTextBox();
    $$.setLanguageSelector();
    $('.toggle_text').toggleText();
    if($$.dev) {
      $$.checkGlobals();
    }
    $$.autosuggest_top();

    $$.topNavUploadTrack();
    $$.topNavClickTrack();

    // extend _uv_id cookie to 2 years from now
    var parentDomain = window.location.host.match(/\..*/);
    if(parentDomain) {
      parentDomain = parentDomain[0];
      var _uv_id = cookie('_uv_id');
      // If no cookie, use the value generated and stored in
      // $.slideshareEventManager.stats.viewer_id
      !_uv_id && $.slideshareEventManager && $.slideshareEventManager.stats &&
        $.slideshareEventManager.stats.viewer_id &&
        (_uv_id = $.slideshareEventManager.stats.viewer_id);

      // If slideshareEventManager doesn't exist yet, or viewer_id hasn't been
      // set, then generate a unique viewer id here
      !_uv_id && (_uv_id = Math.ceil(Math.random()*100000000));

      window.cookie('_uv_id', _uv_id, {'expires':730, 'path': '/', 'domain': parentDomain});
    }

    $('body').on('click', '.modal-backdrop', function() {
      window._gaq.push(["_trackEvent", "Signup", "thickbox_closed_layer_clicked"]);
    });

    $('.pagination').find('li.disabled, li.active').children().click(function(e) {
      e.preventDefault();
    });
  });

  $(window).load(function() {
    $('.mobile-version-container').click(function() {
      window._gaq.push(['_trackEvent','MobileApp','switchToMobile']);
    });
  });

  slideshare_object.addAfterLoginEvent = function(config){
    // Add cookie for initiating like on server once login is success
    var jsonString = JSON.stringify(config);
    cookie("after_login_action", jsonString, { path:'/' });
  };

  // Favorites
  slideshare_object.bind_favorites = function(parentSelector){
    var selectors = '.j-favorited, .j-favorite';
    $(parentSelector).delegate(selectors, "click", selectors, slideshare_object.favorites_handler);
  };

  slideshare_object.favorites_handler = function(e){
    var elmt = $(this);
    if (slideshare_object.user.loggedin) {
      e.preventDefault();
      e.stopPropagation();
      var isFavorited = elmt.hasClass('j-favorite');
      var ssUrl = elmt.data('ss-url');
      var favoriteAction = isFavorited ? slideshare_object.favorites.create_url : slideshare_object.favorites.delete_url;
      var eventCategory = slideshare_object.get_favorite_event_category(elmt);
      var config = {
        element: $(this),
        url: favoriteAction,
        selectors: e.data,
        event_category: eventCategory,
        is_favorited: isFavorited,
        ss_url: ssUrl,
        data: {
          slideshow_id: elmt.attr('data-ssid'),
          user_id: slideshare_object.user.id,
          source: 'slideviewer',
          response_type: 'json'
        }
      };
      slideshare_object.favorites_call_handler(config);
    } else {
      var eventConfig = {
        "event" : "like",
        "data" : { "slideshow_id" : elmt.attr('data-ssid') }
      };
      slideshare_object.addAfterLoginEvent(eventConfig);
    }
  };

  /* Toggle the like action-btn from j-favorite to j-favorited,
   * or visa-versa OR sets the state to one of them as defined in params.
   * Also updates some auxiliary attributes of the button
   *
   * Parameters:
   * elem <selector>    the action-btn to be toggled
   * like_it   if set to true - force likes, if set to false - force unlikes, otherwise toggles state
   */
  slideshare_object.toggleLikeButton = function(elem, like_it) {
    // Some older pages use 2 separate like buttons, one for like of class
    // j-favorite, and one for unlike of class j-favorited: the newer
    // model is to simply have one button and toggle its class.  This
    // if case is for the older legacy code.
    var $elem = $(elem);
    if ($elem.siblings(".j-favorite, .j-favorited").length > 0) {
      if ($elem.is(':visible')) {
        $elem.css('display', 'none');
      } else {
        $elem.css('display', '');
      }
    } else {
      var wasFavorited;
      if(typeof(like_it) === "boolean"){
        wasFavorited = !like_it;
      }
      else{
        wasFavorited = $elem.hasClass('j-favorited');
      }
      $elem.removeClass('j-favorite j-favorited');
      if (wasFavorited) {
        $elem.addClass('j-favorite');
        $elem.attr({'ga' : 'like', 'title' : 'Like this SlideShare'});
        $elem.children('.action-btn-text').text('Like');
      } else {
        $elem.addClass('j-favorited');
        $elem.attr({'ga' : 'unlike', 'title' : 'Unlike this SlideShare'});
        $elem.children('.action-btn-text').text('Liked');
      }
    }
    if($elem.hasClass("favorite-newsfeed")) {
      $elem.toggleClass('liked notranslate_title j-favoriteNewsfeed favorite_cta ');
    }
  };

  /* Wrapper function for slideshare_object.toggleLikeButton with an
   * additional parameter required by jQuery's "each" function
   *
   * Parameters:
   *   index    the index of the elem in the array of elements to be toggled.
   *            The function is used as a callback in jQuery's "each" fxn, so
   *            though it is not used here, we need to have it as a parameter
   *            for the fxn signatures to match
   *
   *   elem     the action-btn to be toggled
   */
  var toggleLikeButton = function(index, elem) {
    slideshare_object.toggleLikeButton(elem);
  };

  slideshare_object.favorites_call_handler = function(config){
    var eventAction = config.is_favorited ? 'favorite_click' : 'unfavorite_click';
    window._gaq.push(['_trackEvent', config.event_category, eventAction]);
    var initialStatus = config.is_favorited ? 'unfavorited' : 'favorited';
    var toggleLikeFn = function() {
      var $slideshow = config.element.closest('.iso_slideshow');
      if ($slideshow && $slideshow.length > 0) {
        $.each($slideshow.find(config.selectors), toggleLikeButton);
      } else {
        $.each(config.element.parent().find(config.selectors), toggleLikeButton);
      }
    };
    toggleLikeFn();
    $.ajax({
      url: config.url,
      data: config.data,
      dataType: 'json',
      type: 'POST',
      success: function(response){
        if(response.success){
          var currentStatus = config.element.hasClass('j-favorite') ? 'unfavorited' : 'favorited';
          if (initialStatus === currentStatus){
            toggleLikeFn();
          }
          var eventAction = config.is_favorited ? 'favorite_click_success' : 'unfavorite_click_success';
          window._gaq.push(['_trackEvent', config.event_category, eventAction]);
        } else {
          // In failure condition
          toggleLikeFn();
          window.console && console.log(response.message);
        }
      },
      error: function(data){
        toggleLikeFn();
        window.console && console.log(data);
      }
    });
  };



  slideshare_object.get_favorite_event_category = function(sourceElement){
    var eventCategory = '';
    if(sourceElement.parents('ul.thumbnails').size() > 0){
      eventCategory = 'list_page';
    } else if(sourceElement.parents('aside.j-related-more-tab').size() > 0){
      eventCategory = 'bigfoot_slideview';
    } else if(document.location.pathname === '/'){
      eventCategory = 'homepage';
    }
    return eventCategory;
  };

  slideshare_object.favorites_status_update = function(){
    var sids = [];
    favoriteElements = $('a.j-favorite');
    favoriteElements.each( function(){
      sids.push( $(this).attr('data-ssid') );
    });
    $.ajax({
      type: "GET",
      url: slideshare_object.favorites && slideshare_object.favorites.user_favorites ?
        slideshare_object.favorites.user_favorites :
        "/favorite/get_favorites",
      data: 'slideshow_id='+sids.join(','),
      dataType: "json",
      success: function(data){
        if (data && $.isArray(data.favorited) && data.favorited.length) {
          var filter = '[data-ssid=' + data.favorited.join('],[data-ssid=') + ']';
          favoriteElements.filter(filter).each(function(){
            $.each($(this).parent().children('.favorite-cta, .j-favorite.action-btn, .j-favorited.action-btn'), function(index, el){
              //force like instead of toggle
              slideshare_object.toggleLikeButton(el, true);
            });
          });
        }
      }
    });
  };

  slideshare_object.add_signin_link = function(selector){
    $(selector).each(function(){
      var href = "/login";
      if(document.location.pathname === '/') {
        href += "?from_source=" + encodeURIComponent(document.location.href) + "&login_source=homepage.popup.like&from=favorite";
      }
      else {
        href += "?from_source=" + encodeURIComponent(document.location.href);
      }

      if (!$(this).hasClass('void_fancybox')) {
        var loginModalAttr = { "href": href, "data-target": "#login_modal" };
        $(this).attr(loginModalAttr);
      } else if ($(this).hasClass('mobile')) {
        $(this).attr("href", "/mobile" + href);
      } else {
        $(this).attr("href", href);
      }
    });
  };

  slideshare_object.add_login_source = function(selector, login_source){
    $(selector).each(function(){
      var href = $(this).attr("href") + "&login_source=" + login_source;
      $(this).attr("href", href);
    });
  };

  slideshare_object.inIframe = function () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };

  // jQuery Cross Domain Messaging Plugin
  // This allows us to register multiple callbacks to receiveMessage method
  // so we can split the receiveMessage responsibility
  $$.extend($$, {
    // List of receivers
    crossDomainMessageReceivers: [],

    // jQuery Cross Domain Messaging Plugin initialization
    initCrossDomainMessaging: function() {
      // jQuery.receiveMessage(callback [, source_origin ] [, delay ]);
      // callback (Function) executes whenever a jQuery.postMessage message
      // is received, source_origin (String) If window.postMessage is available
      // and this value is not equal to the event.origin property, the callback
      // will not be called. delay (Number) An optional zero-or-greater delay
      // in milliseconds.
      if ($.isFunction($.receiveMessage)) {
        $.receiveMessage(
          $.proxy(function(event) {
            $(this.crossDomainMessageReceivers).each(function(index, receiver) {
              receiver(event.data);
            });
          }, this), validateOrigin
        );
      }
    },

    // Register a jQuery Cross Domain Message receiver
    registerMessageReceiver: function(receiver) {
      this.crossDomainMessageReceivers.push(receiver);
    }
  });

  function validateOrigin(origin) {
    return origin === ('http://' + location.host) || origin === ('https://' + location.host);
  }

  $$.initCrossDomainMessaging();

  // Gets the pagekey for the current page
  slideshare_object.getPageKey = function() {
    return /^pagekey-(.+)$/.exec(document.body.id)[1];
  };

})(slideshare_object, jQuery);
