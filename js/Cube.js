//俄罗斯方块每一个方块对象
var DrawCube = function(gl) {
/*
		  attribute vec3 a_Position;
    	attribute vec4 a_Color;
		  attribute vec3 a_Normal;
		     
	    uniform mat4 u_MvpMatrix;
	    uniform vec3 u_PointLight;   
	            
	    varying vec4 v_Color;
	    varying vec2 v_Tex;
      varying vec3 v_LightDir;
      
   	void main(void) { 
  		 gl_Position = u_MvpMatrix * vec4(a_Position, 1.0); 
  		 vec3 lightDirection = normalize(vec3(0.0, 0.0, 0.0) - a_Position);
  	 	 v_Color = vec4(a_Color.xyz * dot(a_Normal, lightDirection), a_Color.w) * 0.5 + a_Color * 0.5;
 
   	}            
   

				#ifdef GL_ES               
				  precision highp float;
				#endif
			 uniform sampler2D u_Sampler;
			 
			 varying vec4 v_Color;

    		void main(void) {
    	              
    	  gl_FragColor =  v_Color; 
              
    		}                                              
*/     
	this.program = createProgram(gl, "drawcubeVertex", "drawcubeFragment");
	
	var vertices = new Float32Array([   // Coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
  	]); 
  	
    var normals = new Float32Array([    // Normal
	  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
	   1.0, 0.0, 0.0,  1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
	    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
	    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
	    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
	   0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0   // v4-v7-v6-v5 back
	 ]); 

    var indices = new Uint8Array([
	     0, 1, 2,   0, 2, 3,    // front
	     4, 5, 6,   4, 6, 7,    // right
	     8, 9,10,   8,10,11,    // up
	    12,13,14,  12,14,15,    // left
	    16,17,18,  16,18,19,    // down
	    20,21,22,  20,22,23     // back
 	]);
 	
  var verticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
  
 
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.useProgram(this.program);
    
  	//顶点  	
  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  	gl.vertexAttribPointer(this.program.a_Position, 3, gl.FLOAT, false, 0, 0);  
  	gl.enableVertexAttribArray(this.program.a_Position);

	//法向量
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(this.program.a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.program.a_Normal);
 
  this.draw = function(u_MvpMatrix, center, color){
   
 	 gl.uniform3fv(this.program.u_Color, color);
 	 
 	 gl.uniform2fv(this.program.u_Center, center);
 	
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  	
  	gl.uniform3f(this.program.u_PointLight, 3.0, 3.0, 3.0);
  	
    gl.uniformMatrix4fv(this.program.u_MvpMatrix, false, u_MvpMatrix);
    
  	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0); 
  	
  }
}  

function initCubeMatrix(){
	//12x20
	var cubeMatrix = new Array(20);
	for(var i = 0; i < cubeMatrix.length; i++){
		cubeMatrix[i] = new Array(10);
		for(var j = 0; j < cubeMatrix[i].length; j++)
		//每一个cubeMatrix的属性
		cubeMatrix[i][j] = {
			  color:[0.0, 1.0, 0.0],
			  center:[-11 + j * 2, i * 2 + 1],
			  draw:false
		}
	}
	return cubeMatrix;
}
 



var GroupCube = function(){          //负责随机产生状态    
	
	     this.groupNum = Math.floor(Math.random() * 7);
	     this.stateNum = 0; 
	     
	     this.colorData = [
	        [1.0, 0.0, 0.0],
	     		[1.0, 1.0, 0.0],
	     		[0.0, 0.0, 1.0],
	     		[0.0, 1.0, 0.0]
	     ];
	     
			 this.groupData = [                   //初始的数据，还不能用，必须要加一个中心center
	     		[[0, 0], [0, 1], [0, 2], [1, 1]],
	     		[[0, 0], [0, 1], [0, 2], [1, 0]],
	     		[[0, 0], [0, 1], [0, 2], [1, 2]],
	     		[[0, 0], [0, 1], [0, 2], [0, 3]],
	     		[[0, 0], [0, 1], [1, 0], [1, 1]],
	     		
	     		[[1, 0], [1, 1], [2, 1], [2, 2]],
	     		
	     		[[2, 0], [2, 1], [1, 1], [1, 2]],
	     ] 
	     
	     this.groupChangeData = [             //用于状态的跳变
	     
	       [
	       	[[ 1,  1], [ 0,  0], [-1, -1], [-1,  1]],
	        [[-1,  1], [ 0,  0], [ 1, -1], [-1, -1]],
	        [[-1, -1], [ 0,  0], [ 1,  1], [ 1, -1]],
	        [[ 1, -1], [ 0,  0], [-1,  1], [ 1,  1]]
	       ],
	       [
	       	[[ 1,  1], [ 0,  0], [-1, -1], [ 0,  2]],
	        [[-1,  1], [ 0,  0], [ 1, -1], [-2,  0]],
	        [[-1, -1], [ 0,  0], [ 1,  1], [ 0, -2]],
	        [[ 1, -1], [ 0,  0], [-1,  1], [ 2,  0]]
	       ],
	       [
	       	[[ 1,  1], [ 0,  0], [-1, -1], [-2,  0]],
	        [[-1,  1], [ 0,  0], [ 1, -1], [ 0, -2]],
	        [[-1, -1], [ 0,  0], [ 1,  1], [ 2,  0]],
	        [[ 1, -1], [ 0,  0], [-1,  1], [ 0,  2]]
	       ],
	       [
	       	[[ 1,  1], [ 0,  0], [-1, -1], [-2, -2]],
	        [[-1,  1], [ 0,  0], [ 1, -1], [ 2, -2]],
	        [[-1, -1], [ 0,  0], [ 1,  1], [ 2,  2]],
	        [[ 1, -1], [ 0,  0], [-1,  1], [-2,  2]]
	       ],
	       [
	       	[[ 0,  0], [ 0,  0], [ 0,  0], [ 0,  0]],
	       ],
	       [
	       	[[ 1,  0], [ 0, -1], [-1,  0], [-2, -1]],
	        [[ 0,  2], [ 1,  1], [ 0 , 0], [ 1, -1]],
	        [[-2, -1], [-1,  0], [ 0, -1], [ 1,  0]],
	        [[ 1, -1], [ 0 , 0], [ 1,  1], [ 0,  2]], 
	       ],
	       [
	       	[[ 0,  1], [-1,  0], [ 0, -1], [-1, -2]],
	        [[-1,  1], [ 0,  0], [ 1,  1], [ 2,  0]],
	        [[-1, -2], [ 0, -1], [-1,  0], [ 0,  1]],
	        [[ 2,  0], [ 1,  1], [ 0,  0], [-1,  1]],
	       ]
	       
	     ];
	     
	     this.getNewGroup = function(){                //返回一个新组合
	     	 this.groupNum = Math.floor(Math.random() * 7); 
	    	 var data = [[0, 0],[0, 0],[0, 0],[0, 0]];
			  for(var i = 0; i < 4; i++){
			    data[i][0] = this.groupData[this.groupNum][i][0];
			    data[i][1] = this.groupData[this.groupNum][i][1];
			   }
			  this.stateNum = 0;                           //状态变为初始状态
			  return data;
	     };
	      
	     this.getRandomColor = function(){
	     	   return this.colorData[Math.floor(Math.random() * this.colorData.length)];
	     }
	     
	     this.getTransform = function(){
	     	    return this.groupChangeData[this.groupNum][this.stateNum];
	     }
	     this.updateState = function(){
	     	   this.stateNum = (this.stateNum + 1) % this.groupChangeData[this.groupNum].length;
	     }
	     
	     this.toLeft = [[0, -1], [0, -1], [0, -1], [0, -1]];
	     this.toRight = [[0, 1], [0, 1], [0, 1], [0, 1]];
	     this.toDown = [[-1, 0], [-1, 0], [-1, 0], [-1, 0]];
} 

 


var KeyControl = function(){                //w, a, s, d按键检测
	  		var that = this;
	  		var lifeTime = 300;
	  		var leftControl;
	  		var rightControl;
	  		var upControl;
	  		var downControl;
	  		this.initialite = function(){
	  			if(leftControl)  clearInterval(leftControl);
	  			if(rightControl)  clearInterval(rightControl);
	  			if(upControl)  clearInterval(upControl);
	  			if(downControl)  clearInterval(downControl);
	  		}
	  		this.moveToWhere = function(toWhere){
	  			if(DRAW == false)  return;
	  			move(testGroup, group, toWhere);
	  			if(collisionDetect(testGroup) == true)
	  			    move(group, group, toWhere);
	  		}
	  		 
	  		this.transform = function(toWhere){ 
	  				if(DRAW == false)  return; 
	  			  move(testGroup, group,toWhere);
	  			  	if(collisionDetect(testGroup) == true){
	  			    	move(group, group, toWhere); 
	  			    	groupCube.updateState();
	  			    }
	  		}
	  		
			document.onkeydown = function(ev){
				var ev
				switch(ev.keyCode)
				{
					case 65: {    //A
					  leftControl = setInterval(that.moveToWhere(groupCube.toLeft), lifeTime);
					  break;
					}
					
					case 83: {   //s
					  downControl = setInterval(that.moveToWhere(groupCube.toDown), lifeTime);
					  break;
					} 
					
					case 87: {   //w
					   upControl = setInterval(that.transform(groupCube.getTransform()), lifeTime);
					   break; 
					}
					case 68: {   //D
					   rightControl = setInterval(that.moveToWhere(groupCube.toRight), lifeTime);
					   break;
					}
					default: return;
				}
			}
				
			document.onkeyup = function(ev){
				var ev
				switch(ev.keyCode)
				{
					case 65: {
						clearInterval(leftControl);
						 break;
					}
					case 83: {
						clearInterval(downControl);
						 break;
					}
					case 87: {
						clearInterval(upControl);
						 break;
					}
					case 68: {
						clearInterval(rightControl);
						 break;
					}
					default: return;
				}
			}		
};


 