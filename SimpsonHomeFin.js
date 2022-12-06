// Students: Zachary Kent & Pierce Patrick
// Project 4 (Part III): Simpson Home
// Due Dec. 6th

var program;
var canvas;
var gl;

var numTimesToSubdivide = 5;
 
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

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
var rugCount = 132;
var shadeCount = 0;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
	vec2(1, 0),
];

var texture1, texture2, texture3, texture4, texture5, texture6, texture7, texture8, texture9;

var N;
var vertices1 = [];

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

var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 0.2999,
    translateX : 0.1999,
    translateY : -0.466,
    //zoom = 1.2
    //X = -0.2
    //Y =  0

    // Camera rotate control variables.
    phi : 2.659,
    theta:0.99,
    radius : 1,
    dr : 2.0 * Math.PI/180.0,
    //phi = 1.2
    //theta = 0.65
    //radius = 1
    //dr = 2.0 * Math.PI/180.0

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};

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

// Lampshade
// Z stays untouched
var shadeVerts = [
	[0.06,  0.0, 0.0],
	[0.065, 0.0, 0.0],
	[0.065, 0.005, 0.0],
	[0.06,  0.005, 0.0],
	[0.1,   0.15, 0.0],
	[0.102, 0.15, 0.0],
	[0.102, 0.155, 0.0],
	[0.05,  0.005, 0.0],
	[0.06,  0.0, 0.0],
	];

function SurfaceRevPoints()
{
  	//Setup initial points matrix
  	for (var i = 0; i < 9; i++)
  	{
    	vertices1.push(vec4(-1*shadeVerts[i][0], shadeVerts[i][1], 
						shadeVerts[i][2], 1));
  	}

	for (var i = 0; i < 9; i++)
  	{
    	vertices1.push(vec4(-1*shadeVerts[i][0], shadeVerts[i][1], 
						shadeVerts[i][2], 1));
  	}

  	var r;
	var t=Math.PI/8;

	// sweep the original curve another "angle" degree
  	for (var j = 0; j < 17; j++)
  	{
        var angle = (j+1)*t; 

    	// for each sweeping step, generate 18 new points corresponding to the original points
    	for(var i = 0; i < 18; i++ )
    	{
            r = vertices1[i][0];
            vertices1.push(vec4(r*Math.cos(angle), vertices1[i][1], -r*Math.sin(angle), 1));
    	}
  	}

       var N=18; 
       // quad strips are formed slice by slice (not layer by layer)
       for (var i=0; i < 17; i++) // slices
       {
           for (var j=0; j < 17; j++)  // layers
           {
    			quadL(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1)); 
           }
       }    
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
	SurfaceRevPoints();	//1734 points

	// Build Rug Points 
    HalfCircle();		//132 points

	// Lamp stand
	const pA = vec4(0.0, 0.0, 0.0, 1.0);
	const pB = vec4(0.0, 0.0, 1.0, 1.0);
	const barColor = vec4(0.396, 0.428, 0.72, 1.0);
	genenerateCylinderPoints([0, 0], pA, pB, 0.05, barColor, barColor);		//600 points
	genenerateCylinderPoints([0, 0], pA, pB, 0.075, barColor, barColor);	//600 points

	// Lamp base
	generateConePoints(0.75, 0.1, 0.3, barColor);							//200 points	

	Initialize_Buffers();
	Initialize_Textures();
	//openNewTexture("images/boat.jpg");
	//openNewTexture("images/couch.jpg");
	//openNewTexture("images/carpet.jpg");
  
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

	SetupLightMat();

    // keyboard handle
    //window.onkeydown = HandleKeyboard;
	window.addEventListener("keydown", function () {
		if (event.keyCode == 65)
		{
			PHONE_ANIMATED = true
			PHONE_ANIMATE_DOWN = false
			var audioElement = new Audio('telephone-ring-01a.wav')
			audioElement.play();
		}
		else if (this.event.keyCode == 66)
		{
			AllInfo.zoomFactor = 1.2;
			AllInfo.translateX = -0.2;
			AllInfo.translateY = 0;

			AllInfo.phi = 1.2;
			AllInfo.theta = 0.65
			AllInfo.radius = 1;
			AllInfo.dr = 2.0 * Math.PI/180.0;
		}
	});

    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.button == 0) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
        else if (e.button == 1)
        {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
    });

    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.3);
        } else {
            AllInfo.zoomFactor += 0.3;
        }
    });

	document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        //render();
    });

	document.addEventListener("mousemove", function(e) {

        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
        } else if (AllInfo.mouseDownLeft) {
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;
            AllInfo.mousePosOnClickY = e.y;
        }
    });

	console.log(pointsArray.length + "\n" + texCoordsArray.length);

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

function Initialize_Buffers()
{
	// vertex position buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
  
    // Normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    // texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vTexCoord );
}

function Initialize_Textures()
{
        // ------------ Setup Texture 1 -----------
        texture1 = gl.createTexture();

        // create the image object
        texture1.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE0);

        //loadTexture
        texture1.image.src='images/boat.jpg';

        // register the event handler to be called on loading an image
        texture1.image.onload = function() {  loadNewTexture(texture1, gl.TEXTURE0); }

        // ------------ Setup Texture 2 -----------
        texture2 = gl.createTexture();

        // create the image object
        texture2.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE1);

        //loadTexture
        texture2.image.src='images/couch.jpg';

        // register the event handler to be called on loading an image
        texture2.image.onload = function() {  loadNewTexture(texture2, gl.TEXTURE1); }

        // ------------ Setup Texture 3 -----------
        texture3 = gl.createTexture();

        // create the image object
        texture3.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE2);

        //loadTexture
        texture3.image.src='images/carpet.jpg';

        // register the event handler to be called on loading an image
        texture3.image.onload = function() {  loadNewTexture(texture3, gl.TEXTURE2); }

		// ------------ Setup Texture 4 -----------
        texture4 = gl.createTexture();

        // create the image object
        texture4.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE3);

        //loadTexture
        texture4.image.src='images/Homer.jpg';

        // register the event handler to be called on loading an image
        texture4.image.onload = function() {  loadNewTexture(texture4, gl.TEXTURE3); }

		// ------------ Setup Texture 5 -----------
        texture5 = gl.createTexture();

        // create the image object
        texture5.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE4);

        //loadTexture
        texture5.image.src='images/Marge.jpg';

        // register the event handler to be called on loading an image
        texture5.image.onload = function() {  loadNewTexture(texture5, gl.TEXTURE4); }

		// ------------ Setup Texture 6 -----------
        texture6 = gl.createTexture();

        // create the image object
        texture6.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE5);

        //loadTexture
        texture6.image.src='images/Lisa.jpg';

        // register the event handler to be called on loading an image
        texture6.image.onload = function() {  loadNewTexture(texture6, gl.TEXTURE5); }

		// ------------ Setup Texture 7 -----------
        texture7 = gl.createTexture();

        // create the image object
        texture7.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE6);

        //loadTexture
        texture7.image.src='images/Maggie.jpg';

        // register the event handler to be called on loading an image
        texture7.image.onload = function() {  loadNewTexture(texture7, gl.TEXTURE6); }

		// ------------ Setup Texture 8 -----------
        texture8 = gl.createTexture();

        // create the image object
        texture8.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE7);

        //loadTexture
        texture8.image.src='images/Bart.jpg';

        // register the event handler to be called on loading an image
        texture8.image.onload = function() {  loadNewTexture(texture8, gl.TEXTURE7); }

		// ------------ Setup Texture 9 -----------
        texture9 = gl.createTexture();

        // create the image object
        texture9.image = new Image();
  
        // Enable texture unit 1
        gl.activeTexture(gl.TEXTURE7);

        //loadTexture
        texture9.image.src='images/family.jpg';

        // register the event handler to be called on loading an image
        texture9.image.onload = function() {  loadNewTexture(texture9, gl.TEXTURE8); }
}

function loadNewTexture(texture, whichTexture)
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 1
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // v1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    // set the texture parameters
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
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

    	t=translate(0.64, -1.49, 0.5);
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

    	t=translate(0.5, 0.5*thickness+0.23, 0.63);
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

	// Panels of the table (xz plane section)
	{
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0, legLen, 0);
		s=scale4(topWid, topThick, topWid);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidCube(1);
		modelViewMatrix=mvMatrixStack.pop();

		mvMatrixStack.push(modelViewMatrix);
		t=translate(0, legLen*.7, 0);
		s=scale4(topWid - 0.02, topThick, topWid - 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidCube(1);
		modelViewMatrix=mvMatrixStack.pop();
	
		mvMatrixStack.push(modelViewMatrix);
		t=translate(0, legLen/4, 0);
		s=scale4(topWid - 0.02, topThick, topWid - 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidCube(1);
		modelViewMatrix=mvMatrixStack.pop();
	}

	// Walls of the table (Y plane section)
	{
		mvMatrixStack.push(modelViewMatrix);
		t=translate(topWid-0.365, legLen/1.65, 0);
		s=scale4(topThick, topWid - 0.05, topWid - 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidCube(1);
		modelViewMatrix=mvMatrixStack.pop();

		mvMatrixStack.push(modelViewMatrix);
		t=translate(topWid-0.145, legLen/1.65, 0);
		s=scale4(topThick, topWid - 0.05, topWid - 0.02);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidCube(1);
		modelViewMatrix=mvMatrixStack.pop();

		mvMatrixStack.push(modelViewMatrix);
		t=translate(0, legLen/1.65, -0.11);
		s=scale4(topWid - 0.02, topWid - 0.05, topThick);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidCube(1);
		modelViewMatrix=mvMatrixStack.pop();
	}

	// Drawer
	{
		materialAmbient = vec4( .2, .2, .2, 1.0 );
		materialDiffuse = vec4( 0/255, 0/255, 0/255, 1.0);
		materialSpecular = vec4( .1, .1, .1, 1.0 );
		materialShiness = 0;
		SetupLightMat();

		mvMatrixStack.push(modelViewMatrix);
		t=translate(0, 0.216, 0);
		s=scale4(1/4.2, 1/15, 1/4.2);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidCube(1);
		modelViewMatrix=mvMatrixStack.pop();

		mvMatrixStack.push(modelViewMatrix);
		materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
		materialDiffuse = vec4( 0/255, 128/255, 128/255, 1.0);
    	materialSpecular = vec4( .05, .05, .05, 1.0 );
    	materialShiness = 100;
    	SetupLightMat();
		t=translate(0, 0.216, 0.136);
		s=scale4(1/8, 1/8, 1/8);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
		DrawSolidSphere(0.098);
		modelViewMatrix=mvMatrixStack.pop();

		materialAmbient = vec4( .5, .5, .5, 1.0 );
    	materialDiffuse = vec4( 115/255, 79/255, 150/255, 1.0);
    	materialSpecular = vec4( .1, .1, .1, 1.0 );
    	materialShiness = 50;
    	SetupLightMat();

		mvMatrixStack.push(modelViewMatrix);
		t=translate(0, 0.2118, 0);
		s=scale4(1/5.05, 1/18, 1/4);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		DrawSolidCube(1);
		modelViewMatrix=mvMatrixStack.pop();
	}
	
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
	t=translate(0.1, 0.17, 1.0); 
    modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, sofaPos, sofaCount);
	modelViewMatrix = mvMatrixStack.pop();

	sofaPos += sofaCount;

	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.1, 0.17, 1.0); 
    modelViewMatrix = mult(modelViewMatrix, t);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, sofaPos, sofaCount);
	modelViewMatrix = mvMatrixStack.pop();
}

function DrawRug() {
	var rugPos = cubeCount + sphereCount + cylinderCount + sofaCount +
				 sofaCount + phoneCount + shadeCount;

	mvMatrixStack.push(modelViewMatrix);
	var N = 12
	modelViewMatrix = mult(modelViewMatrix, rotate([180], [0, 1, 0] ));
	s = scale4(0.35, 0.25, 0.2);
	modelViewMatrix = mult(modelViewMatrix, s);
	t = translate(-1., 0.084, -2.75); 
    modelViewMatrix = mult(modelViewMatrix, t);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays( gl.TRIANGLES, rugPos, 6*N+(N-2)*2*3);
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
	s = scale4(0.35, .25, 0.03);
	modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(1.05, 3, -7.8); 
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix = mvMatrixStack.pop();

	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture+

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);  // fragment shader to use gl.TEXTURE0
	mvMatrixStack.push(modelViewMatrix);
	s = scale4(0.34, .245, 0.03);
	modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(1.08, 3.06, -7.75); 
    modelViewMatrix = mult(modelViewMatrix, t);
	r=rotate(180.0, 0.0, 0.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix = mvMatrixStack.pop();
}

function DrawPainting() {

	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 244/255, 128/255, 55/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();

	mvMatrixStack.push(modelViewMatrix);
	s = scale4(0.35, .35, 0.03);
	modelViewMatrix = mult(modelViewMatrix, s);
	t=translate(-0.5, 2.5, -7.8); 
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix = mvMatrixStack.pop();

	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 2);  // start using texture+
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 8);  // fragment shader to use gl.TEXTURE0
	// Family
	{
		mvMatrixStack.push(modelViewMatrix);
		s = scale4(0.349, .33, 0.01);
		modelViewMatrix = mult(modelViewMatrix, s);
		t=translate(-.5, 2.65, -22.3); 
    	modelViewMatrix = mult(modelViewMatrix, t);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    	gl.drawArrays( gl.TRIANGLES, 0, 36);
		modelViewMatrix = mvMatrixStack.pop();
	}

}

function DrawFloorLamp() {
	lampPos = cubeCount + sphereCount + cylinderCount + sofaCount +
			sofaCount + phoneCount + shadeCount + rugCount;

	materialAmbient = vec4( .2, .2, .2, 1.0 );
	materialDiffuse = vec4( 196/255, 202/255, 206/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();

	drawCylinder(lampPos,[4.1, 7.5, 0.4], undefined, [.25,.1, .08]);					// Shade Holder
	//15194 originally
	lampPos += 600;

	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 208/255, 100/255, 208/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();
	mvMatrixStack.push(modelViewMatrix);

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  
	drawCylinder(lampPos,[2.02, -.12 , 0], [-90, vec3(1.0, 0.0, 0.0)], [.5, 0.25, .5]);	// Main Pole
	//15794 originally
	lampPos += 600;
	drawCone(lampPos,[0.24,-4,.25], [90, vec3(0.0, 0.0, 1.0)], [.25,.25,.25]);			// Base
	//16794 originally

	lightPosition = vec4(-2, 1, 1, 0 );
}

function drawCone(
	pointNum,
	translation = [0, 0, 0],
	rotation = [0, vec4(0.0, 0.0, 0.0)],
	scaling = [1.0, 1.0, 1.0]
  ) {
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
	t=translate(-1.2, 5.4, -0.2); 
    modelViewMatrix = mult(modelViewMatrix, t);
	r=rotate(270.0, 0.0, 90.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	
    gl.drawArrays( gl.TRIANGLES, phonePos, 36);
	modelViewMatrix=mvMatrixStack.pop();

	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 244/255, 244/255, 244/255, 1.0);
    materialSpecular = vec4( .1, .1, .1, 1.0 );
    materialShiness = 0;
    SetupLightMat();

	for (let i = -0.1025; i > -0.1525; i += -0.02)
	{
		mvMatrixStack.push(modelViewMatrix);
		t=translate(i, 0.29, -0.009); 
    	modelViewMatrix = mult(modelViewMatrix, t);
		r=rotate(45, 45, 0, 1.0);
		modelViewMatrix = mult(modelViewMatrix, r);
		DrawSolidCube(0.011);
		modelViewMatrix=mvMatrixStack.pop();
	}

	for (let i = -0.1025; i > -0.1525; i += -0.02)
	{
		mvMatrixStack.push(modelViewMatrix);
		t=translate(i, 0.28, 0.0035); 
    	modelViewMatrix = mult(modelViewMatrix, t);
		r=rotate(45, 45, 0, 1.0);
		modelViewMatrix = mult(modelViewMatrix, r);
		DrawSolidCube(0.01);
		modelViewMatrix=mvMatrixStack.pop();
	}

	for (let i = -0.1025; i > -0.1525; i += -0.02)
	{
		mvMatrixStack.push(modelViewMatrix);
		t=translate(i, 0.269, 0.015); 
    	modelViewMatrix = mult(modelViewMatrix, t);
		r=rotate(45, 45, 0, 1.0);
		modelViewMatrix = mult(modelViewMatrix, r);
		DrawSolidCube(0.012);
		modelViewMatrix=mvMatrixStack.pop();
	}
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

function DrawLampshade(xlength,ylength,zlength)
{
	var shadePos = cubeCount + sphereCount + cylinderCount + sofaCount + sofaCount + phoneCount;

  	mvMatrixStack.push(modelViewMatrix);
  	r=rotate(180,1,0,0);
  	s=scale4(xlength, ylength, zlength );   // scale to the given radius
	modelViewMatrix = mult(modelViewMatrix,r);
	modelViewMatrix = mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  
    gl.drawArrays( gl.TRIANGLES, shadePos, 1734);

  	modelViewMatrix=mvMatrixStack.pop();
}

function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

   	// set up view and projection


    projectionMatrix = ortho( left*AllInfo.zoomFactor - AllInfo.translateX,
                              right*AllInfo.zoomFactor - AllInfo.translateX,
                              bottom*AllInfo.zoomFactor - AllInfo.translateY,
                              ytop*AllInfo.zoomFactor - AllInfo.translateY,
                              near, far);


	eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
				AllInfo.radius*Math.sin(AllInfo.theta),
				AllInfo.radius*Math.sin(AllInfo.phi));

   	modelViewMatrix=lookAt(eye, at, up);

 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 0.8, 0.8, 0.8, 1.0);
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShiness = 50;
    SetupLightMat();
	
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);  // stop using texture

	// Table Lamp
	{
		mvMatrixStack.push(modelViewMatrix);
		t=translate(-0.22, 0.225, -0.32);
		modelViewMatrix=mult(modelViewMatrix, t);
		s=scale4(0.3, 0.4, 0.3);
    	modelViewMatrix = mult(modelViewMatrix, s);
		DrawTableLamp();
		modelViewMatrix=mvMatrixStack.pop();

		// Lampshade
		{
			lightPosition = vec4(-0.21, 0.475, -0.15, 0 );
			materialAmbient = vec4( .2, .2, .2, 1.0 );
    		materialDiffuse = vec4( 238/255, 100/255, 238/255, 1.0);
    		materialSpecular = vec4( .1, .1, .1, 1.0 );
	    	materialShiness = 50;
   			SetupLightMat();

			mvMatrixStack.push(modelViewMatrix);
			t=translate(-0.20, 0.55, -0.11);
    	  	modelViewMatrix=mult(modelViewMatrix,t);
      	
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	        DrawLampshade(0.75, 0.75, 0.75);
  			modelViewMatrix=mvMatrixStack.pop();
		}
	}

	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // start using texture

	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);  // fragment shader to use gl.TEXTURE0
	// Sofa
	{
		mvMatrixStack.push(modelViewMatrix);
		s=scale4(.12, .11, .12);
    	modelViewMatrix = mult(modelViewMatrix, s);
		DrawSofa();
		modelViewMatrix=mvMatrixStack.pop();
	}
	
	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);  // stop using texture
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
		DrawTable(0.255, 0.02, 0.02, 0.25);
		modelViewMatrix=mvMatrixStack.pop();

		// Books
		{
			// Book 1
			lightPosition = vec4(-20, 10, 1, 0 );
			materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
    		materialDiffuse = vec4( 0/255, 147.6/255, 121.2/255, 1.0);
    		materialSpecular = vec4( 1, 1, 1, 1.0 );
    		materialShiness = 20;
    		SetupLightMat();

			mvMatrixStack.push(modelViewMatrix);
			t=translate(-0.066, 0.114, 0);
			s=scale4(0.02, 0.08, 0.1);
			r=rotate(-10.0, 0.0, 0.0, 1.0);
    		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			DrawSolidCube(1);
			modelViewMatrix=mvMatrixStack.pop();

			// Book 2
			lightPosition = vec4(-20, 10, 1, 0 );
			materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
    		materialDiffuse = vec4( 0/255, 246/255, 202/255, 1.0);
    		materialSpecular = vec4( 1, 1, 1, 1.0 );
    		materialShiness = 20;
    		SetupLightMat();

			mvMatrixStack.push(modelViewMatrix);
			t=translate(-0.09, 0.114, 0);
			s=scale4(0.02, 0.08, 0.1);
			r=rotate(-15.0, 0.0, 0.0, 1.0);
    		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			DrawSolidCube(1);
			modelViewMatrix=mvMatrixStack.pop();

			// Book 3
			lightPosition = vec4(-20, 10, 1, 0 );
			materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
    		materialDiffuse = vec4( 252/255, 156/255, 36/255, 1.0);
    		materialSpecular = vec4( 1, 1, 1, 1.0 );
    		materialShiness = 20;
    		SetupLightMat();

			mvMatrixStack.push(modelViewMatrix);
			t=translate(-0.1113, 0.114, 0);
			s=scale4(0.02, 0.08, 0.1);
			r=rotate(-15.0, 0.0, 0.0, 1.0);
    		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			DrawSolidCube(1);
			modelViewMatrix=mvMatrixStack.pop();

			// Book 4
			lightPosition = vec4(-20, 10, 1, 0 );
			materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
    		materialDiffuse = vec4( 101/255, 67/255, 33/255, 1.0);
    		materialSpecular = vec4( 1, 1, 1, 1.0 );
    		materialShiness = 20;
    		SetupLightMat();

			mvMatrixStack.push(modelViewMatrix);
			t=translate(-0.14, 0.114, 0);
			s=scale4(0.02, 0.08, 0.1);
			r=rotate(-27.0, 0.0, 0.0, 1.0);
    		modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			DrawSolidCube(1);
			modelViewMatrix=mvMatrixStack.pop();
		}
	}

	// Walls & Floor
	{
		gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 1);  // start using texture
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);  // fragment shader to use gl.TEXTURE0
		// floor: wall in xz-plane
		lightPosition = vec4(-0.11, 0.475, -0.15, -2 );
		materialAmbient = vec4( .1,.1,.1,.1 );
    	materialDiffuse = vec4( 0/255, 246/255, 202/255, 1.0);
    	materialSpecular = vec4( 0,0,0,1 );
    	materialShiness = 0;
    	SetupLightMat();

		DrawWall(0.02, 0); 

		gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);  // stop using texture
	
		lightPosition = vec4(-0.21, 0.475, -0.15, 0 );
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
        modelViewMatrix=mult(modelViewMatrix, r);
		DrawWall(0.02, 2); 
		modelViewMatrix=mvMatrixStack.pop();
	}

	// Rug
	{
		// Layer 1
		{
			lightPosition = vec4(-0.11, 0.475, -0.15, -2 );
			materialAmbient = vec4( .2, .2, .2, 1.0 );
    		materialDiffuse = vec4( 229.5/255, 130/255, 147.6/255, 1.0);
	    	materialSpecular = vec4( .1, .1, .1, 1.0 );
    		materialShiness = 0;
    		SetupLightMat();

			mvMatrixStack.push(modelViewMatrix);
			t=translate(0, -0.01, 0);
			modelViewMatrix=mult(modelViewMatrix, t)
			DrawRug();
			modelViewMatrix=mvMatrixStack.pop();

			mvMatrixStack.push(modelViewMatrix);
			t=translate(0, 0.057, 1.09);
			r=rotate(180.0, 300.0, 0.0, 1.0);
    		modelViewMatrix=mult(mult(modelViewMatrix, t), r);
			DrawRug();
			modelViewMatrix=mvMatrixStack.pop();
		}

		// Layer 2
		{
			lightPosition = vec4(-0.11, 0.475, -0.15, -2 );
			materialAmbient = vec4( .2, .2, .2, 1.0 );
    		materialDiffuse = vec4( 116/255, 72/255, 118/255, 1.0);
	    	materialSpecular = vec4( .1, .1, .1, 1.0 );
    		materialShiness = 0;
    		SetupLightMat();

			mvMatrixStack.push(modelViewMatrix);
			s = s=scale4(.8, .7, .7);
			modelViewMatrix = mult(modelViewMatrix, s);
			t=translate(0.09, 0.009, 0.225);
			modelViewMatrix = mult(modelViewMatrix, t);
			DrawRug();
			modelViewMatrix=mvMatrixStack.pop();

			mvMatrixStack.push(modelViewMatrix);
			t=translate(0.09, .075, 1.32);
			r=rotate(180.0, 300.0, 0.0, 1.0);
			s = s=scale4(.8, .7, .7);
			modelViewMatrix = mult(modelViewMatrix, s);
    		modelViewMatrix=mult(mult(modelViewMatrix, t), r);
			DrawRug();
			modelViewMatrix=mvMatrixStack.pop();
		}

		// Layer 3
		{
			{
				lightPosition = vec4(-0.11, 0.475, -0.15, -2 );
				materialAmbient = vec4( .2, .2, .2, 1.0 );
				materialDiffuse = vec4( 141/255, 186/255, 206/255, 1.0);
				materialSpecular = vec4( .1, .1, .1, 1.0 );
				materialShiness = 0;
				SetupLightMat();
	
				mvMatrixStack.push(modelViewMatrix);
				s = s=scale4(.6, .4, .4);
				modelViewMatrix = mult(modelViewMatrix, s);
				t=translate(0.24, 0.06, 0.775);
				modelViewMatrix = mult(modelViewMatrix, t);
				DrawRug();
				modelViewMatrix=mvMatrixStack.pop();
	
				mvMatrixStack.push(modelViewMatrix);
				t=translate(0.24, .128, 1.87);
				r=rotate(180.0, 300.0, 0.0, 1.0);
				s = s=scale4(.6, .4, .4);
				modelViewMatrix = mult(modelViewMatrix, s);
				modelViewMatrix=mult(mult(modelViewMatrix, t), r);
				DrawRug();
				modelViewMatrix=mvMatrixStack.pop();
			}
		}
	}

	// Pic Frame
	{
		mvMatrixStack.push(modelViewMatrix);
		DrawPicFrame();
		modelViewMatrix=mvMatrixStack.pop();
	}

	gl.uniform1i(gl.getUniformLocation(program, "textureFlag"), 0);  // stop using texture
	// Floor Lamp
	{
		mvMatrixStack.push(modelViewMatrix);
		DrawFloorLamp();
		modelViewMatrix=mvMatrixStack.pop();

		// Lampshade
		{
			lightPosition = vec4(0.7, 1.0, 0.4, 0 );
			materialAmbient = vec4( .2, .2, .2, 1.0 );
    		materialDiffuse = vec4( 244/255, 128/255, 55/255, 1.0);
    		materialSpecular = vec4( .1, .1, .1, 1.0 );
	    	materialShiness = 0;
   			SetupLightMat();

			mvMatrixStack.push(modelViewMatrix);
			t=translate(0.98, 0.78, 0.23);
    	  	modelViewMatrix=mult(modelViewMatrix,t);
			r = rotate(40, -35, -25, 1.0);
			modelViewMatrix=mult(modelViewMatrix,r);
      	
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	        DrawLampshade(1.25, 1.25, 1.25);
  			modelViewMatrix=mvMatrixStack.pop();

			lightPosition = vec4(-2, 1, 1, 0 );
		}
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
        t=translate(-.21,-0.486,-0.6275);
    	modelViewMatrix=mult(modelViewMatrix,t);
		DrawPhoneReceive(CURR_PHONE_RECEIVE_POS);
		modelViewMatrix=mvMatrixStack.pop();
	}

	// Family
	{
		mvMatrixStack.push(modelViewMatrix);
		DrawPainting();
		modelViewMatrix=mvMatrixStack.pop();
	}

	console.log("phi: " + AllInfo.phi + "\ntheta: " + AllInfo.theta);
    console.log("zoom: " + AllInfo.zoomFactor + "\ntransX: " + AllInfo.translateX +
                "\ntansY: " + AllInfo.translateY);

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

	 texCoordsArray.push(texCoord[0]);
	 texCoordsArray.push(texCoord[1]);
	 texCoordsArray.push(texCoord[2]);

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

		// Triangle a-b-c
     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
		texCoordsArray.push(texCoord[0]);

     	pointsArray.push(vertices[b]);
     	normalsArray.push(normal);
		texCoordsArray.push(texCoord[1]);

     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
		texCoordsArray.push(texCoord[2]);

		// Triangle a-c-d
     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
		texCoordsArray.push(texCoord[0]);

     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
		texCoordsArray.push(texCoord[2]);

     	pointsArray.push(vertices[d]);
     	normalsArray.push(normal);
		texCoordsArray.push(texCoord[3]);
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
	texCoordsArray.push(texCoord[0]);

    pointsArray.push(sofaVerts[b]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[1]);

	pointsArray.push(sofaVerts[c]);
   	normalsArray.push(normal);
	texCoordsArray.push(texCoord[2]);

    pointsArray.push(sofaVerts[a]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[0]);

    pointsArray.push(sofaVerts[c]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[2]);

    pointsArray.push(sofaVerts[d]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[3]);
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
	texCoordsArray.push(texCoord[0]);

    pointsArray.push(phoneVerts[b]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[1]);

    pointsArray.push(phoneVerts[c]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[2]);

    pointsArray.push(phoneVerts[a]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[0]);

    pointsArray.push(phoneVerts[c]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[2]);

    pointsArray.push(phoneVerts[d]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[3]);
}

function quadL(a, b, c, d) {

	var indices=[a, b, c, d];
	var normal = NewellL(indices);

	// triangle a-b-c
	pointsArray.push(vertices1[a]); 
	normalsArray.push(normal); 
	texCoordsArray.push(texCoord[0]);

	pointsArray.push(vertices1[b]); 
	normalsArray.push(normal); 
	texCoordsArray.push(texCoord[1]); 

	pointsArray.push(vertices1[c]); 
	normalsArray.push(normal);   
	texCoordsArray.push(texCoord[2]); 

	// triangle a-c-d
	pointsArray.push(vertices1[a]);  
	normalsArray.push(normal); 
	texCoordsArray.push(texCoord[0]); 

	pointsArray.push(vertices1[c]); 
	normalsArray.push(normal); 
	texCoordsArray.push(texCoord[2]); 

	pointsArray.push(vertices1[d]); 
	normalsArray.push(normal);    
	texCoordsArray.push(texCoord[3]);
	
	shadeCount += 6;
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
		texCoordsArray.push(texCoord[0]);
	  	texCoordsArray.push(texCoord[1]);
	  	texCoordsArray.push(texCoord[2]);
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
		texCoordsArray.push(texCoord[0]);
	  	texCoordsArray.push(texCoord[1]);
	  	texCoordsArray.push(texCoord[2]);
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
	texCoordsArray.push(texCoord[0]);

    pointsArray.push(circleOneVert[b]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[1]);

    pointsArray.push(circleTwoVert[c]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[2]);

    pointsArray.push(circleOneVert[a]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[0]);

    pointsArray.push(circleTwoVert[c]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[2]);

    pointsArray.push(circleTwoVert[d]);
    normalsArray.push(normal);
	texCoordsArray.push(texCoord[3]);

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
		texCoordsArray.push(texCoord[0]);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);
		texCoordsArray.push(texCoord[1]);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);
		texCoordsArray.push(texCoord[2]);

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

function NewellL(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (vertices1[index][1] - vertices1[nextIndex][1])*
            (vertices1[index][2] + vertices1[nextIndex][2]);
       y += (vertices1[index][2] - vertices1[nextIndex][2])*
            (vertices1[index][0] + vertices1[nextIndex][0]);
       z += (vertices1[index][0] - vertices1[nextIndex][0])*
            (vertices1[index][1] + vertices1[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function generateConePoints(coneR1, coneR2, coneHeight) {
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
	  texCoordsArray.push(texCoord[0]);
	  texCoordsArray.push(texCoord[1]);
  
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

	  texCoordsArray.push(texCoord[0]);
	  texCoordsArray.push(texCoord[1]);
	  texCoordsArray.push(texCoord[2]);
  
	  currCylinderPoint += 3;
	  
	}
  
	// Upper face
	// t1 = subtract(circleOneVert[1], circleOneVert[0]);
	// t2 = subtract(pB, circleOneVert[1]);
	for (let i = 0; i < cylinderSize; i++) {
	  pointsArray.push(pB);
	  pointsArray.push(cylinderVertA[i]);
	  pointsArray.push(cylinderVertA[i + 1]);

	  texCoordsArray.push(texCoord[0]);
	  texCoordsArray.push(texCoord[1]);
	  texCoordsArray.push(texCoord[2]);
  
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

	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[1]);
	texCoordsArray.push(texCoord[2]);
	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[2]);
	texCoordsArray.push(texCoord[3]);
  
	currCylinderPoint += 6;
  }
