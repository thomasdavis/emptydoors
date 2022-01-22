import React from "react";
import _ from "lodash";
//armour
// how to generate sprites
const races = {
  orc: {
    sprite: "",
    movement_speed_modifier: 0.1,
    attack_speed_modifier: 0.1,
    projectile_modifier: 0.1,
    melee_modifier: 0.1,
    magic_modifier: 0.1,
    health_modifier: 0.1,
  },
};
/*
axe
sword
spear
arrows
magic
*/
const weapons = {
  spear: {
    damage: 10,
    attack_speed: 20,
    range: 100,
    type: "projectile",
  },
  magic: {
    damage: 10,
    attack_speed: 20,
    range: 100,
    type: "projectile",
  },
  axe: {
    damage: 10,
    attack_speed: 20,
    range: 100,
    type: "melee",
  },
  arrow: {
    damage: 10,
    attack_speed: 20,
    range: 100,
    type: "projectile",
  },
};

const saveState = {
  you: {
    movement_speed: 20,
    health: 100,
    attack_speed: 20,
    weapon: "magic",
    name: "Thomas",
    race: "orc",
    status: "me",
    team: "ally",
    uid: "asd",
    last_attack_tick: 0,
    last_velocity_tick: 0,
  },
  allies: [
    {
      movement_speed: 20,
      health: 100,
      attack_speed: 20,
      weapon: "spear",
      name: "Jemel",
      race: "orc",
      status: "ally",
      uid: "asdd",
      last_attack_tick: 0,
      last_velocity_tick: 0,
      team: "ally",
    },
    {
      movement_speed: 20,
      health: 100,
      attack_speed: 20,
      weapon: "magic",
      name: "James",
      race: "orc",
      status: "ally",
      uid: "asd1212",
      last_attack_tick: 0,
      last_velocity_tick: 0,
      team: "ally",
    },
  ],
  enemies: [
    {
      movement_speed: 20,
      health: 100,
      attack_speed: 20,
      weapon: "axe",
      name: "Roland",
      race: "orc",
      status: "enemy",
      uid: "asxxxxd",
      last_attack_tick: 0,
      last_velocity_tick: 0,
      team: "enemy",
    },
    {
      movement_speed: 20,
      health: 100,
      attack_speed: 20,
      weapon: "arrow",
      name: "Curry",
      race: "orc",
      status: "enemy",
      uid: "asx22xxd",
      last_attack_tick: 0,
      last_velocity_tick: 0,
      team: "enemy",
    },
  ],
};
function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}
function angle(originX, originY, targetX, targetY) {
  var dx = originX - targetX;
  var dy = originY - targetY;

  // var theta = Math.atan2(dy, dx); // [0, Ⲡ] then [-Ⲡ, 0]; clockwise; 0° = west
  // theta *= 180 / Math.PI; // [0, 180] then [-180, 0]; clockwise; 0° = west
  // if (theta < 0) theta += 360; // [0, 360]; clockwise; 0° = west

  var theta = Math.atan2(-dy, dx); // [0, Ⲡ] then [-Ⲡ, 0]; anticlockwise; 0° = west
  theta *= 180 / Math.PI; // [0, 180] then [-180, 0]; anticlockwise; 0° = west
  if (theta < 0) theta += 360; // [0, 360]; anticlockwise; 0° = west

  // var theta = Math.atan2(dy, -dx); // [0, Ⲡ] then [-Ⲡ, 0]; anticlockwise; 0° = east
  // theta *= 180 / Math.PI;          // [0, 180] then [-180, 0]; anticlockwise; 0° = east
  // if (theta < 0) theta += 360;     // [0, 360]; anticlockwise; 0° = east

  // var theta = Math.atan2(-dy, -dx); // [0, Ⲡ] then [-Ⲡ, 0]; clockwise; 0° = east
  // theta *= 180 / Math.PI; // [0, 180] then [-180, 0]; clockwise; 0° = east
  // if (theta < 0) theta += 360; // [0, 360]; clockwise; 0° = east

  return theta;
}
function makeNewCreature(options) {}

function spawnAll() {
  // make you
  // make allies
  // make enemies (similar to your party size)
  // random creatures (neutral)
  const creature = makeCreature();
}

let carrotTex = null; // PIXI.Texture.fromImage("spear.png");

class Game extends React.Component {
  start = () => {
    //Aliases
    const Application = PIXI.Application,
      Container = PIXI.Container,
      loader = PIXI.Loader.shared,
      resources = PIXI.Loader.shared.resources,
      Graphics = PIXI.Graphics,
      TextureCache = PIXI.utils.TextureCache,
      Sprite = PIXI.Sprite,
      Text = PIXI.Text,
      TextStyle = PIXI.TextStyle;
    function shoot(rotation, startPosition, spawn, sprite) {
      console.log("a", spawn.data.last_attack_tick);
      spawn.data.last_attack_tick += 1;
      if (spawn.data.last_attack_tick > 60) {
        var bullet = new PIXI.Sprite(carrotTex);
        if (spawn.data.weapon === "axe") {
          bullet = new PIXI.Sprite(PIXI.Texture.fromImage("axe.png"));
        }
        if (spawn.data.weapon === "spear") {
          bullet = new PIXI.Sprite(PIXI.Texture.fromImage("spear.png"));
        }
        if (spawn.data.weapon === "magic") {
          bullet = new PIXI.Sprite(PIXI.Texture.fromImage("fireball.png"));
        }
        if (spawn.data.weapon === "arrow") {
          bullet = new PIXI.Sprite(PIXI.Texture.fromImage("arrow.png"));
        }
        bullet.position.x = startPosition.x;
        bullet.position.y = startPosition.y;
        spawn.rotation = rotation;
        bullet.rotation = rotation;

        bullet.spawn = spawn; // attach the owner of the attack
        app.stage.addChild(bullet);
        bullets.push(bullet);
        spawn.data.last_attack_tick = 0;
      } else {
        // spawn.data.last_attack_tick = 0;
      }
    }

    carrotTex = PIXI.Texture.fromImage("spear.png");

    //Create a Pixi Application
    const app = new Application({
      width: 512,
      height: 512,
      antialias: true,
      transparent: false,
      resolution: 1,
    });
    app.stage.interactive = true;
    app.stage.interactiveChildren = true;
    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    loader
      .add("spear.png")
      .add("fireball.png")
      .add("arrow.png")
      .add("axe.png")
      .add("carrot.png")
      .add("door.png")
      .add("treasure.png")
      .add("explorer.png")
      .load(setup);

    //Define variables that might be used in more
    //than one function
    let state,
      explorer,
      treasure,
      blobs,
      chimes,
      exit,
      player,
      dungeon,
      door,
      healthBar,
      message,
      gameScene,
      gameOverScene,
      enemies,
      id;
    var bullets = [];
    var bulletSpeed = 5;
    let spawns = [];

    function setup() {
      //Make the game scene and add it to the stage
      gameScene = new Container();
      app.stage.addChild(gameScene);

      //Make the sprites and add them to the `gameScene`
      //Create an alias for the texture atlas frame ids

      //Dungeon

      let dungeonSprite = new Sprite(PIXI.Texture.fromImage("dungeon.png"));
      gameScene.addChild(dungeonSprite);

      //Door
      // let doorSprite = new Sprite(PIXI.Texture.fromImage("door.png"));
      // door = new Sprite(doorSprite);
      // door.position.set(32, 0);
      // gameScene.addChild(door);

      //Explorer
      explorer = new Sprite(PIXI.Texture.fromImage("explorer.png"));
      // explorer = new Sprite(PIXI.Texture.fromImage("explorer.png"));

      explorer.x = 68;
      explorer.y = gameScene.height / 2 - explorer.height / 2;
      explorer.vx = 0;
      explorer.vy = 0;
      explorer.data = saveState.you;
      spawns.push(explorer);
      gameScene.addChild(explorer);

      // spawn allies
      saveState.allies.forEach((ally, index) => {
        const newSpawn = new Sprite(PIXI.Texture.fromImage("explorer.png"));
        newSpawn.x = 68 + index * 40;
        newSpawn.y = gameScene.height / 2 - explorer.height / 2 + index * 60;
        newSpawn.data = { ...ally };
        newSpawn.vx = 0;
        newSpawn.vy = 1;
        gameScene.addChild(newSpawn);
        spawns.push(newSpawn);
      });

      // spawn enemies
      saveState.enemies.forEach((enemy, index) => {
        const newSpawn = new Sprite(PIXI.Texture.fromImage("explorer.png"));
        newSpawn.x = 428 + index * 40;
        newSpawn.y =
          gameScene.height / 2 - explorer.height / 2 + index * 60 + 150;
        newSpawn.data = { ...enemy };
        newSpawn.vx = 0;
        newSpawn.vy = 1;
        newSpawn.alpha = 0.5;
        gameScene.addChild(newSpawn);
        spawns.push(newSpawn);
        // attach combat
      });

      //Treasure

      //Make the blobs
      // let numberOfBlobs = 6,
      //   spacing = 48,
      //   xOffset = 150,
      //   speed = 2,
      //   direction = 1;
      //
      // //An array to store all the blob monsters
      // blobs = [];
      //
      // //Make as many blobs as there are `numberOfBlobs`
      // for (let i = 0; i < numberOfBlobs; i++) {
      //   //Make a blob
      //   const blob = new Sprite(id["blob.png"]);
      //
      //   //Space each blob horizontally according to the `spacing` value.
      //   //`xOffset` determines the point from the left of the screen
      //   //at which the first blob should be added
      //   const x = spacing * i + xOffset;
      //
      //   //Give the blob a random y position
      //   const y = randomInt(0, app.stage.height - blob.height);
      //
      //   //Set the blob's position
      //   blob.x = x;
      //   blob.y = y;
      //
      //   //Set the blob's vertical velocity. `direction` will be either `1` or
      //   //`-1`. `1` means the enemy will move down and `-1` means the blob will
      //   //move up. Multiplying `direction` by `speed` determines the blob's
      //   //vertical direction
      //   blob.vy = speed * direction;
      //
      //   //Reverse the direction for the next blob
      //   direction *= -1;
      //
      //   //Push the blob into the `blobs` array
      //   blobs.push(blob);
      //
      //   //Add the blob to the `gameScene`
      //   gameScene.addChild(blob);
      // }

      //Create the health bar
      healthBar = new Container();
      healthBar.position.set(app.stage.width - 170, 4);
      gameScene.addChild(healthBar);

      //Create the black background rectangle
      const innerBar = new Graphics();
      innerBar.beginFill(0x000000);
      innerBar.drawRect(0, 0, 128, 8);
      innerBar.endFill();
      healthBar.addChild(innerBar);

      //Create the front red rectangle
      const outerBar = new Graphics();
      outerBar.beginFill(0xff3300);
      outerBar.drawRect(0, 0, 128, 8);
      outerBar.endFill();
      healthBar.addChild(outerBar);
      healthBar.outer = outerBar;

      //Create the `gameOver` scene
      gameOverScene = new Container();
      app.stage.addChild(gameOverScene);

      //Make the `gameOver` scene invisible when the game first starts
      gameOverScene.visible = false;

      //Create the text sprite and add it to the `gameOver` scene
      const style = new TextStyle({
        fontFamily: "Futura",
        fontSize: 64,
        fill: "white",
      });
      message = new Text("The End!", style);
      message.x = 120;
      message.y = app.stage.height / 2 - 32;
      gameOverScene.addChild(message);

      //Capture the keyboard arrow keys
      const left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

      //Left arrow key `press` method
      left.press = function () {
        //Change the explorer's velocity when the key is pressed
        explorer.vx = -5;
        explorer.vy = 0;
      };

      //Left arrow key `release` method
      left.release = function () {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the explorer isn't moving vertically:
        //Stop the explorer
        if (!right.isDown && explorer.vy === 0) {
          explorer.vx = 0;
        }
      };

      //Up
      up.press = function () {
        explorer.vy = -5;
        explorer.vx = 0;
      };
      up.release = function () {
        if (!down.isDown && explorer.vx === 0) {
          explorer.vy = 0;
        }
      };

      //Right
      right.press = function () {
        explorer.vx = 5;
        explorer.vy = 0;
      };
      right.release = function () {
        if (!left.isDown && explorer.vy === 0) {
          explorer.vx = 0;
        }
      };

      //Down
      down.press = function () {
        explorer.vy = 5;
        explorer.vx = 0;
      };
      down.release = function () {
        if (!up.isDown && explorer.vx === 0) {
          explorer.vy = 0;
        }
      };

      // var carrotTex = PIXI.Sprite(
      //   PIXI.Loader.shared.resources["spear.png"].texture
      // );

      //Set the game state
      state = play;

      //Start the game loop
      app.ticker.add((delta) => gameLoop(delta));
    }

    function rotateToPoint(mx, my, px, py) {
      var self = this;
      var dist_Y = my - py;
      var dist_X = mx - px;
      var angle = Math.atan2(dist_Y, dist_X);
      //var degrees = angle * 180/ Math.PI;
      return angle;
    }

    function gameLoop(delta) {
      //Update the current game state:
      state(delta);
    }

    function play(delta) {
      //use the explorer's velocity to make it move
      if (window.pause) {
        return false;
      }
      explorer.x += explorer.vx;
      explorer.y += explorer.vy;

      // explorer.rotation = rotateToPoint(
      //   app.renderer.plugins.interaction.mouse.global.x,
      //   app.renderer.plugins.interaction.mouse.global.y,
      //   explorer.position.x,
      //   explorer.position.y
      // );

      // make cunts shoot
      // function shoot(rotation, startPosition, spawn) {
      //   var bullet = new PIXI.Sprite(carrotTex);
      //   bullet.position.x = startPosition.x;
      //   bullet.position.y = startPosition.y;
      //   console.log({ rotation });
      //   bullet.rotation = rotation;
      //   bullet.spawn = spawn; // attach the owner of the attack
      //   app.stage.addChild(bullet);
      //   bullets.push(bullet);
      // }
      // console.log({ bullets });

      spawns.forEach((spawna, spawnIndex) => {
        var bullet = new PIXI.Sprite(carrotTex);
        let targets = [];
        spawns.forEach((targetSpawn) => {
          console.log(spawna.data.team, targetSpawn.data.team);
          if (
            spawna.data.uid !== targetSpawn.data.uid &&
            spawna.data.team !== targetSpawn.data.team
          ) {
            var distance = Math.hypot(
              spawna.x - targetSpawn.x,
              spawna.y - targetSpawn.y
            );
            const clonedTarget = _.clone(targetSpawn);
            clonedTarget.distance = distance;
            targets.push(clonedTarget);
          }
        });
        console.log("targets length", targets.length);

        targets = _.sortBy(targets, "distance");
        const closeTarget = targets[0];
        const farTarget = targets[targets.length - 1];
        // calculate angle between the spawn and the closest enemy
        if (targets.length === 0) {
          return false;
        }
        const calculatedAngle = angle(
          spawna.x,
          spawna.y,
          closeTarget.x,
          closeTarget.y
        );
        // const rotationRadians = degrees_to_radians(calculatedAngle);
        const rotationRadians = Math.atan2(
          closeTarget.y - spawna.y,
          closeTarget.x - spawna.x
        );
        console.log("points", spawna.y, closeTarget.y, spawna.x, closeTarget.x);
        console.log("angle", calculatedAngle);
        console.log("radians", rotationRadians);
        shoot(rotationRadians, spawna, spawna, bullet);
      });

      // loop through projectiles
      for (var b = bullets.length - 1; b >= 0; b--) {
        const bullet = bullets[b];
        bullets[b].position.x += Math.cos(bullets[b].rotation) * bulletSpeed;
        bullets[b].position.y += Math.sin(bullets[b].rotation) * bulletSpeed;
        bullet.x = bullet.position.x;
        bullet.y = bullet.position.y;
        // is bullet out of bounds, splice the cunt out

        if (bullet.x > 512 || bullet.x < 0 || bullet.y > 512 || bullet.y < 0) {
          bullets.splice(b, 1);
        }
        //  then loop through potential targets
        spawns.forEach((spawn, spawnIndex) => {
          // hit collision
          // console.log(spawn.data);
          // if (spawn.data.status === "ally") {
          //   return false;
          // }
          // if bullet was shot by spawn, skip
          if (bullet.spawn.data.uid === spawn.data.uid) {
            return false;
          }
          const didBulletHit = hitTestRectangle(bullet, spawn);
          if (didBulletHit) {
            // console.log("bullet", bullet.spawn);
            // delete the bullet somehow
            if (bullet.parent) {
              bullet.parent.removeChild(bullet);
              bullets.splice(b, 1);
            }
            // calculateDamage()
            // and health
            // console.log("health", spawn.data.health);
            // console.log("damage", bullet.spawn.data.weapon);
            const weapon = weapons[bullet.spawn.data.weapon];
            // console.log("weapon  damage", weapon);
            console.log(spawn.data);
            spawn.data.health = spawn.data.health - weapon.damage;
            // console.log("health", spawn.data.health);
            if (spawn.data.health <= 0) {
              if (spawn.parent) {
                if (spawn.data.status === "me") {
                  alert("you died");
                }
                spawns.splice(spawnIndex, 1);
                spawn.parent.removeChild(spawn);
              }
            }
          }

          const enemies = spawns.filter((sa) => {
            return sa.data.status === "enemy";
            // console.log({ sa });
          });

          if (enemies.length === 0) {
            // alert("round over");
          }

          // console.log({ spawns });
          // cant shoot allies

          // console.log({ spawn, bullet, didBulletHit });
          // delete bullet
          // subtract current health
          // calculateDamage()
          // for the lolz, make a gpt3 dying message
        });
      }

      //Contain the explorer inside the area of the dungeon
      contain(explorer, { x: 28, y: 10, width: 488, height: 480 });
      //contain(explorer, stage);

      //Set `explorerHit` to `false` before checking for a collision
      let explorerHit = false;

      spawns.forEach((spawn) => {
        // attack in direction of closest (melee), or random (ranged)
        if (spawn.data.status === "me") {
          healthBar.outer.width = spawn.data.health;
        }
        const spawnHitsWall = contain(spawn, {
          x: 28,
          y: 10,
          width: 488,
          height: 480,
        });

        // sort opposite targets by distance
        let targets = [];
        spawns.forEach((targetSpawn) => {
          var distance = Math.hypot(
            spawn.x - targetSpawn.x,
            spawn.y - targetSpawn.y
          );
          const clonedTarget = _.clone(targetSpawn);
          clonedTarget.distance = distance;
          targets.push(clonedTarget);
        });

        targets = _.sortBy(targets, "distance");
        const closeTarget = targets[0];
        const farTarget = targets[targets.length - 1];
        function randomInteger(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        // dont run movement strat if player
        if (spawn.data.status !== "me") {
          // if range / melee
          // run away strat
          if (spawn.data.last_velocity_tick > 120) {
            if (randomInteger(0, 10) > 0) {
              const randNum = randomInteger(1, 2);
              switch (randNum) {
                case 1:
                  spawn.vx *= -1;
                case 2:
                  spawn.vy *= -1;
              }
            } else {
              const xDistance = Math.abs(spawn.x - closeTarget.x);
              const yDistance = Math.abs(spawn.y - closeTarget.y);
              // too close, circle, don't avoid unless scared
              if (spawn.x < closeTarget.x) {
                spawn.vx = 1;
                spawn.vy = 1;
              } else {
                spawn.vx = -1;
                spawn.vy = -1;
              }
              // if (xDistance < yDistance) {
              //   if (spawn.x < closeTarget.x) {
              //     spawn.vx = 1;
              //     spawn.vy = 1;
              //   } else {
              //     spawn.vx = -1;
              //     spawn.vy = -1;
              //   }
              // } else {
              //   if (spawn.y < closeTarget.y) {
              //     spawn.vx = 1;
              //     spawn.vy = 1;
              //   } else {
              //     spawn.vx = -1;
              //     spawn.vy = -1;
              //   }
              // }
            }
            spawn.data.last_velocity_tick = 0;
          }
          spawn.data.last_velocity_tick++;
          if (spawnHitsWall === "top" || spawnHitsWall === "bottom") {
            // spawn.vy *= -1;
          }
          if (spawnHitsWall === "left" || spawnHitsWall === "right") {
            // spawn.vx *= -1;
          }
          spawn.x += spawn.vx;
          spawn.y += spawn.vy;
        }
      });
      //Loop through all the sprites in the `enemies` array
      // blobs.forEach(function (blob) {
      //   //Move the blob
      //   blob.y += blob.vy;
      //
      //   //Check the blob's screen boundaries
      //   const blobHitsWall = contain(blob, {
      //     x: 28,
      //     y: 10,
      //     width: 488,
      //     height: 480,
      //   });
      //
      //   //If the blob hits the top or bottom of the stage, reverse
      //   //its direction
      //   if (blobHitsWall === "top" || blobHitsWall === "bottom") {
      //     blob.vy *= -1;
      //   }
      //
      //   //Test for a collision. If any of the enemies are touching
      //   //the explorer, set `explorerHit` to `true`
      //   if (hitTestRectangle(explorer, blob)) {
      //     explorerHit = true;
      //   }
      // });

      //If the explorer is hit...
      if (explorerHit) {
        //Make the explorer semi-transparent
        explorer.alpha = 0.5;

        //Reduce the width of the health bar's inner rectangle by 1 pixel
        healthBar.outer.width -= 1;
      } else {
        //Make the explorer fully opaque (non-transparent) if it hasn't been hit
        explorer.alpha = 1;
      }

      //Does the explorer have enough health? If the width of the `innerBar`
      //is less than zero, end the game and display "You lost!"
      if (healthBar.outer.width < 0) {
        state = end;
        message.text = "You lost!";
      }

      //If the explorer has brought the treasure to the exit,
      //end the game and display "You won!"
    }

    function end() {
      gameScene.visible = false;
      gameOverScene.visible = true;
    }

    /* Helper functions */

    function contain(sprite, container) {
      let collision = undefined;

      //Left
      if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
      }

      //Top
      if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
      }

      //Right
      if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
      }

      //Bottom
      if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
      }

      //Return the `collision` value
      return collision;
    }

    //The `hitTestRectangle` function
    function hitTestRectangle(r1, r2) {
      //Define the variables we'll need to calculate
      let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

      //hit will determine whether there's a collision
      hit = false;

      //Find the center points of each sprite
      r1.centerX = r1.x + r1.width / 2;
      r1.centerY = r1.y + r1.height / 2;
      r2.centerX = r2.x + r2.width / 2;
      r2.centerY = r2.y + r2.height / 2;

      //Find the half-widths and half-heights of each sprite
      r1.halfWidth = r1.width / 2;
      r1.halfHeight = r1.height / 2;
      r2.halfWidth = r2.width / 2;
      r2.halfHeight = r2.height / 2;

      //Calculate the distance vector between the sprites
      vx = r1.centerX - r2.centerX;
      vy = r1.centerY - r2.centerY;

      //Figure out the combined half-widths and half-heights
      combinedHalfWidths = r1.halfWidth + r2.halfWidth;
      combinedHalfHeights = r1.halfHeight + r2.halfHeight;

      //Check for a collision on the x axis
      if (Math.abs(vx) < combinedHalfWidths) {
        //A collision might be occurring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {
          //There's definitely a collision happening
          hit = true;
        } else {
          //There's no collision on the y axis
          hit = false;
        }
      } else {
        //There's no collision on the x axis
        hit = false;
      }
      // console.log(vx, vy, combinedHalfWidths, hit);
      //`hit` will be either `true` or `false`
      return hit;
    }

    //The `randomInt` helper function
    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //The `keyboard` helper function
    function keyboard(keyCode) {
      const key = {};
      key.code = keyCode;
      key.isDown = false;
      key.isUp = true;
      key.press = undefined;
      key.release = undefined;
      //The `downHandler`
      key.downHandler = function (event) {
        if (event.keyCode === key.code) {
          if (key.isUp && key.press) {
            key.press();
          }
          key.isDown = true;
          key.isUp = false;
        }
        event.preventDefault();
      };

      //The `upHandler`
      key.upHandler = function (event) {
        if (event.keyCode === key.code) {
          if (key.isDown && key.release) {
            key.release();
          }
          key.isDown = false;
          key.isUp = true;
        }
        event.preventDefault();
      };

      //Attach event listeners
      window.addEventListener("keydown", key.downHandler.bind(key), false);
      window.addEventListener("keyup", key.upHandler.bind(key), false);
      return key;
    }
  };
  render() {
    return (
      <div className="container">
        <div className="title">Empty People</div>
        <div className="summary">
          Goodluck, walk into thy enemy. <br />
          <br />
          Life gets difficult without friends
        </div>
        <div className="formContainer"></div>
        <div className="formLabel">Name:</div>
        <input className="formInput" placeholder="..." />
        <br />
        <br />
        <div className="formLabel">Bio:</div>
        <textarea
          className="formTextarea"
          placeholder="One's self worth matters"
        />
        <button className="beginButton">BEGIN </button>
      </div>
    );
  }
}

export default Game;
