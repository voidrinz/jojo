String.prototype.replaceAll = function(search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
let rand = function(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
};


let Character = function(spec) {
  let me = {};
  me.attrs = ['hp', 'ap'];
  me.attrsCN = ['生命', '攻击'];
  me.name = spec.name;
  me.hp = spec.hp;
  me.ap = spec.ap;
  me.show =function() {
    console.log(me.name);
    let showStr = me.attrsCN[0] + ': ' + me[me.attrs[0]];
    for (let i = 1; i < me.attrs.length; ++i) {
      showStr += '\n' + me.attrsCN[i] + ': ' + me[me.attrs[i]];
    }
    console.log(showStr);
  };
  me.attack = function(target) {
    if (!me.hp || !target.hp) return;
    let damage = target.defend(me.ap);
    target.hp -= damage;
    let str =[
      'eins攻击了zwei，造成了xxx点伤害',
      'eins殴打了zwei，zwei流了xxx滴血'
    ];
    str = rand(str);
    str = str.replaceAll('eins', me.name);
    str = str.replaceAll('zwei', target.name);
    str = str.replaceAll('xxx', damage);
    console.log(str);
    target.check();
  };
  me.defend = function(damage){
    return damage;
  };
  me.check = function() {
    if (me.hp <= 0) {
      me.fail();
    } else {
      me.show();
    }
  };
  me.fail = function() {
    me.hp = 0;
    me.ap = 0;
    console.log(me.name + ' is failed');
  };
  return me;
};


let Hero = function(spec) {
  let me = Character(spec);
  me.attrs = ['hp', 'mp', 'ap', 'sp', 'wp'];
  me.attrsCN = ['生命', '法力', '攻击', '法术', '武器'];
  me.mp = spec.mp;
  me.sp = spec.sp;
  me.wp = spec.wp || '超级无敌破坏拳';
  me.sl = spec.sl || [0, 0, 0]; //skill level
//   let superShow = me.show;
//   me.show = function() {
//     superShow();
// //     console.log('iam hero');
//   };
  me.spell = function(mana, factor){
    mana = mana || 0;
    factor = factor || 1;
    if (me.mp < mana) {
      let str = ['你无法施放这个法术', '法力值不足', '你需要更多法力', '法术需要法力才可以施放'];
      console.log(rand(str));
      return 0;
    }
    me.mp -= mana;
    me.show();
    return me.sp * factor;
  };
  me.oula = function(target){
    if (!me.hp || !target.hp) return;
    let casted = me.spell(1);
    if (casted) {
      let damage = me.ap * (2 + me.sl[1]);
      target.hp -= damage;
      console.log('oulaoulaoulaoula');
      target.check();
    }
  };
  me.fire = function(target){
    if (!me.hp || !target.hp) return;
    if (!me.sl[2]) {
      let str = ['你无法施放这个法术', '你还木有学会这个技能', '这个技能点是0'];
      console.log(rand(str));
      return;
    }
    let damage = me.spell(3, 1) * me.sl[2] * 0.5;
    if (damage) {
      target.hp -= damage;
      let str =[
        'eins对zwei使用了skl，造成了xxx点伤害',
        'skl！zwei受到了xxx点伤害'
      ];
      str = rand(str);
      str = str.replaceAll('eins', me.name);
      str = str.replaceAll('zwei', target.name);
      str = str.replaceAll('xxx', damage);
      str = str.replaceAll('skl', 'fire');
      console.log(str);
      target.check();
    }
  };

  return me;
};


let Enemy = function(spec) {
  let me = Character(spec);
  return me;
};


let Boss = function(spec) {
  let me = Character(spec);
  me.attrs = ['hp', 'mp', 'ap', 'sp', 'sk'];
  me.attrsCN = ['生命', '法力', '攻击', '法术', '技能'];
  me.mp = spec.mp;
  me.sp = spec.sp;
  me.skill = function(name, attack, defend) {
    me.sk = name;
    me.attack = attack || me.attack;
    me.defend = defend || me.defend;
  };
  return me;
};


let jojo = Hero({name: 'JOJO', hp: 20, ap: 30, sp: 70, mp: 100});
jojo.sl = [1, 1, 1];
let dio = Boss({name: 'DIO', hp: 50, ap: 10});
dio.skill('BOOOOOM!',
  function(target) {
  if (!this.hp || !target.hp) return;
  target.hp -= 100;
  console.log('BOOOOOM!');
  target.check();
  },
  function(damage){
    return 0;
  }
);
while(jojo.hp && dio.hp) {
  jojo.oula(dio);
  dio.attack(jojo);
}
