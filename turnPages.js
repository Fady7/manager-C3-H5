(function () {

    $.fn.extend({
        turnPage: function (config) {
            var page = new TurnPage(config, this);
            page.init();
        }
    });
    /**初始化 */
    function TurnPage(config, wrap) {
        this.wrap = wrap;
        this.nowPage = config.nowPage || 1;
        this.allPage = config.allPage || 1;
        this.callBack = config.callBack || function () {};
        this.init = function () {
            this.creatDom();
            this.domCss();
            this.bindClick();
        }
    }
    /**创建页码元素 */
    TurnPage.prototype.creatDom = function () {
        this.wrap.empty();
        var pageDiv = $("<div class='pageDiv'></div>");
        if (this.nowPage > 1) {
            $("<button class='change prevPage'>上一页</button>").appendTo(pageDiv);
        }
        //第一页
        $("<button class='page'>1</button>").addClass(this.nowPage == 1 ? "activePage" : "").appendTo(pageDiv);
        if (this.nowPage - 2 > 2) { //省略号
            $("<span class='page_'>...</span>").appendTo(pageDiv);
        }
        //中间五页
        for (var i = this.nowPage - 2; i <= this.nowPage + 2; i++) {
            if (i > 1 && i < this.allPage) {
                $("<button class='page'></button>").text(i).addClass(this.nowPage == i ? "activePage" : "").appendTo(pageDiv);
            }
        }
        if (this.nowPage + 2 < this.allPage - 1) {
            $("<span class='page_'>...</span>").appendTo(pageDiv);
        }
        if (this.allPage > 1) {
            //最后一页
            $("<button class='page'></button>").text(this.allPage).addClass(this.nowPage == this.allPage ? "activePage" : "").appendTo(pageDiv);
        }
        //下一页
        if (this.nowPage != this.allPage) {
            $("<button class='change nextPage'>下一页</button>").appendTo(pageDiv);
        }
        this.wrap.append(pageDiv);
    }
    /**元素样式 */
    TurnPage.prototype.domCss = function () {
        this.wrap.find(".pageDiv").css({
                textAlign: "center",
            }).end().find("button")
            .css({
                cursor: "pointer",
                backgroundColor: "#4d5e70",
                color: "#fff",
                border: "1px solid",
                outline: "none",
                borderRadius: 5,
                fontWeight: "bold",
                verticalAlign: "middle"
            }).end()
            .find(".page")
            .css({
                margin: "5px 2px",
                width: 25,
                height: 30
            }).end().find(".change")
            .css({
                height: 33,
                width: 80
            }).end().find(".activePage")
            .css({
                backgroundColor: "rgb(66, 139, 202)"
            })
    }
    /**绑定点击事件 */
    TurnPage.prototype.bindClick = function () {
        var self = this;
        $(".pageDiv", this.wrap).on("click", ".page", function (e) {
            var page = Number($(this).text());
            self.nowPage = page;
            self.init();
            self.callBack(self.nowPage);
        }).on("click", ".nextPage", function () {
            self.nowPage++;
            self.init();
            self.callBack(self.nowPage);
        }).on("click", ".prevPage", function () {
            self.nowPage--;
            self.init();
            self.callBack(self.nowPage);
        })
    }

})()