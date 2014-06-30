}
}
}
sortFlag = !sortFlag;
}
document.getElementById("flightnumber").value = "";
document.getElementById("departFrom").value = "";
document.getElementById("arriveTo").value = "";
var onkeypress = function() {
    dojo.addOnLoad(function() {
            dojo.require("dojo/dom-attr");
            dojo.require("dojo/NodeList-manipulate");
            dojo.require("dojo/NodeList-traverse");
            if (dojo.isIE) {
                var flight_icons = dojo.query(".FlightSearch>div img");
                dojo.forEach(flight_icons, function(elm, idx) {
                    dojo.style(elm, {
                        "position": "relative",
                        "top": "9px"
                    });
                });
                var elmPlc = dojo.query(".FlightSearch>div input");
                dojo.forEach(elmPlc, function(elm, idx) {
                    if (idx === 0) {
                        return false;
                    } else {
                        elm.placeholder = "";
                        elm.value = "";
                        dojo.removeAttr(elm, "class");
                    }
                });
                dojo.style(dojo.byId("list-of-deps"), {
                    "top": "34px"
                });
                dojo.style(dojo.byId("list-of-arrs"), {
                    "top": "34px"
                });
            }
            //yymmdd- format date//
            var dateFormat = function() {
                var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
                    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                    timezoneClip = /[^-+\dA-Z]/g,
                    pad = function(val, len) {
                        val = String(val);
                        len = len || 2;
                        while (val.length < len)
                            val = "0" + val;
                        return val;
                    };
                // Regexes and supporting functions are cached through closure
                return function(date, mask, utc) {
                    var dF = dateFormat;
                    // You can't provide utc if you skip other args (use the "UTC:" mask
                    // prefix)
                    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                        mask = date;
                        date = undefined;
                    }
                    // Passing date through Date applies Date.parse, if necessary
                    date = date ? new Date(date) : new Date;
                    if (isNaN(date))
                        throw SyntaxError("invalid date");
                    mask = String(dF.masks[mask] || mask || dF.masks["default"]);
                    // Allow setting the utc argument via the mask
                    if (mask.slice(0, 4) == "UTC:") {
                        mask = mask.slice(4);
                        utc = true;
                    }
                    var _ = utc ? "getUTC" : "get",
                        d = date[_ + "Date"](),
                        D = date[_ + "Day"](),
                        m = date[_ + "Month"](),
                        y = date[_ + "FullYear"](),
                        H = date[_ + "Hours"](),
                        M = date[_ + "Minutes"](),
                        s = date[_ + "Seconds"](),
                        L = date[_ + "Milliseconds"](),
                        o = utc ? 0 : date.getTimezoneOffset(),
                        flags = {
                            d: d,
                            dd: pad(d),
                            ddd: dF.i18n.dayNames[D],
                            dddd: dF.i18n.dayNames[D + 7],
                            m: m + 1,
                            mm: pad(m + 1),
                            mmm: dF.i18n.monthNames[m],
                            mmmm: dF.i18n.monthNames[m + 12],
                            yy: String(y).slice(2),
                            yyyy: y,
                            h: H % 12 || 12,
                            hh: pad(H % 12 || 12),
                            H: H,
                            HH: pad(H),
                            M: M,
                            MM: pad(M),
                            s: s,
                            ss: pad(s),
                            l: pad(L, 3),
                            L: pad(L > 99 ? Math.round(L / 10) : L),
                            t: H < 12 ? "a" : "p",
                            tt: H < 12 ? "am" : "pm",
                            T: H < 12 ? "A" : "P",
                            TT: H < 12 ? "AM" : "PM",
                            Z: utc ? "UTC" : (String(date).match(timezone) || [""])
                                .pop().replace(timezoneClip, ""),
                            o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                            S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                        };
                    return mask.replace(token, function($0) {
                        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
                    });
                };
            }();
            // Some common format strings
            dateFormat.masks = {
                "default": "ddd mmm dd yyyy HH:MM:ss",
                shortDate: "m/d/yy",
                mediumDate: "mmm d, yyyy",
                longDate: "mmmm d, yyyy",
                fullDate: "dddd, mmmm d, yyyy",
                shortTime: "h:MM TT",
                mediumTime: "h:MM:ss TT",
                longTime: "h:MM:ss TT Z",
                isoDate: "yyyy-mm-dd",
                isoTime: "HH:MM:ss",
                isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
                isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
            };
            // Internationalization strings
            dateFormat.i18n = {
                dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday",
                    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
                    "Saturday"
                ],
                monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
                    "Sep", "Oct", "Nov", "Dec", "January", "February", "March",
                    "April", "May", "June", "July", "August", "September",
                    "October", "November", "December"
                ]
            };
            // For convenience...
            var today = dateFormat(new Date(), "yymmdd").toUpperCase();
            var tomday = dateFormat(new Date().getTime() + 86400000, "yymmdd").toUpperCase();
            Date.prototype.format = function(mask, utc) {
                return dateFormat(this, mask, utc);
            };

            function addColons(str) {
                var result = '';
                while (str.length > 0) {
                    result += str.substring(0, 2) + ':';
                    str = str.substring(2);
                }
                return result;
            }
            var dt = new Date();
            var tom = dt.setTime(dt.getTime() + 86400000);
            var isFlightFound = true;
            dojo.ready(function() {
                    var x = dojo.byId("searchRe");
                    var flightVal = dojo.byId("flightnumber");
                    var tomtext = dojo.byId("tomtext");
                    var flag = false;
                    dojo.query("#displayer").empty();
                    dojo.query("#displayer").append((dateFormat((new Date()), "dddd dS mmmm yyyy")).toUpperCase());
                    dojo.query("#displayer1").empty();
                    dojo.query("#displayer1").append((dateFormat((new Date(tom)), "dddd dS mmmm yyyy")).toUpperCase());
                    var eventHandle = {
                        browserMode: function() {
                            var evt = null;
                            if (dojo.isIE) {
                                evt = window.event
                            } else if (dojo.isFF) {
                                evt = window.Event
                            } else if (dojo.isChrome) {
                                evt = event;
                            }
                        }
                    }
                    //UTIL Function
                    var utils = {
                        LOADING_PLACEHOLDER: dojo.byId("loading-flight-results"),
                        LOADING_ICON: "<img src='images/loading-3-anim-transparent.gif' alt='Loading..'/>",
                        requestDa: {
                            url: "",
                            fieldId: "",
                            callJson: function() {
                                dojo.xhrGet({
                                    url: this.url,
                                    fieldId: this.fieldId,
                                    handleAs: "json",
                                    load: function(jsonData) {
                                        utils.handleJsonObj(this.url, this.fieldId, jsonData);
                                    },
                                    error: function() {}
                                });
                            }
                        },
                        handleJsonObj: function(url, fieldId, obj) {
                            this.call(url, fieldId, obj);
                        },
                        call: function(url, fieldId, jsonData) {
                            flvalue = flightVal.value;
                            var flightNumberSpaced;
                            if (flvalue.indexOf("TOM") == -1) {
                                flvalue = "TOM" + flvalue;
                            }
                            this.afterResults(url, fieldId, jsonData);
                        },
                        enableShowAllLink: function(url) {
                            if (url == "allDepartures") {
                                dojo.style(dojo.byId("allDeps"), {
                                    "color": "black"
                                }); //#8bbce3
                                dojo.style(dojo.byId("allArvs"), {
                                    "color": "#8bbce3"
                                }); //#8bbce3
                                dojo.style(dojo.query(".allFlights .flightImg")[0], {
                                    background: "url(images/FlightStatus-Ico.png) no-repeat -10px -135px",
                                    width: "11px",
                                    height: "11px"
                                });
                                dojo.style(dojo.query(".allFlights .flightImg1")[0], {
                                    background: "url(images/FlightStatus-Ico.png) no-repeat -10px -156px",
                                    width: "11px",
                                    height: "11px"
                                });
                            } else if (url == "allArrivals") {
                                dojo.style(dojo.byId("allArvs"), {
                                    "color": "black"
                                }); //#8bbce3
                                dojo.style(dojo.byId("allDeps"), {
                                    "color": "#8bbce3"
                                }); //#8bbce3
                                dojo.style(dojo.query(".allFlights .flightImg1")[0], {
                                    background: "url(images/FlightStatus-Ico.png) no-repeat -10px -177px",
                                    width: "11px",
                                    height: "11px"
                                });
                                dojo.style(dojo.query(".allFlights .flightImg")[0], {
                                    background: "url(images/FlightStatus-Ico.png) no-repeat -10px -114px",
                                    width: "11px",
                                    height: "11px"
                                });
                            } else {
                                dojo.style(dojo.byId("allDeps"), {
                                    "color": "#8bbce3"
                                });
                                dojo.style(dojo.byId("allArvs"), {
                                    "color": "#8bbce3"
                                });
                                dojo.style(dojo.query(".allFlights .flightImg")[0], {
                                    background: "url(images/FlightStatus-Ico.png) no-repeat -10px -114px",
                                    width: "11px",
                                    height: "11px"
                                });
                                dojo.style(dojo.query(".allFlights .flightImg1")[0], {
                                    background: "url(images/FlightStatus-Ico.png) no-repeat -10px -156px",
                                    width: "11px",
                                    height: "11px"
                                });
                            }
                        },
                        afterResults: function(url, fieldId, jsonData) {
                            this.enableShowAllLink(url.split("/")[0]);
                            //url = url2;
                            dojo.byId("loading-flight-results").innerHTML = "";
                            var departFrom = dojo.byId("departFrom");
                            var deprtsId = dojo.byId("list-of-deps");
                            var arriveTo = dojo.byId("arriveTo");
                            var arvlsId = dojo.byId("list-of-arrs");
                            //var nonUKHeader = '<li class="disable-list-select">- - - - - - - - - - - - - - -</li>';
                            if (fieldId == "departFrom") {
                                if (arriveTo.value.length == 0) {
                                    var deptAutodetails = jsonData.departureAutoSuggestData;
                                    var deptsAutoDiv = "<ul>";
                                    var UKList = "";
                                    var NonUKList = "";
                                    for (var i = 0; i < deptAutodetails.length; i++) {
                                        if (deptAutodetails[i].depAirPortCountryCode == "GBR")
                                            UKList += '<li>' + deptAutodetails[i].depAirPortInfo + '</li>';
                                        else {
                                            NonUKList += '<li>' + deptAutodetails[i].depAirPortInfo + '</li>';
                                        }
                                    }
                                    deptsAutoDiv += UKList + NonUKList;
                                    deptsAutoDiv += "</ul>";
                                    dojo.byId("list-of-deps").innerHTML = deptsAutoDiv;
                                    dojo.forEach(dojo.query("#list-of-deps li"), function(elm, i) {
                                        dojo.connect(elm, "onclick", function(evt) {
                                            departFrom.value = this.innerText || this.textContent;
                                            dojo.style(deprtsId, {
                                                "display": "none"
                                            });
                                            //this.innerText = "";
                                            saerchTypes(departFrom.id);
                                        });
                                    });
                                    _searchDeptCodes("", eventHandle.browserMode(), 0);
                                } else {
                                    //alert(url)
                                    var atoSuggestdepts = jsonData.departureAutoSuggestData;
                                    var deptsAutoDiv = "<ul>";
                                    var UKList = "";
                                    var NonUKList = "";
                                    for (var i = 0; i < atoSuggestdepts.length; i++) {
                                        if (atoSuggestdepts[i].depAirPortCountryCode == "GBR")
                                            UKList += '<li>' + atoSuggestdepts[i].depAirPortInfo + '</li>';
                                        else {
                                            NonUKList += '<li>' + atoSuggestdepts[i].depAirPortInfo + '</li>';
                                        }
                                        //deptsAutoDiv+= "<li>"+atoSuggestdepts[i].depAirPortInfo;+"</li>";
                                    }
                                    deptsAutoDiv += UKList + NonUKList;
                                    deptsAutoDiv += "</ul>";
                                    dojo.byId("list-of-deps").innerHTML = deptsAutoDiv;
                                    dojo.forEach(dojo.query("#list-of-deps li"), function(elm, i) {
                                        dojo.connect(elm, "onclick", function(evt) {
                                            departFrom.value = this.innerText || this.textContent;
                                            dojo.style(deprtsId, {
                                                "display": "none"
                                            });
                                            //this.innerText = "";
                                            saerchTypes(departFrom.id);
                                        });
                                    });
                                    _searchDeptCodes("", eventHandle.browserMode(), 0);
                                }
                            } else if (fieldId == "arriveTo") {
                                if (departFrom.value.length == 0) {
                                    var arriveTo = dojo.byId("arriveTo");
                                    var arvlsId = dojo.byId("list-of-arrs");
                                    var arrAutodetails = jsonData.arrivalAutoSuggestData;
                                    var arrsAutoDiv = "<ul>";
                                    var UKList = "";
                                    var NonUKList = "";
                                    for (var i = 0; i < arrAutodetails.length; i++) {
                                        if (arrAutodetails[i].arrAirPortCountryCode == "GBR")
                                            UKList += '<li>' + arrAutodetails[i].arrAirPortInfo + '</li>';
                                        else {
                                            NonUKList += '<li>' + arrAutodetails[i].arrAirPortInfo + '</li>';
                                        }
                                        //arrsAutoDiv+= "<li>"+arrAutodetails[i].arrAirPortInfo+"</li>";
                                    }
                                    arrsAutoDiv += UKList + NonUKList;
                                    arrsAutoDiv += "</ul>";
                                    dojo.byId("list-of-arrs").innerHTML = arrsAutoDiv;
                                    dojo.forEach(dojo.query("#list-of-arrs li"), function(elm, i) {
                                        dojo.connect(elm, "onclick", function(evt) {
                                            arriveTo.value = this.innerText || this.textContent;
                                            dojo.style(arvlsId, {
                                                "display": "none"
                                            });
                                            //this.innerText = "";
                                            saerchTypes(arriveTo.id);
                                        });
                                    });
                                    _searchArrCodes("", window.Event || event, 0);
                                } else {
                                    var atoSuggestArvls = jsonData.arrivalAutoSuggestData;
                                    var arrsAutoDiv = "<ul>";