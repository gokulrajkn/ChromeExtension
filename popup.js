
            'use strict';

            function addNewTask() {
                var data = new Array();
                var cap;
                var cbh = document.getElementById('taskpaneltable');
                var val = document.getElementsByName("addnewtask")[0].value;
                document.getElementsByName("addnewtask")[0].value = "";
                if (val !== "") {
                    chrome.storage.sync.get('bucketlist', function (result) {
                        if (result.bucketlist) {
                            data = result.bucketlist;
                        }
                        data.push(val);
                        chrome.storage.sync.set({'bucketlist': data}, function () {
                            //var task = "";
                            var divr = document.createElement('tr');
                            divr.setAttribute("name", "tableRow" + parseInt(data.length + 1).toString());
                            cbh.appendChild(divr);
                            var divf = document.createElement('td');
                            divf.setAttribute("width", 290);
                            divr.appendChild(divf);
                            var cbl = document.createElement('label');
                            divf.appendChild(cbl);
                            var cb = document.createElement('input');
                            cb.type = 'checkbox';
                            cb.addEventListener('click', addDoneTasks, false);
                            cbl.appendChild(cb);
                            cb.name = val;
                            cb.value = data.length + 1;
                            cbl.appendChild(document.createTextNode(val));
                            var divd = document.createElement('td');
                            divr.appendChild(divd);
                            var cbbt = document.createElement('button');
                            cbbt.className = "del-button";
                            cbbt.name = "delButton" + parseInt(data.length + 1).toString();
                            cbbt.addEventListener('click', deleteTask, false);
                            divd.appendChild(cbbt);
                            cbbt.appendChild(document.createTextNode(""));
                            if (data.length > 0) {
                                chrome.browserAction.setBadgeText({text: data.length.toString()});
                            } else {
                                chrome.browserAction.setBadgeText({text: ""});
                            }
                        });
                    });
                }
            }

            function main() {
            }

            function bodyload(isfromCollapsableBtn) {
                var data = new Array();
                var data1 = new Array();
                var cap;
                var dtp;
                if (isfromCollapsableBtn) {
                } else {
                    var cbh = document.getElementById('taskpaneltable');
                    while (cbh.hasChildNodes()) {
                        cbh.removeChild(cbh.lastChild);
                    }
                    chrome.storage.sync.get('bucketlist', function (Ele) {
                        if (Ele.bucketlist) {
                            data = Ele.bucketlist;
                        }
                        if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                cap = data[i];
                                var divr = document.createElement('tr');
                                divr.setAttribute("name", "tableRow" + parseInt(i + 1).toString());
                                cbh.appendChild(divr);
                                var divf = document.createElement('td');
                                divf.setAttribute("width", 290);
                                divr.appendChild(divf);
                                var cbl = document.createElement('label');
                                divf.appendChild(cbl);
                                var cb = document.createElement('input');
                                cb.addEventListener('click', addDoneTasks, false);
                                cb.type = 'checkbox';
                                cbl.appendChild(cb);
                                cb.name = cap;
                                cb.value = i + 1;
                                cbl.appendChild(document.createTextNode(cap));
                                var divd = document.createElement('td');
                                divr.appendChild(divd);
                                var cbbt = document.createElement('button');
                                cbbt.className = "del-button";
                                cbbt.type = "button";
                                cbbt.name = "delButton" + parseInt(i + 1).toString();
                                cbbt.addEventListener('click', deleteTask, false);
                                divd.appendChild(cbbt);
                                cbbt.appendChild(document.createTextNode(""));
                            }
                            chrome.browserAction.setBadgeText({text: data.length.toString()});
                        } else {
                            chrome.browserAction.setBadgeText({text: ""});
                        }
                    });
                }
                var dtt = document.getElementById('doneTaskTable');
                while (dtt.hasChildNodes()) {
                    dtt.removeChild(dtt.lastChild);
                }
                chrome.storage.sync.get('donetasks', function (Ele) {
                    if (Ele.donetasks) {
                        data1 = Ele.donetasks;
                    }
                    if (data1.length > 0) {
                        for (var i = 0; i < data1.length; i++) {
                            dtp = data1[i];
                            var divr = document.createElement('tr');
                            divr.setAttribute("name", "dtableRow" + parseInt(i + 1).toString());
                            dtt.appendChild(divr);
                            var divf = document.createElement('td');
                            divf.setAttribute("width", 290);
                            divr.appendChild(divf);
                            var cbl = document.createElement('label');
                            divf.appendChild(cbl);
                            cbl.appendChild(document.createTextNode(dtp.task + " @" + dtp.date));
                            var divd = document.createElement('td');
                            divr.appendChild(divd);
                            var cbbt = document.createElement('button');
                            cbbt.className = "del-button";
                            cbbt.type = "button";
                            cbbt.name = "ddelButton" + parseInt(i + 1).toString();
                            cbbt.addEventListener('click', deleteDoneTasks, false);
                            divd.appendChild(cbbt);
                            cbbt.appendChild(document.createTextNode(""));
                        }
//                        chrome.browserAction.setBadgeText({text: data1.length.toString()});
                    } else {
//                        chrome.browserAction.setBadgeText({text: ""});
                    }
                });
            }

            function deleteTask() {
                var curDelButtonName = this.name;
                var curtask = curDelButtonName.replace("delButton", "");
                chrome.storage.sync.get('bucketlist', function (obj) {
                    var tasks = obj.bucketlist;
                    if (curtask > 0) {
                        var taskName = tasks[parseInt(curtask) - 1];
                        var curIdx = tasks.indexOf(taskName);
                        if (curIdx !== null) {
                            tasks.splice(curIdx, 1);
                        }
                    }
                    chrome.storage.sync.set({'bucketlist': tasks}, function () {
                        fadeOut(document.getElementsByName("tableRow" + curtask)[0], 2000, true);
                        if (tasks.length > 0) {
                            chrome.browserAction.setBadgeText({text: tasks.length.toString()});
                        } else {
                            chrome.browserAction.setBadgeText({text: ""});
                        }
                    });
                });
            }

            function deleteDoneTasks() {
                var curDelButtonName = this.name;
                var curtask = curDelButtonName.replace("ddelButton", "");
                chrome.storage.sync.get('donetasks', function (obj) {
                    var tasks = obj.donetasks;
                    if (curtask > 0) {
                        var taskName = tasks[parseInt(curtask) - 1];
                        var curIdx = tasks.indexOf(taskName);
                        if (curIdx !== null) {
                            tasks.splice(curIdx, 1);
                        }
                    }
                    chrome.storage.sync.set({'donetasks': tasks}, function () {
                        fadeOut(document.getElementsByName("dtableRow" + curtask)[0], 2000, true, true);
                        if (tasks.length > 0) {
//                            chrome.browserAction.setBadgeText({text: tasks.length.toString()});
                        } else {
//                            chrome.browserAction.setBadgeText({text: ""});
                        }
                    });
                });
            }


            function fadeOut(elem, speed, isRemoved, isFromDoneTaskDelete) {
                var taskName = elem.innerText;
                if (isRemoved) {
                } else {
                    chrome.storage.sync.get('bucketlist', function (obj) {
                        var tasks = obj.bucketlist;
                        if (taskName && taskName !== null && taskName !== "") {
                            var curIdx = tasks.indexOf(taskName);
                            if (curIdx !== null) {
                                tasks.splice(curIdx, 1);
                            }
                        }
                        chrome.storage.sync.set({'bucketlist': tasks}, function () {
                            elem.querySelector('label').css('text-decoration', 'line-through');
                            fadeOut(elem, 2000);
                            if (tasks.length > 0) {
                                chrome.browserAction.setBadgeText({text: tasks.length.toString()});
                            } else {
                                chrome.browserAction.setBadgeText({text: ""});
                            }
                        });
                    });
                }
                var outInterval = setInterval(function () {
                    elem.style.opacity -= 0.02;
                    if (elem.style.opacity <= 0) {
                        clearInterval(outInterval);
                        if (isFromDoneTaskDelete) {
                            document.getElementById('doneTaskTable').removeChild(elem);
                        } else {
                            document.getElementById('taskpaneltable').removeChild(elem);
                        }
                    }
                }, speed / 50);

            }

            function addDoneTasks() {
                var h = "";
                var taskName = this.name;
                var row;
                var curtask;
                if (this.parentElement && this.parentElement.parentElement && this.parentElement.parentElement.parentElement
                        && this.parentElement.parentElement.parentElement && this.parentElement.parentElement.parentElement.getAttribute("name")) {
                    row = this.parentElement.parentElement.parentElement.getAttribute("name");
                    curtask = row.replace("tableRow", "");
                    console.log("Success");
                }
                chrome.storage.sync.get('bucketlist', function (obj) {
                    var tasks = obj.bucketlist;
                    if (taskName && taskName !== null && taskName !== "") {
                        h = taskName;
                        var curDate = new Date();
                        var JsonObj = []
                        var task = '{ "task":"' + h + '" , "date":"' + formatDate(curDate) + '" }';
                        var jsonObj = JSON.parse(task)
                        chrome.storage.sync.get('donetasks', function (ob) {
                            var data = ob.donetasks;
                            if (data && data[0] && Object.prototype.toString.call(data) === "[object Array]") {
                                data.push(jsonObj);
                                console.log(data);
                            } else {
                                JsonObj.push(jsonObj);
                                data = JsonObj;
                            }
                            chrome.storage.sync.set({'donetasks': data}, function () {

                            })
                        })
                    }
                    var curIdx = tasks.indexOf(taskName);
                    if (curIdx !== null) {
                        tasks.splice(curIdx, 1);
                    }
                    chrome.storage.sync.set({'bucketlist': tasks}, function () {
                        if (curtask) {
                            fadeOut(document.getElementsByName("tableRow" + curtask)[0], 2000, true);
                        }
                        if (tasks.length > 0) {
                            chrome.browserAction.setBadgeText({text: tasks.length.toString()});
                        } else {
                            chrome.browserAction.setBadgeText({text: ""});
                        }
                        bodyload(true);
                    });
                });
            }

            document.addEventListener('DOMContentLoaded', function () {
                document.querySelector('#commonaddbtn').addEventListener('click', addNewTask);
                document.querySelector('#doneTaskButton').addEventListener('click', collapsabelExpand);
                document.querySelector('#addnewtask_txtfield').addEventListener("keydown", function (e) {
                    if (e.keyCode === 13) {
                        addNewTask();
                    }
                });
                main();
            });

            window.onload = function () {
                bodyload();
            };

            function collapsabelExpand() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            }

            function formatDate(date) {
                var d = new Date(date),
                        month = '' + (d.getMonth() + 1),
                        day = '' + d.getDate(),
                        year = d.getFullYear(),
                        hours = d.getHours(),
                        min = d.getMinutes(),
                        sec = d.getSeconds();
                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                return [hours, min, sec].join(':') + " " + [day, month, year].join('-');
            }


        
            'use strict';

            function addNewTask() {
                var data = new Array();
                var cap;
                var cbh = document.getElementById('taskpaneltable');
                var val = document.getElementsByName("addnewtask")[0].value;
                document.getElementsByName("addnewtask")[0].value = "";
                if (val !== "") {
                    chrome.storage.sync.get('bucketlist', function (result) {
                        if (result.bucketlist) {
                            data = result.bucketlist;
                        }
                        data.push(val);
                        chrome.storage.sync.set({'bucketlist': data}, function () {
                            //var task = "";
                            var divr = document.createElement('tr');
                            divr.setAttribute("name", "tableRow" + parseInt(data.length + 1).toString());
                            cbh.appendChild(divr);
                            var divf = document.createElement('td');
                            divf.setAttribute("width", 290);
                            divr.appendChild(divf);
                            var cbl = document.createElement('label');
                            divf.appendChild(cbl);
                            var cb = document.createElement('input');
                            cb.type = 'checkbox';
                            cb.addEventListener('click', addDoneTasks, false);
                            cbl.appendChild(cb);
                            cb.name = val;
                            cb.value = data.length + 1;
                            cbl.appendChild(document.createTextNode(val));
                            var divd = document.createElement('td');
                            divr.appendChild(divd);
                            var cbbt = document.createElement('button');
                            cbbt.className = "del-button";
                            cbbt.name = "delButton" + parseInt(data.length + 1).toString();
                            cbbt.addEventListener('click', deleteTask, false);
                            divd.appendChild(cbbt);
                            cbbt.appendChild(document.createTextNode(""));
                            if (data.length > 0) {
                                chrome.browserAction.setBadgeText({text: data.length.toString()});
                            } else {
                                chrome.browserAction.setBadgeText({text: ""});
                            }
                        });
                    });
                }
            }

            function main() {
            }

            function bodyload(isfromCollapsableBtn) {
                var data = new Array();
                var data1 = new Array();
                var cap;
                var dtp;
                if (isfromCollapsableBtn) {
                } else {
                    var cbh = document.getElementById('taskpaneltable');
                    while (cbh.hasChildNodes()) {
                        cbh.removeChild(cbh.lastChild);
                    }
                    chrome.storage.sync.get('bucketlist', function (Ele) {
                        if (Ele.bucketlist) {
                            data = Ele.bucketlist;
                        }
                        if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                cap = data[i];
                                var divr = document.createElement('tr');
                                divr.setAttribute("name", "tableRow" + parseInt(i + 1).toString());
                                cbh.appendChild(divr);
                                var divf = document.createElement('td');
                                divf.setAttribute("width", 290);
                                divr.appendChild(divf);
                                var cbl = document.createElement('label');
                                divf.appendChild(cbl);
                                var cb = document.createElement('input');
                                cb.addEventListener('click', addDoneTasks, false);
                                cb.type = 'checkbox';
                                cbl.appendChild(cb);
                                cb.name = cap;
                                cb.value = i + 1;
                                cbl.appendChild(document.createTextNode(cap));
                                var divd = document.createElement('td');
                                divr.appendChild(divd);
                                var cbbt = document.createElement('button');
                                cbbt.className = "del-button";
                                cbbt.type = "button";
                                cbbt.name = "delButton" + parseInt(i + 1).toString();
                                cbbt.addEventListener('click', deleteTask, false);
                                divd.appendChild(cbbt);
                                cbbt.appendChild(document.createTextNode(""));
                            }
                            chrome.browserAction.setBadgeText({text: data.length.toString()});
                        } else {
                            chrome.browserAction.setBadgeText({text: ""});
                        }
                    });
                }
                var dtt = document.getElementById('doneTaskTable');
                while (dtt.hasChildNodes()) {
                    dtt.removeChild(dtt.lastChild);
                }
                chrome.storage.sync.get('donetasks', function (Ele) {
                    if (Ele.donetasks) {
                        data1 = Ele.donetasks;
                    }
                    if (data1.length > 0) {
                        for (var i = 0; i < data1.length; i++) {
                            dtp = data1[i];
                            var divr = document.createElement('tr');
                            divr.setAttribute("name", "dtableRow" + parseInt(i + 1).toString());
                            dtt.appendChild(divr);
                            var divf = document.createElement('td');
                            divf.setAttribute("width", 290);
                            divr.appendChild(divf);
                            var cbl = document.createElement('label');
                            divf.appendChild(cbl);
                            cbl.appendChild(document.createTextNode(dtp.task + " @" + dtp.date));
                            var divd = document.createElement('td');
                            divr.appendChild(divd);
                            var cbbt = document.createElement('button');
                            cbbt.className = "del-button";
                            cbbt.type = "button";
                            cbbt.name = "ddelButton" + parseInt(i + 1).toString();
                            cbbt.addEventListener('click', deleteDoneTasks, false);
                            divd.appendChild(cbbt);
                            cbbt.appendChild(document.createTextNode(""));
                        }
//                        chrome.browserAction.setBadgeText({text: data1.length.toString()});
                    } else {
//                        chrome.browserAction.setBadgeText({text: ""});
                    }
                });
            }

            function deleteTask() {
                var curDelButtonName = this.name;
                var curtask = curDelButtonName.replace("delButton", "");
                chrome.storage.sync.get('bucketlist', function (obj) {
                    var tasks = obj.bucketlist;
                    if (curtask > 0) {
                        var taskName = tasks[parseInt(curtask) - 1];
                        var curIdx = tasks.indexOf(taskName);
                        if (curIdx !== null) {
                            tasks.splice(curIdx, 1);
                        }
                    }
                    chrome.storage.sync.set({'bucketlist': tasks}, function () {
                        fadeOut(document.getElementsByName("tableRow" + curtask)[0], 2000, true);
                        if (tasks.length > 0) {
                            chrome.browserAction.setBadgeText({text: tasks.length.toString()});
                        } else {
                            chrome.browserAction.setBadgeText({text: ""});
                        }
                    });
                });
            }

            function deleteDoneTasks() {
                var curDelButtonName = this.name;
                var curtask = curDelButtonName.replace("ddelButton", "");
                chrome.storage.sync.get('donetasks', function (obj) {
                    var tasks = obj.donetasks;
                    if (curtask > 0) {
                        var taskName = tasks[parseInt(curtask) - 1];
                        var curIdx = tasks.indexOf(taskName);
                        if (curIdx !== null) {
                            tasks.splice(curIdx, 1);
                        }
                    }
                    chrome.storage.sync.set({'donetasks': tasks}, function () {
                        fadeOut(document.getElementsByName("dtableRow" + curtask)[0], 2000, true, true);
                        if (tasks.length > 0) {
//                            chrome.browserAction.setBadgeText({text: tasks.length.toString()});
                        } else {
//                            chrome.browserAction.setBadgeText({text: ""});
                        }
                    });
                });
            }


            function fadeOut(elem, speed, isRemoved, isFromDoneTaskDelete) {
                var taskName = elem.innerText;
                if (isRemoved) {
                } else {
                    chrome.storage.sync.get('bucketlist', function (obj) {
                        var tasks = obj.bucketlist;
                        if (taskName && taskName !== null && taskName !== "") {
                            var curIdx = tasks.indexOf(taskName);
                            if (curIdx !== null) {
                                tasks.splice(curIdx, 1);
                            }
                        }
                        chrome.storage.sync.set({'bucketlist': tasks}, function () {
                            elem.querySelector('label').css('text-decoration', 'line-through');
                            fadeOut(elem, 2000);
                            if (tasks.length > 0) {
                                chrome.browserAction.setBadgeText({text: tasks.length.toString()});
                            } else {
                                chrome.browserAction.setBadgeText({text: ""});
                            }
                        });
                    });
                }
                var outInterval = setInterval(function () {
                    elem.style.opacity -= 0.02;
                    if (elem.style.opacity <= 0) {
                        clearInterval(outInterval);
                        if (isFromDoneTaskDelete) {
                            document.getElementById('doneTaskTable').removeChild(elem);
                        } else {
                            document.getElementById('taskpaneltable').removeChild(elem);
                        }
                    }
                }, speed / 50);

            }

            function addDoneTasks() {
                var h = "";
                var taskName = this.name;
                var row;
                var curtask;
                if (this.parentElement && this.parentElement.parentElement && this.parentElement.parentElement.parentElement
                        && this.parentElement.parentElement.parentElement && this.parentElement.parentElement.parentElement.getAttribute("name")) {
                    row = this.parentElement.parentElement.parentElement.getAttribute("name");
                    curtask = row.replace("tableRow", "");
                    console.log("Success");
                }
                chrome.storage.sync.get('bucketlist', function (obj) {
                    var tasks = obj.bucketlist;
                    if (taskName && taskName !== null && taskName !== "") {
                        h = taskName;
                        var curDate = new Date();
                        var JsonObj = []
                        var task = '{ "task":"' + h + '" , "date":"' + formatDate(curDate) + '" }';
                        var jsonObj = JSON.parse(task)
                        chrome.storage.sync.get('donetasks', function (ob) {
                            var data = ob.donetasks;
                            if (data && data[0] && Object.prototype.toString.call(data) === "[object Array]") {
                                data.push(jsonObj);
                                console.log(data);
                            } else {
                                JsonObj.push(jsonObj);
                                data = JsonObj;
                            }
                            chrome.storage.sync.set({'donetasks': data}, function () {

                            })
                        })
                    }
                    var curIdx = tasks.indexOf(taskName);
                    if (curIdx !== null) {
                        tasks.splice(curIdx, 1);
                    }
                    chrome.storage.sync.set({'bucketlist': tasks}, function () {
                        if (curtask) {
                            fadeOut(document.getElementsByName("tableRow" + curtask)[0], 2000, true);
                        }
                        if (tasks.length > 0) {
                            chrome.browserAction.setBadgeText({text: tasks.length.toString()});
                        } else {
                            chrome.browserAction.setBadgeText({text: ""});
                        }
                        bodyload(true);
                    });
                });
            }

            document.addEventListener('DOMContentLoaded', function () {
                document.querySelector('#commonaddbtn').addEventListener('click', addNewTask);
                document.querySelector('#doneTaskButton').addEventListener('click', collapsabelExpand);
                document.querySelector('#addnewtask_txtfield').addEventListener("keydown", function (e) {
                    if (e.keyCode === 13) {
                        addNewTask();
                    }
                });
                main();
            });

            window.onload = function () {
                bodyload();
            };

            function collapsabelExpand() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            }

            function formatDate(date) {
                var d = new Date(date),
                        month = '' + (d.getMonth() + 1),
                        day = '' + d.getDate(),
                        year = d.getFullYear(),
                        hours = d.getHours(),
                        min = d.getMinutes(),
                        sec = d.getSeconds();
                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                return [hours, min, sec].join(':') + " " + [day, month, year].join('-');
            }


        