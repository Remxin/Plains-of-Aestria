let example = {
    type: "minion",
    hp: 3,
    atk: 3,
    mana_cost: 3,
    name: "name",
    fraction: "human||demon||undead||elf",
    file_path: "./imgs/zdjecie.png",
    description: "short desc of the card",
    keywords: "additional interactions and mechanics"
}
//------------keywords guide-----------------
//                                          |
//             ---berserk---                | if damaged deals additional damage (atk goes up by a set amount)
//             ----taunt----                | if minion with taunt is on board, hostile minion before attacking enemy hero or enemy in front, it has to attack the taunt minion
//             ---enraged---                | minion attacks right at the moment it gets put on the board 
//             ---building--                | has 0 hp, and grants some kind of passive bonus
//             ----wizard---                | at the end of turn, before everyone else throws a spell dealing a set amount of dmg
//             -----sage----                | when used, draws a card
//                                          |
//------------------------------------------|
//-------------keyword format---------------|
//
//           keywords:[keyword]
//                      ^^^^^ 
//                ________|              
//               | 
//           keyword: {name: "keyword_name", value:integer} (value specified if needed, else null)


let skeleton = {
    type: "minion",
    hp: 2,
    atk: 2,
    mana_cost: 2,
    name: "skeleton",
    fraction: "undead",
    file_path: "../imgs/cards/skeleton.png",
    description: "what a mad man, went onto the battlefield bare bones..."
}

let shadow_demon = {
    type: "minion",
    hp: 5,
    atk: 8,
    mana_cost: 7,
    name: "Shadow Demon",
    fraction: "demon",
    file_path: "../imgs/cards/shadow_demon.png",
    description: "huh... now i am kinda afraid that my shadow is not what i think it is...",
    keywords: "enraged"
}



let ghoul = {
    type: "minion",
    hp: 3,
    atk: 3,
    mana_cost: 3,
    name: "Ghoul",
    fraction: "undead",
    file_path: "../imgs/cards/ghoul.png",
    description: "In general ghouls are really hungry and bloodthirsty, and that applies to that little one",
    keywords: "enraged" //+3
}

let skeleton_warrior = {
    type: "minion",
    hp: 9,
    atk: 5,
    mana_cost: 8,
    name: "Skeleton Warrior",
    fraction: "undead",
    file_path: "../imgs/cards/skeleton_warrior.png",
    description: "He must have drunk a lot of milk when he was just a boy...",
    keywords: "taunt"
}

let lich = {
    type: "minion",
    hp: 10,
    atk: 4,
    mana_cost: 10,
    name: "Lich",
    fraction: "undead",
    file_path: "../imgs/cards/lich.png",
    description: "Truly terrifying being, which mastered the arts of magic",
    keywords: "wizard" //deals 3dmg to random enemy as a spell (no counterattack) at the end of turn
}

let skeleton_mage = {
    type: "minion",
    hp: 6,
    atk: 3,
    mana_cost: 6,
    name: "Skeleton Mage",
    fraction: "undead",
    file_path: "../imgs/cards/skeleton_mage.png",
    description: "Skeletal mages were once a human mages... now they are not",
    keywords: "wizard" //deals 2dmg
}

let skeleton_mage_apprentice = {
    type: "minion",
    hp: 3,
    atk: 1,
    mana_cost: 2,
    name: "Skeleton Mage Apprentice",
    fraction: "undead",
    file_path: "../imgs/cards/skeleton_mage_apprentice.png",
    description: "Look! His hand is on fire!",
    keywords: "wizard" //deals 1dmg
}

let zombie = {
    type: "minion",
    hp: 5,
    atk: 4,
    mana_cost: 4,
    name: "Zombie",
    fraction: "undead",
    file_path: "../imgs/cards/zombie.png",
    description: "Braaaaaaaaaaaaaaaaaaaaaaaaainsssss...",
    keywords: "none" //deals 2dmg
}

let assasin = {
    "type": "minion",
    "hp": "4",
    "atk": "2",
    "mana_cost": "6",
    "name": "Assasin",
    "fraction": "human",
    "file_path": "../imgs/cards/assasin.png",
    "description": "Try to challenge this guy face to face",
    "keywords": "execute" // executes targets below 5hp
}


// ? _-_-_-_-_- ADDITIONAL KEYWORDS (optional) _-_-_-_-_-_-
// * ranger - when placed on the first row -2 to hp
// * execute - executes targets below 5hp
// * pierce - attacks 2 enemies in the same row
// * build - after 1 round passes, cards activates. When placed on first row - defensive structure, else - offensive

// let all_cards = []
// all_cards.push(skeleton, shadow_demon, ghoul, skeleton_warrior, skeleton_mage, skeleton_mage_apprentice, lich,  zombie)
// add_card_id(all_cards)
const all_cards = () => {
    return new Promise(async (resolve, reject) => {
        const cookie = await JSON.parse(sessionStorage.getItem("UserContext"))
        console.log(cookie)
        let userFraction
        if (cookie?.userContext) userFraction = await JSON.parse(sessionStorage.getItem("UserContext")).userContext.fraction.name
        else userFraction = await JSON.parse(sessionStorage.getItem("UserContext")).fraction.name
        console.log('aaaa')
        userFraction = userFraction.toLowerCase()
        userFraction = userFraction.slice(0, -1)

        try {
            const res = await fetch("/get/cards", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ fraction: userFraction })
            })
            const cards = await res.json()
            console.log(userFraction)
            resolve(cards)
        } catch (err) {
            reject({ err })
        }
    })
}


export default { all_cards }


function add_card_id(cards) {
    for (let i in cards) {
        all_cards[i].id = i
    }
}