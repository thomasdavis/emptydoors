import React from "react";
import _ from "lodash";
import axios from "axios";

const logs = {};
//armour
// how to generate sprites

/*
TODO:
- generate uids for entities
- win / lose states
- log everything
- uid for the session
-
createjs.Sound.on("fileload", handleLoadComplete);
createjs.Sound.alternateExtensions = ["mp3"];
createjs.Sound.registerSound({src:"path/to/sound.ogg", id:"sound"});
function handleLoadComplete(event) {
	createjs.Sound.play("sound");
}
*/

const bioGeneratorPrompt = `
Name:Julia
Race:Orc
Weapon:Magic
Interests:Gardening, killing men,  protecting people.
Story:Our party approach Julia, she stared at us with eyes intent to kill. Amongst the dead bodies in the battle field, she looked strong and resilient.

Name:Ajax
Race:Orc
Weapon:Axe
Interests:Drinking, reading and writing
Story:`;

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
    health: 10000000,
    attack_speed: 20,
    weapon: "axe",
    name: "Thomas",
    race: "orc",
    type: "warrior",
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
      weapon: "magic",
      name: "Jemel",
      race: "orc",
      type: "mage",
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
      weapon: "arrow",
      name: "James",
      type: "archer",
      race: "orc",
      status: "ally",
      uid: "asd1212",
      last_attack_tick: 0,
      last_velocity_tick: 0,
      team: "ally",
    },
    {
      movement_speed: 20,
      health: 100,
      attack_speed: 20,
      weapon: "magic",
      name: "Jemel",
      race: "elf",
      type: "mage",
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
      weapon: "arrow",
      name: "James",
      type: "archer",
      race: "elf",
      status: "ally",
      uid: "asd1212",
      last_attack_tick: 0,
      last_velocity_tick: 0,
      team: "ally",
    },
    {
      movement_speed: 20,
      health: 100,
      attack_speed: 20,
      weapon: "axe",
      name: "James",
      type: "warrior",
      race: "elf",
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
      race: "human",
      type: "warrior",
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
      weapon: "magic",
      name: "Roland",
      race: "human",
      type: "mage",
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
      name: "Roland",
      race: "human",
      type: "archer",
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
      weapon: "axe",
      name: "Roland",
      race: "fairy",
      type: "warrior",
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
      weapon: "axe",
      name: "Roland",
      race: "fairy",
      type: "archer",
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
      weapon: "axe",
      name: "Roland",
      race: "fairy",
      type: "mage",
      status: "enemy",
      uid: "asxxxxd",
      last_attack_tick: 0,
      last_velocity_tick: 0,
      team: "enemy",
    },
  ],
};

let carrotTex = null; // PIXI.Texture.fromImage("spear.png");

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      bio: "",
      beginned: false,
      partying: false,
      runEngine: false,
      hideEngine: false,
      possibleParty: {
        name: "Mel",
        weapon: "Axe",
        type: "Mage",
      },
    };
  }
  begin = (e) => {
    e.preventDefault();
    // #TODOFIXTHIS
    const username = "Ajax";
    const bio = "I am a heavenly Orc who was blessed with piano skills";
    this.setState({
      username,
      bio,
      beginned: true,
      runEngine: true,
    });
    return false;
  };
  componentDidMount = (e) => {
    // setTimeout(() => {
    //   this.setState({ beginned: true });
    // }, 500);
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSound({ src: "spear.mp3", id: "spear" });
    createjs.Sound.registerSound({ src: "axe.mp3", id: "axe" });
    createjs.Sound.registerSound({ src: "fireball.mp3", id: "fireball" });
    createjs.Sound.registerSound({ src: "arrow.mp3", id: "arrow" });
  };
  componentDidUpdate = (prevProps, prevState) => {
    // if beginning went from no to yes . make an if
    console.log("probably matters", prevState, this.state);
    if (prevState.beginned !== this.state.beginned) {
      setTimeout(() => {
        this.start();
      }, 2000);
    }
    // if (nextProps.runEngine) {
    //   this.start();
    // }
  };
  start = () => {
    console.log("started ------------------------- 1");
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
      // createjs.Sound.play("fireball");
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
        createjs.Sound.play(spawn.data.weapon);
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
    const gameContainer = document.getElementById("gameContainer");
    console.log("does this nigger exist", gameContainer);
    // gameContainer.appendChild(app.view);
    document.body.appendChild(app.view);
    loader
      .add("spear.png")
      .add("fireball.png")
      .add("arrow.png")
      .add("axe.png")
      .add("elf_archer.png")
      .add("elf_mage.png")
      .add("elf_warrior.png")
      .add("fairy_archer.png")
      .add("fairy_mage.png")
      .add("fairy_warrior.png")
      .add("human_warrior.png")
      .add("human_archer.png")
      .add("human_mage.png")
      .add("orc_mage.png")
      .add("orc_warrior.png")
      .add("orc_archer.png")
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
    var bulletSpeed = 2;
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
        const spawnAssetName = `${ally.race}_${ally.type}.png`;
        const newSpawn = new Sprite(PIXI.Texture.fromImage(spawnAssetName));
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
        const spawnAssetName = `${enemy.race}_${enemy.type}.png`;
        const newSpawn = new Sprite(PIXI.Texture.fromImage(spawnAssetName));
        newSpawn.x = 428 + index * 40;
        newSpawn.y = gameScene.height / 2 - explorer.height / 2 + index * 60;
        newSpawn.data = { ...enemy };
        newSpawn.vx = 0;
        newSpawn.vy = 1;
        // newSpawn.alpha = 0.5;
        gameScene.addChild(newSpawn);
        spawns.push(newSpawn);
        // attach combat
      });

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
        explorer.vx = -2;
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
        explorer.vy = -2;
        explorer.vx = 0;
      };
      up.release = function () {
        if (!down.isDown && explorer.vx === 0) {
          explorer.vy = 0;
        }
      };

      //Right
      right.press = function () {
        explorer.vx = 2;
        explorer.vy = 0;
      };
      right.release = function () {
        if (!left.isDown && explorer.vy === 0) {
          explorer.vx = 0;
        }
      };

      //Down
      down.press = function () {
        explorer.vy = 2;
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
    const that = this;
    function play(delta) {
      //use the explorer's velocity to make it move
      if (window.pause) {
        return false;
      }
      explorer.x += explorer.vx;
      explorer.y += explorer.vy;

      spawns.forEach((spawna, spawnIndex) => {
        var bullet = new PIXI.Sprite(carrotTex);
        let targets = [];
        spawns.forEach((targetSpawn) => {
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

        targets = _.sortBy(targets, "distance");
        const closeTarget = targets[0];
        const farTarget = targets[targets.length - 1];
        // calculate angle between the spawn and the closest enemy
        if (targets.length === 0) {
          return false;
        }

        // const rotationRadians = degrees_to_radians(calculatedAngle);
        const rotationRadians = Math.atan2(
          closeTarget.y - spawna.y,
          closeTarget.x - spawna.x
        );
        // console.log("points", spawna.y, closeTarget.y, spawna.x, closeTarget.x);
        // console.log("radians", rotationRadians);
        shoot(rotationRadians, spawna, spawna, bullet);
      });

      // detect if player is near any spawn (hero)
      // if they are, freeze the world and bring up dialog
      // if gpt3 says yes, change team to `ally` else make them super hard to fucking kill
      // fuck it, loop again
      // those who status is ally don't count #TODO
      // do uids matter
      const that2 = this;
      spawns.forEach((spawnZ) => {
        console.log("id test", explorer.data.uid, spawnZ.data.uid);
        if (explorer.data.uid !== spawnZ.data.uid) {
          console.log("not my cousin");
          if (hitTestRectangle(spawnZ, explorer)) {
            console.log("double id test", explorer.data.uid, spawnZ.data.uid);
            console.log("whjy", explorer.x, spawnZ.x, explorer.y, spawnZ.y);
            console.log("you git some other cunt");
            // alert("you git some other cunt");
            // that.setState(
            //   { partying: true, hideEngine: true, runEngine: false },
            //   () => {
            //     window.pause = true;
            //   }
            // );
          }
        }
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
            // console.log(spawn.data);
            spawn.data.health = spawn.data.health - weapon.damage;
            // console.log("health", spawn.data.health);
            if (spawn.data.health <= 0) {
              if (spawn.parent) {
                if (spawn.data.status === "me") {
                  alert("you died");
                  // #MUSIC - DEAD, I DIED
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
    const {
      beginned,
      partying,
      possibleParty,
      runEngine,
      hideEngine,
    } = this.state;
    const { name, bio, type, weapon } = possibleParty;
    // console.log({ beginned, partying });

    if (runEngine) {
      return (
        <div style={{ display: hideEngine ? "hidden" : "block" }}>
          render game
          <div id="gameContainer" />
        </div>
      );
    }

    if (partying) {
      return (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: `
          canvas {
            display: none !important;
          }
          `,
            }}
          />
          <div className="container ">
            <div className="partyContainer">
              <div className="charContainer">
                <div className="charAvatar">
                  <img src="something.jpg" />
                </div>
                <div className="charTitle">
                  <span className="bioLabel">Name:</span> {name}
                </div>
                <div className="charRole">
                  <span className="bioLabel">Type:</span> {type}
                </div>
                <div className="charWeapon">
                  <span className="bioLabel">Weapon: </span>
                  {weapon}
                </div>
              </div>
              <div className="discourseContainer">
                <div className="bioContainer">
                  Kae is an elf who is very interested in nature and animals.
                  She loves to garden and take care of plants. She is also very
                  skilled with a bow and arrow,
                </div>
                <div className="responseContainer">
                  <div className="replyContainer">
                    <div className="replyName">Mel:</div>
                    <div className="replyContent">adasdada</div>
                  </div>{" "}
                  <div className="replyContainer">
                    <div className="replyName">Mel:</div>
                    <div className="replyContent">adasdada</div>
                  </div>{" "}
                  <div className="replyContainer">
                    <div className="replyName">Mel:</div>
                    <div className="replyContent">adasdada</div>
                  </div>{" "}
                  <div className="replyContainer">
                    <div className="replyName">Mel:</div>
                    <div className="replyContent">adasdada</div>
                  </div>
                  <div className="replyInputContainer">
                    <textarea className="replyTextarea" />
                  </div>
                  <div className="talkButtonContainer">
                    <button className="talkButton">SPEAK</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (!beginned) {
      // #MUSIC
      return (
        <div className="container">
          <div className="title">Empty People</div>
          <div className="summary">
            Goodluck, walk into thy enemy. <br />
            <br />
            Life gets difficult without friends
          </div>
          <div className="formContainer"></div>
          <form onSubmit={this.begin}>
            <div className="formLabel">Name:</div>
            <input
              pattern=".{3,}"
              required
              title="3 characters minimum"
              className="formInput"
              placeholder="..."
            />
            <br />
            <br />
            <div className="formLabel">Bio:</div>
            <textarea
              pattern=".{50,}"
              required
              title="50 characters minimum"
              className="formTextarea"
              placeholder="One's self worth matters"
            />
            <button type="submit" className="beginButton">
              BEGIN{" "}
            </button>
          </form>
        </div>
      );
    }
    return <div>Who gives a shit</div>;
  }
}

export default Game;
