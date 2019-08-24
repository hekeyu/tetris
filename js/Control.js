var keyControl = function(){                //w, a, s, d按键检测
	  		var that = this;
			document.onkeydown = function(ev){
				var ev
				switch(ev.keyCode)
				{
					case 65: that.keys[1] = 1; break;    //A
					
					
					
					case 83: that.keys[2] = -1; break;   //S
					
					case 87: that.keys[0] = 1; break;    //w
					
					case 68: that.keys[3] = -1; break;   //D
					default: return;
				}
			}
				
			document.onkeyup = function(ev){
				var ev
				switch(ev.keyCode)
				{
					case 65:  that.keys[1] = 0; break;
					case 83: that.keys[2] = 0; break;
					case 87: that.keys[0] = 0; break;
					case 68: that.keys[3] = 0; break;
					default: return;
				}
			}		
};
