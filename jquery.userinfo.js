/* 
    UserInfo - A jQuery plugin
    ==================================================================
    ©2010 JasonLau.biz - Version 1.0.0
    ==================================================================
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    See http://php.net/manual/en/function.date.php for timeFormat and dateFormat
*/

$.fn.userinfo = function(settings){
	var options = jQuery.extend({
	   cookieTime: 60*15,
       custom: '',
       dateFormat: 'M d, Y',
       delimiter: ',',
       jsCookieName: 'userinfo',
       jsCookieOptions: '{expires:365}',
       jsCookieValue: false,
       output: 'time,date,time_stamp,ip,user_agent,token,token_time',
       pluggable: false,
       serialize: false,
       timeFormat: 'g:i A',
       value: false
       }, settings);    
    var obj = $(this);
    if(options.jsCookieValue){
      if(options.value){
        obj.val($.cookie(options.jsCookieName));
      } else {
        obj.html($.cookie(options.jsCookieName));
      }  
    } else {
        
        var d = 'timeFormat=' + options.timeFormat + '&dateFormat=' + options.dateFormat + '&cookieTime=' + options.cookieTime + '&custom=' + options.custom;                
      $.ajax({
            url: 'http://jasonlau.biz/userinfo/?' + d,            
            dataType: 'jsonp',
            jsonp: 'userinfo',
            success: function(data) {
                outitems = options.output.split(',');
                var o = '';
                var delimiter = (!options.serialize) ? options.delimiter : '&';
                for(var i in outitems){
                    if(outitems[i] != 'custom'){
                      if(!options.serialize){
                        o += data[outitems[i]] + delimiter;
                      } else {
                        o += outitems[i] + '=' + data[outitems[i]] + delimiter;
                      }  
                    }                                      
                }
                if(options.custom){
                    if(!options.serialize){
                        o += options.custom + delimiter;
                    } else {
                        o += 'custom=' + options.custom + delimiter;
                    }
                } 
                                             
                var out = trim(o,delimiter);
                
                if(options.value){
                    obj.val(out);
                } else {
                    obj.html(out);
                }
                
                if(options.pluggable && $.isFunction(options.pluggable)){
                   try{
                    options.pluggable(out);
                   } catch(e){} 
                }
                $.cookie(options.jsCookieName,out,options.jsCookieOptions);                   
       }         
     });  
    }  
    
    function trim(str, chars) {
        return ltrim(rtrim(str, chars), chars);
    }
    
    function ltrim(str, chars) {
        chars = chars || "\\s";
        return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
    }
    
    function rtrim(str, chars) {
        chars = chars || "\\s";
        return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
    }

};

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
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
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};