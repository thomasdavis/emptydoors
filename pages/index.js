import React from "react";
import _ from "lodash";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { nameByRace } from "fantasy-name-generator";
// const { prompt } = dialogue;
// const { prompt } = creation;
const logs = {};

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function capitalize(str) {
  if (!str) {
    return "";
  }
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
    .join(" ");
}
/*
TODO:
- win / lose states
- log everything
- uid for the session
*/

// const bioGeneratorPrompt = `
//
//
//
// `;

const conversationPrompt = (
  playerName,
  playerBio,
  spawnName,
  spawnBio,
  messages,
  finalPrompt
) => {
  let prompt = `${playerName} and ${spawnName} have just finished a chaotic and gruesome battle with some of the most feared creatures in this new and very strange world. Both ${playerName} and ${spawnName} are still stressed from the immediate battle, but are also curious as to whether or not the other is quite what they seem to be.

${spawnName} is unsure because she has just betrayed her clan, which is very dangerous and punishable by death. Betraying a clan is considered by many outside of her land to be high treason. ${spawnName} is quite scared, and unsure of any current alliances, and is very concerned about the current geopolitical climate. ${spawnName} loves to fight for what is right, but also needs to be sure that any effort is on the side of good. ${spawnName} is very skilled with their weapon and how to fight in battle, and has also trained to be skilled with the bow and arrow, axe, sword, and in the dark arts of magic. ${spawnName} is curious to learn more in the dark arts of magic, and is unsure about the world of Human kind.

${spawnBio}

${playerName} is on an expedition in a new land and is currently unsure of who to trust. In some battles there is a great excellence in skill. in other battles ${playerName} requires some others that may have different skills. ${playerName} is looking to be skilled with how to use some of the most powerful weapons; however, he is still practicing the bow and arrow, axe, sword, and the dark arts of magic. ${playerName} is not so curious to learn. ${playerName} is very discerning  as to who joins the fight on the side.


${playerName}:Hey ${spawnName}, those were some wild battle skills, you almost shot me, glad I dodged the bullet. Where did you learn to fight like that?
${spawnName}:I learned with my people, inflicting thousands of deaths across the others. I don't know your people.
${playerName}:Great job, I need some help unleashing devastation against the hoards of enemies. Will you join me in combat with the enemy. I need so much help developing plans to destroy enemies from the other continent! Join me in fighting all of my enemies!
${spawnName}:I do not join with just anybody, your weapons impress my people, but they also scare my loved ones. I did like the way you fought though!
${playerName}:Thanks! I loved the way you fought too!
${spawnName}:Did you kill some of my people?
${playerName}:I don't know, I might have. I am sorry, I wasn't paying attention.
${spawnName}:Okay, we might still become friends.\n`;
  const messageStack = messages.map((m) => {
    return `${m.name}:${m.message}`;
  });
  if (!finalPrompt) {
    messageStack.push(`${spawnName}:`);
  }
  prompt = prompt + messageStack.join("\n");
  console.log({ prompt });
  return prompt;
};

const bioGeneratorPrompt = (spawn) => {
  return `Name:Julia
Race:Orc
Weapon:Magic
Interests:Gardening, killing men,  protecting people.
Story:Our party approach Julia, she stared at us with eyes intent to kill. Amongst the dead bodies in the battle field, she looked strong and resilient. Julia wore a beautiful blue robe, and a small stature.

Name:Ajax
Race:Human
Weapon:Axe
Interests:Adventures, bards, slaying dragons
Story:Ajax was a tall handsome human man. He had big muscles to support the massive battle axe that he carried. His father was a king of the ether world.

Name:Gunther
Race:Elf
Weapon:Bow
Interests:Raiding dungeons, finding treasure, casting spells
Story:Gunther had an elegant appearance, he was the son of an elven king. He was travelling the world looking for the demons that slayed his father.

Name:${capitalize(spawn.data.name)}
Race:${capitalize(spawn.data.race)}
Weapon:${capitalize(spawn.data.weapon)}
Interests:Raiding dungeons, finding treasure, casting spells
Story:`;
};
let conversationSpawn = null;
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
  magic: {
    damage: 20,
    attack_speed: 40,
    range: 100,
    attack_time: 10,
    type: "projectile",
  },
  spear: {
    damage: 20,
    attack_speed: 40,
    range: 100,
    attack_time: 10,
    type: "projectile",
  },
  axe: {
    damage: 10,
    attack_speed: 80,
    range: 100,
    type: "projectile",
    attack_time: 40,
  },
  arrow: {
    damage: 24,
    attack_speed: 100,
    range: 100,
    type: "projectile",
    attack_time: 20,
  },
};

/*
- background loop becomes race music of last person to join your team
- sound for background music if talking
- start screen music
- dump raw data
- share that data in a pretty fashion

*/
const WEAPONS = ["spear", "magic", "axe"];
const RACES2 = ["orc", "fairy", "human", "elf"];
const TYPES2 = ["mage", "archer", "warrior"]; // such bad variable name, don't give a shit
let explorer = {};
const saveState = {
  you: {
    movement_speed: 20,
    health: 1000,
    attack_speed: 20,
    weapon: "spear",
    name: "Thomas",
    race: RACES2[randomInteger(0, 3)],
    type: TYPES2[randomInteger(0, 2)],
    status: "me",
    team: "ally",
    uid: "asd",
    last_attack_tick: 0,
    last_velocity_tick: 0,
  },
  allies: [],
  enemies: [],
};
const levels = [];
let carrotTex = null; // PIXI.Texture.fromImage("spear.png");
let playerState = {
  name: "",
  bio: "",
  talk: [],
};

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
      possibleParty: {},
      possiblePartyBio: null,
      possiblePartyMessages: [],
      partyingDone: false,
      loadingLastQuestion: false,
      partyingAcknowledge: false,
      lastMessage: null,
      lastMessageStatus: false,
    };
  }
  begin = (e) => {
    e.preventDefault();
    // #TODOFIXTHIS
    const username = document.getElementById("inputName").value;
    const bio = document.getElementById("inputBio").value;
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
    window.allowSpawn = false;
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSound({ src: "spear.mp3", id: "spear" });
    createjs.Sound.registerSound({ src: "axe.mp3", id: "axe" });
    createjs.Sound.registerSound({ src: "magic.mp3", id: "magic" });
    createjs.Sound.registerSound({ src: "arrow.mp3", id: "arrow" });
  };
  componentDidUpdate = (prevProps, prevState) => {
    // if beginning went from no to yes . make an if
    console.log("probably matters", prevState, this.state);
    if (prevState.beginned !== this.state.beginned) {
      setTimeout(() => {
        this.start();
      }, 500);
    }
    if (this.state.partying === true && this.state.partying !== prevProps) {
      window.allowSpawn = false;
    } else {
      window.allowSpawn = true;
    }
    // if (nextProps.runEngine) {
    //   this.start();
    // }
  };
  resumeGame = (e) => {
    console.log("resume game", window.pause);
    explorer.x = 30;
    explorer.y = 30;
    // unpause
    // reset state
    this.setState(
      {
        partying: false,
        partyingDone: false,
        possibleParty: {},
        possiblePartyBio: null,
        possiblePartyMessages: [],
        loadingLastQuestion: false,
        lastMessage: null,
        partyingAcknowledge: false,
        lastMessageStatus: false,
        messages: [],
      },
      () => {
        console.log("did this run", window.pause);
        window.pause = false;
      }
    );

    // username: "",
    // bio: "",
    // beginned: false,
    // partying: false,
    // runEngine: false,
    // hideEngine: false,
    // possibleParty: {},
    // possiblePartyBio: null,
    // possiblePartyMessages: [],
    // partyingDone: false,
    // partyingAcknowledge: false,
    // lastMessage: null,
    // lastMessageStatus: false,
  };
  sendMessage = (e) => {
    const that = this;
    // possibleParty: {},
    // possiblePartyBio: null,
    const { username, bio, possibleParty, possiblePartyBio } = this.state;
    const messages = _.clone(this.state.possiblePartyMessages);
    // get value of prompt box
    e.preventDefault();
    const textareaEl = document.getElementById("potentialMessage");
    console.log(textareaEl.value);
    textareaEl.disabled = true;
    const potentialMessage = textareaEl.value;
    messages.push({ name: username, message: potentialMessage });
    that.setState({ possiblePartyMessages: messages });
    const prompt = conversationPrompt(
      username,
      bio,
      possibleParty.data.name,
      possiblePartyBio,
      messages
    );
    console.log(prompt);
    axios
      .post(
        "https://emptyservergame.herokuapp.com/",
        {
          prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log("what happened", response);
        messages.push({
          name: possibleParty.data.name,
          message: response.data.reply,
        });
        console.log(messages);
        textareaEl.disabled = false;
        textareaEl.value = "";
        that.setState({ possiblePartyMessages: messages });
        if (messages.length >= randomInteger(5, 9)) {
          // if (messages.length >= 1) {
          console.log("end discussion now, beg question of team party");
          that.setState({
            partyingDone: true,
            loadingLastQuestion: true,
          });
          // const prompt2 = conversationPrompt(
          //   username,
          //   bio,
          //   possibleParty.data.name,
          //   possiblePartyBio,
          //   messages,
          //   true
          // );

          let finalPrompt = "";
          try {
            const clonePrompt = _.clone(prompt);
            finalPrompt =
              clonePrompt.substr(
                0,
                clonePrompt.length - (possibleParty.data.name.length + 2)
              ) +
              `\n${possibleParty.data.name}:${response.data.reply}` +
              `\n${username}:Do you want to join my team? answer yes or no\n${possibleParty.data.name}:`;
          } catch (e) {
            console.log("what happened", e);
          }

          console.log("=================== CHECK", clonePrompt);
          console.log("=== ------------- xxxxxCHECK", finalPrompt);

          axios
            .post(
              "https://emptyservergame.herokuapp.com/",
              {
                prompt: finalPrompt,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then(function (response) {
              const reply = response.data.reply;
              // check if reply contains somewhat of a yes, otherwise its a no
              console.log("huh", reply);
              let answer = false;
              if (reply.toLowerCase().indexOf("yes") !== -1) {
                answer = true;
              }
              // lastMessage: null,
              // lastMessageStatus: false,
              possibleParty.data.conversion = true;
              if (answer) {
                possibleParty.data.team = "ally";
              }
              that.setState(
                {
                  lastMessageStatus: answer,
                  lastMessage: reply,
                  loadingLastQuestion: false,
                },
                () => {
                  that.partyAnswer(answer);
                }
              );
            })
            .catch(function (error) {});
        }
      })
      .catch(function (error) {});
    // disable prompt box
    // say its loading
    // once reply comes back, reenable
  };
  partyAnswer = (answer) => {
    // start the game engine, revert state variables
    // set spawn direct object to ally status or not
    this.setState({
      partyingAcknowledge: true,
    });
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
      if (
        spawn.data.last_attack_tick >
        180 - weapons[spawn.data.weapon].attack_time
      ) {
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
        console.log("make some fucking noise", spawn.data.weapon);
        console.log("also who am i", spawn.data.status);
        if (bullet.spawn.data.status === "me") {
          const soundObject = createjs.Sound.play(spawn.data.weapon);
          soundObject.volume = Math.random() * 100;
        } else {
          const soundObject = createjs.Sound.play(spawn.data.weapon);
          soundObject.volume = Math.random() * 100;
        }
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
    console.log("does this thing exist", gameContainer);
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
    explorer = {};
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
      const explorerAssetName = `${saveState.you.race}_${saveState.you.type}.png`;

      explorer = new Sprite(PIXI.Texture.fromImage(explorerAssetName));
      // explorer = new Sprite(PIXI.Texture.fromImage("explorer.png"));
      explorer.data = saveState.you;
      explorer.x = 30;
      explorer.y = 30;
      explorer.vx = 0;
      explorer.vy = 0;

      spawns.push(explorer);
      gameScene.addChild(explorer);

      let spawnRate = 5000;

      const spawnRandomEnemy = () => {
        if (window.allowSpawn) {
          console.log("spawnRandomEnemy");
          const GENDERS = ["male", "female"];
          const enemyRace = RACES2[randomInteger(0, 3)];
          const enemyGender = GENDERS[randomInteger(0, 1)];
          const enemy = {
            movement_speed: 20,
            health: 100,
            attack_speed: 20,
            weapon: WEAPONS[randomInteger(0, 2)],
            gender: enemyGender,
            name: nameByRace(enemyRace, { gender: enemyGender }),
            uid: uuidv4(),
            race: enemyRace,
            type: TYPES2[randomInteger(0, 2)],
            status: "enemy",
            team: "enemy",
            last_attack_tick: 0,
            last_velocity_tick: 0,
            conversion: null,
          };
          console.log(enemy.name);
          const spawnAssetName = `${enemy.race}_${enemy.type}.png`;
          console.log(spawnAssetName);
          const newSpawn = new Sprite(PIXI.Texture.fromImage(spawnAssetName));
          newSpawn.x = 428;
          newSpawn.y = 460;
          newSpawn.data = { ...enemy };
          newSpawn.vx = 0;
          newSpawn.vy = 1;
          // newSpawn.alpha = 0.5;
          gameScene.addChild(newSpawn);
          spawns.push(newSpawn);
        }
      };
      setInterval(spawnRandomEnemy, spawnRate);

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
        explorer.vx = -7;
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
        explorer.vy = -7;
        explorer.vx = 0;
      };
      up.release = function () {
        if (!down.isDown && explorer.vx === 0) {
          explorer.vy = 0;
        }
      };

      //Right
      right.press = function () {
        explorer.vx = 7;
        explorer.vy = 0;
      };
      right.release = function () {
        if (!left.isDown && explorer.vy === 0) {
          explorer.vx = 0;
        }
      };

      //Down
      down.press = function () {
        explorer.vy = 7;
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
          if (!spawna.data) {
            return false; // #TODO - no idea
          }
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
        if (!spawnZ.data) {
          return false; // #TODO - no idea again
        }
        if (explorer.data.uid !== spawnZ.data.uid) {
          console.log(spawnZ);
          if (
            hitTestRectangle(spawnZ, explorer) &&
            spawnZ.data.conversion === null &&
            spawnZ.data.team === "enemy"
          ) {
            // #TODO - not rendering the canvas always
            conversationSpawn = spawnZ;
            that.setState(
              {
                partying: true,
                hideEngine: true,
                runEngine: false,
                possibleParty: spawnZ,
              },
              () => {
                window.pause = true;
                axios
                  .post(
                    "https://emptyservergame.herokuapp.com/",
                    {
                      prompt: bioGeneratorPrompt(spawnZ),
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )
                  .then(function (response) {
                    console.log("what happened", response);
                    that.setState({ possiblePartyBio: response.data.reply });
                  })
                  .catch(function (error) {});
              }
            );
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

        if (!spawn.data) {
          return false; // #TODO - no idea again
        }
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
      };

      //Attach event listeners
      window.addEventListener("keydown", key.downHandler.bind(key), false);
      window.addEventListener("keyup", key.upHandler.bind(key), false);
      return key;
    }
  };
  render() {
    const that = this;
    const {
      beginned,
      partying,
      possibleParty,
      possiblePartyBio,
      runEngine,
      hideEngine,
      possiblePartyMessages,
      partyingDone,
      lastMessage,
      lastMessageStatus,
      loadingLastQuestion,
    } = this.state;

    // console.log({ beginned, partying });

    // staff benda billi - polio
    // .<3.........<3........
    // zzzzzzzzzziiiiiiiiiiiiiiiiiiiiiiiiiiii

    let appElements = [];
    /*
      - engine must always be rendered
      - pass shallow props to avoid rerenders

    */

    if (runEngine) {
      return (
        <div style={{ display: hideEngine ? "hidden" : "block" }}>
          <div id="gameContainer" />
        </div>
      );
    }
    console.log("rerender");

    if (partying) {
      const { name, bio, race, type, weapon } = possibleParty.data;
      console.log("whata sdasdasd", lastMessage);
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
                  <img
                    src={`${possibleParty.data.race}_${possibleParty.data.type}.png`}
                  />
                </div>
                <div className="charTitle">
                  <span className="bioLabel">Name:</span> {capitalize(name)}
                </div>

                <div className="charRace">
                  <span className="bioLabel">Race:</span> {capitalize(race)}
                </div>
                <div className="charRole">
                  <span className="bioLabel">Type:</span> {capitalize(type)}
                </div>
                <div className="charWeapon">
                  <span className="bioLabel">Weapon: </span>
                  {capitalize(weapon)}
                </div>
              </div>
              <div className="discourseContainer">
                {possiblePartyBio && (
                  <>
                    <div className="bioContainer">{possiblePartyBio}</div>
                    <div className="responseContainer">
                      {possiblePartyMessages.map((message) => {
                        return (
                          <div className="replyContainer">
                            <div className="replyName">{message.name}:</div>
                            <div className="replyContent">
                              {message.message}
                            </div>
                          </div>
                        );
                      })}
                      {!partyingDone && (
                        <form onSubmit={this.sendMessage}>
                          <div className="replyInputContainer">
                            <textarea
                              id="potentialMessage"
                              className="replyTextarea"
                            ></textarea>
                          </div>
                          <div className="talkButtonContainer">
                            <button className="talkButton" type="submit">
                              SPEAK
                            </button>
                          </div>
                        </form>
                      )}
                      {partyingDone && (
                        <div>
                          <div className="lastMessage">
                            You asked them if they want to join your team.
                          </div>
                          <br />
                          {loadingLastQuestion && <div>loading...</div>}
                          {!loadingLastQuestion && lastMessageStatus !== null && (
                            <>
                              <div className="lastReply">
                                <strong>They said</strong> {lastMessage}{" "}
                                <strong>aka</strong>{" "}
                                {lastMessageStatus ? "yes" : "no"}
                              </div>
                              <button
                                className="talkButton"
                                onClick={that.resumeGame}
                              >
                                CONTINUE WITH
                                {lastMessageStatus ? " ALLY" : " ENEMY"}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {!possiblePartyBio && <div>loading bio...</div>}
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
              id="inputName"
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
              id="inputBio"
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
    return <div></div>;
  }
}

export default Game;
