var lisArr = [];
var nowPage = 1,
    mySize = 2,
    allPage = 1;
var searchVal = "";
//初始化
function init() {
    bindEvent();
    // $(".list dd").eq(0).click();
    randByPage(nowPage, mySize, searchVal);
    windLoc();
    pie();
}

function pie() {
    window.player.pie("pieAdr", 0, "学生地区分布");
    window.player.pie("pieSex", 1, "学生性别分布");
}
init();

function windLoc() {
    location.hash = "student-pie";
    $(window).on("hashchange", function () {
        $(".right .student").not("id", location.hash).fadeOut();
        $("" + location.hash).fadeIn();
    });
    $(".head .logo .btn").on("click", function () {
        $(".content #conLit").slideToggle();
    });
    $(".content #conLit").on("mouseleave", function () {
        if ($(window).innerWidth() < 600) {
            $(this).slideUp();
        }
    });
    $(window).on("resize", function () {
        if ($(this).innerWidth() >= 600) {
            $(".content #conLit").show();
        } else {
            $(".content #conLit").hide();
        }
    })
}


//事件绑定函数
function bindEvent() {
    //左侧列表点击样式切换
    $(".list dl").on("click", "dd", function () {

        $(".action").removeClass("action");
        $(this).addClass("action");
        // 同时切换右侧内容
        if ($(this).index() == 1) {
            randByPage(nowPage, mySize, searchVal);
            // $(".addStu").fadeOut();
            // $(".student").fadeIn();
            location.hash = "student-list";
        } else if ($(this).index() == 2) {
            location.hash = "student-add";
            // $(".student").fadeOut();
            // $(".addStu").fadeIn();
        } else {
            location.hash = "student-pie";
        }
    });
    // 新增学生提交按钮事件
    $("#addNewStudent .btn").click(function (e) {
        e.preventDefault();
        if ($(this).hasClass("reset")) {
            $("#addNewStudent")[0].reset();
        } else {
            var data = $("#addNewStudent").serializeArray();
            var newData = changeData(data);
            if (!newData) {
                alert("请将数据填写完整");
            } else {
                getData("/api/student/addStudent", newData, function (res) {
                    if (res.status == "fail") {
                        alert(res.msg);
                    } else if (res.status == "success") {
                        var flag = confirm("添加成功，是否跳转页面？");
                        pie();
                        if (flag) {
                            $(".list dd").eq(0).click();
                            $("#addNewStudent")[0].reset()
                        } else {
                            $("#addNewStudent")[0].reset();
                        }
                    }
                })
            }
        }
    });
    //学生编辑按钮的遮罩层点击消失事件
    $(".addMask").on("click", function (e) {
        if ($(e.target).hasClass("addMask")) {
            $(".addMask").slideUp();
        }
    });
    //列表编辑删除事件
    $(".randStuList").on("click", ".btn", function () {
        var index = $(this).data("index");
        var data = lisArr[index];

        // 编辑按钮
        if ($(this).hasClass("edx")) {
            $(".addMask").slideDown();
            // console.log($(this).parents("tr").index())
            randFrom("eidStudent", data);
        } else if ($(this).hasClass("del")) {
            // 删除按钮
            var sData = {
                sNo: data.sNo
            };

            getData("/api/student/delBySno", sData, function (res) {
                if (res.status == "fail") {
                    alert(res.msg);
                } else if (res.status == "success") {
                    randByPage(nowPage, mySize, searchVal);
                    var flag = confirm("确定删除学生" + data.name + "的信息吗？");
                    if (flag) {
                        alert(res.msg);
                        $(".list dd").eq(0).click();
                    }

                }
            })
        }
    });
    //编辑信息后的提交按钮事件
    $("#eidStudent").on("click", ".submit", function (e) {
        e.preventDefault();
        var eidData = changeData($("#eidStudent").serializeArray());
        getData("/api/student/updateStudent", eidData, function (res) {
            if (res.status == "fail") {
                alert(res.msg);
            } else if (res.status == "success") {
                alert(res.msg);
                $(".list dd").eq(0).click();
                $(".addMask").click();
            }
        })
    });
    //上一页下一页按钮
    $(".pageBtn").on("click", ".btn", function () {
        if ($(this).hasClass("nextBtn")) {
            nowPage++;
            $(".list dd").eq(0).click();
        } else if ($(this).hasClass("prevBtn")) {
            nowPage--;
            $(".list dd").eq(0).click();
        }
    });

    //搜素框
    $("#search-btn").click(function () {
        searchVal = $("#search-inp").val();
        nowPage = 1;
        randByPage(nowPage, allPage, searchVal);
    })
}

/**渲染列表 */
function randList(data) {
    var str = "";
    $.each(data, function (index, ele) {
        str += "<tr>\
        <td>" + ele.sNo + "</td>\
        <td>" + ele.name + "</td>\
        <td>" + (ele.sex == 0 ? "男" : "女") + "</td>\
        <td>" + ele.email + "</td>\
        <td>" + (new Date().getFullYear() - ele.birth) + "</td>\
        <td>" + ele.phone + "</td>\
        <td>" + ele.address + "</td>\
        <td>\
            <button class='btn edx' data-index=" + index + ">编辑</button>\
            <button class='btn del' data-index=" + index + ">删除</button>\
        </td>\
    </tr>"
    });
    $(".randStuList").html(str);
}

/**表单数据转换为对象形式 */
function changeData(data) {
    var newData = {};
    for (var i = 0; i < data.length; i++) {
        if (!data[i].value) {
            return false;
        }
        newData[data[i].name] = data[i].value;
    }
    newData.birth = parseInt(newData.birth);
    newData.sex = parseInt(newData.sex);
    return newData;
}

/*** 与后端交互*/
function getData(url, data, callback) {
    $.ajax({
        url: "http://open.duyiedu.com" + url,
        type: "GET",
        data: $.extend({
            appkey: "panda_1545214432912"
        }, data),
        dataType: "json",
        success: function (res) {
            callback(res);
        }
    });
}

/**渲染表格数据 */
function randFrom(id, data) {
    var eidForm = $("#" + id)[0];
    for (var prop in data) {
        if (eidForm[prop]) {
            eidForm[prop].value = data[prop];
        }
    }
}


function randByPage(nowPage, mySize, val) {
    if (val) {
        var sex = -1;
        var search = val;

        if (val.indexOf("男") > -1) {
            sex = 0;
            search = val.replace("男", "");
        } else if (val.indexOf("女") > -1) {
            sex = 1;
            search = val.replace("女", "");
        }

        getData("/api/student/searchStudent", {
            sex: sex,
            search: search,
            page: nowPage,
            size: mySize
        }, function (res) {
            if (res.status == "fail") {
                alert(res.msg);
            } else if (res.status == "success") {
                console.log(res.data.searchList)
                lisArr = res.data.searchList;
                allPage = Math.ceil(res.data.cont / mySize);
                $(".pageWrapper").turnPage({
                    nowPage: nowPage,
                    allPage: allPage,
                    callBack: function (page) {
                        randByPage(page, mySize, val);
                    }
                });
                randList(res.data.searchList);
            }
        })
    } else {
        //渲染列表内容
        getData("/api/student/findByPage", {
            page: nowPage,
            size: mySize
        }, function (res) {
            if (res.status == "fail") {
                alert(res.msg);
            } else if (res.status == "success") {

                lisArr = res.data.findByPage;
                allPage = Math.ceil(res.data.cont / mySize);
                // console.log(nowPage, allPage)

                $(".pageWrapper").turnPage({
                    nowPage: nowPage,
                    allPage: allPage,
                    callBack: function (page) {
                        randByPage(page, mySize, val);
                    }
                });
                randList(res.data.findByPage);

                if (nowPage == 1) {
                    $(".prevBtn").hide();
                } else if (nowPage == allPage) {
                    $(".nextBtn").hide();
                } else {
                    $(".pageBtn .btn").show();
                }
            }
        })
    }
}