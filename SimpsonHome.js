var program;
var canvas;
var gl;

var zoomFactor = 1.2;
var translateFactorX = -0.2;
var translateFactorY = 0.0;

var numTimesToSubdivide = 5;
 
var pointsArray = [];
var normalsArray = [];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[.3, .6, .6];
var at=[.1, .1, 0];
var up=[0, 1, 0];

var cubeCount = 36;
var phoneCount = 36;
var sphereCount = 0;	//13488
var cylinderCount = 0;	//600
var sofaCount = 84;
var rugHalfCircleCount = 132;

var pointTrack = 0;
var flag = true;

const NUM_CONE_POINTS = 200;
const NUM_CYLINDER_POINTS = 600;
let currCylinderPoint = 0;
let cylinderVertA = [];
let cylinderVertB = [];
const cylinderSize = 50;
let nPhi = 100;
let currPointNum = 15224;

var circleOneVert = [];
var circleTwoVert = [];

let PHONE_ANIMATED = false;
const ORIGINAL_PHONE_POS = [0,0,0]
let CURR_PHONE_RECEIVE_POS = ORIGINAL_PHONE_POS
let PHONE_ANIMATE_DOWN = false
// Sofa
var sofaVerts = [
	vec4( 0, 0, 0, 1),			//A(0)
	vec4( 6, 0, 0, 1),			//B(1)
	vec4( 6, 2, 0, 1),			//C(2)
	vec4( 5, 2, 0, 1),			//D(3)
	vec4( 5, 1.1, 0, 1),		//E(4)
	vec4( 1, 1.1, 0, 1),		//F(5)
	vec4( 1, 2, 0, 1),			//G(6)
	vec4( 0, 2, 0, 1),			//H(7)
	
	vec4( 0, 0, -2, 1),			//I(8)
	vec4( 6, 0, -2, 1),			//J(9)
	vec4( 6, 2, -2, 1),			//K(10)
	vec4( 5, 2, -2, 1),			//L(11)
	vec4( 5, 1.1, -2, 1),		//M(12)
	vec4( 1, 1.1, -2, 1),		//N(13)
	vec4( 1, 2, -2, 1),			//O(14)
	vec4( 0, 2, -2, 1),			//P(15)

	vec4( 0, 0, -2, 1),		//Q(16)
	vec4( 6, 0, -2, 1),		//R(17)
	vec4( 6, 3.1, -2, 1),		//S(18)
	vec4( 5.9, 3.5, -2, 1),	//T(19)
	vec4( 5.5, 3.9, -2, 1),	//U(20)
	vec4( 0.5, 3.9, -2, 1),	//V(21)
	vec4( 0.1, 3.5, -2, 1),	//W(22)
	vec4( 0, 3.1, -2, 1),		//X23)

	vec4( 0, 0, -2.4, 1),		//Y(24)
	vec4( 6, 0, -2.4, 1),		//Z(25)
	vec4( 6, 3.1, -2.4, 1),		//ZA(26)
	vec4( 5.9, 3.5, -2.4, 1),	//ZB(27)
	vec4( 5.5, 3.9, -2.4, 1),	//ZC(28)
	vec4( 0.5, 3.9, -2.4, 1),	//ZD(29)
	vec4( 0.1, 3.5, -2.4, 1),	//ZE(30)
	vec4( 0, 3.1, -2.4, 1),		//ZF(31)
];

// Both the front and back parts of the couch have the same # of vertices

function BuildSofa()
{
	// Front Part
	quadS(0, 8, 9, 1);
	quadS(0, 8, 15, 7);
	quadS(7, 15, 14, 6);
	quadS(6, 14, 13, 5);
	quadS(5, 13, 12, 4);
	quadS(4, 12, 11, 3);
	quadS(3, 11, 10, 2);
	quadS(2, 10, 9, 1);

	quadS(13, 8, 15, 14);
	quadS(9, 8, 13, 12);
	quadS(9, 12, 11, 10);

	quadS(5, 0, 7, 6);
	quadS(1, 0, 5, 4);
	quadS(1, 4, 3, 2);

	//Back Part
	quadS(16, 24, 25, 17);
	quadS(16, 24, 31, 23);
	quadS(23, 31, 30, 22);
	quadS(22, 30, 29, 21);
	quadS(21, 29, 28, 20);
	quadS(20, 28, 27, 19);
	quadS(19, 27, 26, 18);
	quadS(18, 26, 25, 17);

	quadS(24, 31, 30, 29);
	quadS(25, 24, 29, 28);
	quadS(25, 28, 27, 26);

	quadS(16, 23, 22, 21);
	quadS(17, 16, 21, 20);
	quadS(17, 20, 19, 18);
}

// Phone base
var phoneVerts = [
		vec4( -0.5, -0.5, -0.5, 1.0),	// A(1)
		vec4( 0.5, -0.5, -0.5, 1.0),	// B(2)
		vec4( 0.0, 0.2, -0.5, 1.0),		// C(3)
		vec4( -0.2, 0.2, -0.5, 1.0),	// D(4)
		vec4( -0.5, -0.5, 0.5, 1.0),	// E(5)
		vec4( 0.5, -0.5, 0.5, 1.0),		// F(6)
		vec4( 0.0, 0.2, 0.5, 1.0),		// G(7)
		vec4( -0.2, 0.2, 0.5, 1.0)		// H(8)
	];

function BuildPhone()
{
	quadP( 1, 0, 3, 2 );
	quadP( 2, 3, 7, 6 );
	quadP( 3, 0, 4, 7 );
	quadP( 6, 5, 1, 2 );
	quadP( 4, 5, 6, 7 );
	quadP( 5, 4, 0, 1 );
}

// Cube
var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];

var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
var lightPosition = vec4(-2, 1, 1, 0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( 0.8, 0.8, 0.8, 1.0 );

// This changes the overall color, sorta
var materialAmbient = vec4( 0.2, 0.2, 0.2, 1.0 );
var materialDiffuse = vec4( 0.8, 0.8, 0.8, 1.0);
var materialSpecular = vec4( 0.0, 0.0, 1.0, 1.0 );
var materialShininess = 50.0;

var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

window.onload = function init() 
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points/normals
    colorCube();		//36 points
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);	//13488
	CylinderPoints();	//600
	BuildSofa();		//84 points
	BuildPhone();		//36 points

	// Build Rug Points 
    HalfCircle();		//132 points

	// Build Lamp Points
	// Lamp head
	generateConePoints(0.6, 0.05, 0.85, vec4(0.79, 0.93, 0.923, 1.0));
						//200 points

	// Lamp stand
	const pA = vec4(0.0, 0.0, 0.0, 1.0);
	const pB = vec4(0.0, 0.0, 1.0, 1.0);
	const barColor = vec4(0.396, 0.428, 0.72, 1.0);
	genenerateCylinderPoints([0, 0], pA, pB, 0.05, barColor, barColor);		//600 points
	genenerateCylinderPoints([0, 0], pA, pB, 0.075, barColor, barColor);	//600 points
	genenerateCylinderPoints([0, 0], pA, pB, 0.1, barColor, barColor);		//600 points

	// Lamp base
	generateConePoints(0.75, 0.1, 0.3, barColor);
						//200 points

	// Phone base
	//BuildPhone();		//36 points

    // pass data onto GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
  
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

	SetupLightMat();

    // support user interface
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};

    // keyboard handle
    //window.onkeydown = HandleKeyboard;
  	// a
	window.addEventListener("keydown", function () {
		if (event.keyCode == 65) {
			PHONE_ANIMATED = true
			PHONE_ANIMATE_DOWN = false
		}
	});



    render();
}

function SetupLightMat()
{
	// Set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	// Send lighting & material coefficient products to GPU
	gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

// ******************************************
// Draw simple and primitive objects
// ******************************************
function DrawSolidSphere(radius)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
 	// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
		{
            gl.drawArrays( gl.TRIANGLES, cubeCount+i, 3 );
			pointTrack += 3;
		}

		while (flag)
		{
			console.log("Tracker says " + pointTrack);
			flag = false;
		}

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth 
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	pointTrack += 36;

	modelViewMatrix=mvMatrixStack.pop();
}

// start drawing the wall
function DrawWall(thickness, which)
{
	var s, t, r;

    if (which == 0)		    // If floor
    {
	    // draw thin wall with top = xz-plane, corner at origin
	    mvMatrixStack.push(modelViewMatrix);

    	t=translate(0.5, 0.5*thickness, 0.5);
	    s=scale4(2.0, thickness, 1.5);
            modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawSolidCube(1);

	    modelViewMatrix=mvMatrixStack.pop();
    }
    else if (which == 1)	// If left Wall
    {
        // draw thin wall with top = xz-plane, corner at origin
	    mvMatrixStack.push(modelViewMatrix);

    	t=translate(0.64, -1.5, 0.5);
	    s=scale4(1.25, thickness, 1.5);
            modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawSolidCube(1);

	    modelViewMatrix=mvMatrixStack.pop();
    }
	else if (which == 2)	// If back wall
	{
		// draw thin wall with top = xz-plane, corner at origin
	    mvMatrixStack.push(modelViewMatrix);

    	t=translate(0.5, 0.5*thickness+0.22, 0.65);
	    s=scale4(2.0, thickness, 1.25);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	    DrawSolidCube(1);

	    modelViewMatrix=mvMatrixStack.pop();
	}
}

// ******************************************
// Draw composite objects
// ******************************************

function DrawTableLeg(thick, len)
{
	var s, t;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, len/2, 0);
	var s=scale4(thick, len, thick);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTable(topWid, topThick, legThick, legLen)
{
	var s, t;

	// draw the table top
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	s=scale4(topWid, topThick, topWid);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
	
	// place the four table legs
	var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	t= translate(dist, 0, dist);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);
       
        // no push and pop between leg placements
	t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);

	t=translate(-2*dist, 0, 2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);

	t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);
	
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCylinder(scaleX, scaleY, scaleZ, turn, phoneReceiveTranslate = [0,0,0]){

	var CylPos = cubeCount + sphereCount;

	var s, r;

    mvMatrixStack.push(modelViewMatrix);

	if (turn == true)
	{
		r=rotate(180.0, 0.0, 0.0, 1.0);
    	modelViewMatrix=mult(modelViewMatrix, r);
	}

    s = scale4(scaleX, scaleY, scaleZ);
    modelViewMatrix = mult(modelViewMatrix, s);

	modelViewMatrix = mult(modelViewMatrix, translate(...phoneReceiveTranslate))

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, CylPos, cylinderCount);

    modelViewMatrix = mvMatrixStack.pop();
}

function DrawTableLamp()
{
	var t, s;

	mvMatrixStack.push(modelViewMatrix);
	materialAmbient = vec4( .5, .5, .5, 1.0 );
    materialDiffuse = vec4( 204/255, 162/255, 131/255, 1.0);
    materialSpecular = vec4( .05, .05, .05, 1.0 );
    materialShiness = 0;
    SetupLightMat();
	t=translate(0.07, 0.37, 0.7);
	modelViewMatrix=mult(modelViewMatrix, t);
	DrawCylinder(0.1, 0.1, 0.1, true);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	materialAmbient = vec4( .5, .5, .5, 1.0 );
    materialDiffuse = vec4( 204/255, 162/255, 131/255, 1.0);
    materialSpecular = vec4( .05, .05, .05, 1.0 );
    materialShiness = 0;
    SetupLightMat();
	t=translate(0.07, 0.1, 0.7);
	modelViewMatrix=mult(modelViewMatrix, t);
	s = scale4(1, 0.1, 1);
	modelViewMatrix = mult(modelViewMatrix, s);
	DrawCylinder(0.109, 0.109, 0.109, true);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
	materialDiffuse = vec4( 86/255, 125/255, 70/255, 1.0);
    materialSpecular = vec4( .05, .05, .05, 1.0 );
    materialShiness = 100;
    SetupLightMat();
	t=translate(0.07, 0.37, 0.7); 
    modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidSphere(0.098);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	materialAmbient = vec4( .75, .75, .75, 1.0 );
	materialDiffuse = vec4( 86/255, 125/255, 70/255, 1.0);
    materialSpecular = vec4( .05, .05, .05, 1.0 );
    materialShiness = 100;
    SetupLightMat();
	t=translate(0.07, 0.45, 0.7);
	modelViewMatrix=mult(modelViewMatrix, t);
	DrawCylinder(0.018, 0.035, 0.018, false);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	materialAmbient = vec4( .8, .8, .8, 1.0 );
	materialDiffuse = vec4( 86/255, 125/255, 70/255, 1.0);
    materialSpecular = vec4( .05, .05, .05, 1.0 );
    materialShiness = 100;
    SetupLightMat();
	t=translate(0.07, 0.57, 0.7); 
    modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidSphere(0.03);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSofa()
{
	var sofaPos = cubeCount + sphereCount + cylinderCount;

	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 244/255, 128/255, 55/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.1, 0.57, 1.0); 
    modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, sofaPos, sofaCount);
	modelViewMatrix = mvMatrixStack.pop();

	sofaPos += sofaCount;

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.1, 0.57, 1.0); 
    modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, sofaPos, sofaCount);
	modelViewMatrix = mvMatrixStack.pop();
}

function DrawRug() {
	var rugPos = 13128;

	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 244/255, 128/255, 55/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();

	mvMatrixStack.push(modelViewMatrix);
	var N = 12
	modelViewMatrix = mult(modelViewMatrix, rotate([180], [0, 1, 0] ));
	s = scale4(0.25, 0.25, 0.25);
	modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(-2.0, 1.0, -6.0); 
    modelViewMatrix = mult(modelViewMatrix, t);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, rugPos, 6*N+(N-2)*2*3);
	pointTrack += (6*N+(N-2)*2*3);
	modelViewMatrix = mvMatrixStack.pop();

}

function DrawPicFrame() {

	// Draw Border
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 244/255, 128/255, 55/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();
	mvMatrixStack.push(modelViewMatrix);
	s = scale4(0.35, .25, 0.05);
	modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(1.4, 4.0, 1); 
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix = mvMatrixStack.pop();

	// Draw Sky
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 86/255, 125/255, 70/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();
	mvMatrixStack.push(modelViewMatrix);
	s = scale4(0.25, .2, 0.01);
	modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(2, 5.1, 10); 
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix = mvMatrixStack.pop();

	// Draw Boat
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 255/255, 0/255, 0/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();
	mvMatrixStack.push(modelViewMatrix);
	s = scale4(0.10, .05, 0.01);
	modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(5, 20, 15); 
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix = mvMatrixStack.pop();


	// Draw Vertical Rod
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 255/255, 255/255, 255/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();
	mvMatrixStack.push(modelViewMatrix);
	s = scale4(0.01, .10, 0.01);
	modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(52, 11.25, 20); 
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix = mvMatrixStack.pop();

	// Draw 1st Sail
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 255/255, 255/255, 255/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();
	mvMatrixStack.push(modelViewMatrix);
	s = scale4(0.05, .05, 0.01);
	modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(10, 23.5, 25); 
    modelViewMatrix = mult(modelViewMatrix, t);
	//modelViewMatrix = mult(modelViewMatrix, rotate([90], [0, 0, 1] ));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix = mvMatrixStack.pop();
}

function DrawFloorLamp() {
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 255/255, 255/255, 255/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();
	mvMatrixStack.push(modelViewMatrix);

	//modelViewMatrix = mult(modelViewMatrix, translate(-0.5, 0, -0.5));
	//modelViewMatrix = mult(modelViewMatrix, rotate(35, vec3(0, 1, 0)));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  
	mvMatrixStack.push(modelViewMatrix);
	//modelViewMatrix = mult(modelViewMatrix, translate(0.0, 2.2, 0.0));
	drawCone(15260,[1,-4,.75], [90, vec3(0.0, 0.0, 1.0)], [.25,.25,.25]);
	drawCylinder(14060,[1.95,-.27,1], [-90, vec3(1.0, 0.0, 0.0)], [.5, 0.25, .5]);
	modelViewMatrix = mvMatrixStack.pop();
  
	drawCylinder(14660,[3.85, 9.95, 1], undefined, [.25,.1, .08]);
	//drawCylinder([0.0, 1.0, 0.0], [-90, vec3(1.0, 0.0, 0.0)]);
	//drawCone(15224,[2, -1.0, 1], [90, vec3(0.0, 0.0, 1.0)], [.25, 0.25, .5]);
	drawCone(13260,[4,-4,1.25], [90, vec3(0.0, 0.0, 1.0)], [.25,.25,.25]);
	modelViewMatrix = mvMatrixStack.pop();
}

function drawCone(
	pointNum,
	translation = [0, 0, 0],
	rotation = [0, vec4(0.0, 0.0, 0.0)],
	scaling = [1.0, 1.0, 1.0]
  ) {
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 255/255, 255/255, 255/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();
	mvMatrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, scale4(...scaling));
	modelViewMatrix = mult(modelViewMatrix, rotate(...rotation));
	modelViewMatrix = mult(modelViewMatrix, translate(...translation));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLE_STRIP, pointNum, NUM_CONE_POINTS);
	currPointNum += NUM_CONE_POINTS;
  
	modelViewMatrix = mvMatrixStack.pop();
}

function drawCylinder(
	pointNum,
	translation = [0, 0, 0],
	rotation = [0, vec4(0.0, 0.0, 0.0)],
	scaling = [1.0, 1.0, 1.0]
  ) {
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 255/255, 255/255, 255/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();
	mvMatrixStack.push(modelViewMatrix);
  
	modelViewMatrix = mult(modelViewMatrix, scale4(...scaling));
	modelViewMatrix = mult(modelViewMatrix, rotate(...rotation));
	modelViewMatrix = mult(modelViewMatrix, translate(...translation));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, pointNum, NUM_CYLINDER_POINTS);
	currPointNum += NUM_CYLINDER_POINTS;
  
	modelViewMatrix = mvMatrixStack.pop();
}

function DrawPhoneBase()
{
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 81/255, 244/255, 248/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();

	var phonePos = cubeCount + sphereCount + cylinderCount + sofaCount + sofaCount;
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(0.1, 0.0525, 0.1);   // scale to the given width/height/depth 
    modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(-1.2, 4.6, -0.2); 
    modelViewMatrix = mult(modelViewMatrix, t);
	r=rotate(270.0, 0.0, 90.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
    gl.drawArrays( gl.TRIANGLES, phonePos, 36);

	modelViewMatrix=mvMatrixStack.pop();

	
}

function DrawPhoneReceive(phoneReceivePos = [0,0,0])
{
	// Receiver
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 73/255, 219/255, 223/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(0.79, 0.3, 0.3);   // scale to the given width/height/depth 
    modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(0.195, 2.65, 2);
	modelViewMatrix=mult(modelViewMatrix, t);
	r=rotate(180.0, 90.0, 90.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
	DrawCylinder(0.05, 0.05, 0.05, true, phoneReceivePos);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(0.15, 0.4, 0.4);   // scale to the given width/height/depth 
    modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(0.255, 1.975, 1.5);
	modelViewMatrix=mult(modelViewMatrix, t);
	r=rotate(180.0, 90.0, 90.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
	DrawCylinder(0.05, 0.05, 0.05, true, phoneReceivePos);
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(0.15, 0.4, 0.4);   // scale to the given width/height/depth 
    modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(1.1, 1.975, 1.5);
	modelViewMatrix=mult(modelViewMatrix, t);
	r=rotate(180.0, 90.0, 90.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
	DrawCylinder(0.05, 0.05, 0.05, true, phoneReceivePos);
	modelViewMatrix=mvMatrixStack.pop();
}

function render()
{
	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.8, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShiness=50;
    SetupLightMat();

	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

   	// set up view and projection
   	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
   	modelViewMatrix=lookAt(eye, at, up);
 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	// Table Lamp
	{
		mvMatrixStack.push(modelViewMatrix);
		t=translate(-0.22, 0.18, -0.32);
		modelViewMatrix=mult(modelViewMatrix, t);
		s=scale4(0.3, 0.4, 0.3);
    	modelViewMatrix = mult(modelViewMatrix, s);
		DrawTableLamp();
		modelViewMatrix=mvMatrixStack.pop();
	}

	// Sofa
	{
		mvMatrixStack.push(modelViewMatrix);
		s=scale4(.12, .11, .12);
    	modelViewMatrix = mult(modelViewMatrix, s);
		DrawSofa();
		modelViewMatrix=mvMatrixStack.pop();
	}
	
	// Table
	{
		materialAmbient = vec4( .5, .5, .5, 1.0 );
    	materialDiffuse = vec4( 115/255, 79/255, 150/255, 1.0);
    	materialSpecular = vec4( .1, .1, .1, 1.0 );
    	materialShiness = 50;
    	SetupLightMat();
		mvMatrixStack.push(modelViewMatrix);
		t=translate(-0.15, 0, -0.05);
    	modelViewMatrix=mult(modelViewMatrix, t);
		DrawTable(0.2, 0.02, 0.02, 0.2);
		modelViewMatrix=mvMatrixStack.pop();
	}
	
	// Walls & Floor
	{
		// floor: wall in xz-plane
		materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
    	materialDiffuse = vec4( 0/255, 246/255, 202/255, 1.0);
    	materialSpecular = vec4( 1, 1, 1, 1.0 );
    	materialShiness=50;
    	SetupLightMat();
		DrawWall(0.02, 0); 
	
		// wall #2: in yz-plane
		materialAmbient = vec4( 1.75, 1.75, 1.75, 1.0 );
    	materialDiffuse = vec4( 255/255, 145/255, 164/255, 1.0);
    	materialSpecular = vec4( 1, 1, 1, 1.0 );
    	materialShiness=50;
    	SetupLightMat();
		mvMatrixStack.push(modelViewMatrix);
		r=rotate(90.0, 0.0, 0.0, 1.0);
        modelViewMatrix=mult(modelViewMatrix, r);
		DrawWall(0.02, 1); 
		modelViewMatrix=mvMatrixStack.pop();
	
		// wall #3: in xy-plane
		mvMatrixStack.push(modelViewMatrix);
		r=rotate(-90, 1.0, 0.0, 0.0);
		//r=rotate(90, 1.0, 0.0, 0.0);  // ??
        modelViewMatrix=mult(modelViewMatrix, r);
		DrawWall(0.02, 2); 
		modelViewMatrix=mvMatrixStack.pop();
	}

	// Rug
	{
		mvMatrixStack.push(modelViewMatrix);
		DrawRug();
		modelViewMatrix=mvMatrixStack.pop();
	}

	// Pic Frame
	{
		mvMatrixStack.push(modelViewMatrix);
		DrawPicFrame();
		modelViewMatrix=mvMatrixStack.pop();
	}

	// Floor Lamp
	{
		mvMatrixStack.push(modelViewMatrix);
		DrawFloorLamp();
		modelViewMatrix=mvMatrixStack.pop();
	}

	// Phone
	{
		mvMatrixStack.push(modelViewMatrix);
		DrawPhoneBase();
		modelViewMatrix=mvMatrixStack.pop();
		if (PHONE_ANIMATED) {
			const [x,y, z] = CURR_PHONE_RECEIVE_POS
			CURR_PHONE_RECEIVE_POS = [x-0.1,y,z]
			if (CURR_PHONE_RECEIVE_POS[0] < -6) {
				PHONE_ANIMATE_DOWN = true
			}
			if (PHONE_ANIMATE_DOWN) {
				CURR_PHONE_RECEIVE_POS = [x+0.1,y,z]
			}
			if (CURR_PHONE_RECEIVE_POS[0] > 0) {
				PHONE_ANIMATED = false
			}
		}
		else {
			CURR_PHONE_RECEIVE_POS = ORIGINAL_PHONE_POS
		}

		mvMatrixStack.push(modelViewMatrix);
		DrawPhoneReceive(CURR_PHONE_RECEIVE_POS);
		modelViewMatrix=mvMatrixStack.pop();
	}

    requestAnimFrame(render);
}

// ******************************************
// supporting functions below this:
// ******************************************
function triangle(a, b, c) 
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));
     
     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

     sphereCount += 3;
}

function divideTriangle(a, b, c, count) 
{
    if ( count > 0 ) 
    {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n) 
{
    	divideTriangle(a, b, c, n);
    	divideTriangle(d, c, b, n);
    	divideTriangle(a, d, b, n);
    	divideTriangle(a, c, d, n);
}

function quad(a, b, c, d) 
{
     	var t1 = subtract(vertices[b], vertices[a]);
     	var t2 = subtract(vertices[c], vertices[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[b]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[d]);
     	normalsArray.push(normal);
}

function quadS(a, b, c, d) 
{
     	var t1 = subtract(sofaVerts[b], sofaVerts[a]);
     	var t2 = subtract(sofaVerts[c], sofaVerts[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

     	pointsArray.push(sofaVerts[a]);
     	normalsArray.push(normal);
     	pointsArray.push(sofaVerts[b]);
     	normalsArray.push(normal);
     	pointsArray.push(sofaVerts[c]);
     	normalsArray.push(normal);
     	pointsArray.push(sofaVerts[a]);
     	normalsArray.push(normal);
     	pointsArray.push(sofaVerts[c]);
     	normalsArray.push(normal);
     	pointsArray.push(sofaVerts[d]);
     	normalsArray.push(normal);
}

function quadP(a, b, c, d) 
{
     	var t1 = subtract(phoneVerts[b], phoneVerts[a]);
     	var t2 = subtract(phoneVerts[c], phoneVerts[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

     	pointsArray.push(phoneVerts[a]);
     	normalsArray.push(normal);
     	pointsArray.push(phoneVerts[b]);
     	normalsArray.push(normal);
     	pointsArray.push(phoneVerts[c]);
     	normalsArray.push(normal);
     	pointsArray.push(phoneVerts[a]);
     	normalsArray.push(normal);
     	pointsArray.push(phoneVerts[c]);
     	normalsArray.push(normal);
     	pointsArray.push(phoneVerts[d]);
     	normalsArray.push(normal);
}

function colorCube()
{
    	quad( 1, 0, 3, 2 );
    	quad( 2, 3, 7, 6 );
    	quad( 3, 0, 4, 7 );
    	quad( 6, 5, 1, 2 );
    	quad( 4, 5, 6, 7 );
    	quad( 5, 4, 0, 1 );
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function Cylinderize() {

	var SIZE = 50;
	var originOne = vec4(0.0, 0.0, 0.0, 1.0);
	var originTwo = vec4(0.0, 3.0, 0.0, 1.0);

	// bottom face
    var t1 = subtract(circleTwoVert[1], circleTwoVert[0]);
    var t2 = subtract(originOne, circleTwoVert[1]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);

	for (var i = 0; i < SIZE; i++) {
		pointsArray.push(originOne);
		pointsArray.push(circleTwoVert[i]); 
		pointsArray.push(circleTwoVert[i + 1]);
		normalsArray.push(normal);
		normalsArray.push(normal);
		normalsArray.push(normal);
		cylinderCount += 3;
	}
	// top face
	var t1 = subtract(circleOneVert[1], circleOneVert[0]);
    var t2 = subtract(originTwo, circleOneVert[1]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
	//negate normal since points are put in counterclockwise;
    normal = negate(normalize(normal));

	for (var i = 0; i < SIZE; i++) {
		pointsArray.push(originTwo);
		pointsArray.push(circleOneVert[i]);
		pointsArray.push(circleOneVert[i + 1]);
		normalsArray.push(normal);
		normalsArray.push(normal);
		normalsArray.push(normal);
		cylinderCount += 3;
	}
	
	for(var i= 0; i < SIZE; i++)
	{
		CylSide(i, i+1, i+1, i);
	}
}

// This draws the side of the cylinders
function CylSide(a, b, c, d) {

	var t1 = subtract(circleOneVert[b], circleOneVert[a]);
    var t2 = subtract(circleTwoVert[c], circleOneVert[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    normal = normalize(normal);

    pointsArray.push(circleOneVert[a]);
    normalsArray.push(normal);
    pointsArray.push(circleOneVert[b]);
    normalsArray.push(normal);
    pointsArray.push(circleTwoVert[c]);
    normalsArray.push(normal);
    pointsArray.push(circleOneVert[a]);
    normalsArray.push(normal);
    pointsArray.push(circleTwoVert[c]);
    normalsArray.push(normal);
    pointsArray.push(circleTwoVert[d]);
    normalsArray.push(normal);
    cylinderCount += 6;
}

function CylinderPoints() {

    var SIZE = 50; // slices
    var center = [0.0, 0.0];
    var radius = 1.0;

    var angle = 2*Math.PI/SIZE;

    // Because LINE_STRIP is used in rendering, SIZE + 1 points are needed
    // to draw SIZE line segments

    // Widdershins circle for the "bottom"
    for  (var i = 0; i < SIZE + 1; i++) {
        //circleTwoVert.push(vec4(center[0] + radius * Math.cos(i * angle), center[1] + radius * Math.sin(i * angle), 0.0, 1));
		circleTwoVert.push(vec4(center[0] + radius * Math.cos(i * angle), 0.0, center[1] + radius * Math.sin(i * angle), 1));
    }

    // CounterClockwise circle for the "top"
    for  (var i = 0; i < SIZE + 1; i++) {
        //circleOneVert.push(vec4(center[0] + radius * Math.cos(i * angle), center[1] + radius * Math.sin(i * angle), 3.0, 1));
		circleOneVert.push(vec4(center[0] + radius * Math.cos(i * angle), 3.0, center[1] + radius * Math.sin(i * angle), 1));
    }

    Cylinderize();
}

function HalfCircle() {
	var height=.1;
    var radius=1.5;
    var num=10;
    var alpha=Math.PI/num;
    
    vertices = [vec4(0, 0, 0, 1)];
    for (var i=num; i>=0; i--)
    {
        vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }

    N=N_Circle=vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape();
}


function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];
 
    // create the face list 
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(j, j+N, (j+1)%N+N, (j+1)%N);   
    }

    // the first N vertices come from the base 
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints);

    // the next N vertices come from the top 
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints);
}


function polygon(indices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(vertices[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);

        prev=next;
        next=next+1;
    }
}

function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}


function generateConePoints(coneR1, coneR2, coneHeight, coneColor) {
	let Phi = 0,
	  dPhi = 2 * Math.PI / (nPhi - 1);
	let Nx = coneR1 - coneR2;
	let Ny = coneHeight;
	let N = Math.sqrt(Nx * Nx + Ny * Ny);
  
	Nx /= N;
	Ny /= N;
  
	for (let i = 0; i < nPhi; i++) {
	  const cosPhi = Math.cos(Phi);
	  const sinPhi = Math.sin(Phi);
	  const cosPhi2 = Math.cos(Phi + dPhi / 2);
	  const sinPhi2 = Math.sin(Phi + dPhi / 2);
  
	  pointsArray.push(vec4(-coneHeight / 2, cosPhi * coneR1, sinPhi * coneR1, 1.0));
	  pointsArray.push(vec4(coneHeight / 2, cosPhi2 * coneR2, sinPhi2 * coneR2, 1.0));
  
	  Phi += dPhi;
	}
}

function genenerateCylinderPoints(
	center,
	pA,
	pB,
	radius,
	sideColor,
	faceColor
  ) {
	const angle = 2 * Math.PI / cylinderSize;
  
	for (let i = 0; i < cylinderSize + 1; i++) {
	  const x = center[0] + radius * Math.cos(i * angle);
	  const y = center[1] + radius * Math.sin(i * angle);
  
	  // Cylinder halves
	  cylinderVertB.push(vec4(x, y, 0.0, 1.0));
	  cylinderVertA.push(vec4(x, y, 3.0, 1.0));
	}
  
	generateCylinderFaces(pA, pB, sideColor, faceColor);
}
  
function generateCylinderFaces(pA, pB, sideColor, faceColor) {
	// Lower face
	// let t1 = subtract(circleTwoVert[1], circleTwoVert[0]);
	// let t2 = subtract(pA, circleTwoVert[1]);
	for (let i = 0; i < cylinderSize; i++) {
	  pointsArray.push(pA);
	  pointsArray.push(cylinderVertB[i]);
	  pointsArray.push(cylinderVertB[i + 1]);
  
	  currCylinderPoint += 3;
	  
	}
  
	// Upper face
	// t1 = subtract(circleOneVert[1], circleOneVert[0]);
	// t2 = subtract(pB, circleOneVert[1]);
	for (let i = 0; i < cylinderSize; i++) {
	  pointsArray.push(pB);
	  pointsArray.push(cylinderVertA[i]);
	  pointsArray.push(cylinderVertA[i + 1]);
  
	  currCylinderPoint += 3;
	}
  
	for (let i = 0; i < cylinderSize; i++) {
	  generateCylinderSides(i, i + 1, i + 1, i, sideColor);
	}
  
	cylinderVertA = [];
	cylinderVertB = [];
}

function generateCylinderSides(a, b, c, d, sideColor) {
	pointsArray.push(cylinderVertA[a]);
	pointsArray.push(cylinderVertA[b]);
	pointsArray.push(cylinderVertB[c]);
	pointsArray.push(cylinderVertA[a]);
	pointsArray.push(cylinderVertB[c]);
	pointsArray.push(cylinderVertB[d]);
  
	currCylinderPoint += 6;
  }