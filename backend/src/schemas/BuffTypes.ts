import { scope } from "arktype";

export const BuffTypes = scope({
  BuffAttribute:
    '"Attack"|"Attack Speed"|"Death to Survival"|"Death to Soul"|"Death to Wounded"|"Defense"|"Deserter Capacity"|"Double Items Drop Rate"|"HP"|"Healing Speed"|"Hospital Capacity"|"Leadership"|"Load"|"March Size Capacity"|"March Time"|"Marching Speed"|"Marching Speed to Monsters"|"MonstersAttack"|"Politics"|"Rally Capacity"|"Range"|"Resources Production"|"Stamina cost"|"SubCity Construction Speed"|"SubCity Gold Production"|"SubCity Training Speed"|"SubCity Troop Capacity"|"Training Capacity"|"Training Speed"|"Wounded to Death"',

  BuffCondition:
    '"Against Monsters"|"Attacking"|"Defending"|"During SvS"|"In City"|"In Main City"|"Marching"|"Reinforcing"|"When City Mayor"|"When City Mayor for this SubCity"|"When Defending Outside The Main City"|"When Rallying"|"When The Main Defense General"|"When an officer"|"brings a dragon"|"brings dragon or beast to the attack"|"dragon to the attack"|"leading the army to attack"',

  DebuffCondition:
    '"Enemy"|"Enemy In City"|"Reduces Enemy"|"Reduces Enemy in Attack"|"Reduces Enemy with a Dragon"|"Reduces"',

  Condition: "(BuffCondition|DebuffCondition)",

  BuffAttributeArray: "BuffAttributeArray[]",

  TroopClass:
    '"All Troops"|"Ground Troops"|"Mounted Troops"|"Ranged Troops"|"Siege Machines"',

  BuffAttributeUnion: "BuffAttribute|BuffAttributeArray",

  Buff: {
    attribute: "BuffAttributeUnion",
    "conditions?": "Condition|Condition[]",
    "troopClass?": "TroopClass|TroopClass[]",
    value: {
      number: "number.integer > 0",
      unit: "'flat'|'percentage'",
    },
  },
}).export();
