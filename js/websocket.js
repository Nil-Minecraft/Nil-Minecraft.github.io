var heartbeat_timer = 0;
var last_health = -1;
var health_timeout = 3000;
var mapcode1 = "{}";
var mapcode2 = "[]";

$(function () {
    ws = ws_conn("ws://server.idc2.top:5555");
});

function keepalive(ws) {
    var time = new Date();
    if (last_health != -1 && (time.getTime() - last_health > health_timeout)) {
        //此时即可以认为连接断开，可是设置重连或者关闭
        console.log("heart timeout connect closed");
        ws.close();
    }
    else {
        if (ws.bufferedAmount == 0) {
            ws.send('HeartBeat');
        }
    }
}

//websocket function
function ws_conn(to_url) {
    to_url = to_url || "";
    if (to_url == "") {
        return false;
    }

    clearInterval(heartbeat_timer);
    var ws = new WebSocket(to_url);
    ws.onopen = function () {
        console.log("connect ok");
        heartbeat_timer = setInterval(function () { keepalive(ws) }, 5000);
        if (ws.readyState == 1) {
            if (window.location.pathname == "/control.html") {
                var login_json = { "type": "login href", "html": "control", "user": localStorage.getItem("user_name"), "token": localStorage.getItem("user_token") };
                ws.send(JSON.stringify(login_json));
            }
            if (window.location.pathname == "/server.html") {
                var login_json = { "type": "login href", "html": "server", "user": localStorage.getItem("user_name"), "token": localStorage.getItem("user_token") };
                ws.send(JSON.stringify(login_json));
            }
            if (window.location.pathname == "/invite.html") {
                var login_json = { "type": "login href", "html": "invite", "user": localStorage.getItem("user_name"), "token": localStorage.getItem("user_token") };
                ws.send(JSON.stringify(login_json));
            }
            if (window.location.pathname == "/shop.html") {
                var login_json = { "type": "login href", "html": "shop", "user": localStorage.getItem("user_name"), "token": localStorage.getItem("user_token") };
                ws.send(JSON.stringify(login_json));
            }
        }

    }
    ws.onerror = (evnt) => {
        console.log("connect error");
        clearInterval(heartbeat_timer);
    }
    ws.onclose = (evnt) => {
        console.log("connect closed");
        clearInterval(heartbeat_timer);
        myalert("连接终端失败，请联系客服");
        window.location.href = "index.html";
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_token");
    }

    ws.onmessage = function (msg) {
        var time = new Date();
        if (msg.data == ('HeartBeat')) {
            last_health = time.getTime();
            return;
        }

        if (msg.data != null) {
            json_data = JSON.parse(msg.data);


            if (json_data.type == "terminal info") {

                if (document.getElementById("ruser") != null) {
                    if (document.getElementById("ruser").innerText != json_data.ruser) {
                        document.getElementById("ruser").innerText = json_data.ruser;
                    }
                }
                if (document.getElementById("ouser") != null) {
                    if (document.getElementById("ouser").innerText != json_data.ouser) {
                        document.getElementById("ouser").innerText = json_data.ouser;
                    }
                }
                if (document.getElementById("oserver") != null) {
                    if (document.getElementById("oserver").innerText != json_data.oserver) {
                        document.getElementById("oserver").innerText = json_data.oserver;
                    }
                }
                if (document.getElementById("allflow") != null) {
                    if (document.getElementById("allflow").innerText != json_data.allflow) {
                        document.getElementById("allflow").innerText = json_data.allflow;
                    }
                }
                if (document.getElementById("flowtype") != null) {
                    if (document.getElementById("flowtype").innerText != json_data.flowtype) {
                        document.getElementById("flowtype").innerText = json_data.flowtype;
                    }
                }
                if (document.getElementById("onat") != null) {
                    if (document.getElementById("onat").innerText != json_data.onat) {
                        document.getElementById("onat").innerText = json_data.onat;
                    }
                }
            }
            if (json_data.type == "terminal info pro") {

                if (document.getElementById("money") != null) {
                    if (document.getElementById("money").innerText != json_data.money) {
                        document.getElementById("money").innerText = json_data.money;
                    }
                }
                if (document.getElementById("day") != null) {
                    if (document.getElementById("day").innerText != json_data.day) {
                        document.getElementById("day").innerText = json_data.day;
                    }
                }
                if (document.getElementById("daytime") != null) {
                    if (document.getElementById("daytime").innerText != json_data.daytime) {
                        document.getElementById("daytime").innerText = "单位：天（到期时间：" + json_data.daytime + "）";
                    }
                }
                if (document.getElementById("maxnat") != null) {
                    if (document.getElementById("maxnat").innerText != json_data.maxnat) {
                        document.getElementById("maxnat").innerText = json_data.maxnat;
                    }
                }
                if (document.getElementById("oadmin") != null) {
                    if (document.getElementById("oadmin").innerText != json_data.oadmin) {
                        document.getElementById("oadmin").innerText = json_data.oadmin;
                    }
                }
                if (document.getElementById("banlist") != null) {
                    if (json_data.bancode != document.getElementById("banlist").innerHTML) {
                        document.getElementById("banlist").innerHTML = json_data.bancode
                    }
                    if (json_data.mccode != document.getElementById("mcserver").innerHTML) {
                        document.getElementById("mcserver").innerHTML = json_data.mccode
                    }
                }
                if (document.getElementById("sign_gift") != null) {
                    if (document.getElementById("sign_gift").innerText != json_data.sign_seven_money) {
                        document.getElementById("sign_gift").innerText = json_data.sign_seven_money;
                    }
                    if (document.getElementById("sign_money").innerText != json_data.sign_money) {
                        document.getElementById("sign_money").innerText = json_data.sign_money;
                    }
                    if (document.getElementById("sign_num").innerText != json_data.signed) {
                        document.getElementById("sign_num").innerText = json_data.signed;
                    }
                    if (document.getElementById("sign_day").innerText != "目前签到进度：第 " + json_data.seven_signed + " 天") {
                        document.getElementById("sign_day").innerText = "目前签到进度：第 " + json_data.seven_signed + " 天";

                        if (json_data.seven_signed == "7") {
                            document.getElementById("progress-bar-example-1").style.width = "100%"
                        } else {
                            var num = parseInt(json_data.seven_signed) * 14;
                            document.getElementById("progress-bar-example-1").style.width = String(num) + "%"
                        }
                    }
                    if (json_data.sign_status == "真") {
                        document.getElementById("sign_btn").style.visibility = "visible"
                        document.getElementById("sign_msg").style.visibility = "hidden"
                    } else {
                        document.getElementById("sign_btn").style.visibility = "hidden"
                        document.getElementById("sign_msg").style.visibility = "visible"
                    }
                }
                document.getElementById("load").style.visibility = "hidden"
            }
            if (json_data.type == "back sign") {
                if (json_data.msg == "ok") {
                    myalert("签到成功！获利余额：" + json_data.getmoney)
                }
            }

            if (json_data.type == "invite info pro") {
                if (document.getElementById("invite_code") != null) {
                    document.getElementById("invite_code").innerText = json_data.invite_code
                    document.getElementById("invite_group").innerText = json_data.group
                    document.getElementById("invite_success").innerText = json_data.s
                    document.getElementById("invite_lose").innerText = json_data.e
                    document.getElementById("invite_check").innerText = json_data.c
                    document.getElementById("money1").innerText = json_data.money1
                    document.getElementById("money2").innerText = json_data.money2
                    document.getElementById("invite_all_money").innerText = json_data.invite_all_money
                    if (json_data.invitecode != document.getElementById("invitelist").innerHTML) {

                        document.getElementById("invitelist").innerHTML = json_data.invitecode
                    }

                    if (json_data.invite_man == "未申请") {
                        document.getElementById("apply_invite_btn").style.visibility = "visible"
                        document.getElementById("invite_msg1").innerText = "提交后不可修改"
                    } else {
                        document.getElementById("apply_invite_btn").style.visibility = "hidden"
                        if (json_data.invite_man == "待审核") {
                            document.getElementById("invite_msg1").innerText = "已提交申请，正在审核"
                        } else {
                            if (json_data.invite_man == "通过") {
                                document.getElementById("invite_msg1").innerText = "受邀成功，余额已增加"
                            } else {
                                if (json_data.invite_man == "不存在") {
                                    document.getElementById("apply_invite_btn").style.visibility = "visible"
                                    document.getElementById("invite_msg1").innerText = "提交的邀请码不存在"
                                } else {
                                    if (json_data.invite_man == "双方面邀请") {
                                        document.getElementById("invite_msg1").innerText = "受邀失败，对方已被你邀请"
                                    } else {
                                        document.getElementById("invite_msg1").innerText = "受邀失败，审核未通过"
                                    }

                                }

                            }
                        }

                    }
                    if (json_data.group == "未申请") {
                        document.getElementById("apply_btn").style.visibility = "visible"
                        document.getElementById("invite_msg").innerText = "如果确认同意并遵守以上推广规则，可以点击右边申请按钮"
                    } else {
                        document.getElementById("apply_btn").style.visibility = "hidden"
                        document.getElementById("invite_msg").innerText = "您已提交过申请，无论失败与否你都不能进行第二次申请"
                    }
                }
                document.getElementById("load").style.visibility = "hidden"
            }
            if (json_data.type == "server info pro") {

                if (json_data.servercode != document.getElementById("serverlist").innerHTML) {

                    document.getElementById("serverlist").innerHTML = json_data.servercode

                }
                if (json_data.mapcode1 != null && json_data.mapcode2 != null) {
                    mapcode1 = eval("(" + json_data.mapcode1 + ")");
                    mapcode2 = eval("(" + json_data.mapcode2 + ")");
                    var dom = document.getElementById("container");
                    var myChart = echarts.init(dom);
                    var app = {};
                    option = null;
                    var geoCoordMap = mapcode1;
                    var data = mapcode2;

                    var convertData = function (data) {
                        var res = [];
                        for (var i = 0; i < data.length; i++) {
                            var geoCoord = geoCoordMap[data[i].name];
                            if (geoCoord) {
                                res.push({
                                    name: data[i].name,
                                    value: geoCoord.concat(data[i].value)
                                });
                            }
                        }
                        return res;
                    };

                    var convertedData = [
                        convertData(data),
                        convertData(data.sort(function (a, b) {
                            return b.value - a.value;
                        }).slice(0, 6))
                    ];
                    data.sort(function (a, b) {
                        return a.value - b.value;
                    })

                    var selectedItems = [];
                    var categoryData = [];
                    var barData = [];
                    //   var maxBar = 30;
                    var sum = 0;
                    var count = data.length;
                    for (var i = 0; i < data.length; i++) {
                        categoryData.push(data[i].name);
                        barData.push(data[i].value);
                        sum += data[i].value;
                    }
                    console.log(categoryData);
                    console.log(sum + "   " + count)
                    option = {
                        backgroundColor: '#404a59',
                        animation: true,
                        animationDuration: 1000,
                        animationEasing: 'cubicInOut',
                        animationDurationUpdate: 1000,
                        animationEasingUpdate: 'cubicInOut',

                        geo: {
                            map: 'china',
                            left: '30%',
                            right: '30%',
                            center: [110.98561551896913, 35.205000490896193],
                            zoom: 1.5,
                            label: {
                                emphasis: {
                                    show: false
                                }
                            },
                            roam: true,
                            itemStyle: {
                                normal: {
                                    areaColor: '#323c48',
                                    borderColor: '#111'
                                },
                                emphasis: {
                                    areaColor: '#2a333d'
                                }
                            }
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        grid: {

                        },
                        xAxis: {
                            type: 'value',
                            scale: true,
                            position: 'top',
                            boundaryGap: false,
                            splitLine: {
                                show: false
                            },
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                margin: 2,
                                textStyle: {
                                    color: '#aaa'
                                }
                            },
                        },
                        yAxis: {
                            show: false
                        },
                        series: [{
                            // name: 'pm2.5',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: convertedData[0],
                            symbolSize: function (val) {
                                return Math.max(val[2] / 10, 8);
                            },
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ddb926',
                                    position: 'right',
                                    show: true
                                }
                            }
                        }, {
                            //  name: 'Top 5',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: convertedData[0],
                            symbolSize: function (val) {
                                return Math.max(val[2] / 10, 8);
                            },
                            showEffectOn: 'emphasis',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#f4e925',
                                    shadowBlur: 10,
                                    shadowColor: '#333'
                                }
                            },
                            zlevel: 1
                        },]
                    };

                    function renderBrushed(params) {
                        var mainSeries = params.batch[0].selected[0];

                        var selectedItems = [];
                        var categoryData = [];
                        var barData = [];
                        var maxBar = 30;
                        var sum = 0;
                        var count = 0;

                        for (var i = 0; i < mainSeries.dataIndex.length; i++) {
                            var rawIndex = mainSeries.dataIndex[i];
                            var dataItem = convertedData[0][rawIndex];
                            var pmValue = dataItem.value[2];

                            sum += pmValue;
                            count++;

                            selectedItems.push(dataItem);
                        }

                        selectedItems.sort(function (a, b) {
                            //   return b.value[2] - a.value[2];
                            return a.value - b.value;
                        });

                        for (var i = 0; i < Math.min(selectedItems.length, maxBar); i++) {
                            categoryData.push(selectedItems[i].name);
                            barData.push(selectedItems[i].value[2]);
                        }

                        this.setOption({
                            yAxis: {
                                data: categoryData
                            },
                            xAxis: {
                                axisLabel: {
                                    show: !!count
                                }
                            },
                            title: {
                                id: 'statistic',
                                text: count ? '平均: ' + (sum / count).toFixed(4) : ''
                            },
                            series: {
                                id: 'bar',
                                //        sort:'descending',
                                data: barData
                            }
                        });
                    };
                    if (option && typeof option === "object") {
                        myChart.setOption(option, true);
                    }
                }

                document.getElementById("load").style.visibility = "hidden"
            }

            if (json_data.type == "back web_login") {
                if (json_data.s == "ban") {
                    myalert("账号已被封禁，无法登录");
                }
                if (json_data.s == "not found") {
                    myalert("账号不存在，请下载客户端注册");
                }
                if (json_data.s == "pass error") {
                    myalert("登录账号失败，密码错误");
                }
                if (json_data.s == "login successful") {
                    myalert("登录成功！正在为你跳转控制台");
                    localStorage.setItem("user_name", json_data.user);
                    localStorage.setItem("user_token", json_data.token);
                    window.location.href = "control.html";
                }
            }
        }

    }

    return ws;
}