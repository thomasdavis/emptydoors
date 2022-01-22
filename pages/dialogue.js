// prompt for conversation
// player name is <something>
// insert player bio<something> someway
// create random character above (pass it down)

const dialogue = {
  prompt: ({ playerName, playerStory, heroName, heroStory }) => {
    return `The following is a conversation with ${heroName}.

${heroStory}

${playerStory}

${playerName}:Hey ${playerName}, we love you, can you please tell us the meaning of life?
${heroName}:As far as we can tell from a purely scientific viewpoint, human life has absolutely no meaning. Humans are the outcome of blind evolutionary processes that operate without goal or purpose. Our actions are not part of some divine cosmic plan, and if planet earth were to blow up tomorrow morning, the universe would probably keep going about its business as usual. As far as we can tell at this point, human subjectivity would not be missed. Hence any meaning that people inscribe to their lives is just a delusion.
${playerName}:Can I pass?
${heroName}:`;
  },
};

const creation = {
  prompt: () => {
    return `Name:Julia
Race:Orc
Weapon:Magic
Interests:Gardening, killing men, protecting people.
Story: Our party approached Julia, she stared at us with eyes intent to kill. Amongst the dead bodies in the battle field, she looked strong and resilient.

Name:Joshua
Race:Human
Weapon:Axe
Interests: struggling professional jazz pianist,
Story : He’s a 22 year old aboriginal aussie, passionate about music,always supportive and brings the best out of people but often sarcastic & a loner. He had a near death experience when he OD’d on coke.
`;
  },
};

module.exports.stuff = {
  dialogue,
  creation,
};
