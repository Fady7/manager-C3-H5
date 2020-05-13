// window.player.pie("demo", 0, "学生地区分布");
// window.player.pie("box", 1, "学生性别分布");

(function (root) {
    root.pie = function (ID, index, text) {
        var obj = {
            init: function () {
                // 获得数据
                this.getData();
                this.ID = ID;
                this.text = text;
                this.index = index;
            },
            getData: function () {
                var self = this;
                $.ajax({
                    url: "http://open.duyiedu.com/api/student/findAll",
                    data: {
                        appkey: "panda_1545214432912"
                    },
                    dataType: "json",
                    success: function (res) {
                        var data = res.data;
                        // 处理数据
                        self.renderPie(self.ID, self.changeData(data, self.index, self.text));
                        // self.renderPie("box", self.changeData(data, 1, "学生性别分布图"));
                    }
                })
            },
            DataAdd: function (data) {
                var add = {};
                var sex = {
                    "男": 0,
                    "女": 0
                };
                data.forEach(function (ele, index) {
                    if (!add[ele.address]) {
                        add[ele.address] = 1;
                    } else {
                        add[ele.address]++;
                    }
                    if (ele.sex == 0) {
                        sex["男"]++;
                    } else if (ele.sex == 1) {
                        sex["女"]++;
                    }
                });
                return [add, sex];
            },
            /**
             * 
             * @param {*} data 数据
             * @param {*} index 0--地区 1--性别
             * @param {*} text 饼图标题
             */
            changeData: function (data, index, text) {
                var all = this.DataAdd(data)[index];
                var legendData = [],
                    seriesData = [];
                for (var prop in all) {
                    legendData.push(prop);
                    seriesData.push({
                        value: all[prop],
                        name: prop,
                    })
                }
                var option = {
                    title: {
                        text: text,
                        subtext: '纯属虚构',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: legendData,
                    },
                    series: [{
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: seriesData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
                return option;
            },
            renderPie: function (ID, option) {
                var odom = document.getElementById(ID);
                var myecharts = echarts.init(odom);
                myecharts.setOption(option);
            }
        }
        obj.init();
    }
})(window.player || (window.player = {}))

