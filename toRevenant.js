export const Revenant = new Map();
Revenant.set("名称", v => `レブナント(${v})`);
Revenant.set("種族", v => `アンデッド`);
Revenant.set("レベル", v => `${Number(v)+1}`);
Revenant.set("知能", v => `低い`);
Revenant.set("知覚", v => `魔法`);
Revenant.set("反応", v => `敵対的`);
Revenant.set("言語", v => `なし`);
Revenant.set("生息地", v => `さまざま`);
Revenant.set("知名度", v => `8`);
Revenant.set("弱点値", v => `14`);
Revenant.set("弱点", v => `回復効果ダメージ+3`);
Revenant.set("先制値", v => `${Number(v)-2}`);
Revenant.set("命中力", v => `${Number(v)+2}`);
Revenant.set("打撃点", v => `2d+${Number(v.slice(2))+2}`.replace("+-", "-").replace("+0", ""));
Revenant.set("回避力", v => `${Number(v)-2}`);
Revenant.set("HP", v => `${Number(v)+10}`);
Revenant.set("HP", v => `0`);
Revenant.set("特殊能力", v => {
    const uniqueSkill = "◯精神効果無効\n◯再生=3点\n手番の終了時に、HPが「3」点、回復します。\n HPが0以下になると、この能力は失われます。\n";
    if(v.startsWith("なし")) return uniqueSkill;
    return v.replaceAll(/◯再生=[0-9]+点[^▶︎▷◯●(]*/g, "")
            .replaceAll(/◯精神.+無効\n?/g, "")
            .replaceAll(/.+\/魔力.+\n?/g, "")
            .replace(/●全身\n|/, m=>m+uniqueSkill);
});
Revenant.set("解説", v => `無念の死を遂げ、弔われなかった死体に穢れた魂が取り憑いた動く死体です。\n蘇生を繰り返し、穢れきったものの多くもレブナントになります。`);
Revenant.set("戦利品", v => `2~5:なし\n6~10:穢れた骨(50G/赤B)\n11~:穢れた頭蓋骨(300G/赤A)`);