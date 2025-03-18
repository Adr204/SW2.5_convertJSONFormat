export const HighRevenant = new Map();
HighRevenant.set("名称", v => `ハイレブナント(${v})`);
HighRevenant.set("種族", v => `アンデッド`);
HighRevenant.set("レベル", v => `${Number(v)+1}`);
HighRevenant.set("知能", v => `人間並み`);
HighRevenant.set("知覚", v => `魔法`);
HighRevenant.set("反応", v => `中立`);
HighRevenant.set("生息地", v => `さまざま`);
HighRevenant.set("知名度", v => `12`);
HighRevenant.set("弱点値", v => `17`);
HighRevenant.set("弱点", v => `回復効果ダメージ+3`);
HighRevenant.set("先制値", v => `${Number(v)-2}`);
HighRevenant.set("命中力", v => `${Number(v)+2}`);
HighRevenant.set("打撃点", v => `2d+${Number(v.slice(2))+2}`.replace("+-", "-").replace("+0", ""));
HighRevenant.set("回避力", v => `${Number(v)-2}`);
HighRevenant.set("HP", v => `${Number(v)+20}`);
HighRevenant.set("特殊能力", v => {
    const uniqueSkill = "◯再生=8点\n手番の終了時に、HPが「8」点、回復します。\n HPが0以下になると、この能力は失われます。\n";
    if(v.startsWith("なし")) return uniqueSkill;
    return v.replaceAll(/◯再生=[0-9]+点([^(▶︎▷●◯]|\((?!宣\))|(?<!\n)[(▶︎▷●◯])*/g, "")
            .replace(/●全身\n|/, m=>m+uniqueSkill);
});
HighRevenant.set("解説", v => `死者が強力な怨念や執念によって蘇った存在です。\n通常のレブナントと大きく異なるのは、生前の知識や記憶をほぼそのまま留めている点です。`);
HighRevenant.set("戦利品", v => `自動:穢れた頭蓋骨(300G/赤A)\n2~10:穢れた骨(50G/赤B)\n11~:穢れた仙骨(2,400G/赤B)`);