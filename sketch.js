var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var groundImage;

var cloud, cloudGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

function preload(){

    trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png")
    trex_collided = loadAnimation("trex_collided.png");

    groundImage = loadImage("ground2.png");
    cloudImage = loadImage("cloud.png");

    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");
    

    restartImg = loadImage("restart.png");
    gameOverImg = loadImage("gameOver.png");

    jumpSound = loadSound("jump.mp3");
    dieSound = loadSound("die.mp3");
    //checkPointSound = loadSound("checkPoint.mp3");

}

function setup(){
    createCanvas(600, 200);

    trex = createSprite(50, 100, 20, 50);
    trex.addAnimation("running", trex_running)
    trex.addAnimation("collided", trex_collided);

    edges = createEdgeSprites();

    trex.scale = 0.5;
    trex.x = 50;

    ground = createSprite(200, 180, 400, 20);
    ground.addAnimation("running", groundImage);
    ground.x = ground.width/2;

    gameOver = createSprite(300, 100);
    gameOver.addImage(gameOverImg);

    restart =  createSprite(300, 140);
    restart.addImage(restartImg);

    gameOver.scale = 0.8;
    restart.scale = 0.5;

    invisibleGround = createSprite(200, 190, 400, 20);
    invisibleGround.visible = false;

    obstaclesGroup = new Group();
    cloudGroup = new Group();

    //console.log("Hola" + " Mundo");

    //var rand = Math.round(random(1,100))

    //trex.setCollider("rectangle", 0,0,400,trex.height);
    //trex.setCollider("circle", 0,0,40);
    //trex.debug = true;

    score = 0;
}

function draw(){
    background(180);

    text("Score: " + score, 500, 50);

    console.log("esto es ", gameState);

    if(gameState == PLAY){
        
        trex.changeAnimation("running", trex_running);
        
        gameOver.visible = false;
        restart.visible = false;

        ground.velocityX = -(4 + 3 * score/200);

        score= score + Math.round(getFrameRate()/10);

        if(score>0 && score%200 === 0){
            //checkPointSound.play();
        }

        if(ground.x < 0){
            ground.x = ground.width/2;
        }

        if(keyDown("space")){
            trex.velocityY = -10;
        }
    
        if(keyDown("space") && trex.y >= 100){
            trex.velocityY = -10
            jumpSound.play();
        }
    
        spawnClouds();

        spawnObstacles();

        if(obstaclesGroup.isTouching(trex)){
            //trex.velocityY = -12;
            //jumpSound.play();

            gameState = END;
            dieSound.play();
        }

        trex.velocityY = trex.velocityY + 0.5;

    } else if(gameState == END){
        gameOver.visible = true;
        restart.visible = true;
        
        ground.velocityX = 0;
        trex.velocityY = 0;

        trex.changeAnimation("collided", trex_collided);

        obstaclesGroup.setLifetimeEach(-1);
        cloudGroup.setLifetimeEach(-1);

        obstaclesGroup.setVelocityXEach(0);
        cloudGroup.setVelocityXEach(0);

    }

    //console.log(trex.y)

    //trex.collide(edges[0]);
    //trex.collide(edges[1]);
    //trex.collide(edges[2]);
    //trex.collide(edges[3]);

    trex.collide(invisibleGround);
    //console.log(ground.x)

    if(mousePressedOver(restart)){
        reset()
    }


    //var rand = Math.round(random(1,100));
    //console.log(rand);

    drawSprites();
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible =  false;

    obstaclesGroup.destroyEach();
    cloudGroup.destroyEach();
    score = 0;
}

function spawnObstacles(){
    if(frameCount % 150 == 0){
    var obstacle = createSprite(400, 165, 10, 40);
    obstacle.velocityX = - (3 + score/200);
    //obstacle.debug = true;

    var rand = Math.round(random(1,6));
    switch(rand){
        case 1: obstacle.addImage(obstacle1);
                break;
        case 2: obstacle.addImage(obstacle2);
                break;
        case 3: obstacle.addImage(obstacle3);
                break;
        case 4: obstacle.addImage(obstacle4);
                break;
        case 5: obstacle.addImage(obstacle5);
                break;
        case 6: obstacle.addImage(obstacle6);
                break;
                
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 150;

    obstaclesGroup.add(obstacle);
    }
}

function spawnClouds(){
    if(frameCount % 60 == 0){
        cloud = createSprite(600, 100, 40, 10);
        cloud.addImage(cloudImage);
        cloud.y = Math.round(random(10, 60));
        cloud.velocityX = - (3 + score/200);
        cloud.scale = 0.4;
        //console.log(frameCount);

        cloud.lifetime = 200;

        cloud.depth = trex.depth;
        trex.depth = trex.depth + 1;

        cloudGroup.add(cloud);
    }
}
  
