
(function(){
	function tag(){
		this.wrap = document.getElementById('wrap');
		this.div = this.wrap.getElementsByTagName('div');
		this.menu = document.getElementById('menu');
		this.arr = [0,1,2,3];
		this.arrName = ['游戏','删除','云盘','文件'];
		//this.arrFile = [1];
		this.disX = 0;
		this.disY = 0;
	};
	
	//图标的拖拽
	tag.prototype = {
		constructor:tag,
		createDiv:function(){   //创建元素，并让他们到该去的位置
			for(var i = 0;i<this.arr.length;i++){
				this.createDom(i);
				
				//需要改
				$('#wrap').find('div').eq(i).animate({
					top: (this.arr[i]*160)+40,
					left: 60
				});
			}
		},	
		init:function(){
			var _this = this;
			for(var i = 0;i<this.div.length;i++){
				this.div[i].addEventListener('mouseover',over);
				function over(ev){
					_this.mouseover(this)
				};
				this.div[i].addEventListener('mouseout',out);
				function out(ev){
					_this.mouseout(this)
				};
				this.div[i].addEventListener('mousedown',down);
				function down(ev){
					var obj = this;
					_this.fnDown(ev,down,obj);
				};
			}	
		},
	
		fnDown:function(ev,down,that){
			this.minObj = null;
			var oldIndex;
			var newIndex;
			var _this = this;
			that.style.zIndex = 999;
			this.disX = ev.pageX - that.offsetLeft;
			this.disY = ev.pageY - that.offsetTop;
			document.addEventListener('mousemove',move);
			document.addEventListener('mouseup',up);
			
			function move(ev){
				_this.fnMove(ev,that);
			};
			function up(ev){
				_this.fnUp(ev,down,move,up,that);
			};
			ev.preventDefault();
		
		},
	
		fnMove:function(ev,that){
			var _this = this;
			that.style.left = ev.pageX - this.disX +'px';
			that.style.top = ev.pageY - this.disY + 'px';
			
			//找到最近的
			this.minObj = this.minFn(that);
			for(var i = 0;i<this.div.length;i++){
				if(this.div[i] != that){
					this.mouseout(this.div[i]);
				}
			}
			if(this.minObj){
				this.mouseover(this.minObj);
			}
			

		},
	
	
		fnUp:function(ev,down,move,up,that){
			var _this = this;
			//   newIndex被碰撞，oldIndex拖拽的
			document.removeEventListener('mousemove',move);
			document.removeEventListener('mouseup',up);
			if(this.minObj != null && that!=this.minObj){
				this.minObj.style.zIndex = 999;
				oldIndex = that.index;
				newIndex = this.minObj.index;
				this.arr[oldIndex] = newIndex;  
				this.arr[newIndex] = oldIndex;  
				$('#wrap').find('div').eq(oldIndex).animate({
					top: (newIndex*160)+40,
					left: 60
				});
				$('#wrap').find('div').eq(newIndex).animate({
					top: (oldIndex*160)+40,
					left: 60
				});
				this.mouseout(this.minObj);
				var divN = Array.from(this.div);
				var oldD = divN[oldIndex];
				var newD = divN[newIndex];
				divN[oldIndex] = newD;
				divN[newIndex] = oldD;
				
				this.wrap.innerHTML = '';
				for(var i = 0;i <divN.length;i++){
					this.wrap.appendChild(divN[i]);
				}
				for(var i = 0;i<this.arr.length;i++){
					this.div[i].index = i;
				}
				//that.style.zIndex = 1;
				this.minObj.style.zIndex = 1;
			}	
			that.style.zIndex = 1;
			this.minObj = null;
			oldIndex = null;
			newIndex = null;
		},
		
		minFn:function(obj){   //找最近的节点
			var max = Infinity;  
			var objIndex = -1;
			for(var i=0;i<this.arr.length;i++){
				if(obj != this.div[i]){
					if(duang(obj,this.div[i])){ //碰到的情况下，循环找最小的，记录index，方便查找
						var a = this.div[i].offsetLeft - obj.offsetLeft;
						var b = this.div[i].offsetTop - obj.offsetTop;
						var sqrt = Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
						if(max > sqrt){
							max = sqrt;
							objIndex = i
						}
					}
				}	
			}
			if(objIndex == -1){
				return null;
			}else{
				return this.div[objIndex];
			}
		},
		createDom:function(i,n){   //生成节点，
			var _this = this;
			var div = document.createElement('div');
			var img = document.createElement('img');
			var p = document.createElement('p');
			var input = document.createElement('input');
			input.type = 'text';
			img.src = 'img/'+this.arr[i]+'.png';
			div.index = i;
			div.appendChild(img);
			div.appendChild(p);
			div.appendChild(input);
			wrap.appendChild(div);
			// 重绘问题
			if(n){   
				p.style.display = 'none';
				input.value = '新建文件夹';
				input.focus();
				input.onblur = function(){
					_this.repeat(input);
				};
			}else{
				input.style.display = 'none';
				p.innerHTML = this.arrName[this.arr[i]];
			}
		},
		mouseover:function(obj){  //移入
			obj.style.background = '#7e97b9';
		},
		mouseout:function(obj){   //移出
			obj.style.background = '';
		},
		change:function(ev){   //改名字
			var _this = this;
			if(ev.target.nodeName == 'P'){
				ev.target.style.display = 'none';
				var input = ev.target.nextElementSibling;
				var text = ev.target.innerHTML;
				input.style.display = 'block';
				input.focus();
				input.value = text;
				input.onblur = function(){
					if(input.value == ''||input.value ==text){
						this.style.display = 'none';
						this.previousElementSibling.style.display = 'block';
						return;
					}
					_this.repeat(input);
				};
			}	
		},
		hasName:function(obj){    //判断命名是否重复
			for(var i = 0;i<this.arrName.length;i++){
				if(obj.value == this.arrName[i]){
					return false;
				}
			}
			return true;
		},
		repeat:function(obj){
			if(!this.hasName(obj)){
				obj.focus();
				alert('命名重复');
			}else{
				this.arrName.push(obj.value);
				obj.style.display = 'none';
				obj.previousElementSibling.innerHTML = obj.value;
				obj.previousElementSibling.style.display = 'block';
			}
		},
		newFile:function(ev){
			if(ev.target.innerHTML == '新建'){
				this.arr.push(3);   //
				this.createDom(this.arr.length-1,1);
			}
		}
		
	}
	
	
	
	
	//碰撞检测
	function duang(obj,obj2){
		var l1 = obj.offsetLeft;
		var t1 = obj.offsetTop;
		var r1 = l1 + obj.offsetWidth;
		var b1 = t1 + obj.offsetHeight;
		
		var l2 = obj2.offsetLeft;
		var t2 = obj2.offsetTop;
		var r2 = l2 + obj2.offsetWidth;
		var b2 = t2 + obj2.offsetHeight;
		
		if(r1 < l2 || t1 > b2 || l1 > r2 || b1 < t2){
			return false;
		}else{
			return true;
		}
	};
	
	
	var c1 = new tag();
	c1.createDiv();
	c1.init();
	c1.wrap.onclick = function(ev){
		c1.change(ev);
	};
	c1.menu.onclick = function(ev){
		c1.newFile(ev);
	}

	
	
	
	
	
	
	
	
	
	
	//return arr;
})();
