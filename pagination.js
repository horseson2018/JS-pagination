!(function(global) {
    "use strict";
    var Pagination = function(option) {
        console.log(option)
        var name = option.id
        this.el = typeof name === "string" ? document.querySelector(name) : name
        this.ul = document.createElement('ul');
        this.div = document.createElement('div')
        this.total = option.total
        this.pageSize = option.pageSize || 10
        this.curPage = option.curPage || 1
        this.cb = option.cb
        this.totalPage = Math.ceil(this.total / this.pageSize)
        this.init() // 初始化
    };
  
    Pagination.prototype = {
        init: function(pageSize) {
            this.curPage = 1
            this.totalPage = Math.ceil(this.total / (pageSize || this.pageSize))
            this.ul.innerHTML = ''
            this.el.appendChild(this.ul)
            this.firstPage()
            this.prevPage()
            this.ul.appendChild(this.div)
            this.pages()
            this.nextPage()
            this.finalPage()
            this.infoText(pageSize)
            this.jumpTo()
            this.cb({curpage:this.curPage, pageSize:this.pageSize})
            console.log(this.__proto__)
        },
        firstPage: function() {
            var li = document.createElement('li')
            li.id = "first-page"
            li.innerHTML = "首页"
            var that = this
            li.onclick = function(){
                if(that.curPage > 1){
                    that.curPage = 1
                    that.pages()
                    that.cb({curpage:that.curPage, pageSize:that.pageSize})
                }
            }
            this.ul.appendChild(li)
        },
        prevPage: function() {
            var li = document.createElement('li')
            li.id = "prev-page"
            li.innerHTML = "<"
            var that = this
            li.onclick = function(){
                if(that.curPage > 1){
                    that.curPage -= 1;
                    that.pages()
                    that.cb({curpage:that.curPage, pageSize:that.pageSize})
                }
            }
            this.ul.appendChild(li);
        },
        // 页数改变时重新渲染页码
        pages: function(){
            this.div.innerHTML = ''
            var pags = []
            var prev = document.getElementById('prev-page')
            var next = document.getElementById('next-page')
            if(this.totalPage < 5){
                for(var i = 0; i < this.totalPage; i++){
                    pags.push(i+1)
                }
            } else {
                if(this.curPage < 4){
                    pags = [1,2,3,4,5]
                }else{
                    if(this.curPage + 2 <= this.totalPage){
                        pags = [this.curPage - 2, this.curPage - 1, this.curPage, this.curPage + 1, this.curPage + 2]
                    }else if(this.curPage + 1 <= this.totalPage){
                        pags = [this.curPage - 3, this.curPage - 2, this.curPage - 1, this.curPage, this.curPage + 1]
                    }else if(this.curPage == this.totalPage){
                        pags = [this.curPage - 4, this.curPage - 3, this.curPage - 2, this.curPage - 1, this.curPage]
                    }
                }
            }
            if(this.curPage == 1) {
                prev.classList.add('disabled')
            }else{
                prev.classList.remove('disabled')
            }
            if(next){
                if(this.curPage == this.totalPage) {
                    next.classList.add('disabled')
                }else{
                    next.classList.remove('disabled')
                }
            }

            var that = this
            pags.forEach(item => {
                var li = document.createElement('li')
                if (item == that.curPage) {
                    li.className = 'active'
                } else {
                    li.onclick = function() {
                        that.curPage = +this.innerHTML
                        that.pages();
                        that.cb({curpage:that.curPage, pageSize:that.pageSize})
                    }
                }
                li.classList.add('page')
                li.innerHTML = item
                that.div.appendChild(li)
            });
        },
        nextPage: function() {
            var li = document.createElement('li')
            li.id = "next-page"
            li.innerHTML = ">"
            var that = this
            li.onclick = function(){
                if(that.curPage < that.totalPage){
                    that.curPage += 1;
                    that.pages()
                    that.cb({curpage:that.curPage, pageSize:that.pageSize})
                }
            }
            this.ul.appendChild(li);
        },
        finalPage: function() {
            var li = document.createElement('li')
            li.id = "first-page"
            li.innerHTML = "尾页"
            var that = this
            li.onclick = function(){
                if(that.curPage != that.totalPage){
                    that.curPage = that.totalPage;
                    that.pages()
                    that.cb({curpage:that.curPage, pageSize:that.pageSize})
                }
            }
            this.ul.appendChild(li);
        },
        infoText: function(pageSize) {
            var div = document.createElement('div')
            div.className = "text"
            div.innerHTML = `总计:${this.total}条数据，共${this.totalPage}页，每页展示`
            div.appendChild(this.selectSize(pageSize))
            div.appendChild(document.createTextNode('条'))
            this.ul.appendChild(div);
        },
        jumpTo: function() {
            var div = document.createElement('div')
            div.className = "jump"
            var input = document.createElement('input')
            var btn = document.createElement('button')
            input.id = "first-page"
            btn.innerHTML = "go "
            var that = this
            btn.onclick = function(){
                var value = +input.value
                that.curPage = Math.min(that.totalPage, +value)
                that.pages()
                that.cb({curpage:that.curPage, pageSize:that.pageSize})
            }
            div.appendChild(input)
            div.appendChild(btn)
            this.ul.appendChild(div)
        },
        selectSize: function(size) {
            var select = document.createElement('select')
            // select.innerHTML = `总计:${this.total}条数据，共${this.totalPage}页`
            var options = [5, 10, 20, 50]
            if(options.indexOf(this.pageSize) == -1){
                options.push(this.pageSize)
            }
            options.sort((a, b) => a - b)
            for(var i = 0 ; i < options.length ; i++){
                var option = document.createElement('option')
                option.value = options[i]
                option.innerHTML = options[i]
                select.appendChild(option)
            }
            select.value = size || this.pageSize.toString()
            var that = this
            select.onchange = function(){
                that.init(this.value)
            }
            return select
        }
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = Pagination;
    if (typeof define === 'function') define(function() { return Pagination; });
    global.Pagination = Pagination;
  
  })(this);