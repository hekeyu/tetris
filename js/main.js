var canvas = document.getElementById("canvas");
var gl = canvas.getContext('webgl');
canvas.width =  window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);
//gl.enable(gl.DEPTH_TEST); 
var view = LookAt(-2, 20, 80, -2, 20, 0, 0, 1, 0); 
var proj = SetPerspective(30, canvas.width / canvas.height, 0.01, 100);
var rotate = rotateY(0);
var vpMatrix = multiply(view, proj);
var mvpMatrix = multiply(rotate, vpMatrix);
gl.enable(gl.BLEND);  
//   gl.blendFunc(gl.DST_ALPHA, gl.SRC_ALPHA);
gl.blendFunc(gl.DST_ALPHA,   gl.ONE_MINUS_SRC_ALPHA);  
var drawCube = new DrawCube(gl);
var cubematrix = initCubeMatrix();
///////////////////////////////////////////////////////////////////
var groupCube = new GroupCube();
var group = [[0, 0], [0, 1], [1, 1], [1, 2]];  //当前组的位置
var groupColor = [1.0, 0.0, 0.0];
var testGroup = [[0, 0], [0, 0], [0, 0], [0, 0]]; //用于测试当前组是否可以到达
var bias = [[17, 4], [17, 4], [17, 4], [17, 4]];
var cubeNum = new Array(20);  //记载每一行的方块数
var DRAW = false;
var worker;                                      //work的句柄
var ticker;                                      //控制动画的句柄
var keyControl = new KeyControl();
var drag = new Drag(canvas);
var MOVEX = 0;
var MOVEY = 0;
var SCORE = 0;
////////////////////////////////////////
group = groupCube.getNewGroup();
move(group, group, bias);
groupColor = groupCube.getRandomColor();
for(var i = 0; i < 20; i++)
  cubeNum[i] = 0;


function initialite(){
	   DRAW = false;
		 MOVEX = 0;
 		 MOVEY = 0;
	 	 SCORE = 0;
	 	 if(worker) clearInterval(worker); 
	 	 if(ticker) cancelAnimationFrame(ticker); 
	 	 
	 	 group = groupCube.getNewGroup();
		 move(group, group, bias);
		 groupColor = groupCube.getRandomColor();
		 for(var i = 0; i < 20; i++)
  			cubeNum[i] = 0;
  	 for(var i = 0; i < 20; i++)
  	 	for(var j = 0; j < 10; j++)
  	 	  cubematrix[i][j].draw = false;
  	  
  	 keyControl.initialite();
  	 worker = setInterval(work, 1000);  //
  	 ticker = requestAnimationFrame(tick);
}

function gameOver(){ 
	    cancelAnimationFrame(ticker);
		  clearInterval(worker);  
		  keyControl.initialite();
           alert("你输了");
}
///////////////////////////////////////////

function tick(){
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

MOVEX += drag.dx;
MOVEY += drag.dy;
MOVEX = Math.max(Math.min(30.0, MOVEX), -30.0);
MOVEY= Math.max(Math.min(30.0, MOVEY), -30.0);
mvpMatrix = multiply(multiply(rotateY(-MOVEX), rotateX(-MOVEY)), vpMatrix);
  

//绘制正在下坠得方块
if(DRAW)
  for(var i = 0; i < 4; i++)
   drawCube.draw(mvpMatrix, cubematrix[group[i][0]][group[i][1]].center, groupColor);

//绘制已经固定的cube
for(var i = 0; i < 20; i++)
	for(var j = 0; j < 10; j++)
	 if(cubematrix[i][j].draw)
	 	 drawCube.draw(mvpMatrix, cubematrix[i][j].center, cubematrix[i][j].color);
   requestAnimationFrame(tick);
}
//tick(); 


function work(){
DRAW = false;	 
  
	move(testGroup, group, groupCube.toDown);
    if(collisionDown(testGroup) == true){     //若没有碰撞，则更新group的状态                         
      move(group, group, groupCube.toDown);
    } 
    else{	 								    						  	//若底部碰撞，则更新静态区域
    	 
        for(var i = 0; i < 4; i++){
        	cubeNum[group[i][0]]++; 
        	cubematrix[group[i][0]][group[i][1]].color[0] = groupColor[0]; 
        	cubematrix[group[i][0]][group[i][1]].color[1] = groupColor[1]; 
        	cubematrix[group[i][0]][group[i][1]].color[2] = groupColor[2]; 
            cubematrix[group[i][0]][group[i][1]].draw = true;
        } 
        

        clear()//清除
        
         
        group = groupCube.getNewGroup();  //随机产生一个group    
        groupColor = groupCube.getRandomColor();  //随机颜色 
        move(group, group, bias);         //添加偏移
        if(collisionDetect(group) == false){   //如果生成的Cube产生碰撞，停止运行
            gameOver();
        }  
        
    }
DRAW = true;
} 
 

function move(A, B, step){                    //将当前位置移动到下一个位置
	for(var i = 0; i < 4; i++){
	  A[i][0] = B[i][0] + step[i][0];
	  A[i][1] = B[i][1] + step[i][1];
	}
}

function collisionDetect(data){
	for(var i = 0; i < 4; i++){
		//边缘检测
		if(data[i][0] < 0 || data[i][0] >= 20 || data[i][1] < 0 || data[i][1] >= 10)
			return false;
		if(cubematrix[data[i][0]][data[i][1]].draw)
			return false;
	}
	return true;
}

function collisionDown(data){ 
	for(var i = 0; i <4; i++){
		if(data[i][0] < 0 || cubematrix[data[i][0]][data[i][1]].draw)
			return false;
	}
	return true;
}

function clear(){  //用于清除已经满了的行
	var temp = [];
	for(var i = 0; i<20; i++){
	  if(cubeNum[i] == 0)
	  	break;
 
	  if(cubeNum[i] != 10) 
	     temp.push(i); 
	  else{
	  	 SCORE++;     
	     cubeNum[i] = 0;
	     for(var j = 0; j < 10; j++)
	     		cubematrix[i][j].draw = false;
	  } 
	 } 
	for(var i = 0; i < temp.length; i++){
		  if(i == temp[i])
		     continue;
		     
		  cubeNum[i] = cubeNum[temp[i]];
		  cubeNum[temp[i]] = 0; 
		  for(var j = 0; j < 10; j++){
		  	cubematrix[i][j].color[0] = cubematrix[temp[i]][j].color[0];
		  	cubematrix[i][j].color[1] = cubematrix[temp[i]][j].color[1];
		  	cubematrix[i][j].color[2] = cubematrix[temp[i]][j].color[2];
		  	cubematrix[i][j].draw = cubematrix[temp[i]][j].draw;
		  	cubematrix[temp[i]][j].draw = false;
		  	}
	}
	
	
	
}
